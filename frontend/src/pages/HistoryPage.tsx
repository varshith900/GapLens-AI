import React, { useState, useEffect } from "react";
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  Download,
  Filter
} from "lucide-react";
import { listHistory, deleteResearch, loadDemoScenario, getExportPdfUrl } from "../services/api";
import type { ResearchSummary, UserProfile } from "../types";

interface HistoryPageProps {
  user: UserProfile | null;
  onNavigate: (view: string, param?: string) => void;
  theme?: "dark" | "light";
}

const CATEGORIES = ["All", "Education", "Career", "Government Services", "Business", "Technology", "Healthcare"];

export const HistoryPage: React.FC<HistoryPageProps> = ({ user, onNavigate, theme = "dark" }) => {
  const [sessions, setSessions] = useState<ResearchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isDark = theme === "dark";

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await listHistory(user ? user.uid : "guest");
      setSessions(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this research investigation? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      await deleteResearch(id);
      setSessions(sessions.filter((s) => s.research_id !== id));
    } catch (err) {
      console.error("Failed to delete session:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRunDemo = async () => {
    try {
      setLoading(true);
      const res = await loadDemoScenario();
      if (res && res.research_id) {
        onNavigate("results", res.research_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = sessions.filter((s) => {
    const matchesSearch =
      (s.topic || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.research_question || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All" || (s.category || "").toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Research Investigation History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Review past multi-source investigations, detected gaps, contradictory claims, and verified checklists.
          </p>
        </div>

        <button
          onClick={() => onNavigate("research")}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 hover:scale-105 cursor-pointer shrink-0"
        >
          <span>Start New Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search research sessions by topic, question, or category..."
            className={`w-full pl-10 pr-3 py-2.5 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors ${
              isDark
                ? "bg-slate-900/90 border-slate-800 text-white placeholder-slate-500"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs"
            }`}
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : isDark
                  ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs font-mono">
          Loading past research sessions...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40">
          <HistoryIcon className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            No Research Sessions Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? "No records match your search criteria."
              : "You haven't initiated any research investigations yet."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate("research")}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Open Workspace
            </button>
            <button
              onClick={handleRunDemo}
              className="px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/35 text-xs font-bold hover:bg-amber-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Load Demonstration Case</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filtered.map((s) => (
            <div
              key={s.research_id}
              onClick={() => onNavigate("results", s.research_id)}
              className="p-5 sm:p-6 rounded-3xl glass-panel border hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-4 card-hover-lift"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {s.category || "General"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{s.created_at ? s.created_at.split("T")[0] : "Recent"}</span>
                    </span>
                    <button
                      onClick={(e) => handleDelete(s.research_id, e)}
                      disabled={deletingId === s.research_id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className={`text-base font-heading font-bold group-hover:text-amber-500 transition-colors line-clamp-1 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {s.topic}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  "{s.research_question}"
                </p>
              </div>

              {/* Stats badges */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{s.gaps_count ?? 0} Gaps</span>
                  </span>
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{s.conflicts_count ?? 0} Conflicts</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getExportPdfUrl(s.research_id)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-800 hover:border-amber-500 text-slate-500 hover:text-amber-500 transition-colors"
                    title="Direct PDF Export"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-amber-500 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
