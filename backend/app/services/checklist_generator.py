from typing import List
from backend.app.schemas.research import VerificationTask, InformationGap, PossibleConflict, OutdatedWarning

class ChecklistGenerator:
    """Stage 5: Generates prioritized, interactive verification tasks."""

    def generate_checklist(
        self,
        gaps: List[InformationGap],
        conflicts: List[PossibleConflict],
        warnings: List[OutdatedWarning]
    ) -> List[VerificationTask]:
        tasks: List[VerificationTask] = []
        task_idx = 1

        # High priority tasks from conflicts
        for conf in conflicts:
            tasks.append(VerificationTask(
                task_id=f"task_{task_idx}",
                task_description=f"Resolve {conf.topic}: Confirm whether '{conf.claim_a.claim_text}' or '{conf.claim_b.claim_text}' is the active protocol.",
                reason=conf.ai_finding,
                priority="High",
                completed=False,
                suggested_source="Official State Higher Education Portal / Notification Gazette",
                related_sources=[conf.claim_a.source_title, conf.claim_b.source_title]
            ))
            task_idx += 1

        # Priority tasks from critical information gaps
        for gap in gaps:
            tasks.append(VerificationTask(
                task_id=f"task_{task_idx}",
                task_description=f"Verify {gap.missing_information}: Check missing rules directly with issuing authority.",
                reason=gap.why_it_matters,
                priority=gap.priority,
                completed=False,
                suggested_source=gap.suggested_action,
                related_sources=gap.sources_reviewed
            ))
            task_idx += 1

        # Tasks from outdated sources
        for w in warnings:
            if w.classification == "Potentially outdated":
                tasks.append(VerificationTask(
                    task_id=f"task_{task_idx}",
                    task_description=f"Discard or re-verify legacy data from '{w.source_title}' ({w.relevant_cycle}).",
                    reason=w.reason,
                    priority="Medium",
                    completed=False,
                    suggested_source="Current academic cycle portal",
                    related_sources=[w.source_title]
                ))
                task_idx += 1

        return tasks

checklist_generator = ChecklistGenerator()
