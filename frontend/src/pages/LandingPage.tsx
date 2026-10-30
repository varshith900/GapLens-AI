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
      
      {/* Background Lighting Gradients - Positioned strictly behind content (-z-10) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] lg:w-[1300px] h-[550px] bg-gradient-to-b from-amber-400/25 via-indigo-500/20 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-[650px] left-1/2 -translate-x-1/2 w-[850px] lg:w-[1100px] h-[500px] bg-gradient-to-b from-indigo-500/15 via-amber-500/10 to-transparent blur-[150px] pointer-events-none -z-10"></div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className="relative z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-500/40 dark:border-amber-500/50 bg-white dark:bg-slate-900 text-xs font-mono tracking-widest uppercase text-amber-900 dark:text-amber-300 mb-8 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="font-bold">Enterprise Research Intelligence</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700 dark:text-slate-200 font-semibold">Multi-Document Verification</span>
          </div>

          {/* Primary Headline */}
          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6 ${isDark ? "text-white" : "text-slate-950"}`}>
            Uncover the Silent Gaps in Multi-Source Intelligence.
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 font-normal ${isDark ? "text-slate-100" : "text-slate-800"}`}>
            Conventional tools summarize what is present. Digital Dark Spot cross-examines multiple sources to isolate <b className="text-amber-500 dark:text-amber-400 font-bold">silent omissions</b>, resolve <b className="text-rose-600 dark:text-rose-400 font-bold">conflicting directives</b>, and detect <b className="text-indigo-600 dark:text-indigo-400 font-bold">superseded timelines</b> before high-stakes decisions are finalized.
          </p>

          {/* Investigation Trigger Dock */}
          <div className="max-w-3xl mx-auto mb-6">
            <form
              onSubmit={handleLaunchSearch}
              className={`p-2.5 rounded-2xl border transition-all ${
                isDark
                  ? "bg-slate-900 border-slate-700 shadow-2xl focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50"
                  : "bg-white border-slate-300 shadow-lg focus-within:border-amber-500"
              } flex flex-col sm:flex-row items-center gap-2`}
            >
              <div className="flex items-center gap-3 w-full px-3 py-2 text-left">
                <Search className="w-5 h-5 text-amber-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter a research topic, statutory query, or policy URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent text-sm sm:text-base placeholder-slate-500 focus:outline-none ${
                    isDark ? "text-white" : "text-slate-950"
                  }`}
                />
              </div>
              <div className="w-full sm:w-auto shrink-0">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-400/25 hover:scale-[1.02]"
                >
                  <span>Initiate Investigation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Investigation Domains */}
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mt-4 text-xs font-mono">
              <span className="text-slate-700 dark:text-slate-300 font-bold">Benchmark Domains:</span>
              <button
                type="button"
                onClick={() => setActiveScenarioId("scholarship")}
                className={`transition-colors cursor-pointer ${
                  activeScenarioId === "scholarship"
                    ? "text-amber-600 dark:text-amber-400 font-extrabold underline underline-offset-4"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
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
                    ? "text-amber-600 dark:text-amber-400 font-extrabold underline underline-offset-4"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
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
                    ? "text-amber-600 dark:text-amber-400 font-extrabold underline underline-offset-4"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                }`}
              >
                Clinical Oncology Trial
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. INSTITUTIONAL METRICS STRIP - 100% SOLID & FULL CONTRAST     */}
      {/* ============================================================== */}
      <section className="relative z-10 py-9 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-heading font-black text-amber-500 dark:text-amber-400">100%</div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-extrabold mt-1">
                Verbatim Grounding
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">Every finding tied to exact excerpt quotations</p>
            </div>

            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-heading font-black text-slate-950 dark:text-white">0%</div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-extrabold mt-1">
                Hallucination Tolerance
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">Missing criteria recorded under strict negative proof</p>
            </div>

            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-heading font-black text-slate-950 dark:text-white">5 Stages</div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-extrabold mt-1">
                Deterministic Pipeline
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">From SSRF quarantine to schema-enforced synthesis</p>
            </div>

            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-heading font-black text-slate-950 dark:text-white">ReportLab</div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-extrabold mt-1">
                Executive Vector PDF
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">Board-ready audit dossiers with complete trail</p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. INTERACTIVE RESEARCH DOSSIER SHOWCASE                        */}
      {/* ============================================================== */}
      <section className="relative z-10 py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 font-extrabold mb-2.5">
            Verifiable Research Dossier
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            Inspect Multi-Source Intelligence in Real Time
          </h2>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 mt-3 leading-relaxed">
            Switch scenarios below to observe how the platform identifies omissions, confronts contradictory claims, and validates timelines across legal, engineering, and medical corpora.
          </p>
        </div>

        {/* Domain Preset Tabs */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-[#151d30] border border-slate-300 dark:border-slate-700 shadow-md">
            {Object.keys(SCENARIOS).map((key) => {
              const sc = SCENARIOS[key];
              const Icon = sc.icon;
              const isActive = activeScenarioId === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveScenarioId(key)}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 font-black"
                      : "text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{sc.name.split(" ")[0]} Directive</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Dossier Workbench Container - 100% Solid Card */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131b2e] shadow-2xl overflow-hidden">
          
          {/* Dossier Header Bar */}
          <div className="p-5 sm:p-6 border-b border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#18233c] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                <span className="font-extrabold">Dossier Reference: DDS-2026-X9</span>
                <span>•</span>
                <span className="text-amber-600 dark:text-amber-400 font-black">{scenario.domain}</span>
              </div>
              <h3 className={`text-base sm:text-lg font-heading font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                "{scenario.query}"
              </h3>
            </div>

            {/* Quick Metric Chips */}
            <div className="flex items-center gap-2.5 shrink-0 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-lg border border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-extrabold shadow-xs">
                {scenario.sourcesCount} Sources Audited
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-amber-500 bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-300 font-black shadow-xs">
                {scenario.gapsCount} Silent Gaps
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-rose-500 bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-300 font-black shadow-xs">
                {scenario.conflictsCount} Inconsistencies
              </span>
            </div>
          </div>

          {/* Dossier Navigation Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#162138] px-4 overflow-x-auto text-xs font-heading font-bold">
            <button
              onClick={() => setActiveDossierTab("gaps")}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeDossierTab === "gaps"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400 font-black"
                  : "border-transparent text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Silent Omissions ({scenario.gapsCount})</span>
            </button>

            <button
              onClick={() => setActiveDossierTab("conflicts")}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeDossierTab === "conflicts"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400 font-black"
                  : "border-transparent text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <Scale className="w-4 h-4 text-rose-500" />
              <span>Contradiction Matrix ({scenario.conflictsCount})</span>
            </button>

            <button
              onClick={() => setActiveDossierTab("temporal")}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeDossierTab === "temporal"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400 font-black"
                  : "border-transparent text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Temporal Validity ({scenario.outdatedCount})</span>
            </button>

            <button
              onClick={() => setActiveDossierTab("checklist")}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeDossierTab === "checklist"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400 font-black"
                  : "border-transparent text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              <span>Remediation Protocol ({scenario.checklist.length})</span>
            </button>
          </div>

          {/* Dossier Tab Content */}
          <div className="p-6 sm:p-8 bg-white dark:bg-[#131b2e]">
            
            {/* TAB 1: GAPS */}
            {activeDossierTab === "gaps" && (
              <div className="space-y-4 animate-fade-in">
                {scenario.gaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border-2 border-amber-400 dark:border-amber-500/50 bg-amber-50/80 dark:bg-[#1f1a10] space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <h4 className={`text-sm sm:text-base font-heading font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                          {gap.title}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-black px-3 py-1 rounded-md bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200 border border-amber-400 self-start sm:self-auto">
                        {gap.status}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm space-y-2">
                      <p className="text-slate-900 dark:text-slate-100">
                        <strong className="text-slate-950 dark:text-white font-extrabold">Corpus Finding:</strong> {gap.finding}
                      </p>
                      <p className="text-slate-800 dark:text-slate-200">
                        <strong className="text-slate-950 dark:text-white font-extrabold">Impact Assessment:</strong> {gap.impact}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-300 dark:border-amber-500/30 flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
                      <span>Evaluated across {scenario.sourcesCount} distinct source domains</span>
                      <span className="text-amber-700 dark:text-amber-300 font-black">Strict Negative Proof Enforced</span>
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
                    className="p-5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#18233a] space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm sm:text-base font-heading font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                        {conflict.title}
                      </h4>
                      <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border border-rose-400 font-black">
                        Irreconcilable Claims
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                      
                      {/* Claim A */}
                      <div className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-[#101726]">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300 mb-1.5 font-bold">
                          <span className="font-black text-amber-600 dark:text-amber-400">Source A</span>
                          <span>{conflict.claimA.date}</span>
                        </div>
                        <p className="font-extrabold text-slate-950 dark:text-white mb-1.5">
                          {conflict.claimA.source}
                        </p>
                        <blockquote className="italic text-slate-800 dark:text-slate-200 border-l-4 border-amber-500 pl-2.5 text-xs">
                          "{conflict.claimA.statement}"
                        </blockquote>
                      </div>

                      {/* Claim B */}
                      <div className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-[#101726]">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300 mb-1.5 font-bold">
                          <span className="font-black text-rose-600 dark:text-rose-400">Source B</span>
                          <span>{conflict.claimB.date}</span>
                        </div>
                        <p className="font-extrabold text-slate-950 dark:text-white mb-1.5">
                          {conflict.claimB.source}
                        </p>
                        <blockquote className="italic text-slate-800 dark:text-slate-200 border-l-4 border-rose-500 pl-2.5 text-xs">
                          "{conflict.claimB.statement}"
                        </blockquote>
                      </div>

                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-400 dark:border-amber-500/50 text-xs sm:text-sm">
                      <span className="font-black text-amber-900 dark:text-amber-300 font-mono text-xs uppercase block mb-1">Reconciliation Directive:</span>
                      <p className="text-slate-950 dark:text-slate-100 font-semibold">{conflict.directive}</p>
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
                    className="p-5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#18233a] space-y-3.5 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className={`text-sm sm:text-base font-heading font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                        {temp.source}
                      </h4>
                      <span className="text-xs font-mono px-3 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-200 border border-indigo-400 font-black self-start sm:self-auto">
                        Superseded Lifecycle
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#101726] border border-slate-300 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-400 text-xs block mb-0.5 font-bold">DOCUMENTED CYCLE</span>
                        <span className="text-rose-700 dark:text-rose-400 font-black">{temp.publishedCycle}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-[#101726] border border-slate-300 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-400 text-xs block mb-0.5 font-bold">ACTIVE GOVERNING CYCLE</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black">{temp.activeCycle}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                      {temp.reason}
                    </p>

                    <div className="text-xs font-mono text-slate-800 dark:text-slate-200 pt-1">
                      <strong className="text-slate-950 dark:text-white">Prescribed Directive:</strong> {temp.action}
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
                    className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#162138] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-mono uppercase font-black px-2.5 py-0.5 rounded ${
                          item.priority === "High"
                            ? "bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-300 border border-rose-400"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-300 border border-amber-400"
                        }`}>
                          {item.priority} Priority
                        </span>
                        <span className="font-heading font-black text-slate-950 dark:text-white">
                          {item.task}
                        </span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-200 text-xs">
                        Target Office: <span className="font-mono font-bold text-slate-950 dark:text-white">{item.target}</span>
                      </div>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 text-xs font-mono font-black text-slate-950 dark:text-white shrink-0 self-start sm:self-auto">
                      {item.protocol}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Dossier Bottom Action Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#162138] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold">
              Execute this comprehensive audit benchmark with dynamic vector PDF compilation:
            </span>
            <button
              type="button"
              onClick={handleTriggerDemo}
              disabled={loadingDemo}
              className="px-6 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-black text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md"
            >
              <span>{loadingDemo ? "Executing Pipeline..." : "Launch Live Audit Report →"}</span>
            </button>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 4. METHODOLOGY & 5-STAGE VERIFICATION PIPELINE                 */}
      {/* ============================================================== */}
      <section className="relative z-10 py-16 sm:py-24 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0d1424]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 font-extrabold mb-2.5">
              System Architecture
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
              The 5-Stage Verification Engine
            </h2>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-3 leading-relaxed">
              Deterministic code handles extraction, security, and schema enforcement; model inference is restricted to proposition synthesis and invariant comparison.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {methodologyStages.map((stage, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151e33] flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300 mb-2.5">
                    <span className="font-black text-amber-600 dark:text-amber-400">STAGE {stage.num}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border border-slate-300 dark:border-slate-700">
                      {stage.category.split(" ")[0]}
                    </span>
                  </div>
                  <h3 className={`text-sm font-heading font-black mb-2 ${isDark ? "text-white" : "text-slate-950"}`}>
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {stage.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
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
      <section className="relative z-10 py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 font-extrabold mb-2.5">
            Architectural Differentiation
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            Why Standard Generative Models Fail Serious Research
          </h2>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-3 leading-relaxed">
            Generative chat models are fundamentally engineered for fluency. When documents fail to answer a question, models fill voids with plausible speculation.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131b2e] overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-slate-700">
            
            {/* Generic Chatbot Flaws */}
            <div className="p-6 sm:p-8 space-y-4 bg-white dark:bg-[#131b2e]">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <h3 className="font-heading font-black text-base sm:text-lg text-slate-950 dark:text-white">
                  Conventional Generative Chatbot
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Optimized for conversational agreement. Compresses documents into fluent paragraphs while obscuring critical missing context.
              </p>
              
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-extrabold mt-0.5">✕</span>
                  <span>Fabricates plausible criteria when vital policies (e.g. renewal rules) are unaddressed in source text.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-extrabold mt-0.5">✕</span>
                  <span>Silently blends conflicting deadlines into a single hallucinated date without alerting the investigator.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-extrabold mt-0.5">✕</span>
                  <span>Ignores document publication dates and quotes superseded regulations as current truth.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-extrabold mt-0.5">✕</span>
                  <span>Zero formal negative-proof documentation or traceable verbatim citation indexes.</span>
                </li>
              </ul>
            </div>

            {/* Digital Dark Spot Platform */}
            <div className="p-6 sm:p-8 space-y-4 bg-amber-50/70 dark:bg-[#18233c]">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 className="font-heading font-black text-base sm:text-lg text-slate-950 dark:text-white">
                  Digital Dark Spot Verification System
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Deterministic cross-examination platform enforcing negative-proof constraints, chronological audits, and evidence tracing.
              </p>
              
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-black mt-0.5">✓</span>
                  <span>Explicitly isolates unaddressed questions as silent gaps (<b className="text-amber-600 dark:text-amber-400">Not found in sources reviewed</b>).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-black mt-0.5">✓</span>
                  <span>Confronts conflicting clauses side-by-side with exact quotations, timestamps, and reconciliation directives.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-black mt-0.5">✓</span>
                  <span>Audits academic and administrative cycles to flag superseded circulars and expired mandates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-black mt-0.5">✓</span>
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
      <section className="relative z-10 py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
        
        <div className="text-center mb-12">
          <div className="text-xs font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 font-extrabold mb-2.5">
            Governance & Operational FAQ
          </div>
          <h2 className={`text-3xl sm:text-4xl font-heading font-black tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
            Responsible Intelligence Architecture
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131b2e] overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className={`text-sm sm:text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-950"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180 text-amber-500" : ""
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className={`px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t border-slate-200 dark:border-slate-700 font-normal ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* ============================================================== */}
      {/* 7. EXECUTIVE CALL TO ACTION - 100% OPAQUE & BOLD               */}
      {/* ============================================================== */}
      <section className="relative z-10 py-20 border-t border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#111827]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight leading-tight ${
            isDark ? "text-white" : "text-slate-950"
          }`}>
            Eliminate blind spots before finalizing critical decisions.
          </h2>

          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
            Ingest multiple circulars, research papers, or vendor specifications to isolate silent omissions and contradictory claims in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate("research")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-black text-sm transition-all cursor-pointer shadow-lg shadow-amber-400/25 hover:scale-[1.02]"
            >
              Launch Research Workspace
            </button>
            <button
              type="button"
              onClick={handleTriggerDemo}
              disabled={loadingDemo}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl border-2 text-xs sm:text-sm font-heading font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-slate-900 border-slate-600 text-white hover:bg-slate-800"
                  : "bg-white border-slate-300 text-slate-950 hover:bg-slate-50 shadow-xs"
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
