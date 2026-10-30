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
  Check,
  Search,
  Copy,
  ChevronDown,
  Filter,
  CheckCheck,
  Award
} from "lucide-react";
import { getResearchResults, updateTaskStatus, getExportPdfUrl } from "../services/api";
import type { ResearchSession } from "../types";

interface ResultsPageProps {
  researchId: string;
  onNavigate: (view: string, param?: string) => void;
  theme?: "dark" | "light";
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ researchId, onNavigate, theme = "dark" }) => {
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "gaps" | "conflicts" | "outdated" | "evidence" | "checklist">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const isDark = theme === "dark";

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="relative w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-5 animate-pulse">
          <Layers className="w-8 h-8 animate-spin" />
        </div>
        <h3 className={`text-xl font-heading font-bold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
          Synthesizing Cross-Source Intelligence
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
          Evaluating gaps and contradictions for {researchId}...
        </p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-sm mb-6 font-medium">
          {error || "Report not found"}
        </div>
        <button
          onClick={() => onNavigate("research")}
          className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-sm cursor-pointer"
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

  const filterText = searchQuery.toLowerCase().trim();

  const filteredGaps = gaps.filter(
    (g) =>
      !filterText ||
      g.missing_information.toLowerCase().includes(filterText) ||
      g.why_it_matters.toLowerCase().includes(filterText)
  );

  const filteredConflicts = conflicts.filter(
    (c) =>
      !filterText ||
      c.topic.toLowerCase().includes(filterText) ||
      c.claim_a.claim_text.toLowerCase().includes(filterText) ||
      c.claim_b.claim_text.toLowerCase().includes(filterText)
  );

  const filteredOutdated = outdated.filter(
    (o) =>
      !filterText ||
      o.source_title.toLowerCase().includes(filterText) ||
      o.reason.toLowerCase().includes(filterText)
  );

  const filteredFindings = findings.filter(
    (f) =>
      !filterText ||
      f.description.toLowerCase().includes(filterText) ||
      f.category.toLowerCase().includes(filterText)
  );

  const filteredChecklist = checklist.filter(
    (t) =>
      !filterText ||
      t.task_description.toLowerCase().includes(filterText) ||
      t.reason.toLowerCase().includes(filterText) ||
      (t.suggested_source && t.suggested_source.toLowerCase().includes(filterText))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      
      {/* Top Header & Export Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={() => onNavigate("research")}
            className={`p-2.5 rounded-2xl border transition-colors cursor-pointer shrink-0 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 shadow-xs"
            }`}
            title="Back to Workspace"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-slate-400">ID: {session.research_id}</span>
              {session.is_demo && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase">
                  Demonstration Benchmark
                </span>
              )}
              <span className="text-xs font-mono text-slate-400">• {session.category}</span>
            </div>
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-heading font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {session.research_topic || session.topic}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={fetchResults}
            className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                : "bg-white border-slate-200 text-slate-600 hover:text-slate-950 shadow-xs"
            }`}
            title="Refresh Analysis"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={getExportPdfUrl(session.research_id)}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 hover:scale-105 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Executive PDF</span>
          </a>
        </div>
      </div>

      {/* Dashboard Metadata Banner */}
      <div className="p-5 sm:p-7 rounded-3xl glass-panel-elevated border space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-5 border-b border-slate-200 dark:border-slate-800/80">
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Research Objective</span>
            <p className={`text-xs sm:text-sm font-semibold mt-1 leading-snug ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              "{session.research_question}"
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Analysis Timestamp</span>
            <p className={`text-xs sm:text-sm font-semibold mt-1 flex items-center gap-1.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{session.analysis_date || "Today"}</span>
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Corpus Breakdown</span>
            <p className={`text-xs sm:text-sm font-semibold mt-1 flex items-center gap-1.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{session.sources_analyzed_count || session.sources_analyzed?.length || 0} Analyzed / {session.sources_submitted_count || session.sources_analyzed?.length || 0} Submitted</span>
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Engine Verification</span>
            <p className="text-xs sm:text-sm font-semibold text-amber-500 mt-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{session.engine_used || "Multi-Stage Intelligence Engine"}</span>
            </p>
          </div>
        </div>

        {/* KPI Counter Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
          <div 
            onClick={() => setActiveTab("gaps")}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between cursor-pointer card-hover-lift"
          >
            <div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Information Gaps</span>
              <p className="text-2xl font-heading font-black text-amber-700 dark:text-amber-300 mt-0.5">{gaps.length}</p>
            </div>
            <AlertTriangle className="w-7 h-7 text-amber-500/70 shrink-0" />
          </div>

          <div 
            onClick={() => setActiveTab("conflicts")}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between cursor-pointer card-hover-lift"
          >
            <div>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">Possible Conflicts</span>
              <p className="text-2xl font-heading font-black text-rose-700 dark:text-rose-300 mt-0.5">{conflicts.length}</p>
            </div>
            <ShieldAlert className="w-7 h-7 text-rose-500/70 shrink-0" />
          </div>

          <div 
            onClick={() => setActiveTab("outdated")}
            className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between cursor-pointer card-hover-lift"
          >
            <div>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Cycle Warnings</span>
              <p className="text-2xl font-heading font-black text-indigo-700 dark:text-indigo-300 mt-0.5">{outdated.filter(o => o.classification !== "No apparent date-related warning").length}</p>
            </div>
            <Calendar className="w-7 h-7 text-indigo-500/70 shrink-0" />
          </div>

          <div 
            onClick={() => setActiveTab("checklist")}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between cursor-pointer card-hover-lift"
          >
            <div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Verified Checklist</span>
              <p className="text-2xl font-heading font-black text-emerald-700 dark:text-emerald-300 mt-0.5">{completedCount}/{checklist.length}</p>
            </div>
            <CheckSquare className="w-7 h-7 text-emerald-500/70 shrink-0" />
          </div>
        </div>
      </div>

      {/* Checklist Completion Banner if 100% */}
      {checklist.length > 0 && checklistProgress === 100 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-500/20 dark:via-emerald-500/15 dark:to-transparent border border-emerald-500/40 flex items-center gap-3.5 animate-fade-in shadow-lg shadow-emerald-500/10">
          <Award className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-emerald-950"}`}>All Verification Tasks Completed!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">Every identified conflict and missing requirement has been verified against primary authorities.</p>
          </div>
        </div>
      )}

      {/* Navigation Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {[
            { id: "all", label: "Full Report" },
            { id: "gaps", label: `Gaps (${gaps.length})` },
            { id: "conflicts", label: `Conflicts (${conflicts.length})` },
            { id: "outdated", label: `Freshness (${outdated.length})` },
            { id: "evidence", label: "Evidence" },
            { id: "checklist", label: `Checklist (${completedCount}/${checklist.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                  : isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-950 hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Keyword Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter findings by keyword..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-amber-500 transition-colors ${
              isDark
                ? "bg-slate-900/80 border-slate-800 text-white placeholder-slate-500"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs"
            }`}
          />
        </div>
      </div>

      {/* SECTION 1: Executive Overview */}
      {(activeTab === "all" || activeTab === "gaps") && (
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-mono text-xs font-bold">
              1
            </div>
            <h2 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Executive Synthesis & Overview
            </h2>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed p-4 sm:p-5 rounded-2xl border ${
            isDark
              ? "bg-slate-950/70 border-slate-800/80 text-slate-300"
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            {session.overview}
          </p>

          {/* Key Information Found */}
          {filteredFindings.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                Direct Source Claims Confirmed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredFindings.map((f) => {
                  const isExpanded = expandedCards[f.finding_id];
                  return (
                    <div
                      key={f.finding_id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                        isDark
                          ? "bg-slate-950/80 border-slate-800/90"
                          : "bg-white border-slate-200 shadow-xs"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                          }`}>
                            {f.category}
                          </span>
                          <span className={`text-[10px] font-bold ${f.status === "Found" ? "text-emerald-500" : "text-amber-500"}`}>
                            {f.status}
                          </span>
                        </div>
                        <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                          {f.description}
                        </p>
                      </div>

                      {f.evidence_references && f.evidence_references.length > 0 && (
                        <div className="pt-2.5 border-t border-slate-200 dark:border-slate-900 text-[11px] text-slate-400 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Traceable Grounding:</span>
                            <button
                              onClick={() => toggleExpand(f.finding_id)}
                              className="text-[10px] text-amber-500 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                            >
                              <span>{isExpanded ? "Show Less" : "Expand Full Quote"}</span>
                              <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                          <p className={`italic ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            "{isExpanded ? f.evidence_references[0].snippet : `${f.evidence_references[0].snippet.slice(0, 120)}...`}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Information Gap Analysis */}
      {(activeTab === "all" || activeTab === "gaps") && (
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-mono text-xs font-bold">
                2
              </div>
              <div>
                <h2 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Information Gap Analysis
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Critical items left unaddressed across the reviewed corpus</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/25">
              {filteredGaps.length} Gaps Flagged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGaps.map((gap) => (
              <div
                key={gap.gap_id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3.5 relative overflow-hidden card-hover-lift ${
                  isDark
                    ? "bg-slate-950/90 border-amber-500/35"
                    : "bg-white border-amber-500/40 shadow-xs"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {gap.priority} Priority Gap
                    </span>
                    <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      {gap.status_label || "Not found in the sources reviewed."}
                    </span>
                  </div>
                  <h4 className={`text-sm sm:text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {gap.missing_information}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    <b className={isDark ? "text-slate-400" : "text-slate-800"}>Why it matters:</b> {gap.why_it_matters}
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  isDark ? "bg-slate-900/95 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <p className="text-amber-500 font-bold flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recommended Resolution Action:</span>
                  </p>
                  <p className={`text-[11px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {gap.suggested_action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Contradiction Detection */}
      {(activeTab === "all" || activeTab === "conflicts") && (
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 font-mono text-xs font-bold">
                3
              </div>
              <div>
                <h2 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Contradiction Detection
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Incompatible facts, dates, or procedural guidelines across different sources</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/25">
              {filteredConflicts.length} Flagged
            </span>
          </div>

          {filteredConflicts.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No contradictory claims detected among reviewed documents.</p>
          ) : (
            <div className="space-y-4">
              {filteredConflicts.map((conf) => (
                <div
                  key={conf.conflict_id}
                  className={`p-5 sm:p-6 rounded-2xl border space-y-4 card-hover-lift ${
                    isDark
                      ? "bg-slate-950/90 border-rose-500/35"
                      : "bg-white border-rose-500/40 shadow-xs"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className={`text-sm sm:text-base font-heading font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                      <span>{conf.topic}</span>
                    </h4>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 self-start sm:self-auto">
                      {conf.classification || "Possible contradiction detected"}
                    </span>
                  </div>

                  {/* Side-by-side claim comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    
                    {/* Claim A */}
                    <div className={`p-4 rounded-xl border space-y-2.5 ${
                      isDark ? "bg-slate-900/90 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-amber-500">CLAIM A</span>
                        {conf.claim_a.date_context && (
                          <span className="text-slate-400 font-mono text-[11px]">{conf.claim_a.date_context}</span>
                        )}
                      </div>
                      <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                        "{conf.claim_a.claim_text}"
                      </p>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between gap-2">
                        <span className="truncate">{conf.claim_a.source_title}</span>
                        <a
                          href={conf.claim_a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-500 hover:underline flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Claim B */}
                    <div className={`p-4 rounded-xl border space-y-2.5 ${
                      isDark ? "bg-slate-900/90 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-rose-500">CLAIM B</span>
                        {conf.claim_b.date_context && (
                          <span className="text-slate-400 font-mono text-[11px]">{conf.claim_b.date_context}</span>
                        )}
                      </div>
                      <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                        "{conf.claim_b.claim_text}"
                      </p>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between gap-2">
                        <span className="truncate">{conf.claim_b.source_title}</span>
                        <a
                          href={conf.claim_b.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-500 hover:underline flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* AI Finding & Action */}
                  <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    isDark ? "bg-rose-950/25 border-rose-800/40 text-slate-300" : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}>
                    <p className="font-bold text-rose-500">AI Assessment: {conf.ai_finding}</p>
                    <p className={isDark ? "text-slate-400 text-[11px]" : "text-slate-600 text-[11px]"}>
                      <b>Suggested Resolution:</b> {conf.suggested_action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: Outdated Information Warnings */}
      {(activeTab === "all" || activeTab === "outdated") && (
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 font-mono text-xs font-bold">
              4
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Freshness & Cycle Warnings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Temporal validity, superseded policy years, and date unavailability</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOutdated.map((w, idx) => {
              const isWarn = w.classification === "Potentially outdated";
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3.5 card-hover-lift ${
                    isDark
                      ? isWarn ? "bg-slate-950/90 border-indigo-500/50" : "bg-slate-950/90 border-slate-800"
                      : isWarn ? "bg-white border-indigo-500/50 shadow-xs" : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-500">
                        Cycle: {w.relevant_cycle || "Not specified"}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isWarn
                            ? "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30"
                            : w.classification === "Date unavailable"
                            ? isDark ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        }`}
                      >
                        {w.classification}
                      </span>
                    </div>
                    <h4 className={`text-xs sm:text-sm font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                      {w.source_title}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {w.reason}
                    </p>
                  </div>
                  <div className="text-[11px] text-amber-500 pt-2.5 border-t border-slate-200 dark:border-slate-900 flex items-center justify-between font-medium">
                    <span>Action: {w.recommended_action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 5: Unanswered Questions */}
      {unanswered.length > 0 && (activeTab === "all" || activeTab === "gaps") && (
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border space-y-5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-mono text-xs font-bold ${
              isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
            }`}>
              5
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Unanswered Research Questions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inquiries left completely unanswered by the reviewed sources</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {unanswered.map((u, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <p className={`text-xs sm:text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      {u.question}
                    </p>
                    <p className="text-[11px] text-slate-500">{u.relevance}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full shrink-0 border self-start sm:self-auto ${
                  isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: Traceable Evidence Panel */}
      {(activeTab === "all" || activeTab === "evidence") && (
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-mono text-xs font-bold">
                6
              </div>
              <div>
                <h2 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Traceable Evidence & Sources
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Verbatim grounding quotes and live links for independent review</p>
              </div>
            </div>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl ${
              isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
            }`}>
              {session.sources_analyzed?.length || 0} Sources Documented
            </span>
          </div>

          <div className="space-y-3.5">
            {(session.sources_analyzed || []).map((s, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border space-y-3 card-hover-lift ${
                  isDark ? "bg-slate-950/90 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-500 text-xs font-mono flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <h4 className={`text-xs sm:text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{s.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 font-mono">{s.domain}</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-500 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <span>Visit Live URL</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {s.snippets && s.snippets.length > 0 && (
                  <div className={`p-3.5 rounded-xl border font-mono text-xs leading-relaxed relative group ${
                    isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold mb-1.5">
                      <span>Verbatim Extracted Quote:</span>
                      <button
                        onClick={() => copyToClipboard(s.snippets[0], `snip_${idx}`)}
                        className="text-amber-500 hover:underline flex items-center gap-1 font-sans capitalize font-semibold cursor-pointer"
                      >
                        {copiedSnippet === `snip_${idx}` ? (
                          <>
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Quote</span>
                          </>
                        )}
                      </button>
                    </div>
                    "{s.snippets[0]}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: Dynamic Verification Checklist */}
      {(activeTab === "all" || activeTab === "checklist") && (
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-mono text-xs font-bold">
                7
              </div>
              <div>
                <h2 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Dynamic Verification Checklist
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Prioritized tasks to resolve missing gaps and contradictory rules</p>
              </div>
            </div>

            {/* Checklist progress */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="w-36 bg-slate-200 dark:bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
                  style={{ width: `${checklistProgress}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-500">
                {checklistProgress}% Verified
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {filteredChecklist.map((task) => (
              <div
                key={task.task_id}
                onClick={() => handleToggleTask(task.task_id, task.completed)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 card-hover-lift ${
                  task.completed
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40 opacity-80"
                    : isDark
                    ? "bg-slate-950/90 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    task.completed
                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                      : isDark ? "border-slate-700 bg-slate-900" : "border-slate-300 bg-slate-100"
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                        task.priority === "High"
                          ? "bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30"
                          : task.priority === "Medium"
                          ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                          : isDark ? "bg-slate-800 text-slate-400 border border-slate-700" : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    {task.suggested_source && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                        Target Office: {task.suggested_source}
                      </span>
                    )}
                  </div>
                  <h4
                    className={`text-xs sm:text-sm font-semibold ${
                      task.completed
                        ? "line-through text-slate-400"
                        : isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {task.task_description}
                  </h4>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    <b className={isDark ? "text-slate-300" : "text-slate-800"}>Why it matters:</b> {task.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
