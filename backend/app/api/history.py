from fastapi import APIRouter, Header
from backend.app.schemas.research import ResearchSessionSummary
from backend.app.database.firebase import db_service

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=list[ResearchSessionSummary])
def get_user_history(x_user_id: str = Header(default="guest")):
    return db_service.list_user_sessions(x_user_id)
