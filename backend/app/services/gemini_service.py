import json
import logging
import re
from typing import Dict, Any, Optional
from backend.app.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    """Handles structured communication with Google Gemini API."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self.client = None
        self._init_client()

    def _init_client(self):
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Google GenAI client initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Google GenAI client: {str(e)}")
                self.client = None

    def is_available(self) -> bool:
        return bool(self.api_key and self.client)

    def analyze_research_pipeline(
        self,
        topic: str,
        question: str,
        category: str,
        additional_context: str,
        sources: list[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """
        Executes the multi-stage research analysis via Gemini with structured JSON output.
        """
        if not self.is_available():
            return None

        # Build clean source bundle for prompt
        sources_payload = []
        for s in sources:
            if s.get("extraction_status") == "success":
                sources_payload.append({
                    "source_id": s.get("source_id"),
                    "title": s.get("title"),
                    "url": s.get("url"),
                    "domain": s.get("domain"),
                    "publication_date": s.get("publication_date"),
                    "content": s.get("clean_text", "")[:4500]  # bounded token window
                })

        if not sources_payload:
            return None

        prompt = f"""
You are the AI engine of "Digital Dark Spot", an evidence-backed Information Gap Detection Platform.
Your purpose is to analyze information from multiple sources and help users discover what information is missing, what information conflicts, what might be outdated, and what they should verify next.

CRITICAL INSTRUCTIONS:
1. Do NOT act like a generic conversational chatbot.
2. Every finding MUST cite exact source IDs and provide traceable quotes or snippets.
3. For missing info (gaps), ALWAYS use wording like: "Not found in the sources reviewed."
4. Do NOT classify two claims as contradictory merely because of wording differences. Only flag contradictions if they refer to the same subject, condition, or deadline and state incompatible facts.
5. Check publication dates and academic/scheme cycles for outdated warnings.
6. Output MUST be 100% valid JSON matching the exact schema below without any markdown fences.

USER RESEARCH INPUT:
- Research Topic: {topic}
- Core Research Question: {question}
- Category: {category}
- Additional Context: {additional_context or 'None provided'}

SOURCES REVIEWED ({len(sources_payload)} sources):
{json.dumps(sources_payload, indent=2)}

SCHEMA TO RETURN:
{{
  "overview": "Concise structured summary of confirmed and unconfirmed findings",
  "key_findings": [
    {{
      "finding_id": "find_1",
      "description": "Finding statement",
      "category": "Eligibility / Requirement / Deadline / Financial",
      "status": "Found",
      "evidence_references": [
        {{
          "source_id": "source_id_here",
          "source_title": "title",
          "url": "url",
          "snippet": "exact supporting text snippet",
          "publication_date": "date or null"
        }}
      ]
    }}
  ],
  "information_gaps": [
    {{
      "gap_id": "gap_1",
      "missing_information": "Specific piece of missing information",
      "why_it_matters": "Why this omission is critical for the decision",
      "related_research_question": "Which aspect of the user question is affected",
      "priority": "High | Medium | Low",
      "sources_reviewed": ["source_ids"],
      "suggested_action": "Where or how the user should obtain this missing information",
      "status_label": "Not found in the sources reviewed."
    }}
  ],
  "possible_conflicts": [
    {{
      "conflict_id": "conf_1",
      "topic": "Application Deadline / Document Submission / etc.",
      "claim_a": {{
        "claim_text": "Claim statement A",
        "source_id": "source_id",
        "source_title": "title",
        "url": "url",
        "date_context": "cycle/date"
      }},
      "claim_b": {{
        "claim_text": "Claim statement B",
        "source_id": "source_id",
        "source_title": "title",
        "url": "url",
        "date_context": "cycle/date"
      }},
      "ai_finding": "Detailed explanation of the discrepancy",
      "suggested_action": "How to resolve this conflict with authoritative bodies",
      "classification": "Possible contradiction detected"
    }}
  ],
  "outdated_information": [
    {{
      "source_id": "source_id",
      "source_title": "title",
      "url": "url",
      "publication_date": "date or null",
      "relevant_cycle": "e.g. 2023-2024",
      "classification": "Potentially outdated | Date unavailable | Current cycle not confirmed | No apparent date-related warning",
      "reason": "Explanation of age, superseded scheme, or expired deadline",
      "recommended_action": "Recommended verification step"
    }}
  ],
  "unanswered_questions": [
    {{
      "question": "Unanswered question regarding the objective",
      "relevance": "Why user needs this answered",
      "status": "Not found in reviewed sources"
    }}
  ],
  "verification_checklist": [
    {{
      "task_id": "task_1",
      "task_description": "Concrete action user must take",
      "reason": "Why this check is necessary",
      "priority": "High | Medium | Low",
      "completed": false,
      "suggested_source": "Suggested authoritative contact or portal",
      "related_sources": ["source titles"]
    }}
  ],
  "limitations": [
    "Analysis is strictly bounded to the {len(sources_payload)} sources provided.",
    "Web pages with dynamic JavaScript or client-side authentication could not be independently inspected.",
    "Verification checklist reflects potential risks and should be validated with primary issuing authorities."
  ],
  "confidence_notes": [
    "Direct source claims extracted with exact text grounding.",
    "Contradictions evaluated by cross-referencing temporal cycle metadata."
  ]
}}
"""

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            raw_text = response.text.strip()
            # Clean markdown code blocks if returned
            if raw_text.startswith("```"):
                raw_text = re.sub(r"^```(?:json)?\n", "", raw_text)
                raw_text = re.sub(r"\n```$", "", raw_text)
            
            data = json.loads(raw_text)
            return data
        except Exception as e:
            logger.error(f"Gemini API call or JSON parsing error: {str(e)}")
            return None

gemini_service = GeminiService()
