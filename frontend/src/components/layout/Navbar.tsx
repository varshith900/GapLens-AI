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
  ArrowRight,
  UserCheck
} from "lucide-react";
import type { UserProfile } from "../../types";
import { logoutUser } from "../../services/firebase";
import { checkHealth, loadDemoScenario } from "../../services/api";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  user: UserProfile | null;
  onAuthChange: (user: UserProfile | null) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onAuthChange,
  theme,
  onToggleTheme,
}) => {
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkHealth().then(setHealth).catch(() => {});
  }, []);

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

  const isDark = theme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 border-b ${
        isDark
          ? "bg-[#07090e]/85 border-slate-800/80 backdrop-blur-xl"
          : "bg-white/90 border-slate-200/90 backdrop-blur-xl shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand Logo & Tag */}
        <div 
          onClick={() => handleNavClick("landing")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-500 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-5 h-5 text-slate-950 transition-transform group-hover:rotate-45 duration-500" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-heading font-black text-base sm:text-lg tracking-tight transition-colors ${
                  isDark
                    ? "text-white group-hover:text-amber-400"
                    : "text-slate-900 group-hover:text-amber-600"
                }`}
              >
                Digital Dark Spot
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase leading-none hidden sm:block">
              AI Information Gap Detection
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl border transition-colors bg-opacity-70 dark:bg-slate-900/60 dark:border-slate-800 bg-slate-100 border-slate-200">
          <button
            onClick={() => handleNavClick("landing")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === "landing"
                ? isDark
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-white text-slate-950 shadow-xs border border-slate-200"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                : "text-slate-600 hover:text-slate-950 hover:bg-white"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick("research")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === "research"
                ? isDark
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-white text-slate-950 shadow-xs border border-slate-200"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                : "text-slate-600 hover:text-slate-950 hover:bg-white"
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => handleNavClick("history")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === "history"
                ? isDark
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-white text-slate-950 shadow-xs border border-slate-200"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                : "text-slate-600 hover:text-slate-950 hover:bg-white"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </nav>

        {/* Right Controls (Theme, Demo, Auth) */}
        <div className="hidden md:flex items-center gap-2.5">
          
          {/* Quick Demo Button */}
          <button
            onClick={handleQuickDemo}
            disabled={isDemoLoading}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              isDark
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "10s" }} />
            <span>{isDemoLoading ? "Analyzing..." : "Live Demo"}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? "bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800"
                : "bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-xs"
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Color Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Authentication State */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  isDark
                    ? "bg-slate-900/90 border-slate-800 text-slate-300"
                    : "bg-white border-slate-200 text-slate-700 shadow-xs"
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                  {user.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="max-w-[110px] truncate">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick("login")}
                className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick("research")}
                className="text-xs font-black px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/25 hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu & Theme Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? "bg-slate-900 border-slate-800 text-amber-300"
                : "bg-white border-slate-200 text-indigo-600 shadow-xs"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-300"
                : "bg-white border-slate-200 text-slate-700 shadow-xs"
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden animate-slide-down border-b px-4 pt-3 pb-6 space-y-4 ${
            isDark
              ? "bg-[#07090e]/95 border-slate-800 backdrop-blur-2xl text-slate-200"
              : "bg-white/95 border-slate-200 backdrop-blur-2xl text-slate-900 shadow-lg"
          }`}
        >
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavClick("landing")}
              className={`px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-colors ${
                currentView === "landing"
                  ? isDark
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                  : "hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              Home Overview
            </button>
            <button
              onClick={() => handleNavClick("research")}
              className={`px-4 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-colors ${
                currentView === "research"
                  ? isDark
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                  : "hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <FileSearch className="w-4 h-4 text-amber-500" />
              <span>Research Workspace</span>
            </button>
            <button
              onClick={() => handleNavClick("history")}
              className={`px-4 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-colors ${
                currentView === "history"
                  ? isDark
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                  : "hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Audit History</span>
            </button>
          </nav>

          <div className="pt-2">
            <button
              onClick={handleQuickDemo}
              disabled={isDemoLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-500 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isDemoLoading ? "Analyzing..." : "Run Scholarship Demonstration"}</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user.displayName}</p>
                    <p className="text-[10px] text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 bg-rose-500/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick("login")}
                  className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick("signup")}
                  className="py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs text-center shadow-sm"
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
