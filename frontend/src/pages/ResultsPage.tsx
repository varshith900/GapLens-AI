import React, { useState, useEffect } from "react";
import {
  Download,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  CheckSquare,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  RefreshCw,
  Check
} from "lucide-react";
import { getResearchResults, updateTaskStatus, getExportPdfUrl } from "../services/api";
import type { ResearchSession } from "../types";

interface ResultsPageProps {
  researchId: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ researchId, onNavigate }) => {
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getResearchResults(researchId);
      setSession(data);
    } catch (err: any) {
      setError(err.message || "Failed to load research analysis report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (researchId) {
      fetchResults();
    }
  }, [researchId]);

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    if (!session) return;
    try {
      await updateTaskStatus(session.research_id, taskId, !currentStatus);
      const updatedChecklist = (session.verification_checklist || []).map((t) =>
        t.task_id === taskId ? { ...t, completed: !currentStatus } : t
      );
      setSession({ ...session, verification_checklist: updatedChecklist });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
          <Layers className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Loading Research Findings</h3>
        <p className="text-xs text-slate-400 font-mono">Synthesizing cross-source evidence for {researchId}...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm mb-6">
          {error || "Report not found"}
        </div>
        <button
          onClick={() => onNavigate("research")}
          className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700"
        >
          Return to Workspace
        </button>
      </div>
    );
  }

  const checklist = session.verification_checklist || [];
  const completedCount = checklist.filter((t) => t.completed).length;
  const checklistProgress = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const gaps = session.information_gaps || [];
  const conflicts = session.possible_conflicts || [];
  const outdated = session.outdated_information || [];
  const findings = session.key_findings || [];
  const unanswered = session.unanswered_questions || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Navigation & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("research")}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">ID: {session.research_id}</span>
              {session.is_demo && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Hackathon Scenario
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {session.research_topic || session.topic}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchResults}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh Analysis"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={getExportPdfUrl(session.research_id)}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Report</span>
          </a>
        </div>
      </div>

      {/* Dashboard Metadata Banner */}
      <div className="p-6 rounded-2xl glass-panel-elevated border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Research Objective</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
              "{session.research_question}"
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Analysis Timestamp</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{session.analysis_date || "Today"}</span>
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Corpus Breakdown</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{session.sources_analyzed_count || session.sources_analyzed?.length || 0} Analyzed / {session.sources_submitted_count || session.sources_analyzed?.length || 0} Submitted</span>
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Engine Verification</span>
            <p className="text-xs sm:text-sm font-semibold text-amber-300 mt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{session.engine_used || "Multi-Stage Intelligence Engine"}</span>
            </p>
          </div>
        </div>

        {/* KPI Counter Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-400/90 font-medium">Information Gaps</span>
              <p className="text-xl font-extrabold text-amber-300">{gaps.length}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-amber-400/60" />
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-rose-400/90 font-medium">Possible Conflicts</span>
              <p className="text-xl font-extrabold text-rose-300">{conflicts.length}</p>
            </div>
            <ShieldAlert className="w-6 h-6 text-rose-400/60" />
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-indigo-400/90 font-medium">Outdated Warnings</span>
              <p className="text-xl font-extrabold text-indigo-300">{outdated.filter(o => o.classification !== "No apparent date-related warning").length}</p>
            </div>
            <Calendar className="w-6 h-6 text-indigo-400/60" />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-400/90 font-medium">Verified Checklist</span>
              <p className="text-xl font-extrabold text-emerald-300">{completedCount}/{checklist.length}</p>
            </div>
            <CheckSquare className="w-6 h-6 text-emerald-400/60" />
          </div>
        </div>
      </div>

      {/* Section 1: Executive Overview */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
            1
          </div>
          <h2 className="text-base font-bold text-white">Executive Synthesis & Overview</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {session.overview}
        </p>

        {findings.length > 0 && (
          <div className="mt-4 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Direct Claims Extracted From Sources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {findings.map((f) => (
                <div key={f.finding_id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {f.category}
                      </span>
                      <span className={`text-[10px] font-semibold ${f.status === "Found" ? "text-emerald-400" : "text-amber-400"}`}>
                        {f.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{f.description}</p>
                  </div>
                  {f.evidence_references && f.evidence_references.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                      <span className="text-slate-500 font-mono">Evidence: </span>
                      <span className="italic">"{f.evidence_references[0].snippet.slice(0, 100)}..."</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Information Gap Analysis */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Information Gap Analysis</h2>
              <p className="text-xs text-slate-400">What critical information was omitted or missing in the reviewed sources</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {gaps.length} Gaps Detected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {gaps.map((gap) => (
            <div
              key={gap.gap_id}
              className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {gap.priority} Priority Gap
                  </span>
                  <span className="text-[11px] font-mono text-amber-400/90 font-medium">
                    {gap.status_label || "Not found in the sources reviewed."}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{gap.missing_information}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <b className="text-slate-400">Why it matters:</b> {gap.why_it_matters}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
                <p className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Suggested Verification Action:</span>
                </p>
                <p className="text-slate-300">{gap.suggested_action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Contradiction Detection */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">
              3
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Contradiction Detection</h2>
              <p className="text-xs text-slate-400">Incompatible facts, dates, or procedural guidelines across different sources</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
            {conflicts.length} Contradictions Flagged
          </span>
        </div>

        {conflicts.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No contradictory claims detected among reviewed documents.</p>
        ) : (
          <div className="space-y-4 mt-2">
            {conflicts.map((conf) => (
              <div
                key={conf.conflict_id}
                className="p-5 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>{conf.topic}</span>
                  </h4>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {conf.classification || "Possible contradiction detected"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-400">CLAIM A</span>
                      {conf.claim_a.date_context && (
                        <span className="text-slate-400 font-mono">{conf.claim_a.date_context}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 font-medium">"{conf.claim_a.claim_text}"</p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate max-w-[200px]">{conf.claim_a.source_title}</span>
                      <a
                        href={conf.claim_a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-rose-400">CLAIM B</span>
                      {conf.claim_b.date_context && (
                        <span className="text-slate-400 font-mono">{conf.claim_b.date_context}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 font-medium">"{conf.claim_b.claim_text}"</p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate max-w-[200px]">{conf.claim_b.source_title}</span>
                      <a
                        href={conf.claim_b.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-rose-300">AI Assessment: {conf.ai_finding}</p>
                  <p className="text-slate-400 text-[11px]"><b>Suggested Resolution:</b> {conf.suggested_action}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Outdated Information Warnings */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono text-xs font-bold">
            4
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Outdated Information & Cycle Warnings</h2>
            <p className="text-xs text-slate-400">Temporal validity, stale scheme years, and date unavailability</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {outdated.map((w, idx) => {
            const isWarn = w.classification === "Potentially outdated";
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl bg-slate-950 border flex flex-col justify-between space-y-3 ${
                  isWarn ? "border-indigo-500/40" : "border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      Cycle: {w.relevant_cycle || "Not specified"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isWarn
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                          : w.classification === "Date unavailable"
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {w.classification}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{w.source_title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{w.reason}</p>
                </div>
                <div className="text-[11px] text-amber-400/90 pt-2 border-t border-slate-900 flex items-center justify-between">
                  <span>Action: {w.recommended_action}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: Unanswered Questions */}
      {unanswered.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-mono text-xs font-bold">
              5
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Unanswered Research Questions</h2>
              <p className="text-xs text-slate-400">Critical inquiries that could not be resolved from the provided sources</p>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {unanswered.map((u, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-200">{u.question}</p>
                    <p className="text-[11px] text-slate-500">{u.relevance}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 shrink-0 border border-slate-800">
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 6: Traceable Evidence Panel */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
              6
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Traceable Evidence & Sources</h2>
              <p className="text-xs text-slate-400">Verbatim grounding text and citations for all extracted claims</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            {session.sources_analyzed?.length || 0} Sources Documented
          </span>
        </div>

        <div className="space-y-3 mt-2">
          {(session.sources_analyzed || []).map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-white">{s.title}</h4>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-slate-500 font-mono">{s.domain}</span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Visit Live URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {s.snippets && s.snippets.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/60 font-mono text-[11px] text-slate-300 leading-relaxed">
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Extracted Source Grounding Snippet:</p>
                  "{s.snippets[0]}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 7: Interactive Verification Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
              7
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dynamic Verification Checklist</h2>
              <p className="text-xs text-slate-400">Prioritized checklist generated to resolve gaps and confirm contradictory claims</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${checklistProgress}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {checklistProgress}% Done
            </span>
          </div>
        </div>

        <div className="space-y-2.5 mt-2">
          {checklist.map((task) => (
            <div
              key={task.task_id}
              onClick={() => handleToggleTask(task.task_id, task.completed)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                task.completed
                  ? "bg-emerald-950/20 border-emerald-800/40 opacity-75"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  task.completed
                    ? "bg-emerald-500 border-emerald-400 text-slate-950"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                      task.priority === "High"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : task.priority === "Medium"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  {task.suggested_source && (
                    <span className="text-[11px] text-amber-400/90 font-mono truncate">
                      Target: {task.suggested_source}
                    </span>
                  )}
                </div>
                <h4
                  className={`text-xs font-semibold text-white ${
                    task.completed ? "line-through text-slate-400" : ""
                  }`}
                >
                  {task.task_description}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  <b>Reason:</b> {task.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
