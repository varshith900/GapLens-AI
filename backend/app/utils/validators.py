import re
from urllib.parse import urlparse
from typing import Optional

DATE_PATTERNS = [
    # YYYY-MM-DD or YYYY/MM/DD
    r"\b(20\d{2}[-/]\d{1,2}[-/]\d{1,2})\b",
    # Month DD, YYYY or Month DD YYYY
    r"\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+20\d{2})\b",
    # DD Month YYYY
    r"\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?,?\s+20\d{2})\b",
    # Academic / financial cycle e.g. 2023-2024, 2024-25
    r"\b(20\d{2}\s*[-–/]\s*(?:20)?\d{2})\b",
    # Standalone 4-digit year 2018-2027
    r"\b(20(?:1[89]|2[0-9]))\b"
]

def extract_domain(url: str) -> str:
    try:
        parsed = urlparse(url)
        return parsed.netloc.lower() or "unknown-domain"
    except Exception:
        return "unknown-domain"

def detect_date_in_text(text: str) -> Optional[str]:
    if not text:
        return None
    for pattern in DATE_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None

def detect_academic_cycle(text: str) -> Optional[str]:
    if not text:
        return None
    match = re.search(r"\b(20\d{2}\s*[-–/]\s*(?:20)?\d{2})\b", text)
    if match:
        return match.group(1).strip()
    return None
