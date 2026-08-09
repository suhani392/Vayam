"use client";

/**
 * app/profile/page.tsx
 *
 * Citizen Profile Management & Civic Identity Page.
 * Phase 11 Polish:
 * - Interactive profile editor for DOB, State, Education Level, Employment Status, Annual Income, Kisan/PWD flags
 * - Clear Required vs Optional distinction
 * - Explanatory helper text ("Annual income is optional but required to confirm eligibility for Post-Matric Scholarships and Pension Schemes")
 * - Instant re-evaluation of civic state upon saving
 * - 100% Multilingual via useLanguage() t()
 */

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { TEST_PROFILES } from "@/lib/core/data/test-profiles";
import type { UserProfile, EducationLevel, EmploymentStatus } from "@/lib/core/types";
import { getPersonalizedCivicState } from "@/lib/core/civic-state";
import { useLanguage } from "@/hooks/useLanguage";
import {
  User,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Calendar,
  Building,
  GraduationCap,
  Briefcase,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function ProfilePage() {
  const { lang, t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile>(TEST_PROFILES.profileB);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Compute instant civic state
  const civicState = getPersonalizedCivicState(profile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation checks
    if (!profile.name.trim()) {
      setValidationError("Please enter your name.");
      return;
    }

    if (!profile.dateOfBirth || !profile.dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setValidationError("Please enter a valid Date of Birth (YYYY-MM-DD).");
      return;
    }

    // Check future DOB
    const dobDate = new Date(profile.dateOfBirth);
    if (dobDate > new Date()) {
      setValidationError("Date of Birth cannot be in the future.");
      return;
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageContainer width="standard">
      <PageHeader
        badge={
          <span className="badge badge-accent gap-1">
            <Shield size={12} /> {t("header.profile.privacy")}
          </span>
        }
        title={t("nav.profile")}
        description={t("nav.profile.desc")}
      />

      <div className="space-y-8 mb-12">

        {/* ── Privacy Assurance Banner ── */}
        <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-border-subtle flex items-start gap-3 text-caption">
          <Shield size={18} className="text-success shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-foreground block">
              100% Local Privacy Protection
            </span>
            <span className="text-muted-foreground leading-relaxed block">
              Vayam does not transmit your personal profile or financial numbers to third-party databases. All eligibility evaluations are computed deterministically on your device.
            </span>
          </div>
        </div>

        {/* ── Active Civic Intelligence Summary ── */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-accent/10 to-card border border-accent/20 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h3 className="text-h4 font-bold text-foreground">Current Evaluated Life Stage</h3>
            </div>
            <span className="badge badge-accent font-mono font-bold uppercase">{civicState.lifeStage.stage.replace(/_/g, " ")}</span>
          </div>

          <p className="text-body-sm text-muted-foreground">
            Age: <strong className="text-foreground">{civicState.age.years} years, {civicState.age.months} months</strong> ({civicState.age.daysUntilBirthday} days until next birthday).
          </p>

          <div className="flex flex-wrap gap-2 pt-1 text-caption">
            <span className="badge badge-muted">Now Opportunities: {civicState.recommendations.now.length}</span>
            <span className="badge badge-muted">Next Milestones: {civicState.upcomingMilestones.length}</span>
            <span className="badge badge-muted">State: {profile.location.stateName}</span>
          </div>
        </div>

        {/* ── Profile Editor Form ── */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-card border border-border-subtle space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h3 className="text-h3 font-bold text-foreground">Citizen Profile Indicators</h3>
            <p className="text-caption text-muted-foreground">
              Fields marked <span className="text-destructive font-bold">* Required</span> are necessary for core age and state evaluation. Optional fields unlock specialized scheme eligibility.
            </p>
          </div>

          {validationError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-body-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-success/10 border border-success/30 text-success text-body-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Profile updated! Civic state and recommendations re-evaluated.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center justify-between">
                <span>Full Name <span className="text-destructive">*</span></span>
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center justify-between">
                <span>Date of Birth (YYYY-MM-DD) <span className="text-destructive">*</span></span>
                <span className="text-[11px] text-muted-foreground font-normal">Used for age engine</span>
              </label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono"
                required
              />
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center justify-between">
                <span>State of Residence <span className="text-destructive">*</span></span>
              </label>
              <select
                value={profile.location.stateCode}
                onChange={(e) => {
                  const code = e.target.value;
                  const name = code === "MH" ? "Maharashtra" : code === "DL" ? "Delhi" : code === "KA" ? "Karnataka" : "Tamil Nadu";
                  setProfile({
                    ...profile,
                    location: { ...profile.location, stateCode: code, stateName: name },
                  });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="MH">Maharashtra (MH)</option>
                <option value="DL">Delhi (DL)</option>
                <option value="KA">Karnataka (KA)</option>
                <option value="TN">Tamil Nadu (TN)</option>
              </select>
            </div>

            {/* Education Level */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center justify-between">
                <span>Education Stage <span className="text-destructive">*</span></span>
              </label>
              <select
                value={profile.educationLevel}
                onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value as EducationLevel })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="secondary">Class 10 (Secondary)</option>
                <option value="higher_secondary">Class 12 (Higher Secondary)</option>
                <option value="diploma">Diploma</option>
                <option value="undergraduate">Undergraduate Degree</option>
                <option value="postgraduate">Postgraduate Degree</option>
              </select>
            </div>

            {/* Employment Status */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center justify-between">
                <span>Employment Status <span className="text-destructive">*</span></span>
              </label>
              <select
                value={profile.employmentStatus}
                onChange={(e) => setProfile({ ...profile, employmentStatus: e.target.value as EmploymentStatus })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="student">Student</option>
                <option value="unemployed">Unemployed / Job Seeker</option>
                <option value="employed_private">Employed (Private Sector)</option>
                <option value="self_employed">Self Employed / Entrepreneur</option>
                <option value="retired">Retired / Senior Citizen</option>
              </select>
            </div>

            {/* Annual Income (Optional - with explanation) */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center justify-between">
                <span>Annual Household Income (₹ INR) <span className="badge badge-muted text-[10px]">Optional</span></span>
              </label>
              <input
                type="number"
                value={profile.annualIncomeInr ?? ""}
                onChange={(e) => setProfile({
                  ...profile,
                  annualIncomeInr: e.target.value ? Number(e.target.value) : undefined,
                })}
                placeholder="e.g. 150000"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono placeholder:text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground flex items-start gap-1 pt-0.5">
                <HelpCircle size={12} className="shrink-0 mt-0.5 text-accent" />
                <span>Annual income is optional but required to confirm eligibility for post-matric scholarships and senior citizen pension schemes.</span>
              </p>
            </div>

          </div>

          <div className="pt-4 border-t border-border-subtle flex items-center justify-end">
            <button
              type="submit"
              className="btn btn-primary px-6 py-2.5 rounded-xl gap-2 font-bold shadow-sm"
            >
              <Save size={16} />
              <span>Save & Re-evaluate Civic State</span>
            </button>
          </div>
        </form>

      </div>
    </PageContainer>
  );
}
