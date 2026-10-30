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
  Layers,
  GraduationCap,
  Briefcase,
  Landmark,
  Building2,
  Cpu,
  HeartPulse,
  Compass,
  CheckCircle2,
  Info
} from "lucide-react";
import { createResearch, triggerAnalysis } from "../services/api";
import type { UserProfile } from "../types";

interface ResearchPageProps {
  user: UserProfile | null;
  onNavigate: (view: string, param?: string) => void;
}

const CATEGORIES = [
  { name: "Education", icon: GraduationCap },
  { name: "Career", icon: Briefcase },
  { name: "Government Services", icon: Landmark },
  { name: "Business", icon: Building2 },
  { name: "Technology", icon: Cpu },
  { name: "Healthcare", icon: HeartPulse },
  { name: "General Research", icon: Compass },
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
      setUrlError("URL must start with http:// or https://");
      return;
    }

    if (sources.includes(trimmed)) {
      setUrlError("This URL is already in your source list.");
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
    setContext("Undergraduate applicant verifying eligibility, mandatory documentation, and renewal terms across state and national portals.");
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 sm:pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <FileSearch className="w-3.5 h-3.5" />
            <span>Research Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white">
            Initiate Cross-Source Investigation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Provide your research objective and multiple reference URLs. The multi-stage AI engine will detect missing conditions, conflicting requirements, and expired deadlines.
          </p>
        </div>

        {/* Demo Preset Trigger */}
        <button
          onClick={handleLoadDemoPreset}
          className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-600/15 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/35 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Load Hackathon Scholarship Scenario</span>
        </button>
      </div>

      {submitError && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Loading Modal / Overlay if analyzing */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl glass-panel-glow border border-amber-500/40 shadow-2xl text-center space-y-5 animate-fade-in">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <Loader2 className="w-20 h-20 text-amber-400 animate-spin" />
              <Layers className="w-8 h-8 text-amber-300 absolute" />
            </div>
            
            <div>
              <h3 className="text-xl font-heading font-bold text-white">Analyzing Information Sources</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 h-10 flex items-center justify-center font-medium">
                {progressStage}
              </p>
            </div>

            {/* Staged progress bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 h-full rounded-full transition-all duration-500 shadow-md shadow-amber-500/50"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Stage: {progressPercent <= 40 ? "Extraction" : progressPercent <= 80 ? "Cross-Analysis" : "Synthesis"}</span>
                <span className="text-amber-400 font-bold">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-8">
        
        {/* Left Column: Research Objective & Categorization */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 sm:p-7 rounded-3xl glass-panel border border-slate-800/90 space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-heading font-bold text-white flex items-center gap-2">
                <span>1. Research Objective</span>
              </h2>
              <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                Required
              </span>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Research Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Government Scholarship Application / Cloud Database Migration"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            {/* Category Selector with interactive buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Research Domain Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-[1.02]"
                          : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Research Question / Objective */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Primary Question / Decision Objective
              </label>
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What critical conditions, deadlines, document requirements, and renewal terms must be verified?"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                The AI compares all retrieved documents directly against this question to identify omissions.
              </p>
            </div>

            {/* Additional Context */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Additional Constraints or Profile <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., Undergraduate student with household income below 8 Lakhs"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

          </div>

          {/* Evidence Guarantee Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-slate-300 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence Grounding Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">
              Every source claim is bound to verbatim quotes and live URLs. Missing information is never fabricated—it is transparently noted as: <i>"Not found in the sources reviewed."</i>
            </p>
          </div>
        </div>

        {/* Right Column: Source Collection Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-7 rounded-3xl glass-panel border border-slate-800/90 space-y-5">
            
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-heading font-bold text-white flex items-center gap-2">
                <span>2. Reference Sources</span>
              </h2>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-amber-300 border border-slate-700 font-bold">
                {sources.length} Added
              </span>
            </div>

            {/* Add Source URL Input Form */}
            <form onSubmit={handleAddUrl} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={currentUrl}
                    onChange={(e) => {
                      setCurrentUrl(e.target.value);
                      setUrlError("");
                    }}
                    placeholder="https://example.gov.in/guidelines"
                    className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20 cursor-pointer hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {urlError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1.5 pt-1 animate-fade-in font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{urlError}</span>
                </p>
              )}
            </form>

            {/* Scrollable list of Added Sources */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {sources.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-slate-800 rounded-2xl space-y-2">
                  <Globe className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-400">No source URLs added yet</p>
                  <p className="text-[11px] text-slate-500">
                    Paste public web pages or click "Load Hackathon Scholarship Scenario" above
                  </p>
                </div>
              ) : (
                sources.map((url, idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between gap-3 text-xs group hover:border-slate-700 transition-all card-hover-lift"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-[11px] font-mono text-amber-400 flex items-center justify-center shrink-0 font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-mono text-slate-300 truncate text-[11px]">
                        {url}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Launch Analysis Button */}
            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={isSubmitting || sources.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer ${
                sources.length === 0
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:scale-[1.02]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Cross-Analyze Sources & Detect Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
