"use client";

/**
 * components/auth/auth-modal.tsx
 *
 * Tabbed Auth Dialog Modal for Supabase Authentication (Sign In & Sign Up).
 * Formatted with Vayam Design System styling (Saffron/Emerald accents, paper warmth, smooth animations).
 */

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, signIn, signUp, signInDemo, loading } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    setSubmitting(true);
    if (mode === "signin") {
      const res = await signIn(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to sign in. Please check credentials.");
      }
    } else {
      if (!fullName.trim()) {
        setErrorMsg("Please enter your full name.");
        setSubmitting(false);
        return;
      }
      const res = await signUp(email, password, fullName);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to create account.");
      }
    }
    setSubmitting(false);
  };

  const handleDemoLogin = () => {
    setErrorMsg(null);
    signInDemo();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-card rounded-3xl border border-border-subtle shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-secondary transition-colors"
          aria-label="Close auth modal"
        >
          <X size={20} />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2 pt-2">
          <h2 className="text-h2 font-extrabold text-foreground tracking-tight">
            {mode === "signin" ? "Welcome Back to Vayam" : "Create your Citizen Account"}
          </h2>
          <p className="text-caption text-muted-foreground max-w-xs mx-auto">
            {mode === "signin"
              ? "Sign in to access your personalized civic timeline, schemes, and rights."
              : "Register to connect your profile with verified Indian government intelligence."}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 bg-surface-secondary/70 rounded-2xl border border-border-subtle">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
            }}
            className={cn(
              "flex-1 py-2 text-body-sm font-bold rounded-xl transition-all flex items-center justify-center",
              mode === "signin"
                ? "bg-card text-foreground shadow-sm ring-1 ring-border-subtle"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-secondary/50"
            )}
          >
            <span className="pt-[4px]">Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            className={cn(
              "flex-1 py-2 text-body-sm font-bold rounded-xl transition-all flex items-center justify-center",
              mode === "signup"
                ? "bg-card text-foreground shadow-sm ring-1 ring-border-subtle"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-secondary/50"
            )}
          >
            <span className="pt-[4px]">Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-body-sm font-semibold flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center gap-1.5">
                <User size={14} className="text-accent" /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Citizen Name"
                required
                className="w-full px-4 py-3 rounded-2xl bg-surface-secondary/60 border border-border-subtle focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-body-sm text-foreground placeholder:text-muted-foreground transition-all"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-caption font-bold text-foreground flex items-center gap-1.5">
              <Mail size={14} className="text-accent" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@example.com"
              required
              className="w-full px-4 py-3 rounded-2xl bg-surface-secondary/60 border border-border-subtle focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-body-sm text-foreground placeholder:text-muted-foreground transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-bold text-foreground flex items-center gap-1.5">
              <Lock size={14} className="text-accent" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="citizen@123"
                required
                className="w-full px-4 py-3 pr-11 rounded-2xl bg-surface-secondary/60 border border-border-subtle focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-body-sm text-foreground placeholder:text-muted-foreground transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-accent text-accent-foreground font-bold text-body-sm flex items-center justify-center gap-2 shadow-md hover:bg-accent/90 disabled:opacity-50 transition-all mt-2 cursor-pointer"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2 pt-[4px]">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : mode === "signin" ? (
              <span className="flex items-center gap-2 pt-[4px]">
                <span>Sign In to Vayam</span>
                <ArrowRight size={16} />
              </span>
            ) : (
              <span className="flex items-center gap-2 pt-[4px]">
                <span>Complete Registration</span>
                <CheckCircle2 size={16} />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
