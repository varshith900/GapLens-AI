import React, { useState, useEffect } from "react";
import {
  Compass,
  FileSearch,
  History,
  Sparkles,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import type { UserProfile } from "../../types";
import { logoutUser } from "../../services/firebase";
import { checkHealth, loadDemoScenario } from "../../services/api";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  user: UserProfile | null;
  onAuthChange: (user: UserProfile | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onAuthChange,
}) => {
  const [isDark, setIsDark] = useState(true);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    checkHealth().then(setHealth).catch(() => {});
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    onAuthChange(null);
    onNavigate("landing");
  };

  const handleQuickDemo = async () => {
    try {
      setIsDemoLoading(true);
      const res = await loadDemoScenario();
      if (res && res.research_id) {
        onNavigate("results", res.research_id);
      }
    } catch (err) {
      console.error("Failed to load demo:", err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
            <Compass className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Digital Dark Spot
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AI Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Discover What's Missing in Your Information
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onNavigate("landing")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === "landing"
                ? "text-amber-400 bg-amber-500/10"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("research")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentView === "research"
                ? "text-amber-400 bg-amber-500/10"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <FileSearch className="w-4 h-4 text-amber-400" />
            Workspace
          </button>
          <button
            onClick={() => onNavigate("history")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentView === "history"
                ? "text-amber-400 bg-amber-500/10"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <History className="w-4 h-4 text-slate-400" />
            Research History
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleQuickDemo}
            disabled={isDemoLoading}
            title="Load the official Scholarship Gap & Contradiction Scenario"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/30 transition-all hover:scale-[1.02] shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {isDemoLoading ? "Analyzing Demo..." : "Test Hackathon Scenario"}
          </button>

          {health && (
            <div
              title={`Engine: ${health.engine_mode} | Storage: ${health.storage_mode}`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${health.gemini_active ? "bg-emerald-400" : "bg-amber-400"}`}></span>
              <span>{health.gemini_active ? "Gemini 2.5" : "Adaptive Engine"}</span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Toggle color theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold uppercase">
                  {user.displayName?.charAt(0) || "U"}
                </div>
                <span className="text-xs text-slate-200 font-medium max-w-[100px] truncate">
                  {user.displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate("login")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate("research")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20"
              >
                Start Research
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
