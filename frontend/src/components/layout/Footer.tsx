import React from "react";
import { Compass, ShieldCheck, Sparkles } from "lucide-react";

export const Footer: React.FC<{ onNavigate: (view: string) => void; theme?: "dark" | "light" }> = ({
  onNavigate,
  theme = "dark",
}) => {
  const isDark = theme === "dark";

  return (
    <footer
      className={`w-full border-t py-12 px-4 sm:px-6 lg:px-8 mt-auto transition-colors duration-300 ${
        isDark
          ? "border-slate-800/80 bg-[#07090e]/95 text-slate-400"
          : "border-slate-200 bg-white/95 text-slate-600 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <img src="/logo.png" alt="GapsLens AI Logo" className="w-full h-full object-cover" />
            </div>
            <span className={`font-black text-base font-heading ${isDark ? "text-white" : "text-slate-900"}`}>
              GapsLens AI
            </span>
          </div>
          <p className="text-xs leading-relaxed">
            The AI-assisted research intelligence platform that exposes blind spots, contradictory claims, and outdated data before you make high-stakes decisions.
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold pt-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Dark Spot Detection Platform</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-300" : "text-slate-800"}`}>
            Platform
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onNavigate("research")}
                className="hover:text-amber-500 transition-colors cursor-pointer"
              >
                Research Workspace
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("history")}
                className="hover:text-amber-500 transition-colors cursor-pointer"
              >
                Session History
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("landing")}
                className="hover:text-amber-500 transition-colors cursor-pointer"
              >
                How It Works
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("landing")}
                className="hover:text-amber-500 transition-colors cursor-pointer"
              >
                Core Capabilities
              </button>
            </li>
          </ul>
        </div>

        {/* Verification Engine */}
        <div>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-300" : "text-slate-800"}`}>
            Engine Highlights
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Evidence Traceability Guarantee</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
              <span>Cross-Source Conflict Compare</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Academic Cycle Freshness Audit</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Actionable Verification Checklists</span>
            </li>
          </ul>
        </div>

        {/* Ethical disclaimer */}
        <div>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-300" : "text-slate-800"}`}>
            Responsible AI Notice
          </h4>
          <div
            className={`p-3 rounded-2xl border text-[11px] leading-relaxed ${
              isDark
                ? "bg-slate-900/80 border-slate-800 text-slate-400"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <div className={`flex items-center gap-1.5 font-bold mb-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Evidence Grounding</span>
            </div>
            Findings are flagged as potential information gaps, possible conflicts, and verification leads. Information absent from reviewed documents does not mean it does not exist elsewhere.
          </div>
        </div>

      </div>

      <div className={`max-w-7xl mx-auto pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4 ${
        isDark ? "border-slate-800/80 text-slate-500" : "border-slate-200 text-slate-500"
      }`}>
        <p>© 2026 GapsLens AI - Digital Dark Spot. All rights reserved. Production Intelligence Platform.</p>
        <p className="flex items-center gap-2 font-mono text-[11px]">
          <span>Powered by Google Gemini & FastAPI</span>
          <span>•</span>
          <span>v1.0.0-production</span>
        </p>
      </div>
    </footer>
  );
};
