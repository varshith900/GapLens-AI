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
  AlertCircle,
  TrendingUp,
  Cpu,
  BarChart3,
  Network,
  Terminal,
  Activity,
  Radar,
  Radio,
  FileSearch,
  BookOpen
} from "lucide-react";
import { loadDemoScenario } from "../services/api";

interface LandingPageProps {
  onNavigate: (view: string, param?: string) => void;
  theme?: "dark" | "light";
}

const ROTATING_HIGHLIGHTS = [
  "Pinpoint silent omissions before making high-stakes decisions",
  "Detect conflicting deadlines across government circulars",
  "Audit outdated regulations and expired academic cycles",
  "Generate prioritized verification checklists with official office contacts",
  "Back every single finding with traceable verbatim grounding quotes"
];

const TERMINAL_LOGS = [
  { time: "00:00.8s", tag: "INGEST", text: "Ingesting 4 source URLs • SSRF verification passed • 18,450 words normalized", color: "text-cyan-400" },
  { time: "00:01.5s", tag: "STAGE 1", text: "Isolating factual claims • Extracted 24 verifiable propositions with verbatim quotes", color: "text-emerald-400" },
  { time: "00:02.3s", tag: "STAGE 2", text: "Cross-matching application deadlines... CONTRADICTION: Nov 20 (Gazette) vs Nov 10 (Archive)", color: "text-rose-400" },
  { time: "00:03.1s", tag: "STAGE 3", text: "Executing negative-proof audit... SILENT GAP: Renewal CGPA requirement absent in 4/4 portals", color: "text-amber-400" },
  { time: "00:03.8s", tag: "STAGE 4", text: "Temporal analysis... Archive bulletin flagged as superseded (2023-2024 academic cycle)", color: "text-indigo-400" },
  { time: "00:04.6s", tag: "STAGE 5", text: "Synthesis complete: 2 Gaps, 2 Conflicts, 1 Outdated Source • Executive PDF compiled", color: "text-emerald-400" }
];

const DEMO_SCENARIOS = {
  scholarship: {
    id: "scholarship",
    name: "Government Scholarship",
    badge: "Education & Public Services",
    icon: GraduationCap,
    completeness: 68,
    darkSpotIndex: 32,
    question: "What should a student verify before applying for a national or state merit scholarship?",
    sourcesCount: 4,
    gapsCount: 2,
    conflictsCount: 2,
    outdatedCount: 1,
    sourcesList: [
      { id: "S1", name: "State Gazette Higher Ed Notification", date: "Oct 2025 (Active)", status: "Active Official", tag: "emerald" },
      { id: "S2", name: "Student Welfare Archive Bulletin", date: "Sep 2023 (Expired)", status: "Superseded", tag: "indigo" },
      { id: "S3", name: "National Merit Scholarship Portal", date: "Aug 2025", status: "Verified", tag: "emerald" },
      { id: "S4", name: "University Financial Aid FAQ", date: "Undated 2024", status: "Omission Alert", tag: "amber" }
    ],
    sampleGap: {
      title: "Scholarship Renewal Grade Maintenance",
      desc: "None of the 4 reviewed portals state the minimum CGPA, attendance cutoff, or backlog allowance required to renew grant disbursement in Year 2.",
      status: "Not found in the sources reviewed."
    },
    sampleConflict: {
      title: "Conflicting Application Deadlines",
      claimA: "Nov 20, 2025 (State Higher Ed Gazette)",
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
    badge: "Technology Architecture",
    icon: Cloud,
    completeness: 72,
    darkSpotIndex: 28,
    question: "What compliance and failover criteria are required before migrating to Aurora PostgreSQL?",
    sourcesCount: 3,
    gapsCount: 2,
    conflictsCount: 1,
    outdatedCount: 1,
    sourcesList: [
      { id: "S1", name: "Cloud Provider Architecture Whitepaper", date: "Jan 2025", status: "Active Official", tag: "emerald" },
      { id: "S2", name: "PostgreSQL 13 End-of-Life Advisory", date: "Feb 2023 (Legacy)", status: "Superseded", tag: "indigo" },
      { id: "S3", name: "Engineering Production Migration Log", date: "Nov 2024", status: "Discrepancy", tag: "rose" }
    ],
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
    name: "Clinical Oncology Protocol",
    badge: "Healthcare & Life Sciences",
    icon: Stethoscope,
    completeness: 64,
    darkSpotIndex: 36,
    question: "What exclusion criteria and biomarker thresholds apply for the Phase-II oncology trial?",
    sourcesCount: 4,
    gapsCount: 1,
    conflictsCount: 2,
    outdatedCount: 1,
    sourcesList: [
      { id: "S1", name: "ClinicalTrials.gov Protocol Registry", date: "Sep 2025 (Active)", status: "Active Registry", tag: "emerald" },
      { id: "S2", name: "Phase I Preliminary Cohort Advisory", date: "Mar 2022 (Archive)", status: "Superseded", tag: "indigo" },
      { id: "S3", name: "Institutional Ethics Committee Circular", date: "Aug 2025", status: "Conflict Alert", tag: "rose" },
      { id: "S4", name: "Hospital Trial Patient Information Sheet", date: "Jul 2025", status: "Gap Alert", tag: "amber" }
    ],
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

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, theme = "dark" }) => {
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [activeScenarioKey, setActiveScenarioKey] = useState<"scholarship" | "cloud" | "clinical">("scholarship");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [activeTabComparison, setActiveTabComparison] = useState<"chatbot" | "platform">("platform");
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [heroSearchInput, setHeroSearchInput] = useState("");
  const [activeRadarNode, setActiveRadarNode] = useState<number>(0);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  const isDark = theme === "dark";

  // Rotating highlight ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightIdx((prev) => (prev + 1) % ROTATING_HIGHLIGHTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Terminal log auto-ticker
  useEffect(() => {
    const logTimer = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % TERMINAL_LOGS.length);
    }, 2800);
    return () => clearInterval(logTimer);
  }, []);

  // Radar node auto-cycle
  useEffect(() => {
    const radarTimer = setInterval(() => {
      setActiveRadarNode((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(radarTimer);
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
        }, 350);
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
    <div className="flex flex-col min-h-screen relative overflow-hidden transition-colors duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-slide-down bg-slate-900 dark:bg-slate-950 border border-amber-500/50 text-amber-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[380px] sm:w-[850px] lg:w-[1300px] h-[600px] bg-gradient-to-b from-amber-500/20 via-indigo-600/15 to-transparent blur-[140px] rounded-full pointer-events-none animate-aurora-drift"></div>
      <div className="absolute top-96 -left-32 w-[300px] sm:w-[500px] h-[450px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute top-[850px] -right-32 w-[300px] sm:w-[500px] h-[450px] bg-rose-500/10 blur-[140px] rounded-full pointer-events-none"></div>

      {/* ============================================================== */}
      {/* HERO SECTION WITH DYNAMIC ROTATING TICKER & SEARCH SCANNER     */}
      {/* ============================================================== */}
      <section className="relative pt-10 pb-16 sm:pt-18 sm:pb-24 lg:pt-20 lg:pb-28 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          
          {/* FLOATING MICRO-WIDGET: Contradiction Alert (Left) */}
          <div className="hidden xl:flex items-center gap-3 p-3.5 rounded-2xl glass-panel-elevated border border-rose-500/40 shadow-2xl max-w-xs absolute left-2 top-12 animate-float-left">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-500">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>Contradiction Flagged</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                Nov 20 (Gazette) vs Nov 10 (Archive)
              </p>
              <span className="text-[9px] font-mono text-rose-400 mt-1 block">Cross-Source Discrepancy Found</span>
            </div>
          </div>

          {/* FLOATING MICRO-WIDGET: Silent Gap Alert (Right) */}
          <div className="hidden xl:flex items-center gap-3 p-3.5 rounded-2xl glass-panel-elevated border border-amber-500/40 shadow-2xl max-w-xs absolute right-2 top-12 animate-float-right">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div className="text-left text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>Critical Information Gap</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                Renewal GPA Cutoff Missing in 4 Portals
              </p>
              <span className="text-[9px] font-mono text-amber-400 mt-1 block">Strict Negative Proof Verified</span>
            </div>
          </div>

          {/* Eyebrow badge */}
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold mb-6 transition-all hover:scale-105 cursor-default ${
              isDark
                ? "bg-slate-900/90 border-amber-500/35 text-amber-300 shadow-xl shadow-amber-500/10"
                : "bg-white border-amber-500/40 text-amber-700 shadow-md shadow-amber-500/10"
            }`}
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-heading tracking-wide">AI-Assisted Information Gap & Contradiction Platform</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Production Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1
            className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight max-w-5xl mx-auto leading-[1.08] mb-6 ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            Don't Just Find Information.{" "}
            <span className="text-shimmer block sm:inline">
              Discover What's Missing.
            </span>
          </h1>

          {/* Dynamic Rotating Highlight Ticker */}
          <div className="h-10 sm:h-8 flex items-center justify-center mb-6">
            <p
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border text-xs sm:text-sm font-mono transition-all animate-fade-in ${
                isDark
                  ? "bg-slate-900/80 border-slate-800 text-amber-300/90"
                  : "bg-white border-slate-200 text-amber-700 shadow-xs"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{ROTATING_HIGHLIGHTS[highlightIdx]}</span>
            </p>
          </div>

          {/* Subtitle */}
          <p
            className={`text-sm sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8 font-normal ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Scattered research creates dangerous blind spots. Digital Dark Spot cross-examines multiple sources together to pinpoint <b>silent omissions</b>, <b>conflicting instructions</b>, and <b>superseded dates</b> before you make critical decisions.
          </p>

          {/* HERO QUICK-LAUNCH SEARCH SCANNER BAR */}
          <div className="max-w-3xl mx-auto mb-10">
            <form
              onSubmit={handleHeroSearch}
              className={`p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2 transition-all animate-border-glow ${
                isDark
                  ? "bg-slate-900/90"
                  : "bg-white shadow-slate-200/50"
              }`}
            >
              <div className="flex items-center gap-3 w-full px-3 py-2 text-left">
                <Search className="w-5 h-5 text-amber-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter a research topic, question, or website URL..."
                  value={heroSearchInput}
                  onChange={(e) => setHeroSearchInput(e.target.value)}
                  className={`w-full bg-transparent text-sm sm:text-base placeholder-slate-400 focus:outline-none ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
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
              <span className="text-slate-500 dark:text-slate-400 font-mono">Quick test presets:</span>
              <button
                type="button"
                onClick={() => {
                  setActiveScenarioKey("scholarship");
                  showToast("Loaded Post-Matric Scholarship audit preset");
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  activeScenarioKey === "scholarship"
                    ? "bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-md shadow-amber-500/20"
                    : isDark
                    ? "bg-slate-900/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border-slate-800"
                    : "bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-slate-200 shadow-xs"
                }`}
              >
                🎓 Post-Matric Scholarship
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveScenarioKey("cloud");
                  showToast("Loaded Enterprise Database Migration preset");
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  activeScenarioKey === "cloud"
                    ? "bg-cyan-500 text-slate-950 border-cyan-500 font-bold shadow-md shadow-cyan-500/20"
                    : isDark
                    ? "bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border-slate-800"
                    : "bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border-slate-200 shadow-xs"
                }`}
              >
                ☁️ Cloud Aurora Migration
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveScenarioKey("clinical");
                  showToast("Loaded Clinical Oncology Protocol preset");
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  activeScenarioKey === "clinical"
                    ? "bg-rose-500 text-white border-rose-500 font-bold shadow-md shadow-rose-500/20"
                    : isDark
                    ? "bg-slate-900/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border-slate-800"
                    : "bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-800 border-slate-200 shadow-xs"
                }`}
              >
                🧬 Clinical Oncology Protocol
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* THE DIGITAL DARK SPOT RADAR & LIVE HOLOGRAM HUD               */}
          {/* ============================================================== */}
          <div className="max-w-5xl mx-auto rounded-3xl glass-panel-elevated p-5 sm:p-8 text-left border shadow-2xl relative overflow-hidden mb-12">
            
            {/* Animated Laser Scanline Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-scanline pointer-events-none"></div>

            {/* Radar Header with Live Scenario Selector Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4 mb-6 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
                    Interactive Knowledge Radar & Hologram HUD
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                    Live Telemetry
                  </span>
                </div>
                <h3 className={`text-base sm:text-xl font-heading font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                  Cross-Source Information Gap & Contradiction Matrix
                </h3>
              </div>

              {/* Scenario Toggle Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                {(Object.keys(DEMO_SCENARIOS) as Array<keyof typeof DEMO_SCENARIOS>).map((key) => {
                  const s = DEMO_SCENARIOS[key];
                  const Icon = s.icon;
                  const isActive = activeScenarioKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveScenarioKey(key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{s.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Holographic Radar Hub Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-6">
              
              {/* Radar Graphic (Left Column 5 cols) */}
              <div className="lg:col-span-5 relative flex items-center justify-center p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 min-h-[300px] overflow-hidden">
                {/* Concentric radar circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 rounded-full border border-dashed border-amber-500/20"></div>
                  <div className="absolute w-40 h-40 rounded-full border border-dashed border-cyan-500/25"></div>
                  <div className="absolute w-24 h-24 rounded-full border border-amber-500/30"></div>
                  {/* Rotating Radar Sweep Beam */}
                  <div className="absolute w-56 h-56 rounded-full animate-radar-sweep pointer-events-none">
                    <div className="w-1/2 h-1/2 bg-gradient-to-br from-amber-400/25 to-transparent rounded-tl-full origin-bottom-right"></div>
                  </div>
                </div>

                {/* Central Intelligence Core Node */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex flex-col items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 animate-pulse text-center p-1">
                  <Compass className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-heading font-black leading-tight">DARK SPOT</span>
                  <span className="text-[8px] font-mono tracking-tighter uppercase font-bold">CORE</span>
                </div>

                {/* Orbiting Source Node 1 (Top) */}
                <button
                  type="button"
                  onClick={() => setActiveRadarNode(0)}
                  className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeRadarNode === 0
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>S1: Official Gazette</span>
                </button>

                {/* Orbiting Source Node 2 (Right) */}
                <button
                  type="button"
                  onClick={() => setActiveRadarNode(1)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeRadarNode === 1
                      ? "bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30 scale-105"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span>S2: 2023 Archive</span>
                </button>

                {/* Orbiting Source Node 3 (Bottom) */}
                <button
                  type="button"
                  onClick={() => setActiveRadarNode(2)}
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeRadarNode === 2
                      ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 scale-105"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>S3: Discrepancy</span>
                </button>

                {/* Orbiting Source Node 4 (Left) */}
                <button
                  type="button"
                  onClick={() => setActiveRadarNode(3)}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeRadarNode === 3
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30 scale-105"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>S4: Omission</span>
                </button>
              </div>

              {/* Live Telemetry Cards (Right Column 7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">Active Cross-Source Inspection:</span>
                    <span className={`font-heading font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                      {scenario.question}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30 font-mono text-xs font-bold shrink-0">
                    {scenario.badge}
                  </span>
                </div>

                {/* Source Nodes Quick Status Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {scenario.sourcesList.map((src, i) => (
                    <button
                      key={src.id}
                      onClick={() => setActiveRadarNode(i)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        activeRadarNode === i
                          ? "bg-amber-500/20 border-amber-500 font-bold"
                          : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="font-bold text-amber-500">{src.id}</span>
                        <span className="text-slate-400">{src.date.split(" ")[0]}</span>
                      </div>
                      <p className="text-[11px] font-medium line-clamp-1 leading-tight text-slate-800 dark:text-slate-200">
                        {src.name}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Active Finding Inspection Callout */}
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/40 relative">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Pinpointed Finding in Source {scenario.sourcesList[activeRadarNode]?.id || "S1"}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                      {scenario.sourcesList[activeRadarNode]?.status || "Audited"}
                    </span>
                  </div>
                  <h4 className={`text-sm font-heading font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {activeRadarNode === 0
                      ? "Official Application Window Verified"
                      : activeRadarNode === 1
                      ? scenario.sampleConflict.title
                      : activeRadarNode === 2
                      ? scenario.sampleOutdated.source
                      : scenario.sampleGap.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {activeRadarNode === 0
                      ? "Gazette circular establishes the legally binding deadline as November 20, 2025. All other conflicting bulletins are deemed superseded."
                      : activeRadarNode === 1
                      ? `Discrepancy: ${scenario.sampleConflict.claimA} vs ${scenario.sampleConflict.claimB}`
                      : activeRadarNode === 2
                      ? scenario.sampleOutdated.reason
                      : scenario.sampleGap.desc}
                  </p>
                </div>
              </div>

            </div>

            {/* Live Metrics Meter Bar */}
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Documented Findings</span>
                <span className={`text-lg font-heading font-black ${isDark ? "text-white" : "text-slate-900"}`}>{scenario.completeness}%</span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${scenario.completeness}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-2xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono uppercase text-amber-500 font-bold block">Dark Spot Index</span>
                <span className="text-lg font-heading font-black text-amber-500">{scenario.darkSpotIndex}% Missing</span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${scenario.darkSpotIndex}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-2xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono uppercase text-rose-500 font-bold block">Contradictions</span>
                <span className="text-lg font-heading font-black text-rose-500">{scenario.conflictsCount} Discrepancies</span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${scenario.conflictsCount * 50}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-2xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono uppercase text-indigo-500 font-bold block">Temporal Status</span>
                <span className="text-lg font-heading font-black text-indigo-500">1 Superseded</span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `75%` }}></div>
                </div>
              </div>
            </div>

            {/* LIVE VERIFICATION TERMINAL TICKER */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3 sm:p-4 mb-6 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-slate-300">Live AI Execution Log Stream</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-emerald-400 font-bold">ONLINE & EXECUTING</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {TERMINAL_LOGS.map((log, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 transition-opacity duration-300 ${
                      activeLogIndex === idx ? "opacity-100 font-bold" : "opacity-45"
                    }`}
                  >
                    <span className="text-slate-500 shrink-0 text-[10px]">[{log.time}]</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold shrink-0 ${log.color} bg-slate-900 border border-slate-800`}>
                      {log.tag}
                    </span>
                    <span className="text-slate-300 text-[11px] truncate">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulator Action Callout */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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
      <section className="py-12 border-y border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#090d16]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-amber-500">100%</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Verbatim Grounding Snippets</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
              <p className={`text-3xl sm:text-4xl lg:text-5xl font-heading font-black ${isDark ? "text-white" : "text-slate-900"}`}>5 Stages</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Deterministic & AI Pipeline</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-cyan-600 dark:text-cyan-400">4-Tier</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Temporal Freshness Matrix</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-emerald-600 dark:text-emerald-400">0%</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Hallucinated Citations</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* LUXURY BENTO GRID: 4 PILLARS OF RESEARCH INTEGRITY              */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 font-heading">
            Architectural Differentiation
          </span>
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            Engineered for Ground Truth, Not Flattery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Most AI tools try to be helpful by guessing answers to missing data. Digital Dark Spot rejects probabilistic hallucination, enforcing strict negative proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Item 1: Wide 2-Col Negative-Proof Gap Engine */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-amber-500/30 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/60 transition-all shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  Core Innovation
                </span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-heading font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Negative-Proof Gap Detection
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 max-w-xl ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Identifies crucial research questions that are <b>completely absent</b> across all reviewed sources. Never fabricates criteria to sound complete.
              </p>

              {/* Interactive Mock Gap Visualizer */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-200 dark:border-slate-800">
                  <span>AUDITED CONDITION</span>
                  <span>STATUS IN SOURCES REVIEWED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-200 font-sans font-medium">Initial Eligibility Income Cap</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Found (INR 8L)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-200 font-sans font-medium">Year 2 Renewal CGPA Requirement</span>
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Not Found in Sources
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-200 font-sans font-medium">Backlog Subject Allowance</span>
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Not Found in Sources
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Item 2: Contradiction Matrix */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-rose-500/30 flex flex-col justify-between group hover:border-rose-500/60 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30">
                  Stage 2
                </span>
              </div>
              <h3 className={`text-xl font-heading font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Discrepancy Matrix
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Flags incompatible claims between separate URLs with traceable verbatim excerpts and verification guidance.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs">
              <span className="text-[10px] font-mono uppercase text-rose-500 font-bold block mb-1">Live Example:</span>
              <p className="text-slate-700 dark:text-slate-200 font-medium">"Nov 20 Gazette notice directly contradicts Nov 10 archive bulletin."</p>
            </div>
          </div>

          {/* Bento Item 3: Temporal Freshness */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-indigo-500/30 flex flex-col justify-between group hover:border-indigo-500/60 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/30">
                  Stage 4
                </span>
              </div>
              <h3 className={`text-xl font-heading font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Temporal Freshness
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Audits timestamps and cycle labels to warn you when a circular references expired application seasons.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs">
              <span className="text-[10px] font-mono uppercase text-indigo-500 font-bold block mb-1">Cycle Tracking:</span>
              <p className="text-slate-700 dark:text-slate-200 font-medium">2023 Academic Cycle detected • Superseded by 2025 Regulations.</p>
            </div>
          </div>

          {/* Bento Item 4: Wide 2-Col Actionable Checklist & Vector PDF */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-emerald-500/30 flex flex-col justify-between group hover:border-emerald-500/60 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  Stage 5 Synthesis
                </span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-heading font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Actionable Escalation Checklist & Vector PDF
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Transforms findings into prioritized action steps with exact office phone numbers, official enquiry portals, and an executive ReportLab vector PDF ready for board review.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                ✓ ReportLab Vector Engine
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                ✓ Official Authority Contacts
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                ✓ Negative-Proof Disclaimers
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE COMPARISON: CHATBOT BLINDNESS VS DARK SPOT INTEL    */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 font-heading">
            Reality Check
          </span>
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            Why Generic AI Summarizers Fail Serious Research
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Language models are trained to provide fluent answers, masking missing information with plausible hallucinations. Digital Dark Spot reverses this by enforcing strict negative proof.
          </p>
        </div>

        {/* Tab Switcher for Comparison */}
        <div className="flex justify-center mb-8">
          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveTabComparison("chatbot")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTabComparison === "chatbot"
                  ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ❌ Generic AI Chatbot / Summarizer
            </button>
            <button
              onClick={() => setActiveTabComparison("platform")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTabComparison === "platform"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                  : "text-slate-500 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              ⚡ Digital Dark Spot Engine
            </button>
          </div>
        </div>

        {/* Comparison Display Box */}
        <div className="max-w-4xl mx-auto">
          {activeTabComparison === "chatbot" ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-500/30 space-y-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Traditional Chatbots & Summarizers</h3>
                  <p className="text-xs text-rose-600 dark:text-rose-300 font-mono">Compresses text blindly • Incurs critical real-world blind spots</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono space-y-2">
                <p className="text-slate-400">// Example Output from Generic Chatbot:</p>
                <p className="text-rose-600 dark:text-rose-300 leading-relaxed font-sans">
                  "The scholarship deadline is November 10. Applicants must submit income certificates and marksheets to qualify."
                </p>
                <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1 font-sans">
                  <p>❌ Silently overlooked that the state gazette extended the deadline to Nov 20.</p>
                  <p>❌ Never noticed that neither document stated the required Year 2 renewal GPA cutoff.</p>
                  <p>❌ Failed to warn that the INR 6L income cap was from a superseded 2023 archive.</p>
                  <p>❌ Zero traceable quote citations or escalation office phone numbers.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-500/40 space-y-5 animate-fade-in shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Digital Dark Spot Platform</h3>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-mono">Negative-Proof Gap Engine • Cross-Source Verification Matrix</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono space-y-3">
                <p className="text-slate-400">// Real Intelligence Output from Digital Dark Spot:</p>
                <div className="space-y-2 font-sans">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                    <b>⚠️ 2 GAPS IDENTIFIED:</b> "Not found in the sources reviewed. The renewal CGPA threshold is absent across all 4 portals."
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200">
                    <b>⚡ 2 CONFLICTS FLAGGED:</b> "Deadline discrepancy: Nov 20 (Gazette) vs Nov 10 (Archive Bulletin). Traceable quotes provided."
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-900 dark:text-indigo-200">
                    <b>⏳ 1 OUTDATED SOURCE:</b> "2023-2024 academic cycle bulletin superseded by active 2025-2026 regulations."
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
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
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#080c16]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 font-heading">
              Deterministic & AI Architecture
            </span>
            <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              The 5-Stage Verification Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
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
                    ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-white shadow-md shadow-amber-500/10 font-bold"
                    : isDark
                    ? "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-mono font-bold ${activePipelineStage === idx ? "text-amber-500" : "text-slate-400"}`}>
                    STAGE {stage.num}
                  </span>
                  {activePipelineStage === idx && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <p className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                  {stage.title}
                </p>
              </button>
            ))}
          </div>

          {/* Active Stage Detail Showcase */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-amber-500/30 max-w-4xl mx-auto animate-fade-in shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-amber-500 font-bold uppercase">
                  Stage {pipelineStages[activePipelineStage].num} Specification
                </span>
                <h3 className={`text-lg sm:text-xl font-heading font-bold mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {pipelineStages[activePipelineStage].title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 self-start sm:self-auto">
                {pipelineStages[activePipelineStage].tag}
              </span>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {pipelineStages[activePipelineStage].desc}
            </p>
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Safety Guarantee: SSRF Defense & Schema Enforcement</span>
              <button
                onClick={() => onNavigate("research")}
                className="text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
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
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 font-heading">
            Frequently Asked Questions
          </span>
          <h3 className={`text-2xl sm:text-4xl font-heading font-extrabold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            Responsible AI & Operational Integrity
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-panel border overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <span className={`text-xs sm:text-sm font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-500 shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className={`px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t border-slate-200 dark:border-slate-800/50 animate-fade-in font-normal ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}>
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
      <section className="py-16 border-t border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-transparent to-amber-500/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Stop guessing what your sources missed.
          </h2>
          <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
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
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl border font-bold text-sm transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-slate-900 border-slate-700 hover:border-amber-500/50 text-white"
                  : "bg-white border-slate-300 hover:border-amber-500 text-slate-900 shadow-xs"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{loadingDemo ? "Analyzing..." : "Run Sample Scholarship Audit"}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
