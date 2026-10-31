import React, { useState } from "react";
import { Compass, Mail, Lock, User, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff, CheckCircle2, ExternalLink } from "lucide-react";
import { signupUser, loginUser, signInWithGoogle } from "../services/firebase";
import type { UserProfile } from "../types";

interface SignupPageProps {
  onNavigate: (view: string) => void;
  onAuthSuccess: (user: UserProfile) => void;
  theme?: "dark" | "light";
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onAuthSuccess, theme = "dark" }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDomainUnauthorized, setIsDomainUnauthorized] = useState(false);

  const isDark = theme === "dark";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsDomainUnauthorized(false);
    if (!email || !password || !name) {
      setError("Please complete all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const user = await signupUser(email, password, name);
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError("");
      setIsDomainUnauthorized(false);
      const user = await signInWithGoogle();
      onAuthSuccess(user);
    } catch (err: any) {
      if (err.code === "auth/unauthorized-domain") {
        setIsDomainUnauthorized(true);
      } else {
        setError(err.message || "Google registration was unsuccessful.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    try {
      setLoading(true);
      const user = await loginUser("senior.researcher@digitaldarkspot.ai", "demo123456");
      onAuthSuccess(user);
    } catch {
      setError("Failed to initialize demo access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl glass-panel-elevated border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Left Side: Features & Guarantee */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-amber-500/10 via-indigo-600/10 to-transparent flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold mb-6">
              <img src="/logo.png" alt="GapsLens AI" className="w-4 h-4 rounded object-cover" />
              <span>GapsLens AI - Digital Dark Spot</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-heading font-black leading-tight text-slate-900 dark:text-white mb-3">
              Start exposing critical research gaps.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Join scholars, policy analysts, healthcare professionals, and engineers detecting silent omissions in web data.
            </p>

            <div className="space-y-3.5">
              {[
                "Unlimited cross-source research sessions",
                "Instant cross-source contradiction isolation",
                "Automated 4-tier freshness classification",
                "Direct export to ReportLab vector PDFs"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 text-[11px] text-slate-500 font-mono">
            Compliant with Responsible AI Negative-Proof Verification
          </div>
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
              Create Researcher Account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Set up your profile to start auditing multi-source intelligence.
            </p>
          </div>

          {isDomainUnauthorized && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs space-y-2.5 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-500">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>One-Time Step: Authorize 'localhost' in Firebase Console</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Google Firebase projects require <code>localhost</code> to be explicitly listed under <b>Authorized domains</b> before Google OAuth popups can open.
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <p>1. Open Firebase Console settings below</p>
                <p>2. Scroll to <b>Authorized domains</b> → click <b>Add domain</b></p>
                <p>3. Enter <code>localhost</code> and click <b>Save</b></p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href="https://console.firebase.google.com/project/digital-dark-spot-ai/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Open Firebase Settings ↗</span>
                </a>
                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
                >
                  Continue in Demo Mode
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 animate-fade-in font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* GOOGLE SIGN UP BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] shadow-xs cursor-pointer mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign Up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[11px] font-mono uppercase text-slate-400">
              or register with email
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Alexis Vance"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@university.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-heading font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{loading ? "Creating Account..." : "Create Researcher Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={loading}
              className="w-full py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Continue as Demo Researcher (Instant Access)</span>
            </button>

            <p className="text-xs text-slate-500 mt-4">
              Already registered?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Sign In Instead
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
