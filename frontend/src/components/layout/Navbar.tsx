import React, { useState, useEffect } from "react";
import {
  Compass,
  FileSearch,
  History,
  Sparkles,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck,
  Zap,
  ArrowRight
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
    onNavigate("landing");
  };

  const handleQuickDemo = async () => {
    try {
      setIsDemoLoading(true);
      setMobileMenuOpen(false);
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

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#07090e]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => handleNavClick("landing")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/25 group-hover:scale-105 group-hover:shadow-amber-500/40 transition-all duration-300">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 transition-transform group-hover:rotate-45 duration-500" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-300 border-2 border-[#07090e]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
                Digital Dark Spot
              </span>
              <span className="hidden xs:inline-flex text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                AI Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              Discover What's Missing in Your Information
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-semibold">
          <button
            onClick={() => handleNavClick("landing")}
            className={`px-3.5 py-2 rounded-xl transition-all duration-200 ${
              currentView === "landing"
                ? "text-amber-400 bg-amber-500/10 shadow-sm shadow-amber-500/10"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("research")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              currentView === "research"
                ? "text-amber-400 bg-amber-500/10 shadow-sm shadow-amber-500/10"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <FileSearch className="w-4 h-4 text-amber-400" />
            <span>Workspace</span>
          </button>
          <button
            onClick={() => handleNavClick("history")}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              currentView === "history"
                ? "text-amber-400 bg-amber-500/10 shadow-sm shadow-amber-500/10"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>Audit Trail</span>
          </button>
        </nav>

        {/* Right Desktop Action Bar */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Quick Demo Button */}
          <button
            onClick={handleQuickDemo}
            disabled={isDemoLoading}
            title="Load the official Scholarship Gap & Contradiction Scenario"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-600/15 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/35 transition-all duration-200 hover:scale-[1.02] shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
            <span>{isDemoLoading ? "Analyzing Demo..." : "Test Hackathon Scenario"}</span>
          </button>

          {/* Engine Status Diagnostic Pill */}
          {health && (
            <div
              title={`Engine: ${health.engine_mode} | Storage: ${health.storage_mode}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono bg-slate-900/90 border border-slate-800 text-slate-400 select-none"
            >
              <span className={`w-2 h-2 rounded-full ${health.gemini_active ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
              <span>{health.gemini_active ? "Gemini 2.5 Active" : "Adaptive Engine"}</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
            title="Toggle color theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Auth State */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-800">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold uppercase">
                  {user.displayName?.charAt(0) || "U"}
                </div>
                <span className="text-xs text-slate-200 font-semibold max-w-[110px] truncate">
                  {user.displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors border border-transparent hover:border-slate-800"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => handleNavClick("login")}
                className="text-xs font-semibold px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick("research")}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] flex items-center gap-1.5"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-slide-down border-b border-slate-800 bg-[#07090e]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavClick("landing")}
              className={`px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors ${
                currentView === "landing"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              Home Overview
            </button>
            <button
              onClick={() => handleNavClick("research")}
              className={`px-4 py-3 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                currentView === "research"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <FileSearch className="w-4 h-4 text-amber-400" />
              <span>Research Workspace</span>
            </button>
            <button
              onClick={() => handleNavClick("history")}
              className={`px-4 py-3 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                currentView === "history"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Audit History</span>
            </button>
          </nav>

          {/* Quick Demo in Mobile Drawer */}
          <div className="pt-2">
            <button
              onClick={handleQuickDemo}
              disabled={isDemoLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isDemoLoading ? "Analyzing Demo..." : "Run Hackathon Scholarship Scenario"}</span>
            </button>
          </div>

          {/* Auth section in mobile drawer */}
          <div className="pt-3 border-t border-slate-800/80">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{user.displayName}</p>
                    <p className="text-[10px] text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick("login")}
                  className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick("signup")}
                  className="py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs text-center"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
};
