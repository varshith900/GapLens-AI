import React, { useState } from "react";
import {
  FileSearch,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Globe,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Layers
} from "lucide-react";
import { createResearch, triggerAnalysis } from "../services/api";
import type { UserProfile } from "../types";

interface ResearchPageProps {
  user: UserProfile | null;
  onNavigate: (view: string, param?: string) => void;
}

const CATEGORIES = [
  "Education",
  "Career",
  "Government Services",
  "Business",
  "Technology",
  "Healthcare",
  "General Research"
];

const DEMO_PRESET_URLS = [
  "https://scholarships.gov.in/national-merit-2025",
  "https://highereducation.state.gov.in/circulars/scholarship-docs-guidelines",
  "https://studentwelfare-archive.org/bulletins/2023/merit-scheme",
  "https://scholarships-disbursement-faq.edu/faqs-general"
];

export const ResearchPage: React.FC<ResearchPageProps> = ({ user, onNavigate }) => {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("Education");
  const [context, setContext] = useState("");
  
  const [sources, setSources] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [progressStage, setProgressStage] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUrlError("");
    const trimmed = currentUrl.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setUrlError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    if (sources.includes(trimmed)) {
      setUrlError("This URL has already been added to the source list.");
      return;
    }

    setSources([...sources, trimmed]);
    setCurrentUrl("");
  };

  const handleRemoveUrl = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleLoadDemoPreset = () => {
    setTopic("Scholarship Application Research");
    setQuestion("What should a student verify before applying for a government scholarship?");
    setCategory("Education");
    setContext("Undergraduate applicant verifying eligibility, submission channels, and renewal terms across state and national portals.");
    setSources(DEMO_PRESET_URLS);
    setUrlError("");
    setSubmitError("");
  };

  const handleStartAnalysis = async () => {
    setSubmitError("");
    if (!topic.trim()) {
      setSubmitError("Research Topic is required.");
      return;
    }
    if (!question.trim()) {
      setSubmitError("Research Question / Objective is required.");
      return;
    }
    if (sources.length === 0) {
      setSubmitError("Please add at least one source URL to analyze.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      setProgressStage("Collecting and registering sources...");
      setProgressPercent(20);
      
      const created = await createResearch({
        topic: topic.trim(),
        research_question: question.trim(),
        category,
        additional_context: context.trim(),
        sources: sources,
        is_demo: topic.includes("Scholarship") && sources.length >= 4
      }, user ? user.uid : "guest");

      setProgressStage("Extracting and cleaning webpage contents...");
      setProgressPercent(40);
      await triggerAnalysis(created.research_id);

      setTimeout(() => {
        setProgressStage("Analyzing individual claims and condition statements...");
        setProgressPercent(60);
      }, 700);

      setTimeout(() => {
        setProgressStage("Detecting cross-source contradictions and date discrepancies...");
        setProgressPercent(80);
      }, 1400);

      setTimeout(() => {
        setProgressStage("Compiling information gaps & generating verification checklist...");
        setProgressPercent(100);
      }, 2100);

      setTimeout(() => {
        onNavigate("results", created.research_id);
      }, 2600);

    } catch (err: any) {
      setSubmitError(err.message || "Failed to start analysis. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileSearch className="w-4 h-4" />
            <span>Research Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Initiate New Cross-Source Investigation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Input your objective and information sources to detect omissions, contradictions, and outdated claims.
          </p>
        </div>

        <button
          onClick={handleLoadDemoPreset}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Load Hackathon Scholarship Scenario</span>
        </button>
      </div>

      {submitError && (
        <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-2xl glass-panel-elevated border border-slate-700 shadow-2xl text-center">
            <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-amber-400 animate-spin" />
              <Layers className="w-7 h-7 text-amber-300 absolute" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">Analyzing Information Sources</h3>
            <p className="text-xs text-slate-400 mb-6 h-8 flex items-center justify-center">
              {progressStage}
            </p>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Stage: {progressPercent <= 40 ? "Extraction" : progressPercent <= 80 ? "Cross-Analysis" : "Synthesis"}</span>
              <span className="text-amber-400 font-bold">{progressPercent}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column: Research Objective & Frame */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>1. Research Objective</span>
              <span className="text-[10px] text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">Required</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Research Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Government Scholarship Application / Tech Stack Migration"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Research Domain Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Question / Decision Objective
              </label>
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What critical conditions, deadlines, document requirements, and renewal terms must be verified?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                The engine evaluates all collected sources against this specific query to identify silent omissions.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Constraints or Background <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., Full-time undergraduate student from low-income bracket"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-slate-300 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence Traceability Notice</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Every confirmed claim is grounded in source snippets. Missing details will be explicitly framed as: <i>"Not found in the sources reviewed."</i>
            </p>
          </div>
        </div>

        {/* Right Column: Source Collection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>2. Information Sources</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {sources.length} Added
                </span>
              </h2>
            </div>

            <form onSubmit={handleAddUrl} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    placeholder="https://example.gov.in/guidelines"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add</span>
                </button>
              </div>

              {urlError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{urlError}</span>
                </p>
              )}
            </form>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {sources.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl">
                  <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No source URLs added yet</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Paste websites above or click "Load Hackathon Scenario"
                  </p>
                </div>
              ) : (
                sources.map((url, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs group hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-mono text-slate-300 truncate text-[11px]">
                        {url}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Remove source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={isSubmitting || sources.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${
                sources.length === 0
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:scale-[1.02]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Analyze Sources & Detect Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
