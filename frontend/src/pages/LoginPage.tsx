import React, { useState } from "react";
import { Compass, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { loginUser, resetPassword } from "../services/firebase";
import type { UserProfile } from "../types";

interface LoginPageProps {
  onNavigate: (view: string) => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      setLoading(true);
      const user = await loginUser(email, password);
      onAuthSuccess(user);
      onNavigate("research");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setLoading(true);
      const demoUser = await loginUser("demo.researcher@digitaldarkspot.ai", "demo123456");
      onAuthSuccess(demoUser);
      onNavigate("research");
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel-elevated border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Researcher Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your cross-source investigations and verification history
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@university.edu"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgot}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-slate-950 text-slate-500">or instant demo</span>
          </div>
        </div>

        <button
          onClick={handleDemoSignIn}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Continue as Demo Researcher (Instant Access)</span>
        </button>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => onNavigate("signup")}
            className="text-amber-400 font-semibold hover:underline"
          >
            Create Researcher Account
          </button>
        </p>
      </div>
    </div>
  );
};
