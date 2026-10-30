import uuid
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, BackgroundTasks, Header
from fastapi.responses import StreamingResponse

from backend.app.schemas.research import (
    CreateResearchRequest,
    AddSourcesRequest,
    UpdateTaskStatusRequest,
    ResearchAnalysisResult,
    ResearchSessionSummary,
    KeyFinding,
    InformationGap,
    PossibleConflict,
    OutdatedWarning,
    VerificationTask,
    UnansweredQuestion
)
from backend.app.services.source_extractor import source_extractor, DEMO_SOURCES
from backend.app.services.source_analyzer import source_analyzer
from backend.app.services.gap_detector import gap_detector
from backend.app.services.conflict_detector import conflict_detector
from backend.app.services.freshness_checker import freshness_checker
from backend.app.services.checklist_generator import checklist_generator
from backend.app.services.gemini_service import gemini_service
from backend.app.services.report_generator import report_generator
from backend.app.database.firebase import db_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/research", tags=["Research"])

def to_dict(obj):
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    if hasattr(obj, "dict"):
        return obj.dict()
    return obj

def run_full_analysis(research_id: str):
    """
    Executes the multi-stage research analysis pipeline.
    """
    session = db_service.get_session(research_id)
    if not session:
        logger.error(f"Cannot run analysis: session {research_id} not found")
        return

    session["status"] = "extracting"
    session["analysis_status"] = "extracting"
    db_service.save_session(session)

    # 1. Extract content for all sources
    raw_urls = session.get("sources_input", [])
    extracted_sources = []
    
    for url in raw_urls:
        rec = source_extractor.extract_source(url)
        extracted_sources.append(to_dict(rec))

    session["sources_analyzed"] = extracted_sources
    session["sources_analyzed_count"] = sum(1 for s in extracted_sources if s.get("extraction_status") == "success")
    session["sources_submitted_count"] = len(raw_urls)
    session["status"] = "analyzing"
    session["analysis_status"] = "analyzing"
    db_service.save_session(session)

    topic = session.get("topic", "")
    question = session.get("research_question", "")
    category = session.get("category", "General Research")
    additional_context = session.get("additional_context", "")

    # 2. Check if live Gemini API is active
    gemini_result = None
    if gemini_service.is_available():
        logger.info(f"Invoking Google Gemini for session {research_id}...")
        try:
            gemini_result = gemini_service.analyze_research_pipeline(
                topic=topic,
                question=question,
                category=category,
                additional_context=additional_context,
                sources=extracted_sources
            )
        except Exception as e:
            logger.error(f"Gemini API execution failed: {str(e)}. Proceeding to deterministic pipeline.")

    # 3. If Gemini produced validated output, hydrate from it
    if gemini_result and isinstance(gemini_result, dict) and "key_findings" in gemini_result:
        logger.info("Successfully received structured output from Google Gemini.")
        session["overview"] = gemini_result.get("overview", "")
        session["key_findings"] = gemini_result.get("key_findings", [])
        session["information_gaps"] = gemini_result.get("information_gaps", [])
        session["possible_conflicts"] = gemini_result.get("possible_conflicts", [])
        session["outdated_information"] = gemini_result.get("outdated_information", [])
        session["unanswered_questions"] = gemini_result.get("unanswered_questions", [])
        session["verification_checklist"] = gemini_result.get("verification_checklist", [])
        session["limitations"] = gemini_result.get("limitations", [])
        session["confidence_notes"] = gemini_result.get("confidence_notes", [])
        session["engine_used"] = "Google Gemini"
    else:
        # Fallback to the deterministic multi-stage analytical engine
        logger.info(f"Using deterministic analytical pipeline for session {research_id}...")
        gaps, findings, unanswered = gap_detector.evaluate_gaps_and_findings(topic, question, extracted_sources)
        conflicts = conflict_detector.detect_conflicts(extracted_sources)
        warnings = freshness_checker.evaluate_freshness(extracted_sources)
        checklist = checklist_generator.generate_checklist(gaps, conflicts, warnings)

        session["overview"] = (
            f"Multi-source synthesis for '{topic}'. Analyzed {len(extracted_sources)} source(s). "
            f"Identified {len(findings)} confirmed claim areas, {len(gaps)} critical missing information gaps, "
            f"and {len(conflicts)} potential contradictions requiring authoritative cross-verification."
        )
        session["key_findings"] = [to_dict(f) for f in findings]
        session["information_gaps"] = [to_dict(g) for g in gaps]
        session["possible_conflicts"] = [to_dict(c) for c in conflicts]
        session["outdated_information"] = [to_dict(w) for w in warnings]
        session["unanswered_questions"] = [to_dict(u) for u in unanswered]
        session["verification_checklist"] = [to_dict(t) for t in checklist]
        session["limitations"] = [
            f"Analysis is strictly limited to the {len(extracted_sources)} documents/URLs provided.",
            "Dynamic client-side pages and authenticated portals were evaluated on accessible static text.",
            "AI findings reflect potential discrepancies and must be validated with official regulatory gazettes."
        ]
        session["confidence_notes"] = [
            "All findings cross-referenced against verbatim extracted source texts.",
            "Temporal flags derived from explicit metadata and academic intake cycles."
        ]
        session["engine_used"] = "Deterministic Heuristic Engine (Add GEMINI_API_KEY in .env for live Gemini)"

    now_dt = datetime.now(timezone.utc)
    session["status"] = "completed"
    session["analysis_status"] = "completed"
    session["analysis_date"] = now_dt.strftime("%B %d, %Y - %H:%M UTC")
    session["updated_at"] = now_dt.isoformat()
    db_service.save_session(session)
    logger.info(f"Analysis completed successfully for {research_id}")

@router.post("", response_model=ResearchSessionSummary)
def create_research_session(
    request: CreateResearchRequest,
    x_user_id: str = Header(default="guest")
):
    research_id = f"res_{uuid.uuid4().hex[:10]}"
    now = datetime.now(timezone.utc).isoformat()

    session_data = {
        "research_id": research_id,
        "user_id": x_user_id,
        "topic": request.topic,
        "research_topic": request.topic,
        "research_question": request.research_question,
        "category": request.category or "General Research",
        "additional_context": request.additional_context or "",
        "sources_input": request.sources,
        "status": "created",
        "analysis_status": "created",
        "created_at": now,
        "updated_at": now,
        "is_demo": request.is_demo or False
    }

    db_service.save_session(session_data)
    
    return ResearchSessionSummary(
        research_id=research_id,
        user_id=x_user_id,
        topic=request.topic,
        research_question=request.research_question,
        category=request.category or "General Research",
        status="created",
        created_at=now,
        updated_at=now,
        sources_count=len(request.sources),
        sources_analyzed_count=0,
        gaps_count=0,
        conflicts_count=0,
        checklist_total=0,
        checklist_completed=0,
        is_demo=request.is_demo or False
    )

@router.post("/{research_id}/sources")
def add_sources(research_id: str, request: AddSourcesRequest):
    session = db_service.get_session(research_id)
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")

    existing = session.get("sources_input", [])
    for u in request.urls:
        if u not in existing:
            existing.append(u)
    session["sources_input"] = existing
    session["updated_at"] = datetime.now(timezone.utc).isoformat()
    db_service.save_session(session)
    return {"status": "success", "total_sources": len(existing), "sources": existing}

@router.post("/{research_id}/analyze")
def trigger_analysis(research_id: str, background_tasks: BackgroundTasks):
    session = db_service.get_session(research_id)
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")

    if not session.get("sources_input"):
        raise HTTPException(status_code=400, detail="Please add at least one source before starting analysis")

    # Run analysis
    background_tasks.add_task(run_full_analysis, research_id)
    return {"status": "started", "research_id": research_id, "message": "Analysis initiated"}

@router.get("/{research_id}")
def get_research_status(research_id: str):
    session = db_service.get_session(research_id)
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")
    return session

@router.get("/{research_id}/results")
def get_research_results(research_id: str):
    session = db_service.get_session(research_id)
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")

    if session.get("analysis_status") != "completed":
        return {
            "research_id": research_id,
            "status": session.get("analysis_status", "pending"),
            "message": "Analysis is still running or pending"
        }

    return session

@router.get("", response_model=list[ResearchSessionSummary])
def list_research_history(x_user_id: str = Header(default="guest")):
    return db_service.list_user_sessions(x_user_id)

@router.delete("/{research_id}")
def delete_research(research_id: str):
    deleted = db_service.delete_session(research_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Research session not found or already deleted")
    return {"status": "success", "deleted_id": research_id}

@router.patch("/{research_id}/tasks/{task_id}")
def update_task_status(research_id: str, task_id: str, req: UpdateTaskStatusRequest):
    updated = db_service.update_task_status(research_id, task_id, req.completed)
    if not updated:
        raise HTTPException(status_code=404, detail="Task or research session not found")
    return {"status": "success", "task_id": task_id, "completed": req.completed}

@router.get("/{research_id}/export")
def export_pdf(research_id: str):
    session = db_service.get_session(research_id)
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")

    pdf_buffer = report_generator.generate_pdf_report(session)
    filename = f"DigitalDarkSpot_Report_{research_id}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.post("/demo/load")
def load_demo_scholarship_scenario():
    """
    Creates and immediately runs the production demonstration scholarship scenario.
    """
    research_id = f"res_demo_{uuid.uuid4().hex[:6]}"
    now = datetime.now(timezone.utc).isoformat()
    demo_urls = list(DEMO_SOURCES.keys())

    session_data = {
        "research_id": research_id,
        "user_id": "guest",
        "topic": "Scholarship Application Research",
        "research_topic": "Scholarship Application Research",
        "research_question": "What should a student verify before applying for a government scholarship?",
        "category": "Education",
        "additional_context": "Applicant is evaluating national and state merit scholarships for undergraduate enrollment.",
        "sources_input": demo_urls,
        "status": "created",
        "analysis_status": "created",
        "created_at": now,
        "updated_at": now,
        "is_demo": True
    }
    db_service.save_session(session_data)
    # Run analysis synchronously for demo so it's ready immediately
    run_full_analysis(research_id)
    return {"status": "success", "research_id": research_id}
