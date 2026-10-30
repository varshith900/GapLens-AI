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
  HelpCircle
} from "lucide-react";
import { loadDemoScenario } from "../services/api";

interface LandingPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [loadingDemo, setLoadingDemo] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Digital Dark Spot Intelligence Engine</span>
            <span className="w-1 h-1 rounded-full bg-amber-400"></span>
            <span className="text-slate-400 font-normal">Shinchan Online Hackathon 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Don't Just Find Information.{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Discover What's Missing.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Scatter-shot research leaves dangerous blind spots. Digital Dark Spot cross-examines multiple sources to surface <b>unanswered questions</b>, <b>conflicting claims</b>, and <b>outdated dates</b> before you make critical decisions.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNavigate("research")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2.5"
            >
              <span>Start Research Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleRunDemo}
              disabled={loadingDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-base border border-slate-700/80 transition-all flex items-center justify-center gap-2 hover:border-amber-500/40"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{loadingDemo ? "Analyzing Scholarship Demo..." : "Explore Scholarship Demo"}</span>
            </button>
          </div>

          {/* Interactive Feature Visualizer Mockup */}
          <div className="max-w-5xl mx-auto rounded-2xl glass-panel-elevated p-4 sm:p-6 text-left border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 text-xs font-mono text-slate-400">digital-dark-spot://audit-viewer</span>
              </div>
              <div className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Cross-Examining 4 Sources
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 relative">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Critical Information Gap</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1.5">Renewal CGPA Requirements</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  None of the 4 reviewed sources specify minimum academic scores needed to renew funding for subsequent years.
                </p>
                <div className="text-[11px] font-mono text-amber-300/90 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40">
                  Not found in the sources reviewed.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 relative">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Contradiction Detected</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1.5">Conflicting Portal Deadlines</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Source B dictates submission cutoff is <b>Nov 20</b>, while Archive Source C states deadline is <b>Nov 10</b>.
                </p>
                <div className="text-[11px] font-mono text-rose-300/90 bg-rose-950/40 px-2 py-1 rounded border border-rose-800/40">
                  Action: Verify with active 2025 gazette.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 relative">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Outdated Cycle Warning</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1.5">Superseded 2023-2024 Notice</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Source C references earlier INR 6L income cap from 2023 cycle; current 2025 guidelines raised cap to INR 8L.
                </p>
                <div className="text-[11px] font-mono text-indigo-300/90 bg-indigo-950/40 px-2 py-1 rounded border border-indigo-800/40">
                  Status: Potentially Outdated
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-2">Workflow Architecture</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How Digital Dark Spot Operates</h3>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              A 5-stage evidence extraction and cross-verification pipeline built to bridge probabilistic LLMs with deterministic rigor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                title: "Define Objective",
                desc: "Enter your research topic, core question, and category to establish the analytical frame.",
                icon: Search
              },
              {
                step: "02",
                title: "Collect Sources",
                desc: "Add multiple URLs. The engine validates SSRF security and cleans HTML boilerplate.",
                icon: Layers
              },
              {
                step: "03",
                title: "Claim Extraction",
                desc: "Extracts individual conditions, deadlines, criteria, and verbatim grounding snippets.",
                icon: FileText
              },
              {
                step: "04",
                title: "Cross-Compare",
                desc: "Compares claims to find discrepancies, date clashes, and silent omissions.",
                icon: AlertTriangle
              },
              {
                step: "05",
                title: "Verification Plan",
                desc: "Generates an actionable, prioritized checklist and downloadable executive report.",
                icon: CheckCircle2
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      STEP {item.step}
                    </span>
                    <item.icon className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-2">Core Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Why Ordinary Summarizers Fail</h3>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Ordinary chatbots compress text and hallucinate missing pieces. Digital Dark Spot highlights what is absent and conflicting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Information Gap Detection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates your core objective against retrieved claims. Identifies unanswered questions and explicitly notes: <i>"Not found in the sources reviewed."</i>
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Contradiction Detection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flags factual discrepancies between different documents (e.g. differing deadlines or conflicting physical vs digital document mandates).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Outdated Information Warnings</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                4-tier classification: Potentially Outdated, Date Unavailable, Current Cycle Not Confirmed, and Clean, guarding against superseded policies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Prioritized Verification Checklist</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dynamic, interactive checklist showing exactly what needs verification, why it matters, suggested authoritative bodies, and progress tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Verbatim Evidence Traceability</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero hallucinated citations. Every claim links to original URLs and quotes extracted text so you can inspect evidence firsthand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Executive PDF Export</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-click downloadable research intelligence dossier formatted with executive summaries, conflict callouts, and verification tables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Use Case Scenario */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">Example Live Demonstration</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                Government Scholarship Application Audit
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                A student is applying for a competitive scholarship and reviews 4 websites. Source A lists eligibility criteria, Source B demands physical in-person caste verification before Nov 20, Source C states physical submission is waived before Nov 10 (from 2023), and Source D fails to explain renewal grade cutoffs.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleRunDemo}
                  disabled={loadingDemo}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loadingDemo ? "Analyzing..." : "Run This Exact Scenario Now"}</span>
                </button>
                <button
                  onClick={() => onNavigate("research")}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors"
                >
                  Create Custom Research
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
