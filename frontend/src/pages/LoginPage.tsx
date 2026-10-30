import React, { useState } from "react";
import { Compass, Mail, Lock, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";
import { loginUser, resetPassword, signInWithGoogle } from "../services/firebase";
import type { UserProfile } from "../types";

interface LoginPageProps {
  onNavigate: (view: string) => void;
  onAuthSuccess: (user: UserProfile) => void;
  theme?: "dark" | "light";
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onAuthSuccess, theme = "dark" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDomainUnauthorized, setIsDomainUnauthorized] = useState(false);

  const isDark = theme === "dark";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsDomainUnauthorized(false);
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      setLoading(true);
      const user = await loginUser(email, password);
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
        setError(err.message || "Google sign in was unsuccessful.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setLoading(true);
      const demoUser = await loginUser("senior.researcher@digitaldarkspot.ai", "demo123456");
      onAuthSuccess(demoUser);
    } catch {
      setError("Quick sign-in encountered an issue.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setError("Enter your email address above first to receive reset instructions.");
      return;
    }
    try {
      await resetPassword(email);
      setMessage("Password reset instructions dispatched to your email address.");
      setError("");
    } catch {
      setError("Could not process password reset request.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl glass-panel-elevated border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Left Side: Brand Value Proposition & Trust */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-amber-500/10 via-indigo-600/10 to-transparent flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold mb-6">
              <Compass className="w-4 h-4" />
              <span>Digital Dark Spot</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-heading font-black leading-tight text-slate-900 dark:text-white mb-3">
              Research with absolute certainty.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Expose hidden omissions, conflicting deadlines, and superseded rules before making high-stakes decisions.
            </p>

            <div className="space-y-3.5">
              {[
                "100% Verbatim Quote Grounding Guarantee",
                "Automated Cross-Source Contradiction Matrix",
                "Academic & Regulatory Cycle Freshness Auditor",
                "Exportable Executive Vector PDF Reports"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 text-[11px] text-slate-500 font-mono">
            Enterprise Security • Cloud Firestore Encrypted
          </div>
        </div>

        {/* Right Side: Auth Form with Google Sign In */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
              Researcher Sign In
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sign in to manage your investigations and persistent audit history.
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
                  onClick={handleDemoSignIn}
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

          {message && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs flex items-center gap-2 animate-fade-in font-medium">
              <span>{message}</span>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] shadow-xs cursor-pointer mb-5"
          >
            {/* Google G multi-color SVG icon */}
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
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[11px] font-mono uppercase text-slate-400">
              or sign in with email
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              <span>{loading ? "Signing in..." : "Sign In to Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Instant Access */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Demo Access (Bypass Registration)</span>
            </button>

            <p className="text-xs text-slate-500 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("signup")}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Create Researcher Account
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
