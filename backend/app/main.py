import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.api.research import router as research_router
from backend.app.api.sources import router as sources_router
from backend.app.api.history import router as history_router
from backend.app.services.gemini_service import gemini_service
from backend.app.database.firebase import db_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("DigitalDarkSpot")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Digital Dark Spot – AI-Assisted Information Gap & Contradiction Detection Platform"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes under /api
app.include_router(research_router, prefix=settings.API_PREFIX)
app.include_router(sources_router, prefix=settings.API_PREFIX)
app.include_router(history_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "tagline": "Discover What's Missing in Your Information.",
        "docs_url": "/docs",
        "health_check": f"{settings.API_PREFIX}/health"
    }

@app.get(f"{settings.API_PREFIX}/health")
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "gemini_active": gemini_service.is_available(),
        "gemini_model": settings.GEMINI_MODEL,
        "firebase_active": db_service.is_firestore_active,
        "storage_mode": "Firestore Cloud" if db_service.is_firestore_active else "Local Resilient JSON Store",
        "engine_mode": "Google Gemini 2.5 Flash" if gemini_service.is_available() else "Deterministic Multi-Stage Heuristic Engine"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
