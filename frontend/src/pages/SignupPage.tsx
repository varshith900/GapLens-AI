import React, { useState } from "react";
import { Compass, Mail, Lock, User, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { signupUser, loginUser } from "../services/firebase";
import type { UserProfile } from "../types";

interface SignupPageProps {
  onNavigate: (view: string) => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onAuthSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
      onNavigate("research");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    try {
      setLoading(true);
      const user = await loginUser("demo.researcher@digitaldarkspot.ai", "demo123456");
      onAuthSuccess(user);
      onNavigate("research");
    } catch {
      setError("Failed to initialize demo access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel-elevated border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Join Digital Dark Spot to save investigations and track verification tasks
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name or Department
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Rivera"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
          </div>

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
                placeholder="alex.rivera@institution.edu"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password (6+ characters)
            </label>
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
            <span>{loading ? "Registering..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-slate-950 text-slate-500">or bypass signup</span>
          </div>
        </div>

        <button
          onClick={handleDemoAccess}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Quick Access as Demo Researcher</span>
        </button>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already registered?{" "}
          <button
            onClick={() => onNavigate("login")}
            className="text-amber-400 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
