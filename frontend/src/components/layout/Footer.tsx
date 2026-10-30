import React from "react";
import { Compass, ShieldCheck, Sparkles } from "lucide-react";

export const Footer: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">Digital Dark Spot</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The AI-assisted research intelligence platform that exposes blind spots, contradictory claims, and outdated data before you make high-stakes decisions.
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium pt-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Shinchan Online Hackathon 2026</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate("research")} className="hover:text-amber-400 transition-colors">
                Research Workspace
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("history")} className="hover:text-amber-400 transition-colors">
                Session History
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("landing")} className="hover:text-amber-400 transition-colors">
                How It Works
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("landing")} className="hover:text-amber-400 transition-colors">
                Core Capabilities
              </button>
            </li>
          </ul>
        </div>

        {/* Verification Engine */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Engine Highlights</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Evidence Traceability Guarantee</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Cross-Source Conflict Compare</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span>Academic Cycle Freshness Audit</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Actionable Verification Checklists</span>
            </li>
          </ul>
        </div>

        {/* Ethical disclaimer */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Responsible AI Notice</h4>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Evidence Grounding</span>
            </div>
            Findings are flagged as potential information gaps, possible conflicts, and verification leads. Information absent from reviewed documents does not mean it does not exist elsewhere.
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 Digital Dark Spot. Built for the Shinchan Online Hackathon 2026.</p>
        <p className="flex items-center gap-2">
          <span>Powered by Google Gemini & FastAPI</span>
          <span>•</span>
          <span className="text-slate-400 font-mono">v1.0.0-production</span>
        </p>
      </div>
    </footer>
  );
};
