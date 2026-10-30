from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class SourceInput(BaseModel):
    url: str
    label: Optional[str] = None

class CreateResearchRequest(BaseModel):
    topic: str = Field(..., min_length=2, description="Research topic")
    research_question: str = Field(..., min_length=5, description="Core research question or objective")
    category: Optional[str] = "General Research"
    additional_context: Optional[str] = ""
    sources: List[str] = Field(default_factory=list, description="List of source URLs")
    is_demo: Optional[bool] = False

class AddSourcesRequest(BaseModel):
    urls: List[str]

class UpdateTaskStatusRequest(BaseModel):
    completed: bool

class SourceRecord(BaseModel):
    source_id: str
    title: str
    url: str
    domain: str
    extracted_content: str
    clean_text: str
    publication_date: Optional[str] = None
    last_updated_date: Optional[str] = None
    extraction_timestamp: str = Field(default_factory=utc_now_iso)
    extraction_status: str  # "success", "failed", "manual_verification_required"
    error_message: Optional[str] = None
    snippets: List[str] = Field(default_factory=list)
    word_count: int = 0

class EvidenceReference(BaseModel):
    source_id: str
    source_title: str
    url: str
    snippet: str
    publication_date: Optional[str] = None

class KeyFinding(BaseModel):
    finding_id: str
    description: str
    category: str
    status: str = "Found"  # "Found", "Partially Found", "Requires Confirmation"
    evidence_references: List[EvidenceReference] = Field(default_factory=list)

class InformationGap(BaseModel):
    gap_id: str
    missing_information: str
    why_it_matters: str
    related_research_question: str
    priority: str = "High"  # "High", "Medium", "Low"
    sources_reviewed: List[str] = Field(default_factory=list)
    suggested_action: str
    status_label: str = "Not found in the sources reviewed."

class ClaimDetail(BaseModel):
    claim_text: str
    source_id: str
    source_title: str
    url: str
    date_context: Optional[str] = None

class PossibleConflict(BaseModel):
    conflict_id: str
    topic: str
    claim_a: ClaimDetail
    claim_b: ClaimDetail
    ai_finding: str
    suggested_action: str
    classification: str = "Possible contradiction detected"

class OutdatedWarning(BaseModel):
    source_id: str
    source_title: str
    url: str
    publication_date: Optional[str] = "Unavailable"
    relevant_cycle: Optional[str] = "Unspecified"
    classification: str  # "Potentially outdated", "Date unavailable", "Current cycle not confirmed", "No apparent date-related warning"
    reason: str
    recommended_action: str

class UnansweredQuestion(BaseModel):
    question: str
    relevance: str
    status: str = "Not found in reviewed sources"

class VerificationTask(BaseModel):
    task_id: str
    task_description: str
    reason: str
    priority: str = "High"  # "High", "Medium", "Low"
    completed: bool = False
    suggested_source: Optional[str] = None
    related_sources: List[str] = Field(default_factory=list)

class ResearchAnalysisResult(BaseModel):
    research_id: str
    research_topic: str
    research_question: str
    category: str
    overview: str
    sources_analyzed: List[Dict[str, Any]] = Field(default_factory=list)
    key_findings: List[KeyFinding] = Field(default_factory=list)
    information_gaps: List[InformationGap] = Field(default_factory=list)
    possible_conflicts: List[PossibleConflict] = Field(default_factory=list)
    outdated_information: List[OutdatedWarning] = Field(default_factory=list)
    unanswered_questions: List[UnansweredQuestion] = Field(default_factory=list)
    verification_checklist: List[VerificationTask] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    confidence_notes: List[str] = Field(default_factory=list)
    analysis_date: str = Field(default_factory=utc_now_iso)
    sources_submitted_count: int = 0
    sources_analyzed_count: int = 0
    analysis_status: str = "completed"

class ResearchSessionSummary(BaseModel):
    research_id: str
    user_id: str
    topic: str
    research_question: str
    category: str
    status: str  # "created", "extracting", "analyzing", "completed", "failed"
    created_at: str
    updated_at: str
    sources_count: int = 0
    sources_analyzed_count: int = 0
    gaps_count: int = 0
    conflicts_count: int = 0
    checklist_total: int = 0
    checklist_completed: int = 0
    is_demo: bool = False
