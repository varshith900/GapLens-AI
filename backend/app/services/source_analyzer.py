import re
from typing import Dict, Any, List

class SourceAnalyzer:
    """Stage 1: Individual source analysis and claim extraction."""

    def analyze_single_source(self, source: Dict[str, Any]) -> Dict[str, Any]:
        content = source.get("clean_text", "")
        source_id = source.get("source_id", "src_unknown")
        title = source.get("title", "Untitled Source")
        url = source.get("url", "")
        pub_date = source.get("publication_date")

        claims = []
        # Extract eligibility conditions
        eligibility_matches = re.findall(r"(?:must|eligible|criteria|minimum|exceed|not exceed|securing|citizen)[^.\n]+[.\n]", content, re.IGNORECASE)
        for em in eligibility_matches[:3]:
            claims.append({
                "type": "Eligibility",
                "text": em.strip(),
                "source_id": source_id,
                "source_title": title,
                "url": url,
                "snippet": em.strip(),
                "publication_date": pub_date
            })

        # Extract deadlines and dates
        deadline_matches = re.findall(r"(?:deadline|closing date|last date|between|portal closing)[^.\n]+[.\n]", content, re.IGNORECASE)
        for dm in deadline_matches[:3]:
            claims.append({
                "type": "Deadline",
                "text": dm.strip(),
                "source_id": source_id,
                "source_title": title,
                "url": url,
                "snippet": dm.strip(),
                "publication_date": pub_date
            })

        # Extract document and procedure requirements
        doc_matches = re.findall(r"(?:document|certificate|submission|upload|verified by|aadhaar|mark sheet)[^.\n]+[.\n]", content, re.IGNORECASE)
        for doc in doc_matches[:3]:
            claims.append({
                "type": "Documentation",
                "text": doc.strip(),
                "source_id": source_id,
                "source_title": title,
                "url": url,
                "snippet": doc.strip(),
                "publication_date": pub_date
            })

        return {
            "source_id": source_id,
            "title": title,
            "url": url,
            "domain": source.get("domain", ""),
            "claims": claims,
            "raw_snippet_count": len(claims)
        }

source_analyzer = SourceAnalyzer()
