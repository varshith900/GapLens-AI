export interface EvidenceReference {
  source_id: string;
  source_title: string;
  url: string;
  snippet: string;
  publication_date?: string | null;
}

export interface KeyFinding {
  finding_id: string;
  description: string;
  category: string;
  status: "Found" | "Partially Found" | "Requires Confirmation";
  evidence_references: EvidenceReference[];
}

export interface InformationGap {
  gap_id: string;
  missing_information: string;
  why_it_matters: string;
  related_research_question: string;
  priority: "High" | "Medium" | "Low";
  sources_reviewed: string[];
  suggested_action: string;
  status_label: string;
}

export interface ClaimDetail {
  claim_text: string;
  source_id: string;
  source_title: string;
  url: string;
  date_context?: string | null;
}

export interface PossibleConflict {
  conflict_id: string;
  topic: string;
  claim_a: ClaimDetail;
  claim_b: ClaimDetail;
  ai_finding: string;
  suggested_action: string;
  classification: string;
}

export interface OutdatedWarning {
  source_id: string;
  source_title: string;
  url: string;
  publication_date?: string | null;
  relevant_cycle?: string | null;
  classification: "Potentially outdated" | "Date unavailable" | "Current cycle not confirmed" | "No apparent date-related warning";
  reason: string;
  recommended_action: string;
}

export interface UnansweredQuestion {
  question: string;
  relevance: string;
  status: string;
}

export interface VerificationTask {
  task_id: string;
  task_description: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  suggested_source?: string | null;
  related_sources: string[];
}

export interface SourceRecord {
  source_id: string;
  title: string;
  url: string;
  domain: string;
  extracted_content?: string;
  clean_text?: string;
  publication_date?: string | null;
  last_updated_date?: string | null;
  extraction_timestamp: string;
  extraction_status: "success" | "failed" | "manual_verification_required";
  error_message?: string | null;
  snippets: string[];
  word_count?: number;
}

export interface ResearchSession {
  research_id: string;
  user_id?: string;
  topic: string;
  research_topic?: string;
  research_question: string;
  category: string;
  additional_context?: string;
  status: "created" | "extracting" | "analyzing" | "completed" | "failed";
  analysis_status?: string;
  analysis_date?: string;
  created_at?: string;
  updated_at?: string;
  overview?: string;
  sources_analyzed?: SourceRecord[];
  sources_submitted_count?: number;
  sources_analyzed_count?: number;
  key_findings?: KeyFinding[];
  information_gaps?: InformationGap[];
  possible_conflicts?: PossibleConflict[];
  outdated_information?: OutdatedWarning[];
  unanswered_questions?: UnansweredQuestion[];
  verification_checklist?: VerificationTask[];
  limitations?: string[];
  confidence_notes?: string[];
  engine_used?: string;
  is_demo?: boolean;
}

export interface ResearchSummary {
  research_id: string;
  user_id: string;
  topic: string;
  research_question: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
  sources_count: number;
  sources_analyzed_count: number;
  gaps_count: number;
  conflicts_count: number;
  checklist_total: number;
  checklist_completed: number;
  is_demo: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
}

