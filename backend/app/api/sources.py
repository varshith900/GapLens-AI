from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.source_extractor import source_extractor, DEMO_SOURCES
from backend.app.schemas.research import SourceRecord

router = APIRouter(prefix="/sources", tags=["Sources"])

class ValidateUrlRequest(BaseModel):
    url: str

@router.post("/validate", response_model=SourceRecord)
def validate_and_preview_url(req: ValidateUrlRequest):
    return source_extractor.extract_source(req.url)

@router.get("/demo")
def get_demo_sources():
    return [
        {
            "id": k,
            "url": k,
            "title": v["title"],
            "domain": v["domain"],
            "publication_date": v.get("publication_date"),
            "cycle": v.get("cycle"),
            "summary": v["content"].strip().split("\n\n")[0]
        }
        for k, v in DEMO_SOURCES.items()
    ]
