"use client";

/**
 * app/profile/page.tsx
 *
 * Citizen Profile Management & Civic Identity Page.
 * Interactive profile editor connected to Supabase profiles & user_preferences database tables.
 * Dynamically populated state options (36 States/UTs), Education stages, Employment status, DOB, and Income.
 */

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { EducationLevel, EmploymentStatus, UserProfile } from "@/lib/core/types";
import { getPersonalizedCivicState } from "@/lib/core/civic-state";
import { useLanguage } from "@/hooks/useLanguage";
import { ALL_INDIAN_STATES } from "@/lib/core/profile/normalization";
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
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function ProfilePage() {
  const { lang, t } = useLanguage();
  const {
    profile,
    loaded,
    saveProfile,
    setProfile,
    profileCompletion,
    profileHealth,
    hasValidProfile,
  } = useUserProfile();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!loaded || !profile) {
    return (
      <PageContainer width="standard">
        <div className="p-8 text-center text-body text-muted-foreground">Loading your profile...</div>
      </PageContainer>
    );
  }

  // Compute instant civic state when profile is valid
  const civicState = profile && profile.dateOfBirth && profile.location?.stateCode && profile.location?.stateName && profile.educationLevel && profile.employmentStatus
    ? getPersonalizedCivicState(profile as UserProfile)
    : null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!profile.name?.trim()) {
      setValidationError("Please enter your full name.");
      return;
    }

    if (!profile.dateOfBirth || !profile.dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setValidationError("Please enter a valid Date of Birth (YYYY-MM-DD).");
      return;
    }

    const dobDate = new Date(profile.dateOfBirth);
    if (dobDate > new Date()) {
      setValidationError("Date of Birth cannot be in the future.");
      return;
    }

    if (!profile.location?.stateCode) {
      setValidationError("Please select your State of Residence.");
      return;
    }

    if (!profile.educationLevel) {
      setValidationError("Please select your Education Stage.");
      return;
    }

    if (!profile.employmentStatus) {
      setValidationError("Please select your Employment Status.");
      return;
    }

    await saveProfile(profile);
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
              Supabase Database Protected
            </span>
            <span className="text-muted-foreground leading-relaxed block">
              Your profile information is stored securely in Supabase PostgreSQL (`profiles` table) with Row-Level Security (RLS) policies ensuring only you can view and edit your data.
            </span>
          </div>
        </div>

        {civicState ? (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-accent/10 to-card border border-accent/20 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-accent" />
                <h3 className="text-h4 font-bold text-foreground">Evaluated Life Stage</h3>
              </div>
              <span className="badge badge-accent font-mono font-bold uppercase">
                {civicState.lifeStage.stage.replace(/_/g, " ")}
              </span>
            </div>

            <p className="text-body-sm text-muted-foreground">
              Age: <strong className="text-foreground">{civicState.age.years} years, {civicState.age.months} months</strong> ({civicState.age.daysUntilBirthday} days until next birthday).
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-caption">
              <span className="badge badge-muted">Matched Opportunities: {civicState.recommendations.now.length}</span>
              <span className="badge badge-muted">State: {profile.location?.stateName || "Not set"}</span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle size={18} />
              <h3 className="text-h4 font-bold">Profile Incomplete ({profileCompletion.percent}%)</h3>
            </div>
            <p className="text-body-sm text-muted-foreground">
              Please complete all required fields below so Vayam can calculate your exact age, state eligibility, and civic rights.
            </p>
          </div>
        )}

        {/* ── Profile Editor Form ── */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-card border border-border-subtle space-y-6 shadow-xs">
          <div className="border-b border-border-subtle pb-4">
            <h3 className="text-h3 font-bold text-foreground">Citizen Profile Indicators</h3>
            <p className="text-caption text-muted-foreground">
              Fields marked <span className="text-destructive font-bold">* Required</span> are needed for age, state, education, and employment matching.
            </p>
          </div>

          {validationError && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-body-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-body-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Profile updated in Supabase database! Civic state re-evaluated.</span>
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
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Suhani Sharma"
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
                value={profile.dateOfBirth || ""}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono"
                required
              />
            </div>

            {/* State of Residence */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center justify-between">
                <span>State of Residence <span className="text-destructive">*</span></span>
              </label>
              <select
                value={profile.location?.stateCode || ""}
                onChange={(e) => {
                  const code = e.target.value;
                  const foundState = ALL_INDIAN_STATES.find((s) => s.code === code);
                  setProfile({
                    ...profile,
                    location: {
                      stateCode: code,
                      stateName: foundState?.name || "",
                      district: profile.location?.district ?? "",
                      residenceType: profile.location?.residenceType ?? "urban",
                    },
                  });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              >
                <option value="">-- Select State of Residence --</option>
                {ALL_INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Education Level */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center justify-between">
                <span>Education Stage <span className="text-destructive">*</span></span>
              </label>
              <select
                value={profile.educationLevel || ""}
                onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value as EducationLevel })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              >
                <option value="">-- Select Education Stage --</option>
                <option value="no_formal_education">No Formal Education</option>
                <option value="primary">Primary School (Up to Class 5)</option>
                <option value="middle">Middle School (Up to Class 8)</option>
                <option value="secondary">Class 10 (Secondary / SSC)</option>
                <option value="higher_secondary">Class 12 (Higher Secondary / HSC)</option>
                <option value="diploma">Diploma / Polytechnic</option>
                <option value="undergraduate">Undergraduate Degree (Bachelor's)</option>
                <option value="postgraduate">Postgraduate Degree (Master's)</option>
                <option value="doctorate">Doctorate / PhD</option>
              </select>
            </div>

            {/* Employment Status */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-foreground flex items-center justify-between">
                <span>Employment Status <span className="text-destructive">*</span></span>
              </label>
              <select
                value={profile.employmentStatus || ""}
                onChange={(e) => setProfile({ ...profile, employmentStatus: e.target.value as EmploymentStatus })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              >
                <option value="">-- Select Employment Status --</option>
                <option value="student">Student</option>
                <option value="unemployed">Unemployed / Job Seeker</option>
                <option value="employed_private">Employed (Private Sector)</option>
                <option value="employed_government">Employed (Government Sector)</option>
                <option value="self_employed">Self Employed / Entrepreneur</option>
                <option value="homemaker">Homemaker</option>
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
                placeholder="e.g. 250000"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono placeholder:text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground flex items-start gap-1 pt-0.5">
                <HelpCircle size={12} className="shrink-0 mt-0.5 text-accent" />
                <span>Income helps confirm eligibility for NSP post-matric scholarships and senior citizen pension schemes.</span>
              </p>
            </div>

          </div>

          <div className="pt-4 border-t border-border-subtle flex items-center justify-end">
            <button
              type="submit"
              className="btn btn-primary px-6 py-2.5 rounded-xl gap-2 font-bold shadow-sm"
            >
              <Save size={16} />
              <span>Save & Update Database</span>
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
