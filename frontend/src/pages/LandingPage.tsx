import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
  Check,
  Zap,
  Globe,
  Sliders,
  ExternalLink,
  Download,
  Copy,
  Clock,
  ShieldCheck,
  CheckCheck,
  GraduationCap,
  Cloud,
  Stethoscope,
  XCircle,
  ChevronRight,
  Eye,
  RefreshCw,
  Compass,
  FileCheck2,
  AlertCircle
} from "lucide-react";
import { loadDemoScenario } from "../services/api";

interface LandingPageProps {
  onNavigate: (view: string, param?: string) => void;
}

const ROTATING_HIGHLIGHTS = [
  "Pinpoint silent omissions before making critical decisions",
  "Detect conflicting deadlines across government circulars",
  "Audit outdated 2023 regulations before you apply",
  "Generate prioritized verification checklists with phone & email contacts",
  "Back every single finding with verbatim grounding quotes"
];

const DEMO_SCENARIOS = {
  scholarship: {
    id: "scholarship",
    name: "Government Scholarship",
    badge: "Education",
    icon: GraduationCap,
    accentColor: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-500/40",
    question: "What should a student verify before applying for a national or state merit scholarship?",
    sourcesCount: 4,
    gapsCount: 2,
    conflictsCount: 2,
    outdatedCount: 1,
    sampleGap: {
      title: "Scholarship Renewal Grade Maintenance",
      desc: "None of the 4 reviewed portals state the minimum CGPA, attendance cutoff, or backlog allowance required to renew grant disbursement in Year 2.",
      status: "Not found in the sources reviewed."
    },
    sampleConflict: {
      title: "Conflicting Application Deadlines",
      claimA: "Nov 20, 2025 (State Higher Ed Circular)",
      claimB: "Nov 10, 2023 (Student Welfare Archive Bulletin)",
      action: "Verify against the active 2025-2026 gazette notification."
    },
    sampleOutdated: {
      source: "Student Welfare Archive Bulletin",
      cycle: "2023-2024 (Superseded)",
      reason: "Cites expired November 10, 2023 deadline and old INR 6L income cap (now raised to INR 8L)."
    }
  },
  cloud: {
    id: "cloud",
    name: "Enterprise Database Migration",
    badge: "Technology",
    icon: Cloud,
    accentColor: "from-cyan-500/20 to-blue-600/10",
    borderColor: "border-cyan-500/40",
    question: "What compliance and failover criteria are required before migrating to Aurora PostgreSQL?",
    sourcesCount: 3,
    gapsCount: 2,
    conflictsCount: 1,
    outdatedCount: 1,
    sampleGap: {
      title: "HIPAA BAA Multi-Region Encryption Keys",
      desc: "Vendor architectural documentation fails to detail multi-region KMS replication protocols during regional failover state.",
      status: "Not found in the sources reviewed."
    },
    sampleConflict: {
      title: "Maximum Supported Read Replica Lag",
      claimA: "Sub-10ms synchronous replication (Architecture Whitepaper)",
      claimB: "Async replication up to 120ms under peak load (Engineering Blog)",
      action: "Review contractual SLA tier directly with Enterprise Support."
    },
    sampleOutdated: {
      source: "PostgreSQL 13 End-of-Life Advisory",
      cycle: "2023 Legacy",
      reason: "References deprecated pg_dump syntax replaced in PostgreSQL 16+."
    }
  },
  clinical: {
    id: "clinical",
    name: "Clinical Trial Oncology Protocol",
    badge: "Healthcare",
    icon: Stethoscope,
    accentColor: "from-rose-500/20 to-pink-600/10",
    borderColor: "border-rose-500/40",
    question: "What exclusion criteria and biomarker thresholds apply for the Phase-II oncology trial?",
    sourcesCount: 4,
    gapsCount: 1,
    conflictsCount: 2,
    outdatedCount: 1,
    sampleGap: {
      title: "Prior Immunotherapy Washout Period",
      desc: "The reviewed trial summary does not state the mandatory clearance window for prior checkpoint inhibitor therapy.",
      status: "Not found in the sources reviewed."
    },
    sampleConflict: {
      title: "Minimum Absolute Neutrophil Count (ANC)",
      claimA: "ANC >= 1,500/mcL (ClinicalTrials.gov Registry)",
      claimB: "ANC >= 1,000/mcL (Institutional Ethics Protocol Circular)",
      action: "Confirm exact cohort inclusion cutoff with Principal Investigator."
    },
    sampleOutdated: {
      source: "Phase I Preliminary Cohort Advisory",
      cycle: "2022 Archive",
      reason: "Cites exploratory dosing levels revised in updated Phase II amendment."
    }
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [activeScenarioKey, setActiveScenarioKey] = useState<"scholarship" | "cloud" | "clinical">("scholarship");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [activeTabComparison, setActiveTabComparison] = useState<"chatbot" | "platform">("platform");
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [heroSearchInput, setHeroSearchInput] = useState("");

  // Rotating highlight ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightIdx((prev) => (prev + 1) % ROTATING_HIGHLIGHTS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scenario = DEMO_SCENARIOS[activeScenarioKey];

  const handleRunDemo = async () => {
    try {
      setLoadingDemo(true);
      showToast("Triggering 5-stage AI intelligence pipeline...");
      const res = await loadDemoScenario();
      if (res && res.research_id) {
        showToast("Analysis complete! Rendering verified findings...");
        setTimeout(() => {
          onNavigate("results", res.research_id);
        }, 400);
      }
    } catch (e) {
      console.error(e);
      onNavigate("research");
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchInput.trim()) {
      onNavigate("research");
    } else {
      handleRunDemo();
    }
  };

  const pipelineStages = [
    {
      num: "01",
      title: "Safe Ingestion & Boilerplate Stripping",
      tag: "Deterministic Scraper",
      desc: "Validates URLs, blocks private IP addresses (SSRF defense), strips navigation menus, ads, and scripts to isolate raw semantic text."
    },
    {
      num: "02",
      title: "Individual Claim & Condition Isolation",
      tag: "Stage 1 AI Engine",
      desc: "Extracts key facts, dates, requirements, procedures, and conditions with verbatim grounding quotes tied to each source ID."
    },
    {
      num: "03",
      title: "Cross-Source Contradiction Matrix",
      tag: "Stage 2 AI Engine",
      desc: "Compares claims across all sources to detect incompatible deadlines, conflicting document lists, and differing eligibility cutoffs."
    },
    {
      num: "04",
      title: "Objective Gap & Temporal Freshness Audit",
      tag: "Stages 3 & 4 AI Engine",
      desc: "Flags essential research questions unanswered by reviewed sources ('Not found in sources') and identifies superseded academic cycles."
    },
    {
      num: "05",
      title: "Actionable Checklist & Executive PDF",
      tag: "Stage 5 Synthesis",
      desc: "Generates prioritized escalation tasks with office contacts and compiles an executive ReportLab vector PDF report ready for download."
    }
  ];

  const faqs = [
    {
      q: "How does Digital Dark Spot differ from an ordinary AI chatbot or search engine?",
      a: "Ordinary chatbots compress text and frequently hallucinate missing facts to appear helpful. Digital Dark Spot does the opposite: it systematically identifies what information is missing, highlights factual contradictions between multiple websites, flags superseded academic cycles, and demands traceable evidence for every claim."
    },
    {
      q: "What does 'Not found in the sources reviewed' mean?",
      a: "In accordance with responsible AI standards, missing information is never framed as 'this fact does not exist in the real world'. Instead, the platform precisely identifies that the reviewed documents leave that specific research objective unanswered, directing users to authoritative inquiry."
    },
    {
      q: "How are contradictions detected without false positives?",
      a: "Our Stage 2 engine does not flag two statements as contradictory merely because they use different wording. It checks whether both sources refer to the exact same subject, time frame, and condition before highlighting incompatible facts (e.g. November 20 vs November 10 deadlines)."
    },
    {
      q: "Can I export an executive PDF report for presentations or audits?",
      a: "Yes. Every completed research session generates a vector PDF report formatted with executive summaries, side-by-side conflict comparisons, verbatim quotes, and prioritized verification checklists."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-mesh-pattern relative overflow-hidden text-slate-100">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-slide-down bg-slate-900 border border-amber-500/50 text-amber-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Dynamic Ambient Background Aura */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[350px] sm:w-[750px] lg:w-[1100px] h-[550px] bg-gradient-to-b from-amber-500/20 via-indigo-600/10 to-transparent blur-[140px] rounded-full pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-96 -left-32 w-[300px] sm:w-[500px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute top-[800px] -right-32 w-[300px] sm:w-[500px] h-[400px] bg-rose-500/10 blur-[130px] rounded-full pointer-events-none"></div>

      {/* ============================================================== */}
      {/* HERO SECTION WITH DYNAMIC ROTATING TICKER & SEARCH SCANNER     */}
      {/* ============================================================== */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-28 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-xl shadow-amber-500/10 hover:border-amber-400 transition-all hover:scale-105 cursor-default">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span className="font-heading tracking-wide">AI-Assisted Information Gap & Contradiction Platform</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 font-medium hidden sm:inline">Production Research Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.12] mb-6">
            Don't Just Find Information.{" "}
            <span className="text-shimmer block sm:inline">
              Discover What's Missing.
            </span>
          </h1>

          {/* Dynamic Rotating Highlight Ticker */}
          <div className="h-10 sm:h-8 flex items-center justify-center mb-6">
            <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-amber-300/90 font-mono transition-all animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{ROTATING_HIGHLIGHTS[highlightIdx]}</span>
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Scattered research creates dangerous blind spots. Digital Dark Spot cross-examines multiple sources together to pinpoint <b>silent omissions</b>, <b>conflicting instructions</b>, and <b>superseded dates</b> before you make critical decisions.
          </p>

          {/* HERO QUICK-LAUNCH SEARCH SCANNER BAR */}
          <div className="max-w-3xl mx-auto mb-14">
            <form onSubmit={handleHeroSearch} className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-3 w-full px-3 py-2 text-left">
                <Search className="w-5 h-5 text-amber-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter a research topic, query, or website URL..."
                  value={heroSearchInput}
                  onChange={(e) => setHeroSearchInput(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-heading font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Instant Quick-Test Scenario Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs">
              <span className="text-slate-400 font-mono">Quick test presets:</span>
              <button
                type="button"
                onClick={() => {
                  setActiveScenarioKey("scholarship");
                  handleRunDemo();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-colors cursor-pointer"
              >
                🎓 Post-Matric Scholarship
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveScenarioKey("cloud");
                  showToast("Switched to Enterprise Database Migration scenario");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                ☁️ Cloud Aurora Migration
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveScenarioKey("clinical");
                  showToast("Switched to Clinical Trial Oncology scenario");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                🧬 Clinical Oncology Protocol
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* INTERACTIVE LIVE AUDIT SIMULATOR (PROMINENT HERO PLAYGROUND) */}
          {/* ============================================================== */}
          <div className="max-w-5xl mx-auto rounded-3xl glass-panel-elevated p-5 sm:p-8 text-left border border-slate-800/90 shadow-2xl relative overflow-hidden card-hover-lift">
            
            {/* Header with Live Scenario Selector Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-5 mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-xs font-mono text-slate-400 font-semibold tracking-wider uppercase">Interactive Engine Simulator</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">Live Demonstration</span>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-white">
                  Cross-Source Information Gap & Contradiction Detection
                </h3>
              </div>

              {/* Scenario Toggle Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto">
                {(Object.keys(DEMO_SCENARIOS) as Array<keyof typeof DEMO_SCENARIOS>).map((key) => {
                  const s = DEMO_SCENARIOS[key];
                  const Icon = s.icon;
                  const isActive = activeScenarioKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveScenarioKey(key)}
                      className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                          : "text-slate-400 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{s.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scenario Header Info */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Research Query:</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                  "{scenario.question}"
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                  {scenario.sourcesCount} Sources
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                  {scenario.gapsCount} Gaps
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                  {scenario.conflictsCount} Conflicts
                </span>
              </div>
            </div>

            {/* Three Side-by-Side Finding Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              
              {/* Card 1: Missing Gap */}
              <div className="p-5 rounded-2xl bg-amber-950/15 border border-amber-500/40 flex flex-col justify-between space-y-3 relative group hover:border-amber-500 transition-all">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-amber-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Information Gap</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      High Priority
                    </span>
                  </div>
                  <h4 className="text-sm font-heading font-bold text-white mb-1.5">
                    {scenario.sampleGap.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scenario.sampleGap.desc}
                  </p>
                </div>
                <div className="text-[11px] font-mono text-amber-300 bg-amber-950/50 px-2.5 py-1.5 rounded-xl border border-amber-800/40 font-semibold">
                  {scenario.sampleGap.status}
                </div>
              </div>

              {/* Card 2: Contradiction */}
              <div className="p-5 rounded-2xl bg-rose-950/15 border border-rose-500/40 flex flex-col justify-between space-y-3 relative group hover:border-rose-500 transition-all">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-rose-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Contradiction</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      Discrepancy
                    </span>
                  </div>
                  <h4 className="text-sm font-heading font-bold text-white mb-2">
                    {scenario.sampleConflict.title}
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 font-medium">
                      <span className="text-amber-400 font-bold">A:</span> {scenario.sampleConflict.claimA}
                    </p>
                    <p className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 font-medium">
                      <span className="text-rose-400 font-bold">B:</span> {scenario.sampleConflict.claimB}
                    </p>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-rose-300 bg-rose-950/50 px-2.5 py-1.5 rounded-xl border border-rose-800/40">
                  {scenario.sampleConflict.action}
                </div>
              </div>

              {/* Card 3: Outdated */}
              <div className="p-5 rounded-2xl bg-indigo-950/15 border border-indigo-500/40 flex flex-col justify-between space-y-3 relative group hover:border-indigo-500 transition-all">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-indigo-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Cycle Warning</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      Temporal Risk
                    </span>
                  </div>
                  <h4 className="text-sm font-heading font-bold text-white mb-1">
                    {scenario.sampleOutdated.source}
                  </h4>
                  <p className="text-xs text-indigo-300 font-mono font-semibold mb-1.5">
                    Cycle: {scenario.sampleOutdated.cycle}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scenario.sampleOutdated.reason}
                  </p>
                </div>
                <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/50 px-2.5 py-1.5 rounded-xl border border-indigo-800/40">
                  Status: Potentially Outdated
                </div>
              </div>

            </div>

            {/* Simulator Action Callout */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">
                Want to run this full audit scenario live with interactive checklists and downloadable report?
              </span>
              <button
                onClick={handleRunDemo}
                disabled={loadingDemo}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-md shadow-amber-500/20 self-start sm:self-auto shrink-0"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{loadingDemo ? "Opening Demo..." : "Open Full Interactive Report →"}</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* STATS & CREDIBILITY RIBBON */}
      <section className="py-10 bg-[#090d16]/90 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-amber-400">100%</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Verbatim Grounding Snippets</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white">5 Stages</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Deterministic & AI Pipeline</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-cyan-400">4-Tier</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Temporal Freshness Matrix</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-emerald-400">0%</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Hallucinated Citations</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE COMPARISON: CHATBOT BLINDNESS VS DARK SPOT INTEL    */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 font-heading">
            Architectural Differentiation
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-2">
            Why Generic AI Summarizers Fail Serious Research
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            Language models are trained to provide fluent answers, masking missing information with plausible hallucinations. Digital Dark Spot reverses this by enforcing strict negative proof.
          </p>
        </div>

        {/* Tab Switcher for Comparison */}
        <div className="flex justify-center mb-8">
          <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveTabComparison("chatbot")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTabComparison === "chatbot"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ❌ Generic AI Chatbot / Summarizer
            </button>
            <button
              onClick={() => setActiveTabComparison("platform")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTabComparison === "platform"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ⚡ Digital Dark Spot Engine
            </button>
          </div>
        </div>

        {/* Comparison Display Box */}
        <div className="max-w-4xl mx-auto">
          {activeTabComparison === "chatbot" ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/10 border border-rose-500/30 space-y-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-white">Traditional Chatbots & Summarizers</h3>
                  <p className="text-xs text-rose-300 font-mono">Compresses text blindly • Incurs critical real-world blind spots</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono space-y-2">
                <p className="text-slate-500">// Example Output from Generic Chatbot:</p>
                <p className="text-rose-300 leading-relaxed">
                  "The scholarship deadline is November 10. Applicants must submit income certificates and marksheets to qualify."
                </p>
                <div className="pt-2 text-xs text-slate-400 space-y-1">
                  <p>❌ Silently overlooked that the state gazette extended the deadline to Nov 20.</p>
                  <p>❌ Never noticed that neither document stated the required Year 2 renewal GPA cutoff.</p>
                  <p>❌ Failed to warn that the INR 6L income cap was from a superseded 2023 archive.</p>
                  <p>❌ Zero traceable quote citations or escalation office phone numbers.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-950/15 border border-amber-500/40 space-y-5 animate-fade-in shadow-2xl shadow-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-white">Digital Dark Spot Platform</h3>
                  <p className="text-xs text-amber-300 font-mono">Negative-Proof Gap Engine • Cross-Source Verification Matrix</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono space-y-3">
                <p className="text-slate-500">// Real Intelligence Output from Digital Dark Spot:</p>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200">
                    <b>⚠️ 2 GAPS IDENTIFIED:</b> "Not found in the sources reviewed. The renewal CGPA threshold is absent across all 4 portals."
                  </div>
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-200">
                    <b>⚡ 2 CONFLICTS FLAGGED:</b> "Deadline discrepancy: Nov 20 (Gazette) vs Nov 10 (Archive Bulletin). Traceable quotes provided."
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200">
                    <b>⏳ 1 OUTDATED SOURCE:</b> "2023-2024 academic cycle bulletin superseded by active 2025-2026 regulations."
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                    <b>📋 ESCALATION CHECKLIST:</b> "4 targeted verification steps with State Scholarship Helpdesk contacts."
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5-STAGE PIPELINE INTERACTIVE ARCHITECTURE INSPECTOR             */}
      {/* ============================================================== */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-[#080c16]/90 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 font-heading">
              Deterministic & AI Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-2">
              The 5-Stage Verification Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Click any stage below to inspect the internal logic and verifiable output contracts.
            </p>
          </div>

          {/* Interactive Pipeline Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-8">
            {pipelineStages.map((stage, idx) => (
              <button
                key={idx}
                onClick={() => setActivePipelineStage(idx)}
                className={`p-3 sm:p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                  activePipelineStage === idx
                    ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                    : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-mono font-bold ${activePipelineStage === idx ? "text-amber-400" : "text-slate-500"}`}>
                    STAGE {stage.num}
                  </span>
                  {activePipelineStage === idx && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                  {stage.title}
                </p>
              </button>
            ))}
          </div>

          {/* Active Stage Detail Showcase */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-amber-500/30 max-w-4xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                  Stage {pipelineStages[activePipelineStage].num} Specification
                </span>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-white mt-0.5">
                  {pipelineStages[activePipelineStage].title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 self-start sm:self-auto">
                {pipelineStages[activePipelineStage].tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {pipelineStages[activePipelineStage].desc}
            </p>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Safety Guarantee: SSRF Defense & Schema Enforcement</span>
              <button
                onClick={() => onNavigate("research")}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Test in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* FAQ SECTION WITH INTERACTIVE ACCORDION                        */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 font-heading">
            Frequently Asked Questions
          </span>
          <h3 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-2">
            Responsible AI & Operational Integrity
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-panel border border-slate-800/80 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40 transition-colors"
              >
                <span className="text-xs sm:text-sm font-heading font-bold text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 animate-fade-in font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* BOTTOM CTA BANNER                                              */}
      {/* ============================================================== */}
      <section className="py-16 bg-gradient-to-b from-[#07090e] to-slate-950 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
            Stop guessing what your sources missed.
          </h2>
          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Run your first cross-source information gap analysis now. Compare multiple circulars, spot contradictory eligibility rules, and receive an executive verification audit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate("research")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-heading font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              Open Research Workspace Now
            </button>
            <button
              onClick={handleRunDemo}
              disabled={loadingDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-white font-bold text-sm transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{loadingDemo ? "Analyzing Demo..." : "Run Sample Scholarship Audit"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FLOATING QUICK-ACTION BOTTOM DOCK FOR MOBILE & DESKTOP         */}
      {/* ============================================================== */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto">
        <div className="p-2 rounded-2xl bg-[#090d18]/90 border border-amber-500/30 shadow-2xl backdrop-blur-2xl flex items-center justify-between sm:justify-center gap-2 sm:gap-4">
          <button
            onClick={() => onNavigate("research")}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-transform active:scale-95 shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>New Research</span>
          </button>
          <button
            onClick={handleRunDemo}
            disabled={loadingDemo}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{loadingDemo ? "Loading..." : "Test Demo"}</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            title="Scroll to top"
          >
            ↑ Top
          </button>
        </div>
      </div>

    </div>
  );
};
