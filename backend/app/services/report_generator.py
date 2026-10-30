import io
import logging
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

logger = logging.getLogger(__name__)

class ReportGenerator:
    """Generates downloadable, executive-ready PDF research reports using ReportLab."""

    def generate_pdf_report(self, session: Dict[str, Any]) -> io.BytesIO:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()
        
        # Custom palette styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Heading1"],
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=6
        )
        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#475569"),
            spaceAfter=15
        )
        h2_style = ParagraphStyle(
            "SectionH2",
            parent=styles["Heading2"],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#1e293b"),
            spaceBefore=14,
            spaceAfter=8
        )
        body_style = ParagraphStyle(
            "DocBody",
            parent=styles["Normal"],
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor("#334155")
        )
        callout_style = ParagraphStyle(
            "Callout",
            parent=styles["Normal"],
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor("#b45309")
        )
        conflict_style = ParagraphStyle(
            "Conflict",
            parent=styles["Normal"],
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor("#b91c1c")
        )

        story = []

        # Header
        story.append(Paragraph("DIGITAL DARK SPOT", ParagraphStyle("Brand", fontSize=10, textColor=colors.HexColor("#d97706"), fontName="Helvetica-Bold")))
        story.append(Paragraph("AI-Assisted Information Gap & Contradiction Report", title_style))
        topic = session.get("research_topic", session.get("topic", "Research Report"))
        question = session.get("research_question", "N/A")
        analysis_date = session.get("analysis_date", "Recent")
        story.append(Paragraph(f"<b>Research Topic:</b> {topic}<br/><b>Research Objective:</b> {question}<br/><b>Generated:</b> {analysis_date}", subtitle_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#e2e8f0"), spaceAfter=14))

        # 1. Overview
        story.append(Paragraph("1. Executive Overview", h2_style))
        overview_text = session.get("overview", "Comprehensive multi-source analysis completed.")
        story.append(Paragraph(overview_text, body_style))
        story.append(Spacer(1, 10))

        # 2. Key Findings
        story.append(Paragraph("2. Information Found Across Sources", h2_style))
        findings = session.get("key_findings", [])
        if findings:
            for f in findings:
                desc = f.get("description", "")
                cat = f.get("category", "")
                status = f.get("status", "Found")
                story.append(Paragraph(f"• <b>[{cat}]</b> {desc} <i>({status})</i>", body_style))
                for ev in f.get("evidence_references", [])[:2]:
                    snippet = ev.get("snippet", "")
                    title = ev.get("source_title", "")
                    story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;<i>Evidence ({title}): \"{snippet[:180]}...\"</i>", ParagraphStyle("Ev", parent=body_style, fontSize=8.5, textColor=colors.HexColor("#64748b"))))
                story.append(Spacer(1, 4))
        else:
            story.append(Paragraph("No direct confirmed findings extracted.", body_style))
        story.append(Spacer(1, 10))

        # 3. Information Gaps
        story.append(Paragraph("3. Potential Information Gaps (Unanswered Topics)", h2_style))
        gaps = session.get("information_gaps", [])
        if gaps:
            for g in gaps:
                missing = g.get("missing_information", "")
                why = g.get("why_it_matters", "")
                prio = g.get("priority", "High")
                action = g.get("suggested_action", "")
                status_lbl = g.get("status_label", "Not found in the sources reviewed.")
                story.append(Paragraph(f"<b>GAP: {missing}</b> (Priority: {prio})", callout_style))
                story.append(Paragraph(f"<b>Status:</b> {status_lbl}<br/><b>Impact:</b> {why}<br/><b>Suggested Action:</b> {action}", body_style))
                story.append(Spacer(1, 6))
        else:
            story.append(Paragraph("No significant information gaps detected in reviewed corpus.", body_style))
        story.append(Spacer(1, 10))

        # 4. Possible Contradictions
        story.append(Paragraph("4. Possible Contradictions & Claim Discrepancies", h2_style))
        conflicts = session.get("possible_conflicts", [])
        if conflicts:
            for c in conflicts:
                topic_c = c.get("topic", "")
                ai_finding = c.get("ai_finding", "")
                claim_a = c.get("claim_a", {})
                claim_b = c.get("claim_b", {})
                action_c = c.get("suggested_action", "")

                story.append(Paragraph(f"<b>CONFLICT: {topic_c}</b>", conflict_style))
                story.append(Paragraph(f"• <b>Claim A ({claim_a.get('source_title', 'Source A')}):</b> {claim_a.get('claim_text', '')}", body_style))
                story.append(Paragraph(f"• <b>Claim B ({claim_b.get('source_title', 'Source B')}):</b> {claim_b.get('claim_text', '')}", body_style))
                story.append(Paragraph(f"<b>AI Assessment:</b> {ai_finding}<br/><b>Resolution Step:</b> {action_c}", body_style))
                story.append(Spacer(1, 6))
        else:
            story.append(Paragraph("No direct contradictory claims detected between reviewed sources.", body_style))
        story.append(Spacer(1, 10))

        # 5. Outdated Warnings
        story.append(Paragraph("5. Freshness & Outdated Information Warnings", h2_style))
        warnings = session.get("outdated_information", [])
        if warnings:
            for w in warnings:
                title_w = w.get("source_title", "")
                cls_w = w.get("classification", "")
                reason_w = w.get("reason", "")
                cycle_w = w.get("relevant_cycle", "N/A")
                story.append(Paragraph(f"• <b>{title_w}</b> - <i>{cls_w}</i> (Cycle: {cycle_w})<br/>&nbsp;&nbsp;{reason_w}", body_style))
                story.append(Spacer(1, 4))
        story.append(Spacer(1, 10))

        # 6. Verification Checklist
        story.append(Paragraph("6. Prioritized Verification Checklist", h2_style))
        checklist = session.get("verification_checklist", [])
        if checklist:
            for t in checklist:
                box = "[X]" if t.get("completed") else "[ ]"
                desc = t.get("task_description", "")
                prio = t.get("priority", "High")
                src = t.get("suggested_source", "Authoritative office")
                story.append(Paragraph(f"<b>{box} ({prio} Priority)</b> {desc}<br/>&nbsp;&nbsp;&nbsp;&nbsp;<i>Target Source: {src}</i>", body_style))
                story.append(Spacer(1, 4))
        story.append(Spacer(1, 10))

        # Footer & Limitations
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e2e8f0"), spaceBefore=10, spaceAfter=8))
        story.append(Paragraph("<b>Notice on AI Uncertainty:</b> AI-generated findings must be evaluated as potential gaps, possible conflicts, and verification leads rather than absolute facts. Always confirm mission-critical decisions directly with primary issuing institutions.", ParagraphStyle("Foot", parent=body_style, fontSize=8, textColor=colors.HexColor("#64748b"))))

        doc.build(story)
        buffer.seek(0)
        return buffer

report_generator = ReportGenerator()
