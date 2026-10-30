import os
from pathlib import Path
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseModel
    class BaseSettings(BaseModel):
        pass
from dotenv import load_dotenv

# Load .env from project root or backend root
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT_DIR / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

class Settings(BaseSettings):
    APP_NAME: str = "Digital Dark Spot – AI-Assisted Information Gap Detection"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DEBUG: bool = True
    
    # AI Engine Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # Firebase Configuration
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")
    FIREBASE_CLIENT_EMAIL: str = os.getenv("FIREBASE_CLIENT_EMAIL", "")
    FIREBASE_PRIVATE_KEY: str = os.getenv("FIREBASE_PRIVATE_KEY", "")
    
    # Storage & Persistence
    DATA_DIR: Path = ROOT_DIR / ".tmp" / "storage"
    
    # Security & Extraction Guardrails
    REQUEST_TIMEOUT_SECONDS: int = 15
    MAX_CONTENT_LENGTH_BYTES: int = 1_500_000  # ~1.5MB max per scraped page
    USER_AGENT: str = "DigitalDarkSpot-Researcher/1.0 (+https://digitaldarkspot.ai)"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
