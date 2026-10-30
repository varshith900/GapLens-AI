import re
import uuid
import logging
from typing import Dict, Any, List
import requests
from bs4 import BeautifulSoup
from backend.app.config import settings
from backend.app.utils.security import is_safe_public_url
from backend.app.utils.validators import extract_domain, detect_date_in_text, detect_academic_cycle
from backend.app.schemas.research import SourceRecord

logger = logging.getLogger(__name__)

# Realistic, transparent demonstration sources for the Hackathon scholarship scenario
DEMO_SOURCES: Dict[str, Dict[str, Any]] = {
    "https://scholarships.gov.in/national-merit-2025": {
        "title": "[DEMO SOURCE A] National Merit Scholarship Portal - Official Guidelines (2025-2026)",
        "url": "https://scholarships.gov.in/national-merit-2025",
        "domain": "scholarships.gov.in",
        "publication_date": "August 15, 2025",
        "last_updated_date": "September 01, 2025",
        "cycle": "2025-2026",
        "content": """
NATIONAL MERIT SCHOLARSHIP SCHEME (CENTRAL SECTOR) - ACADEMIC YEAR 2025-2026
Ministry of Education - Guidelines for Higher Education Grants.

1. OBJECTIVE:
To provide financial assistance to meritorious students from low-income families to meet a part of their day-to-day expenses while pursuing higher studies.

2. ELIGIBILITY CRITERIA:
- The applicant must be an Indian citizen enrolled in a recognized regular full-time undergraduate or postgraduate degree course in an accredited university or college.
- Must have secured a minimum of 80% marks or equivalent CGPA in the Class 12 Higher Secondary Board Examination.
- Total annual parental/family income from all sources must not exceed INR 8,00,000 (8 Lakhs) per annum. An official income certificate issued by a competent Revenue authority (Tehsildar or Sub-Divisional Magistrate) is mandatory.
- Age limit: The student must be under 22 years of age as of July 1, 2025.
- The applicant must NOT be in receipt of any other central or state government scholarship or fellowship during the same academic tenure.

3. DISBURSEMENT:
- Undergraduate rate: INR 12,000 per annum for the first three years.
- Postgraduate rate: INR 20,000 per annum.
- Direct Benefit Transfer (DBT) directly into the student's Aadhaar-linked bank account.
"""
    },
    "https://highereducation.state.gov.in/circulars/scholarship-docs-guidelines": {
        "title": "[DEMO SOURCE B] Department of Higher Education - Required Documents & Submission Circular",
        "url": "https://highereducation.state.gov.in/circulars/scholarship-docs-guidelines",
        "domain": "highereducation.state.gov.in",
        "publication_date": "September 10, 2025",
        "last_updated_date": "September 12, 2025",
        "cycle": "2025-2026",
        "content": """
DEPARTMENT OF HIGHER EDUCATION - CIRCULAR NO. 44/2025
Subject: Mandatory Documentation and Application Procedure for Merit Scholarships 2025-2026.

1. APPLICATION PROCEDURE:
All eligible candidates must register on the State Higher Education portal between September 15, 2025, and November 20, 2025.
The definitive online portal closing deadline is November 20, 2025, at 11:59 PM IST.

2. MANDATORY DOCUMENT SUBMISSION REQUIREMENTS:
- Duly signed printout of online application verified by College Principal.
- Class 10 & Class 12 mark sheets (attested copies).
- Category / Caste Certificate: IMPORTANT: In addition to uploading a scanned copy online, applicants claiming reserved category benefits MUST submit the physical original Caste Certificate to the District Welfare Officer in person for biometric verification before the application cutoff date.
- Proof of admission (College ID card or current fee receipt).
- Aadhaar-seeded bank account passbook copy.
- Domicile certificate issued within the past 3 years.
"""
    },
    "https://studentwelfare-archive.org/bulletins/2023/merit-scheme": {
        "title": "[DEMO SOURCE C] Student Welfare Archive - Merit Scheme Bulletin 2023",
        "url": "https://studentwelfare-archive.org/bulletins/2023/merit-scheme",
        "domain": "studentwelfare-archive.org",
        "publication_date": "October 05, 2023",
        "last_updated_date": "October 18, 2023",
        "cycle": "2023-2024",
        "content": """
STUDENT WELFARE INFORMATION BULLETIN (ARCHIVAL NOTICE - ACADEMIC SESSION 2023-2024)
State & National Scholarship Consolidated Information.

APPLICATION DEADLINE:
The last date for submission of online applications for the Central Sector Merit Scheme is November 10, 2023. Late submissions will not be entertained under any circumstances.

DOCUMENTATION:
Applicants are required to submit only scanned digital copies via the unified portal. Physical submission of original certificates to district offices has been waived for all candidates to streamline digital administration.

CRITERIA:
Income ceiling: INR 6,00,000 per annum for the 2023 session.
"""
    },
    "https://scholarships-disbursement-faq.edu/faqs-general": {
        "title": "[DEMO SOURCE D] Higher Studies Support Network - Scholarship FAQ & Disbursement Advisory",
        "url": "https://scholarships-disbursement-faq.edu/faqs-general",
        "domain": "scholarships-disbursement-faq.edu",
        "publication_date": None,  # Intentionally undated
        "last_updated_date": None,
        "cycle": None,
        "content": """
HIGHER STUDIES SCHOLARSHIP SUPPORT NETWORK - FREQUENTLY ASKED QUESTIONS

Q: How is the scholarship money disbursed?
A: Funds are transferred directly to your bank account via the Public Financial Management System (PFMS). Ensure your bank account is active and seeded with your Aadhaar number.

Q: Can I change my college or course after receiving the first year scholarship?
A: Course transfer is permissible only within approved institutions under the same university, subject to prior approval from the State Nodal Officer.

Q: What happens if my college is located outside my home state?
A: Students studying in other states are eligible provided their permanent residence is verified by their domicile state.

(Note: This advisory covers general disbursement questions and banking requirements. It does not mention renewal grade cutoffs, annual renewal forms, or CGPA maintenance conditions.)
"""
    }
}

class SourceExtractor:
    """Extracts, cleans, and structures web content safely with SSRF protections."""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": settings.USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })

    def extract_source(self, url: str) -> SourceRecord:
        url = url.strip()
        source_id = f"src_{uuid.uuid4().hex[:8]}"

        # Check if URL matches demo sources
        for demo_url, data in DEMO_SOURCES.items():
            if url.rstrip("/").lower() == demo_url.rstrip("/").lower() or url.lower() in demo_url.lower():
                return self._create_demo_record(source_id, demo_url, data)

        # 1. SSRF & URL safety check
        is_safe, safety_reason = is_safe_public_url(url)
        if not is_safe:
            return SourceRecord(
                source_id=source_id,
                title="Invalid or Blocked URL",
                url=url,
                domain=extract_domain(url),
                extracted_content="",
                clean_text="",
                extraction_status="failed",
                error_message=safety_reason,
                snippets=[]
            )

        # 2. Fetch remote content
        try:
            response = self.session.get(
                url,
                timeout=settings.REQUEST_TIMEOUT_SECONDS,
                allow_redirects=True,
                stream=True
            )

            # Check status code
            if response.status_code == 403 or response.status_code == 401:
                return SourceRecord(
                    source_id=source_id,
                    title="Access Restricted / Paywall",
                    url=url,
                    domain=extract_domain(url),
                    extracted_content="",
                    clean_text="",
                    extraction_status="manual_verification_required",
                    error_message=f"HTTP {response.status_code} Access Denied. Source may be protected by authentication, bot-checks, or paywall.",
                    snippets=[]
                )
            
            if response.status_code >= 400:
                return SourceRecord(
                    source_id=source_id,
                    title="Source Page Inaccessible",
                    url=url,
                    domain=extract_domain(url),
                    extracted_content="",
                    clean_text="",
                    extraction_status="failed",
                    error_message=f"HTTP Error {response.status_code}: Unable to reach source.",
                    snippets=[]
                )

            # Enforce size limit
            content_bytes = bytearray()
            for chunk in response.iter_content(chunk_size=16384):
                content_bytes.extend(chunk)
                if len(content_bytes) > settings.MAX_CONTENT_LENGTH_BYTES:
                    break

            html_text = content_bytes.decode(response.encoding or "utf-8", errors="replace")

        except requests.exceptions.Timeout:
            return SourceRecord(
                source_id=source_id,
                title="Connection Timeout",
                url=url,
                domain=extract_domain(url),
                extracted_content="",
                clean_text="",
                extraction_status="failed",
                error_message=f"Request timed out after {settings.REQUEST_TIMEOUT_SECONDS} seconds.",
                snippets=[]
            )
        except requests.exceptions.RequestException as e:
            return SourceRecord(
                source_id=source_id,
                title="Network Error",
                url=url,
                domain=extract_domain(url),
                extracted_content="",
                clean_text="",
                extraction_status="failed",
                error_message=f"Failed to fetch content: {str(e)}",
                snippets=[]
            )

        # 3. Parse HTML and clean boilerplates
        soup = BeautifulSoup(html_text, "html.parser")

        # Extract title
        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else ""
        if not title:
            h1 = soup.find("h1")
            title = h1.get_text(strip=True) if h1 else extract_domain(url)

        # Remove scripts, styles, navigations, footers, ads
        for element in soup(["script", "style", "nav", "footer", "header", "noscript", "svg", "form", "aside"]):
            element.decompose()

        # Extract metadata dates
        pub_date = None
        for meta in soup.find_all("meta"):
            prop = meta.get("property", "").lower()
            name = meta.get("name", "").lower()
            content = meta.get("content", "")
            if any(k in prop or k in name for k in ["published_time", "date", "article:published", "dc.date"]):
                pub_date = content.strip()
                break

        # Main readable text
        main_text = soup.get_text(separator="\n", strip=True)
        # Clean excessive newlines
        clean_text = re.sub(r"\n{3,}", "\n\n", main_text)

        if not pub_date:
            pub_date = detect_date_in_text(clean_text[:1500])

        if len(clean_text.strip()) < 100:
            return SourceRecord(
                source_id=source_id,
                title=title or "Empty or Unreadable Page",
                url=url,
                domain=extract_domain(url),
                extracted_content="",
                clean_text="",
                extraction_status="manual_verification_required",
                error_message="Page contained insufficient readable text or was dynamically rendered by client-side JavaScript.",
                snippets=[]
            )

        # Build snippets (first 3 substantial paragraphs)
        paragraphs = [p.strip() for p in clean_text.split("\n\n") if len(p.strip()) > 60]
        snippets = paragraphs[:3]

        return SourceRecord(
            source_id=source_id,
            title=title[:180],
            url=url,
            domain=extract_domain(url),
            extracted_content=clean_text[:15000],  # preserve rich text for LLM stage
            clean_text=clean_text[:15000],
            publication_date=pub_date,
            last_updated_date=None,
            extraction_status="success",
            snippets=snippets,
            word_count=len(clean_text.split())
        )

    def _create_demo_record(self, source_id: str, url: str, data: Dict[str, Any]) -> SourceRecord:
        clean = data["content"].strip()
        snippets = [p.strip() for p in clean.split("\n\n") if len(p.strip()) > 40][:3]
        return SourceRecord(
            source_id=source_id,
            title=data["title"],
            url=url,
            domain=data["domain"],
            extracted_content=clean,
            clean_text=clean,
            publication_date=data.get("publication_date"),
            last_updated_date=data.get("last_updated_date"),
            extraction_status="success",
            snippets=snippets,
            word_count=len(clean.split())
        )

source_extractor = SourceExtractor()
