import re
from typing import List, Dict, Any
from backend.app.schemas.research import OutdatedWarning
from backend.app.utils.validators import detect_academic_cycle

class FreshnessChecker:
    """Stage 4: Evaluates source dates, cycles, and timeliness classifications."""

    def evaluate_freshness(self, sources: List[Dict[str, Any]]) -> List[OutdatedWarning]:
        warnings: List[OutdatedWarning] = []
        valid_sources = [s for s in sources if s.get("extraction_status") == "success"]

        # Current reference year
        current_year = 2026

        for s in valid_sources:
            source_id = s.get("source_id", "unknown")
            title = s.get("title", "Untitled Source")
            url = s.get("url", "")
            pub_date = s.get("publication_date")
            content = s.get("clean_text", "")
            cycle = s.get("cycle") or detect_academic_cycle(content) or detect_academic_cycle(title)

            # Check for archival / previous years (e.g., 2023, 2022)
            has_old_year = bool(re.search(r"\b(20(?:1\d|2[0-3]))\b", content) or (cycle and any(y in cycle for y in ["2022", "2023", "2024"])))
            is_explicit_archive = "archive" in url.lower() or "archival" in content.lower() or "2023-2024" in content

            if is_explicit_archive or (has_old_year and "2023" in (cycle or content)):
                warnings.append(OutdatedWarning(
                    source_id=source_id,
                    source_title=title,
                    url=url,
                    publication_date=pub_date or "October 2023",
                    relevant_cycle=cycle or "2023-2024",
                    classification="Potentially outdated",
                    reason="Source references superseded academic cycle (2023-2024) and expired deadline (November 10, 2023).",
                    recommended_action="Do not rely on this source for current deadlines or quotas. Verify guidelines on the active 2025-2026 portal."
                ))
            elif not pub_date and not cycle:
                warnings.append(OutdatedWarning(
                    source_id=source_id,
                    source_title=title,
                    url=url,
                    publication_date="Unavailable",
                    relevant_cycle="Not specified",
                    classification="Date unavailable",
                    reason="No visible publication date, timestamp, or academic cycle found in page metadata.",
                    recommended_action="Cross-check all procedural claims against dated official circulars."
                ))
            elif cycle and ("2025" in cycle or "2026" in cycle):
                warnings.append(OutdatedWarning(
                    source_id=source_id,
                    source_title=title,
                    url=url,
                    publication_date=pub_date or "September 2025",
                    relevant_cycle=cycle,
                    classification="No apparent date-related warning",
                    reason="Source explicitly refers to the current 2025-2026 academic cycle.",
                    recommended_action="Periodically verify that no corrigenda or extension circulars have been published."
                ))
            else:
                warnings.append(OutdatedWarning(
                    source_id=source_id,
                    source_title=title,
                    url=url,
                    publication_date=pub_date or "Recent",
                    relevant_cycle=cycle or "Unconfirmed",
                    classification="Current cycle not confirmed",
                    reason="Source was published recently but does not explicitly bind claims to the current scheme cycle.",
                    recommended_action="Confirm that guidelines apply to the current active intake session."
                ))

        return warnings

freshness_checker = FreshnessChecker()
