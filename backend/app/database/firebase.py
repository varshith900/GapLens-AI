import json
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path
from backend.app.config import settings

logger = logging.getLogger(__name__)

class DatabaseService:
    """
    Unified persistence manager.
    Supports Google Cloud Firestore when configured, and falls back to
    local structured JSON storage so the platform is immediately operational out-of-the-box.
    """

    def __init__(self):
        self.firestore_client = None
        self.is_firestore_active = False
        self.storage_dir = settings.DATA_DIR / "sessions"
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self._init_firebase()

    def _init_firebase(self):
        if not settings.FIREBASE_PROJECT_ID:
            logger.info("FIREBASE_PROJECT_ID not set. Using local JSON store.")
            return

        try:
            import firebase_admin
            from firebase_admin import credentials, firestore

            if not firebase_admin._apps:
                if settings.FIREBASE_CLIENT_EMAIL and settings.FIREBASE_PRIVATE_KEY:
                    cred_dict = {
                        "type": "service_account",
                        "project_id": settings.FIREBASE_PROJECT_ID,
                        "private_key": settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
                        "client_email": settings.FIREBASE_CLIENT_EMAIL,
                        "token_uri": "https://oauth2.googleapis.com/token",
                    }
                    cred = credentials.Certificate(cred_dict)
                    firebase_admin.initialize_app(cred)
                else:
                    firebase_admin.initialize_app()

            self.firestore_client = firestore.client()
            self.is_firestore_active = True
            logger.info(f"Firebase Firestore initialized for project: {settings.FIREBASE_PROJECT_ID}")
        except Exception as e:
            logger.warning(f"Could not initialize Firebase Firestore ({str(e)}). Using local file store.")
            self.firestore_client = None
            self.is_firestore_active = False

    def save_session(self, session: Dict[str, Any]) -> bool:
        research_id = session.get("research_id")
        if not research_id:
            return False

        # If Firestore is active, save to Firestore
        if self.is_firestore_active and self.firestore_client:
            try:
                doc_ref = self.firestore_client.collection("research_sessions").document(research_id)
                doc_ref.set(session)
            except Exception as e:
                logger.error(f"Firestore save error: {str(e)}. Falling back to local disk.")

        # Always persist locally for instant retrieval & offline resilience
        file_path = self.storage_dir / f"{research_id}.json"
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(session, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            logger.error(f"Failed to save session locally: {str(e)}")
            return False

    def get_session(self, research_id: str) -> Optional[Dict[str, Any]]:
        # Try local first for low latency
        file_path = self.storage_dir / f"{research_id}.json"
        if file_path.exists():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error reading local file: {str(e)}")

        # Fallback to Firestore if active
        if self.is_firestore_active and self.firestore_client:
            try:
                doc = self.firestore_client.collection("research_sessions").document(research_id).get()
                if doc.exists:
                    return doc.to_dict()
            except Exception as e:
                logger.error(f"Firestore retrieval error: {str(e)}")

        return None

    def list_user_sessions(self, user_id: str) -> List[Dict[str, Any]]:
        sessions = []

        # Local directory scan
        for f in self.storage_dir.glob("*.json"):
            try:
                with open(f, "r", encoding="utf-8") as fp:
                    data = json.load(fp)
                    # Filter by user if specified (or allow guest/demo if user_id is guest)
                    sess_user = data.get("user_id", "guest")
                    if user_id == "all" or sess_user == user_id or user_id in ("guest", "anonymous"):
                        summary = {
                            "research_id": data.get("research_id"),
                            "user_id": sess_user,
                            "topic": data.get("research_topic", data.get("topic", "Untitled")),
                            "research_question": data.get("research_question", ""),
                            "category": data.get("category", "General Research"),
                            "status": data.get("analysis_status", "completed"),
                            "created_at": data.get("analysis_date", data.get("created_at", "")),
                            "updated_at": data.get("updated_at", ""),
                            "sources_count": len(data.get("sources_analyzed", [])),
                            "sources_analyzed_count": data.get("sources_analyzed_count", 0),
                            "gaps_count": len(data.get("information_gaps", [])),
                            "conflicts_count": len(data.get("possible_conflicts", [])),
                            "checklist_total": len(data.get("verification_checklist", [])),
                            "checklist_completed": sum(1 for t in data.get("verification_checklist", []) if t.get("completed")),
                            "is_demo": data.get("is_demo", False)
                        }
                        sessions.append(summary)
            except Exception as e:
                logger.error(f"Error reading session file {f.name}: {str(e)}")

        # Sort descending by date
        sessions.sort(key=lambda s: s.get("created_at", ""), reverse=True)
        return sessions

    def delete_session(self, research_id: str) -> bool:
        deleted = False
        file_path = self.storage_dir / f"{research_id}.json"
        if file_path.exists():
            try:
                file_path.unlink()
                deleted = True
            except Exception as e:
                logger.error(f"Error deleting local session file: {str(e)}")

        if self.is_firestore_active and self.firestore_client:
            try:
                self.firestore_client.collection("research_sessions").document(research_id).delete()
                deleted = True
            except Exception as e:
                logger.error(f"Firestore delete error: {str(e)}")

        return deleted

    def update_task_status(self, research_id: str, task_id: str, completed: bool) -> bool:
        session = self.get_session(research_id)
        if not session:
            return False

        updated = False
        checklist = session.get("verification_checklist", [])
        for task in checklist:
            if task.get("task_id") == task_id:
                task["completed"] = completed
                updated = True
                break

        if updated:
            session["verification_checklist"] = checklist
            self.save_session(session)
            return True

        return False

db_service = DatabaseService()
