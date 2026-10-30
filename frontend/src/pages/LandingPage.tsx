import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronDown,
  Layers,
  FileText,
  AlertTriangle,
  Scale,
  Clock,
  CheckCircle2,
  Lock,
  Compass,
  FileCheck2,
  FileCode,
  Download,
  Building2,
  GraduationCap,
  Cloud,
  Stethoscope,
  Terminal,
  Activity,
  Sparkles
} from "lucide-react";
import { loadDemoScenario } from "../services/api";

interface LandingPageProps {
  onNavigate: (view: string, param?: string) => void;
  theme?: "dark" | "light";
}

interface ScenarioData {
  id: string;
  name: string;
  domain: string;
  icon: React.ComponentType<{ className?: string }>;
  query: string;
  sourcesCount: number;
  completeness: number;
  darkSpotIndex: number;
  gapsCount: number;
  conflictsCount: number;
  outdatedCount: number;
  sources: {
    id: string;
    title: string;
    authority: string;
    cycle: string;
    status: "Verified Official" | "Superseded" | "Incomplete" | "Discrepancy";
  }[];
  gaps: {
    title: string;
    objective: string;
    finding: string;
    impact: string;
    status: string;
  }[];
  conflicts: {
    title: string;
    claimA: {
      source: string;
      statement: string;
      date: string;
    };
    claimB: {
      source: string;
      statement: string;
      date: string;
    };
    directive: string;
  }[];
  temporal: {
    source: string;
    publishedCycle: string;
    activeCycle: string;
    reason: string;
    action: string;
  }[];
  checklist: {
    priority: "High" | "Medium";
    task: string;
    target: string;
    protocol: string;
  }[];
}

const SCENARIOS: Record<string, ScenarioData> = {
  scholarship: {
    id: "scholarship",
    name: "Statutory Higher Education Directive",
    domain: "Public Policy & Academic Governance",
    icon: GraduationCap,
    query: "What statutory eligibility criteria, renewal rules, and deadlines govern the merit scholarship?",
    sourcesCount: 4,
    completeness: 68,
    darkSpotIndex: 32,
    gapsCount: 2,
    conflictsCount: 2,
    outdatedCount: 1,
    sources: [
      { id: "SRC-01", title: "State Higher Education Gazette Notification", authority: "Department of Higher Education", cycle: "2025-2026 (Active)", status: "Verified Official" },
      { id: "SRC-02", title: "Student Welfare Advisory Bulletin", authority: "Institutional Welfare Directorate", cycle: "2023-2024 (Superseded)", status: "Superseded" },
      { id: "SRC-03", title: "National Public Information Portal", authority: "Ministry Public Records", cycle: "2025 Active", status: "Verified Official" },
      { id: "SRC-04", title: "University Financial Aid Circular", authority: "Academic Council Board", cycle: "Undated Circular", status: "Incomplete" }
    ],
    gaps: [
      {
        title: "Year-Two Renewal CGPA Cutoff & Backlog Policy",
        objective: "Academic standing required to maintain continuous disbursement after Year 1",
        finding: "Unaddressed across all 4 reviewed documents. No explicit minimum GPA, attendance threshold, or backlog allowance is stated.",
        impact: "High Risk — Candidates risk unexpected grant termination upon matriculation without documented maintenance standards.",
        status: "Not found in sources reviewed"
      },
      {
        title: "Official Grievance Redressal & Appellate Authority",
        objective: "Statutory escalation procedure in the event of disbursement rejection",
        finding: "None of the reviewed circulars specify the designated appellate officer, filing timeline, or statutory review window.",
        impact: "Compliance Gap — Enrolled applicants lack legal recourse in procedural disputes.",
        status: "Not found in sources reviewed"
      }
    ],
    conflicts: [
      {
        title: "Statutory Application Submission Deadline",
        claimA: {
          source: "State Higher Ed Gazette (SRC-01)",
          statement: "The application window conclusively terminates on November 20, 2025 at 23:59 IST.",
          date: "October 14, 2025"
        },
        claimB: {
          source: "Student Welfare Bulletin (SRC-02)",
          statement: "All completed submissions must be received on or before November 10, 2023.",
          date: "September 02, 2023"
        },
        directive: "Adhere exclusively to Gazette Notification SRC-01 (Nov 20, 2025). The bulletin in SRC-02 represents a superseded administrative cycle."
      },
      {
        title: "Maximum Gross Family Income Eligibility Threshold",
        claimA: {
          source: "State Higher Ed Gazette (SRC-01)",
          statement: "Annual household gross revenue shall not exceed INR 8,00,000 as attested by Form 16.",
          date: "October 14, 2025"
        },
        claimB: {
          source: "Welfare Directorate Circular (SRC-02)",
          statement: "Parental aggregate taxable income must remain below INR 6,00,000 per annum.",
          date: "September 02, 2023"
        },
        directive: "Verify against active Finance Department notification. SRC-01 reflects the amended ceiling enacted for Fiscal Year 2025-2026."
      }
    ],
    temporal: [
      {
        source: "Student Welfare Advisory Bulletin (SRC-02)",
        publishedCycle: "2023-2024 Administrative Cycle",
        activeCycle: "2025-2026 Gazette Mandate",
        reason: "Cites obsolete application deadlines (Nov 10, 2023) and superseded income ceilings (INR 6.0L) that have been amended by statutory gazette.",
        action: "Quarantine source from primary eligibility evaluation."
      }
    ],
    checklist: [
      { priority: "High", task: "Confirm Year 2 renewal CGPA cutoff with State Scholarship Directorate", target: "State Directorate Office (011-2338-9241)", protocol: "Obtain written administrative clarification" },
      { priority: "High", task: "Validate application window termination date against current gazette", target: "Gazette Notification Portal", protocol: "Verify Serial No. 2025-ED-091" },
      { priority: "Medium", task: "Request written documentation regarding permissible academic backlog limits", target: "Registrar Academic Affairs", protocol: "Formal administrative memorandum" },
      { priority: "Medium", task: "Ensure income documentation reflects the amended INR 8.0L threshold", target: "Revenue Competent Authority", protocol: "Certified Tahsildar Affidavit" }
    ]
  },
  cloud: {
    id: "cloud",
    name: "Enterprise Database Architecture & SLA",
    domain: "Infrastructure & Regulatory Compliance",
    icon: Cloud,
    query: "What high-availability SLA, cross-region KMS protocols, and failover constraints apply to the database migration?",
    sourcesCount: 3,
    completeness: 72,
    darkSpotIndex: 28,
    gapsCount: 2,
    conflictsCount: 1,
    outdatedCount: 1,
    sources: [
      { id: "SRC-01", title: "Enterprise Database Architecture Whitepaper", authority: "Vendor Enterprise Engineering", cycle: "Q1 2025 Edition", status: "Verified Official" },
      { id: "SRC-02", title: "Legacy PostgreSQL 13 Deprecation Notice", authority: "Open-Source Core Team", cycle: "2023 Advisory", status: "Superseded" },
      { id: "SRC-03", title: "Production Migration Engineering Log", authority: "Internal Infrastructure Team", cycle: "November 2024", status: "Discrepancy" }
    ],
    gaps: [
      {
        title: "Multi-Region KMS Key Replication During Regional Failover",
        objective: "Automated cryptographic key failover during unannounced regional outage",
        finding: "Documentation does not define whether secondary replica decryption keys replicate synchronously or require manual KMS re-binding.",
        impact: "Severe Compliance Risk — Potential database mount failure and regulatory breach during disaster recovery.",
        status: "Not found in sources reviewed"
      },
      {
        title: "HIPAA Business Associate Agreement (BAA) Telemetry Bounds",
        objective: "Scope of proprietary diagnostics collected by automated performance insights",
        finding: "The reviewed contractual documents fail to clarify whether query text containing patient identifiers is masked prior to vendor ingestion.",
        impact: "Legal Exposure — Risk of unencrypted PHI leakage into third-party observability pipelines.",
        status: "Not found in sources reviewed"
      }
    ],
    conflicts: [
      {
        title: "Guaranteed Maximum Read-Replica Replication Lag",
        claimA: {
          source: "Vendor Architecture Whitepaper (SRC-01)",
          statement: "Aurora global storage guarantees sub-10ms asynchronous replication across availability zones.",
          date: "January 2025"
        },
        claimB: {
          source: "Production Migration Log (SRC-03)",
          statement: "Observed cross-AZ replication latency degraded to 140ms during heavy batch write workloads.",
          date: "November 2024"
        },
        directive: "Conduct stress-testing benchmark under simulated production load prior to signing enterprise SLA agreement."
      }
    ],
    temporal: [
      {
        source: "Legacy PostgreSQL Deprecation Notice (SRC-02)",
        publishedCycle: "2023 Engine Lifecycle",
        activeCycle: "PostgreSQL 16 Enterprise Standard",
        reason: "References end-of-life catalog table structures and connection pooling flags deprecated in modern engine branches.",
        action: "Update infrastructure automation templates to target engine version 16.3+."
      }
    ],
    checklist: [
      { priority: "High", task: "Request formal KMS multi-region replication specification from Vendor Architect", target: "Enterprise Solutions Architect", protocol: "Contractual Architectural Review" },
      { priority: "High", task: "Execute synthetic latency benchmarks under 20,000 IOPS write load", target: "Staging Performance Cluster", protocol: "Validate sub-15ms compliance" },
      { priority: "Medium", task: "Confirm HIPAA BAA covers query-string parameter tokenization", target: "Vendor Legal Counsel", protocol: "Signed BAA Schedule A Amendment" }
    ]
  },
  clinical: {
    id: "clinical",
    name: "Phase-II Clinical Oncology Protocol",
    domain: "Life Sciences & Institutional Review Board",
    icon: Stethoscope,
    query: "What exclusion criteria, prior therapy washout periods, and biomarker thresholds govern patient cohort admission?",
    sourcesCount: 4,
    completeness: 64,
    darkSpotIndex: 36,
    gapsCount: 1,
    conflictsCount: 2,
    outdatedCount: 1,
    sources: [
      { id: "SRC-01", title: "ClinicalTrials.gov Primary Registry Dossier", authority: "National Health Authority", cycle: "August 2025 Amendment", status: "Verified Official" },
      { id: "SRC-02", title: "Phase-I Preliminary Safety Monograph", authority: "Clinical Research Consortium", cycle: "2022 Archive", status: "Superseded" },
      { id: "SRC-03", title: "Institutional Review Board Protocol Summary", authority: "IRB Ethics Committee", cycle: "July 2025 Circular", status: "Discrepancy" },
      { id: "SRC-04", title: "Investigational Site Patient Eligibility Form", authority: "Participating Hospital Network", cycle: "September 2025", status: "Incomplete" }
    ],
    gaps: [
      {
        title: "Checkpoint Inhibitor Washout Period Prior to Randomization",
        objective: "Mandatory biological clearance interval for prior anti-PD-1 or anti-CTLA-4 immunotherapy",
        finding: "Neither the primary registry nor the hospital criteria sheet specifies the mandatory washout window in days.",
        impact: "Critical Patient Safety Risk — Risk of fatal immune-mediated adverse events without defined biological clearance.",
        status: "Not found in sources reviewed"
      }
    ],
    conflicts: [
      {
        title: "Minimum Baseline Absolute Neutrophil Count (ANC)",
        claimA: {
          source: "Primary Registry Dossier (SRC-01)",
          statement: "Eligible patients must exhibit an absolute neutrophil count of >= 1,500/mcL at screening.",
          date: "August 2025"
        },
        claimB: {
          source: "IRB Protocol Summary (SRC-03)",
          statement: "Patients with ANC >= 1,000/mcL are eligible for cohort admission under compassionate use guidelines.",
          date: "July 2025"
        },
        directive: "Confer immediately with Principal Investigator. Protocol Amendment 4 enforces 1,500/mcL; earlier drafts must be discarded."
      },
      {
        title: "Maximum Allowed Serum Creatinine Threshold",
        claimA: {
          source: "Primary Registry Dossier (SRC-01)",
          statement: "Serum creatinine must be <= 1.5x institutional Upper Limit of Normal (ULN).",
          date: "August 2025"
        },
        claimB: {
          source: "Investigational Site Eligibility Form (SRC-04)",
          statement: "Calculated creatinine clearance of >= 50 mL/min required; serum creatinine values not strictly gated.",
          date: "September 2025"
        },
        directive: "Harmonize site eligibility checklists with IRB-approved Master Protocol Rev 3.2."
      }
    ],
    temporal: [
      {
        source: "Phase-I Preliminary Safety Monograph (SRC-02)",
        publishedCycle: "2022 Pre-Trial Monograph",
        activeCycle: "Phase-II Registered Master Protocol",
        reason: "Contains exploratory dose-escalation thresholds that have been replaced by the approved Phase-II recommended dose.",
        action: "Restrict usage strictly to historical pharmacokinetic reference."
      }
    ],
    checklist: [
      { priority: "High", task: "Issue administrative binding query regarding immunotherapy washout window", target: "Lead Medical Monitor / Principal Investigator", protocol: "Written Protocol Clarification Letter" },
      { priority: "High", task: "Reconcile site screening ANC cutoffs across participating investigational centers", target: "Clinical Research Associates Lead", protocol: "Site Audit Directive" },
      { priority: "Medium", task: "Archive obsolete Phase-I dosing monographs from active investigator site files", target: "Trial Master File Coordinator", protocol: "Document Retention Log Update" }
    ]
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, theme = "dark" }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("scholarship");
  const [activeDossierTab, setActiveDossierTab] = useState<"gaps" | "conflicts" | "temporal" | "checklist">("gaps");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isDark = theme === "dark";
  const scenario = SCENARIOS[activeScenarioId];

  const handleLaunchSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate("research");
    } else {
      handleTriggerDemo();
    }
  };

  const handleTriggerDemo = async () => {
    try {
      setLoadingDemo(true);
      const res = await loadDemoScenario();
      if (res && res.research_id) {
        onNavigate("results", res.research_id);
      } else {
        onNavigate("research");
      }
    } catch {
      onNavigate("research");
    } finally {
      setLoadingDemo(false);
    }
  };

  const methodologyStages = [
    {
      num: "01",
      title: "SSRF Quarantine & Structural Isolation",
      category: "Deterministic Ingestion",
      summary: "Inbound URLs are scrutinized against private CIDR ranges to prevent internal network scanning. HTML trees are stripped of navigation scripts, ads, and cookies to isolate uncorrupted semantic text."
    },
    {
      num: "02",
      title: "Atomic Proposition Decomposition",
      category: "Semantic Extraction",
      summary: "Documents are resolved into atomic, falsifiable propositions. Each requirement, deadline, monetary threshold, and procedural mandate is linked to verbatim excerpt citations and exact source identifiers."
    },
    {
      num: "03",
      title: "Multi-Document Invariance Audit",
      category: "Contradiction Engine",
      summary: "Cross-correlates claims across independent sources. Flags irreconcilable dates, conflicting financial cutoffs, and diverging prerequisites using strict logical equivalence criteria."
    },
    {
      num: "04",
      title: "Negative-Proof & Chronological Classifier",
      category: "Gap & Temporal Analysis",
      summary: "Verifies the corpus against essential research objectives. Items absent across all sources are classified under strict negative proof ('Not found in sources reviewed'). Temporal headers identify superseded cycles."
    },
    {
      num: "05",
      title: "Remediation Directive & Executive Dossier",
      category: "Synthesis & Governance",
      summary: "Synthesizes findings into an escalation protocol complete with administrative office contacts, statutory gazette serials, and a board-ready ReportLab vector PDF export."
    }
  ];

  const faqs = [
    {
      q: "How does Digital Dark Spot distinguish itself from standard generative AI chatbots?",
      a: "Standard generative LLMs are optimized to construct fluent, complete-sounding narratives. When documentation lacks answers, typical models hallucinate plausible details to satisfy user prompts. Digital Dark Spot rejects this premise: it enforces strict negative-proof constraints, explicitly reporting when critical information is absent across reviewed documentation, highlighting discrepancies between sources, and demanding verifiable citation grounding for every assertion."
    },
    {
      q: "What is the operational definition of 'Not found in the sources reviewed'?",
      a: "In compliance with responsible AI governance, our engine never claims an unstated fact 'does not exist in reality.' Instead, it records an objective finding: across all ingested documents, that specific research objective is unanswered. This protects researchers and decision-makers from false negatives while providing targeted directions for authoritative inquiry."
    },
    {
      q: "How are contradictions evaluated to eliminate false alarms?",
      a: "The contradiction matrix does not flag variations in phraseology or stylistic tone. It tests whether two or more separate documents refer to the identical entity, administrative cycle, and condition, yet establish mutually incompatible factual obligations (such as competing submission deadlines or differing income thresholds)."
    },
    {
      q: "Can the intelligence dossier be exported for compliance audits or legal review?",
      a: "Yes. Every completed investigation can be downloaded as a publication-grade vector PDF. Reports incorporate executive summaries, source integrity tables, side-by-side contradiction matrices with verbatim quotes, and prioritized verification directives."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden transition-colors duration-300">
      
      {/* Subtle Architectural Grid Background */}
      <div className="absolute inset-0 bg-mesh-pattern pointer-events-none opacity-60"></div>
      
      {/* Ambient Lighting Gradients */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] lg:w-[1100px] h-[500px] bg-gradient-to-b from-amber-500/10 via-slate-500/5 to-transparent blur-[160px] pointer-events-none"></div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className="relative pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-32 z-10 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-[11px] font-mono tracking-widest uppercase text-slate-700 dark:text-slate-300 mb-8 backdrop-blur-md shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Enterprise Research Intelligence</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Multi-Document Verification</span>
          </div>

          {/* Primary Headline */}
          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6 ${isDark ? "text-white" : "text-slate-950"}`}>
            Uncover the Silent Gaps in Multi-Source Intelligence.
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 font-normal ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Conventional tools summarize what is present. Digital Dark Spot cross-examines multiple sources to isolate <b>silent omissions</b>, resolve <b>conflicting directives</b>, and detect <b>superseded timelines</b> before high-stakes decisions are finalized.
          </p>

          {/* Investigation Trigger Dock */}
          <div className="max-w-3xl mx-auto mb-6">
            <form
              onSubmit={handleLaunchSearch}
              className={`p-2 rounded-2xl border transition-all ${
                isDark
                  ? "bg-slate-900/90 border-slate-800 shadow-2xl focus-within:border-amber-500/50"
                  : "bg-white border-slate-300 shadow-lg focus-within:border-amber-500"
              } flex flex-col sm:flex-row items-center gap-2`}
            >
              <div className="flex items-center gap-3 w-full px-3 py-2 text-left">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter a research topic, statutory query, or policy URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent text-sm sm:text-base placeholder-slate-400 focus:outline-none ${
                    isDark ? "text-white" : "text-slate-950"
                  }`}
                />
              </div>
              <div className="w-full sm:w-auto shrink-0">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Initiate Investigation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Investigation Domains */}
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mt-4 text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">Benchmark Domains:</span>
              <button
                type="button"
                onClick={() => setActiveScenarioId("scholarship")}
                className={`transition-colors cursor-pointer ${
                  activeScenarioId === "scholarship"
                    ? "text-amber-500 font-bold underline underline-offset-4"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Statutory Fellowship
              </button>
              <span className="text-slate-400">•</span>
              <button
                type="button"
                onClick={() => setActiveScenarioId("cloud")}
                className={`transition-colors cursor-pointer ${
                  activeScenarioId === "cloud"
                    ? "text-amber-500 font-bold underline underline-offset-4"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Enterprise Cloud SLA
              </button>
              <span className="text-slate-400">•</span>
              <button
                type="button"
                onClick={() => setActiveScenarioId("clinical")}
                className={`transition-colors cursor-pointer ${
                  activeScenarioId === "clinical"
                    ? "text-amber-500 font-bold underline underline-offset-4"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Clinical Oncology Trial
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. INSTITUTIONAL METRICS STRIP                                 */}
      {/* ============================================================== */}
      <section className="py-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-heading font-black text-amber-500">100%</div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                Verbatim Grounding
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Every finding tied to exact excerpt quotations</p>
            </div>

            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">0%</div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                Hallucination Tolerance
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Missing criteria recorded under strict negative proof</p>
            </div>

            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">5 Stages</div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                Deterministic Pipeline
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">From SSRF quarantine to schema-enforced synthesis</p>
            </div>

            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">ReportLab</div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                Executive Vector PDF
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Board-ready audit dossiers with complete trail</p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. INTERACTIVE RESEARCH DOSSIER SHOWCASE (CORE DEMONSTRATION)  */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-mono tracking-widest uppercase text-amber-500 font-bold mb-2">
            Verifiable Research Dossier
          </div>
          <h2 className={`text-2xl sm:text-4xl font-heading font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Inspect Multi-Source Intelligence in Real Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            Switch scenarios below to observe how the platform identifies omissions, confronts contradictory claims, and validates timelines across legal, engineering, and medical corpora.
          </p>
        </div>

        {/* Domain Preset Tabs */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {Object.keys(SCENARIOS).map((key) => {
              const sc = SCENARIOS[key];
              const Icon = sc.icon;
              const isActive = activeScenarioId === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveScenarioId(key)}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{sc.name.split(" ")[0]} Directive</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Dossier Workbench Container */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101a] shadow-xl overflow-hidden">
          
          {/* Dossier Header Bar */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                <span>Dossier Reference: DDS-2026-X9</span>
                <span>•</span>
                <span className="text-amber-500 font-bold">{scenario.domain}</span>
              </div>
              <h3 className={`text-base sm:text-lg font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                "{scenario.query}"
              </h3>
            </div>

            {/* Quick Metric Chips */}
            <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                {scenario.sourcesCount} Sources Audited
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                {scenario.gapsCount} Silent Gaps
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                {scenario.conflictsCount} Inconsistencies
              </span>
            </div>
          </div>

          {/* Dossier Navigation Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101a] px-4 overflow-x-auto text-xs font-heading font-bold">
            <button
              onClick={() => setActiveDossierTab("gaps")}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeDossierTab === "gaps"
                  ? "border-amber-500 text-amber-500"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Silent Omissions ({scenario.gapsCount})</span>
            </button>

            <button
              onClick={() => setActiveDossierTab("conflicts")}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeDossierTab === "conflicts"
                  ? "border-amber-500 text-amber-500"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Contradiction Matrix ({scenario.conflictsCount})</span>
            </button>

            <button
              onClick={() => setActiveDossierTab("temporal")}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeDossierTab === "temporal"
                  ? "border-amber-500 text-amber-500"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Temporal Validity ({scenario.outdatedCount})</span>
            </button>

            <button
              onClick={() => setActiveDossierTab("checklist")}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeDossierTab === "checklist"
                  ? "border-amber-500 text-amber-500"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Remediation Protocol ({scenario.checklist.length})</span>
            </button>
          </div>

          {/* Dossier Tab Content */}
          <div className="p-6 sm:p-8">
            
            {/* TAB 1: GAPS */}
            {activeDossierTab === "gaps" && (
              <div className="space-y-4 animate-fade-in">
                {scenario.gaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] dark:bg-amber-950/[0.1] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <h4 className={`text-sm sm:text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {gap.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 self-start sm:self-auto">
                        {gap.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <p className="text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold">Corpus Finding:</strong> {gap.finding}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold">Impact Assessment:</strong> {gap.impact}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Evaluated across {scenario.sourcesCount} distinct source domains</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">Strict Negative Proof Enforced</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: CONTRADICTIONS */}
            {activeDossierTab === "conflicts" && (
              <div className="space-y-4 animate-fade-in">
                {scenario.conflicts.map((conflict, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm sm:text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {conflict.title}
                      </h4>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold">
                        Irreconcilable Claims
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      
                      {/* Claim A */}
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                          <span className="font-bold text-amber-500">Source A</span>
                          <span>{conflict.claimA.date}</span>
                        </div>
                        <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                          {conflict.claimA.source}
                        </p>
                        <blockquote className="italic text-slate-600 dark:text-slate-300 border-l-2 border-amber-500/40 pl-2 text-[11px]">
                          "{conflict.claimA.statement}"
                        </blockquote>
                      </div>

                      {/* Claim B */}
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                          <span className="font-bold text-rose-500">Source B</span>
                          <span>{conflict.claimB.date}</span>
                        </div>
                        <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                          {conflict.claimB.source}
                        </p>
                        <blockquote className="italic text-slate-600 dark:text-slate-300 border-l-2 border-rose-500/40 pl-2 text-[11px]">
                          "{conflict.claimB.statement}"
                        </blockquote>
                      </div>

                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-[10px] uppercase block mb-0.5">Reconciliation Directive:</span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">{conflict.directive}</p>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: TEMPORAL */}
            {activeDossierTab === "temporal" && (
              <div className="space-y-4 animate-fade-in">
                {scenario.temporal.map((temp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className={`text-sm sm:text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {temp.source}
                      </h4>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold self-start sm:self-auto">
                        Superseded Lifecycle
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 text-[10px] block">DOCUMENTED CYCLE</span>
                        <span className="text-rose-500 font-bold">{temp.publishedCycle}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 text-[10px] block">ACTIVE GOVERNING CYCLE</span>
                        <span className="text-emerald-500 font-bold">{temp.activeCycle}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {temp.reason}
                    </p>

                    <div className="text-[11px] font-mono text-slate-500 pt-1">
                      <strong>Prescribed Directive:</strong> {temp.action}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: CHECKLIST */}
            {activeDossierTab === "checklist" && (
              <div className="space-y-3 animate-fade-in">
                {scenario.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                          item.priority === "High"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}>
                          {item.priority} Priority
                        </span>
                        <span className="font-heading font-bold text-slate-900 dark:text-white">
                          {item.task}
                        </span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Target Office: <span className="font-mono text-slate-700 dark:text-slate-300">{item.target}</span>
                      </div>
                    </div>

                    <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 shrink-0 self-start sm:self-auto">
                      {item.protocol}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Dossier Bottom Action Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Execute this comprehensive audit benchmark with dynamic vector PDF compilation:
            </span>
            <button
              type="button"
              onClick={handleTriggerDemo}
              disabled={loadingDemo}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>{loadingDemo ? "Executing Pipeline..." : "Launch Live Audit Report →"}</span>
            </button>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 4. METHODOLOGY & 5-STAGE VERIFICATION PIPELINE                 */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#07090e]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono tracking-widest uppercase text-amber-500 font-bold mb-2">
              System Architecture
            </div>
            <h2 className={`text-2xl sm:text-4xl font-heading font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              The 5-Stage Verification Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
              Deterministic code handles extraction, security, and schema enforcement; model inference is restricted to proposition synthesis and invariant comparison.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {methodologyStages.map((stage, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="font-bold text-amber-500">STAGE {stage.num}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {stage.category.split(" ")[0]}
                    </span>
                  </div>
                  <h3 className={`text-sm font-heading font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stage.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px] font-mono text-slate-400">
                  Verifiable Output Contract
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. ARCHITECTURAL DIFFERENTIATION (WHY LLMS FAIL)                */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-mono tracking-widest uppercase text-amber-500 font-bold mb-2">
            Architectural Differentiation
          </div>
          <h2 className={`text-2xl sm:text-4xl font-heading font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Why Standard Generative Models Fail Serious Research
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            Generative chat models are fundamentally engineered for fluency. When documents fail to answer a question, models fill voids with plausible speculation.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            
            {/* Generic Chatbot Flaws */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  Conventional Generative Chatbot
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Optimized for conversational agreement. Compresses documents into fluent paragraphs while obscuring critical missing context.
              </p>
              
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span>Fabricates plausible criteria when vital policies (e.g. renewal rules) are unaddressed in source text.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span>Silently blends conflicting deadlines into a single hallucinated date without alerting the investigator.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span>Ignores document publication dates and quotes superseded regulations as current truth.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span>Zero formal negative-proof documentation or traceable verbatim citation indexes.</span>
                </li>
              </ul>
            </div>

            {/* Digital Dark Spot Platform */}
            <div className="p-6 sm:p-8 space-y-4 bg-amber-500/[0.02] dark:bg-amber-950/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  Digital Dark Spot Verification System
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Deterministic cross-examination platform enforcing negative-proof constraints, chronological audits, and evidence tracing.
              </p>
              
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>Explicitly isolates unaddressed questions as silent gaps (<b>Not found in sources reviewed</b>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>Confronts conflicting clauses side-by-side with exact quotations, timestamps, and reconciliation directives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>Audits academic and administrative cycles to flag superseded circulars and expired mandates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>Generates actionable escalation directives and downloadable ReportLab vector PDF dossiers.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 6. TECHNICAL FAQ SECTION                                       */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80">
        
        <div className="text-center mb-12">
          <div className="text-xs font-mono tracking-widest uppercase text-amber-500 font-bold mb-2">
            Governance & Operational FAQ
          </div>
          <h2 className={`text-2xl sm:text-4xl font-heading font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Responsible Intelligence Architecture
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <span className={`text-xs sm:text-sm font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className={`px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/60 font-normal ${
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
      {/* 7. EXECUTIVE CALL TO ACTION                                    */}
      {/* ============================================================== */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-transparent to-slate-100 dark:to-slate-950/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight leading-tight ${
            isDark ? "text-white" : "text-slate-950"
          }`}>
            Eliminate blind spots before finalizing critical decisions.
          </h2>

          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ingest multiple circulars, research papers, or vendor specifications to isolate silent omissions and contradictory claims in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate("research")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-sm transition-all cursor-pointer shadow-md"
            >
              Launch Research Workspace
            </button>
            <button
              type="button"
              onClick={handleTriggerDemo}
              disabled={loadingDemo}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl border text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                  : "bg-white border-slate-300 text-slate-900 hover:bg-slate-50 shadow-xs"
              }`}
            >
              <span>{loadingDemo ? "Processing..." : "View Sample Scholarship Audit"}</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
