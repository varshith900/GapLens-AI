import unittest
from backend.app.utils.security import is_safe_public_url
from backend.app.services.source_extractor import source_extractor, DEMO_SOURCES
from backend.app.services.conflict_detector import conflict_detector
from backend.app.services.gap_detector import gap_detector
from backend.app.services.freshness_checker import freshness_checker
from backend.app.services.checklist_generator import checklist_generator
from backend.app.services.report_generator import report_generator
from backend.app.database.firebase import db_service
from backend.app.api.research import run_full_analysis

class TestDigitalDarkSpotPipeline(unittest.TestCase):

    def test_ssrf_and_security_guardrails(self):
        """Verify private and dangerous URLs are safely blocked."""
        blocked_urls = [
            "http://localhost:8000/secret",
            "http://127.0.0.1:3000",
            "http://169.254.169.254/latest/meta-data/",
            "http://0.0.0.0:80",
            "ftp://invalid-protocol.com",
            "",
            "javascript:alert(1)"
        ]
        for url in blocked_urls:
            is_safe, reason = is_safe_public_url(url)
            self.assertFalse(is_safe, f"URL {url} should have been blocked but passed")

        # Public URLs should be recognized as safe
        is_safe, _ = is_safe_public_url("https://scholarships.gov.in")
        self.assertTrue(is_safe)

    def test_demo_source_extraction(self):
        """Verify demo scenario sources extract properly with dates and clean text."""
        for url in DEMO_SOURCES.keys():
            record = source_extractor.extract_source(url)
            self.assertEqual(record.extraction_status, "success")
            self.assertTrue(len(record.clean_text) > 50)
            self.assertTrue(len(record.snippets) > 0)

    def test_scholarship_scenario(self):
        """
        Verify the exact scholarship scenario:
        - Eligibility is found
        - Differing deadline & document claims are detected as contradictions
        - Previous year source is flagged as potentially outdated
        - Undated source flagged as Date unavailable
        - Renewal conditions flagged as critical information gap
        """
        demo_urls = list(DEMO_SOURCES.keys())
        extracted = [source_extractor.extract_source(u).model_dump() for u in demo_urls]

        # 1. Conflict detection
        conflicts = conflict_detector.detect_conflicts(extracted)
        self.assertTrue(len(conflicts) >= 1, "Should detect at least 1 contradiction (deadline or documentation)")
        
        conflict_topics = [c.topic for c in conflicts]
        has_deadline_or_docs = any("Deadline" in t or "Certificate" in t or "Document" in t for t in conflict_topics)
        self.assertTrue(has_deadline_or_docs, f"Expected deadline or document contradiction, got: {conflict_topics}")

        # 2. Information gap detection
        gaps, findings, unanswered = gap_detector.evaluate_gaps_and_findings(
            topic="Scholarship Application Research",
            question="What should a student verify before applying for a government scholarship?",
            sources=extracted
        )
        self.assertTrue(len(gaps) >= 1, "Should detect information gaps")
        has_renewal_gap = any("renewal" in g.missing_information.lower() for g in gaps)
        self.assertTrue(has_renewal_gap, "Should identify renewal conditions as an information gap")
        
        # Verify findings are extracted
        self.assertTrue(len(findings) >= 1, "Should extract key findings (eligibility/disbursement)")

        # 3. Freshness checking
        warnings = freshness_checker.evaluate_freshness(extracted)
        classifications = [w.classification for w in warnings]
        self.assertIn("Potentially outdated", classifications)
        self.assertIn("Date unavailable", classifications)

        # 4. Verification Checklist
        tasks = checklist_generator.generate_checklist(gaps, conflicts, warnings)
        self.assertTrue(len(tasks) >= 3, "Checklist should contain prioritized tasks")
        priorities = [t.priority for t in tasks]
        self.assertIn("High", priorities)

    def test_report_and_persistence(self):
        """Test session saving, PDF generation, and checklist status updates."""
        test_id = "res_test_pipeline_run"
        sample_session = {
            "research_id": test_id,
            "topic": "Scholarship Application Research",
            "research_topic": "Scholarship Application Research",
            "research_question": "What should a student verify before applying?",
            "category": "Education",
            "sources_input": list(DEMO_SOURCES.keys()),
            "status": "created",
            "analysis_status": "created"
        }
        db_service.save_session(sample_session)
        
        # Run analysis
        run_full_analysis(test_id)
        
        retrieved = db_service.get_session(test_id)
        self.assertEqual(retrieved.get("analysis_status"), "completed")
        self.assertTrue(len(retrieved.get("key_findings", [])) > 0)
        self.assertTrue(len(retrieved.get("information_gaps", [])) > 0)

        # Test PDF generation
        pdf = report_generator.generate_pdf_report(retrieved)
        self.assertTrue(len(pdf.getvalue()) > 1000, "PDF buffer should contain generated bytes")

        # Test task toggle
        tasks = retrieved.get("verification_checklist", [])
        if tasks:
            first_task_id = tasks[0]["task_id"]
            db_service.update_task_status(test_id, first_task_id, True)
            updated = db_service.get_session(test_id)
            updated_task = next(t for t in updated["verification_checklist"] if t["task_id"] == first_task_id)
            self.assertTrue(updated_task["completed"])

        # Clean up test session
        db_service.delete_session(test_id)
        self.assertIsNone(db_service.get_session(test_id))

if __name__ == "__main__":
    unittest.main()

