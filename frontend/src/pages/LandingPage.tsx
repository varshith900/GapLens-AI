import React, { useState } from "react";
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
  Sliders
} from "lucide-react";
import { loadDemoScenario } from "../services/api";

interface LandingPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"gaps" | "conflicts" | "outdated">("gaps");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleRunDemo = async () => {
    try {
      setLoadingDemo(true);
      const res = await loadDemoScenario();
      if (res && res.research_id) {
        onNavigate("results", res.research_id);
      }
    } catch (e) {
      console.error(e);
      onNavigate("research");
    } finally {
      setLoadingDemo(false);
    }
  };

  const faqs = [
    {
      q: "How does Digital Dark Spot differ from an ordinary AI chatbot or search engine?",
      a: "Ordinary chatbots summarize provided text and frequently hallucinate missing facts to appear helpful. Digital Dark Spot does the opposite: it systematically identifies what information is missing, highlights factual contradictions between multiple websites, flags superseded academic cycles, and demands traceable evidence for every claim."
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
    <div className="flex flex-col min-h-screen bg-mesh-pattern">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 lg:pt-28 lg:pb-36">
        
        {/* Ambient background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[650px] h-[300px] bg-gradient-to-tr from-amber-500/15 via-amber-400/10 to-indigo-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-1/3 left-10 w-[200px] sm:w-[350px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-float"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900/90 border border-amber-500/35 text-amber-300 text-xs font-semibold mb-6 shadow-lg shadow-amber-500/10 hover:border-amber-400/60 transition-colors">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-heading tracking-wide">Digital Dark Spot Intelligence Platform</span>
            <span className="w-1 h-1 rounded-full bg-amber-400 hidden xs:inline-block"></span>
            <span className="text-slate-400 font-medium hidden xs:inline-block">Shinchan Online Hackathon 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12] mb-6">
            Don't Just Find Information.{" "}
            <span className="text-shimmer font-black">
              Discover What's Missing.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Scattered research leaves high-stakes blind spots. Digital Dark Spot cross-examines multiple sources together to pinpoint <b>silent omissions</b>, <b>conflicting instructions</b>, and <b>expired dates</b> before you make critical decisions.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-16 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => onNavigate("research")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Launch Research Workspace</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={handleRunDemo}
              disabled={loadingDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm sm:text-base border border-slate-700/80 transition-all duration-300 flex items-center justify-center gap-2 hover:border-amber-500/50 cursor-pointer shadow-lg hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "10s" }} />
              <span>{loadingDemo ? "Analyzing Scholarship Demo..." : "Explore Scholarship Demo"}</span>
            </button>
          </div>

          {/* Interactive Feature Visualizer Card */}
          <div className="max-w-5xl mx-auto rounded-3xl glass-panel-elevated p-4 sm:p-7 text-left border border-slate-800/90 shadow-2xl relative overflow-hidden card-hover-lift">
            
            {/* Window chrome header */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between border-b border-slate-800/80 pb-4 mb-6 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 text-xs font-mono text-slate-400">digital-dark-spot://audit-intelligence</span>
              </div>
              
              {/* Interactive preview tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <button
                  onClick={() => setActivePreviewTab("gaps")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    activePreviewTab === "gaps"
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Gaps
                </button>
                <button
                  onClick={() => setActivePreviewTab("conflicts")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    activePreviewTab === "conflicts"
                      ? "bg-rose-500 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Conflicts
                </button>
                <button
                  onClick={() => setActivePreviewTab("outdated")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    activePreviewTab === "outdated"
                      ? "bg-indigo-500 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Outdated
                </button>
              </div>
            </div>

            {/* Dynamic preview content based on active tab */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Missing Gap */}
              <div className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${
                activePreviewTab === "gaps"
                  ? "bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/30 scale-[1.01]"
                  : "bg-slate-900/60 border-slate-800/80"
              }`}>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Information Gap</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">Renewal Grade Cutoffs</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  None of the 4 reviewed scholarship portals document required CGPA thresholds needed to renew grant funding in subsequent academic years.
                </p>
                <div className="text-[11px] font-mono text-amber-300 bg-amber-950/40 px-2.5 py-1.5 rounded-lg border border-amber-800/40">
                  Not found in the sources reviewed.
                </div>
              </div>

              {/* Card 2: Contradiction */}
              <div className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${
                activePreviewTab === "conflicts"
                  ? "bg-rose-950/20 border-rose-500/50 ring-1 ring-rose-500/30 scale-[1.01]"
                  : "bg-slate-900/60 border-slate-800/80"
              }`}>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Contradiction Flagged</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">Conflicting Portal Deadlines</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Department circular specifies <b>November 20</b> deadline, while student archive lists deadline as <b>November 10</b>.
                </p>
                <div className="text-[11px] font-mono text-rose-300 bg-rose-950/40 px-2.5 py-1.5 rounded-lg border border-rose-800/40">
                  Action: Verify with 2025 gazette.
                </div>
              </div>

              {/* Card 3: Outdated */}
              <div className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${
                activePreviewTab === "outdated"
                  ? "bg-indigo-950/20 border-indigo-500/50 ring-1 ring-indigo-500/30 scale-[1.01]"
                  : "bg-slate-900/60 border-slate-800/80"
              }`}>
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Cycle Warning</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">Superseded 2023 Guidelines</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Source C references expired 2023 session income ceilings (INR 6 Lakhs); active guidelines have raised threshold to INR 8 Lakhs.
                </p>
                <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/40 px-2.5 py-1.5 rounded-lg border border-indigo-800/40">
                  Status: Potentially Outdated
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5-Step Workflow Section */}
      <section className="py-20 sm:py-28 bg-[#0a0e18]/80 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 font-heading">
              Methodological Rigor
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-2">
              How the 5-Stage Engine Operates
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              Separating concerns between deterministic Python web-extractors and probabilistic LLM reasoning eliminates compounding inaccuracies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                step: "01",
                title: "Define Objective",
                desc: "Enter your core question, target topic, and decision criteria to bind the analysis frame.",
                icon: Search
              },
              {
                step: "02",
                title: "Collect Sources",
                desc: "Submit URLs. The engine sanitizes HTML, protects against SSRF, and extracts clean text.",
                icon: Layers
              },
              {
                step: "03",
                title: "Claim Extraction",
                desc: "Extracts individual eligibility rules, deadlines, requirements, and verbatim snippets.",
                icon: FileText
              },
              {
                step: "04",
                title: "Cross-Comparison",
                desc: "Compares claims to isolate discrepancies, incompatible requirements, and omissions.",
                icon: AlertTriangle
              },
              {
                step: "05",
                title: "Verification Plan",
                desc: "Generates an actionable, prioritized checklist and downloadable executive report.",
                icon: CheckCircle2
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-amber-500/40 transition-all duration-300 card-hover-lift flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold text-amber-400 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25">
                      STEP {item.step}
                    </span>
                    <item.icon className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <h4 className="text-base font-heading font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 font-heading">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-2">
              Engineered for Evidence, Not Hype
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              Every feature provides actionable clarity so students, researchers, and professionals can make sound decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 rounded-3xl glass-panel border border-slate-800 hover:border-amber-500/35 transition-all card-hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white mb-2.5">Information Gap Detection</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Evaluates your objective against collected claims. Surfaces missing rules and explicitly frames them: <i>"Not found in the sources reviewed."</i>
              </p>
            </div>

            <div className="p-7 rounded-3xl glass-panel border border-slate-800 hover:border-rose-500/35 transition-all card-hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white mb-2.5">Contradiction Detection</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Flags factual discrepancies between different documents (e.g. differing deadlines or in-person vs digital document mandates).
              </p>
            </div>

            <div className="p-7 rounded-3xl glass-panel border border-slate-800 hover:border-cyan-500/35 transition-all card-hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white mb-2.5">Outdated Information Warnings</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                4-tier classification: Potentially Outdated, Date Unavailable, Current Cycle Not Confirmed, and Clean, guarding against stale scheme policies.
              </p>
            </div>

            <div className="p-7 rounded-3xl glass-panel border border-slate-800 hover:border-emerald-500/35 transition-all card-hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white mb-2.5">Prioritized Verification Checklist</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Dynamic, interactive checklist showing exactly what needs verification, why it matters, suggested authoritative bodies, and progress tracking.
              </p>
            </div>

            <div className="p-7 rounded-3xl glass-panel border border-slate-800 hover:border-indigo-500/35 transition-all card-hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white mb-2.5">Verbatim Evidence Traceability</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Zero hallucinated citations. Every claim links to original URLs and quotes extracted text so you can inspect evidence firsthand.
              </p>
            </div>

            <div className="p-7 rounded-3xl glass-panel border border-slate-800 hover:border-purple-500/35 transition-all card-hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white mb-2.5">Executive PDF Export</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                One-click downloadable research intelligence dossier formatted with executive summaries, conflict callouts, and verification tables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="py-20 sm:py-28 bg-[#0a0e18]/80 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 font-heading">
              Transparency & FAQ
            </span>
            <h3 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-2">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform duration-300 shrink-0 ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed animate-fade-in border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
