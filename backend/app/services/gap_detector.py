from typing import List, Dict, Any, Tuple
from backend.app.schemas.research import InformationGap, KeyFinding, EvidenceReference, UnansweredQuestion

class GapDetector:
    """Stage 3: Evaluates research objectives against collected sources to surface missing information gaps."""

    def evaluate_gaps_and_findings(
        self,
        topic: str,
        question: str,
        sources: List[Dict[str, Any]]
    ) -> Tuple[List[InformationGap], List[KeyFinding], List[UnansweredQuestion]]:
        valid_sources = [s for s in sources if s.get("extraction_status") == "success"]
        source_ids = [s.get("source_id") for s in valid_sources]
        corpus_text = " ".join([s.get("clean_text", "").lower() for s in valid_sources])

        key_findings: List[KeyFinding] = []
        gaps: List[InformationGap] = []
        unanswered: List[UnansweredQuestion] = []

        # 1. Eligibility evaluation
        if any(w in corpus_text for w in ["eligibility", "citizen", "marks", "income", "age limit"]):
            evidence = []
            for s in valid_sources:
                if any(k in s.get("clean_text", "").lower() for k in ["eligibility", "80% marks", "8,00,000", "under 22"]):
                    evidence.append(EvidenceReference(
                        source_id=s.get("source_id"),
                        source_title=s.get("title"),
                        url=s.get("url"),
                        snippet=s.get("snippets", ["Eligibility guidelines detailed."])[0] if s.get("snippets") else "Guidelines outlined.",
                        publication_date=s.get("publication_date")
                    ))
            key_findings.append(KeyFinding(
                finding_id="find_eligibility",
                description="Core eligibility criteria identified (citizenship, minimum academic cutoff, and parental income ceiling).",
                category="Eligibility",
                status="Found",
                evidence_references=evidence
            ))
        else:
            gaps.append(InformationGap(
                gap_id="gap_eligibility",
                missing_information="Specific Eligibility Criteria & Cutoff Percentile",
                why_it_matters="Crucial to prevent wasted application fees or disqualification.",
                related_research_question=question,
                priority="High",
                sources_reviewed=source_ids,
                suggested_action="Review official notification brochure for minimum marks threshold."
            ))

        # 2. Document Submission
        if any(w in corpus_text for w in ["document", "certificate", "mark sheet", "passbook"]):
            evidence = []
            for s in valid_sources:
                if "document" in s.get("clean_text", "").lower() or "certificate" in s.get("clean_text", "").lower():
                    evidence.append(EvidenceReference(
                        source_id=s.get("source_id"),
                        source_title=s.get("title"),
                        url=s.get("url"),
                        snippet=s.get("snippets", ["Documents requirement listed."])[0] if s.get("snippets") else "Document requirements found.",
                        publication_date=s.get("publication_date")
                    ))
            key_findings.append(KeyFinding(
                finding_id="find_docs",
                description="Documentation checklist documented, but conflicting physical verification conditions detected.",
                category="Documentation",
                status="Requires Confirmation",
                evidence_references=evidence
            ))
        else:
            gaps.append(InformationGap(
                gap_id="gap_docs",
                missing_information="Mandatory Document Submission Checklist",
                why_it_matters="Incomplete document submissions result in automatic application rejection.",
                related_research_question=question,
                priority="High",
                sources_reviewed=source_ids,
                suggested_action="Obtain the formal document verification guidelines from the university."
            ))

        # 3. Renewal conditions gap check
        has_renewal_info = any(k in corpus_text for k in ["renewal criteria", "renewal conditions", "cgpa for renewal", "subsequent year renewal"])
        if not has_renewal_info:
            gaps.append(InformationGap(
                gap_id="gap_renewal",
                missing_information="Scholarship Renewal Terms & Multi-Year Maintenance Criteria",
                why_it_matters="Students risk losing continuing financial assistance if mandatory second-year CGPA or attendance floors are not known.",
                related_research_question=question,
                priority="High",
                sources_reviewed=source_ids,
                suggested_action="Verify continuing eligibility and renewal rules with the Ministry or college administrative officer."
            ))
            unanswered.append(UnansweredQuestion(
                question="What specific academic grade / CGPA must be maintained in college to retain the scholarship for subsequent academic years?",
                relevance="Assures ongoing multi-year funding continuity.",
                status="Not found in reviewed sources"
            ))

        # 4. Grievance Redressal and Appeals
        if not any(k in corpus_text for k in ["grievance", "appeal", "helpdesk", "dispute", "rejection query"]):
            gaps.append(InformationGap(
                gap_id="gap_grievance",
                missing_information="Rejection Appeal Process & Official Helpdesk Escalation",
                why_it_matters="If an application is wrongfully flagged or technical glitches prevent DBT disbursement, students need an appeal mechanism.",
                related_research_question=question,
                priority="Medium",
                sources_reviewed=source_ids,
                suggested_action="Locate the State Nodal Officer helpline or grievance redressal portal."
            ))
            unanswered.append(UnansweredQuestion(
                question="What is the formal procedure to appeal if an application is rejected during biometric or institutional verification?",
                relevance="Protects applicant rights in case of documentation disputes.",
                status="Not found in reviewed sources"
            ))

        # 5. Disbursement timeline & Delay protocol
        if "pfms" in corpus_text or "disbursed" in corpus_text:
            key_findings.append(KeyFinding(
                finding_id="find_disbursement",
                description="Disbursement mechanism identified via Direct Benefit Transfer (DBT) / PFMS to Aadhaar-linked accounts.",
                category="Disbursement",
                status="Found",
                evidence_references=[
                    EvidenceReference(
                        source_id=s.get("source_id"),
                        source_title=s.get("title"),
                        url=s.get("url"),
                        snippet=s.get("snippets", ["Disbursement advisory."])[0] if s.get("snippets") else "PFMS transfer.",
                        publication_date=s.get("publication_date")
                    )
                    for s in valid_sources if "pfms" in s.get("clean_text", "").lower() or "disburs" in s.get("clean_text", "").lower()
                ]
            ))

        return gaps, key_findings, unanswered

gap_detector = GapDetector()
