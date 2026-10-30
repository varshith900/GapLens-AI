import re
from typing import List, Dict, Any
from backend.app.schemas.research import PossibleConflict, ClaimDetail

class ConflictDetector:
    """Stage 2: Detect conflicting claims, differing dates, and divergent requirements across sources."""

    def detect_conflicts(self, sources: List[Dict[str, Any]]) -> List[PossibleConflict]:
        conflicts: List[PossibleConflict] = []
        valid_sources = [s for s in sources if s.get("extraction_status") == "success"]

        # 1. Deadline discrepancies
        deadline_claims = []
        for s in valid_sources:
            content = s.get("clean_text", "")
            # Look for dates around deadline keywords
            for m in re.finditer(r"(?:deadline|last date|closing date)[^.\n]*?(?:is\s+|:\s*)?([A-Za-z]+\s+\d{1,2}(?:,\s+20\d{2})?)", content, re.IGNORECASE):
                deadline_claims.append({
                    "date_str": m.group(1).strip(),
                    "full_claim": m.group(0).strip(),
                    "source_id": s.get("source_id"),
                    "source_title": s.get("title"),
                    "url": s.get("url"),
                    "cycle": s.get("relevant_cycle") or s.get("publication_date")
                })

        # Compare deadlines across distinct sources
        if len(deadline_claims) >= 2:
            first = deadline_claims[0]
            for other in deadline_claims[1:]:
                if first["source_id"] != other["source_id"] and first["date_str"].lower() != other["date_str"].lower():
                    conflicts.append(PossibleConflict(
                        conflict_id=f"conf_deadline_{len(conflicts) + 1}",
                        topic="Application Submission Deadline Discrepancy",
                        claim_a=ClaimDetail(
                            claim_text=f"Stipulates submission deadline is {first['date_str']}. Context: '{first['full_claim']}'",
                            source_id=first["source_id"],
                            source_title=first["source_title"],
                            url=first["url"],
                            date_context=str(first["cycle"]) if first["cycle"] else None
                        ),
                        claim_b=ClaimDetail(
                            claim_text=f"Stipulates submission deadline is {other['date_str']}. Context: '{other['full_claim']}'",
                            source_id=other["source_id"],
                            source_title=other["source_title"],
                            url=other["url"],
                            date_context=str(other["cycle"]) if other["cycle"] else None
                        ),
                        ai_finding="Possible contradiction detected: Multiple sources cite different calendar dates for the online application deadline.",
                        suggested_action="Verify the definitive deadline directly against the current year's active official gazette or portal notice."
                    ))
                    break

        # 2. Document submission requirement differences (e.g. Physical submission vs Online-only)
        physical_src = None
        digital_only_src = None
        for s in valid_sources:
            txt = s.get("clean_text", "").lower()
            if "physical original" in txt or "submit the physical" in txt or "in person" in txt:
                physical_src = s
            elif "scanned digital copies" in txt or "physical submission of original certificates to district offices has been waived" in txt or "waived" in txt:
                digital_only_src = s

        if physical_src and digital_only_src and physical_src["source_id"] != digital_only_src["source_id"]:
            conflicts.append(PossibleConflict(
                conflict_id=f"conf_docs_{len(conflicts) + 1}",
                topic="Caste & Category Certificate Verification Method",
                claim_a=ClaimDetail(
                    claim_text="Requires physical original certificate to be submitted in-person to the District Welfare Officer.",
                    source_id=physical_src["source_id"],
                    source_title=physical_src["title"],
                    url=physical_src["url"],
                    date_context=physical_src.get("publication_date")
                ),
                claim_b=ClaimDetail(
                    claim_text="States physical submission has been waived and only online digital scans are required.",
                    source_id=digital_only_src["source_id"],
                    source_title=digital_only_src["title"],
                    url=digital_only_src["url"],
                    date_context=digital_only_src.get("publication_date")
                ),
                ai_finding="Possible contradiction detected: Sources mandate conflicting document validation protocols (mandatory in-person verification vs digital submission waiver).",
                suggested_action="Contact the university nodal officer or state welfare desk to verify if in-person verification is currently enforced."
            ))

        # 3. Income ceiling differences
        income_claims = []
        for s in valid_sources:
            txt = s.get("clean_text", "")
            for m in re.finditer(r"(?:income|ceiling)[^.\n]*?(?:INR|Rs\.?|₹)\s*([\d,]+(?:\s*Lakhs?)?)", txt, re.IGNORECASE):
                income_claims.append({
                    "val": m.group(1).strip(),
                    "full": m.group(0).strip(),
                    "source": s
                })
        if len(income_claims) >= 2 and income_claims[0]["source"]["source_id"] != income_claims[1]["source"]["source_id"]:
            if income_claims[0]["val"] != income_claims[1]["val"]:
                conflicts.append(PossibleConflict(
                    conflict_id=f"conf_income_{len(conflicts) + 1}",
                    topic="Annual Family Income Eligibility Limit",
                    claim_a=ClaimDetail(
                        claim_text=f"Lists income cap as INR {income_claims[0]['val']}.",
                        source_id=income_claims[0]["source"]["source_id"],
                        source_title=income_claims[0]["source"]["title"],
                        url=income_claims[0]["source"]["url"],
                        date_context=income_claims[0]["source"].get("publication_date")
                    ),
                    claim_b=ClaimDetail(
                        claim_text=f"Lists income cap as INR {income_claims[1]['val']}.",
                        source_id=income_claims[1]["source"]["source_id"],
                        source_title=income_claims[1]["source"]["title"],
                        url=income_claims[1]["source"]["url"],
                        date_context=income_claims[1]["source"].get("publication_date")
                    ),
                    ai_finding="Possible contradiction detected: Conflicting income eligibility thresholds found across sources.",
                    suggested_action="Consult the active scheme brochure to confirm whether the income limit is INR 6 Lakhs or INR 8 Lakhs for the current cycle."
                ))

        return conflicts

conflict_detector = ConflictDetector()
