import React, { useState, useEffect } from "react";
import {
  History as HistoryIcon,
  Search,
  Trash2,
  ExternalLink,
  Calendar,
  Layers,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles
} from "lucide-react";
import { listHistory, deleteResearch, loadDemoScenario } from "../services/api";
import { ResearchSummary, UserProfile } from "../types";

interface HistoryPageProps {
  user: UserProfile | null;
  onNavigate: (view: string, param?: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ user, onNavigate }) => {
  const [sessions, setSessions] = useState<ResearchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    if (!window.confirm("Delete this research investigation?")) return;
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

  const filtered = sessions.filter((s) =>
    (s.topic || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.research_question || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HistoryIcon className="w-4 h-4" />
            <span>Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Research Investigation History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and review past multi-source audits, detected gaps, and verified checklists.
          </p>
        </div>

        <button
          onClick={() => onNavigate("research")}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
        >
          <span>Start New Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search research sessions by topic, question, or category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Loading past research sessions...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 space-y-3">
          <HistoryIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Research Sessions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? "No records match your search criteria."
              : "You haven't initiated any research investigations yet."}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigate("research")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
            >
              Open Workspace
            </button>
            <button
              onClick={handleRunDemo}
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Hackathon Demo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <div
              key={s.research_id}
              onClick={() => onNavigate("results", s.research_id)}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {s.category || "General"}
                  </span>
                  <div className="flex items-center gap-2">
                    {s.is_demo && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        DEMO
                      </span>
                    )}
                    <button
                      onClick={(e) => handleDelete(s.research_id, e)}
                      disabled={deletingId === s.research_id}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {s.topic}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  "{s.research_question}"
                </p>
              </div>

              {/* Badges / Metrics */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{s.gaps_count} Gaps</span>
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <ShieldAlert className="w-3 h-3" />
                    <span>{s.conflicts_count} Conflicts</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{s.checklist_completed}/{s.checklist_total}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                  <Clock className="w-3 h-3" />
                  <span>{s.created_at ? s.created_at.slice(0, 10) : "Recent"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

