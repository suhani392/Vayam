"use client";

/**
 * app/page.tsx
 *
 * Vayam Main Root Page.
 * Flow:
 * 1. Unauthenticated visitors -> Renders <AboutVayamLanding /> first.
 * 2. Authenticated users -> Renders Personalized Civic Dashboard with actual user profile details.
 *    If profile details are missing, notifies user to complete their profile.
 */

import React from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { AboutVayamLanding } from "@/components/landing/about-vayam-landing";
import { useLanguage } from "@/hooks/useLanguage";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/components/auth/AuthContext";
import { getPersonalizedCivicState } from "@/lib/core/civic-state";
import { getPersonalizedKnowledge } from "@/lib/knowledge/search";
import type { UserProfile } from "@/lib/core/types";
import {
  Sparkles,
  Compass,
  Bot,
  Clock,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  LogOut,
  ExternalLink,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Mail,
  CheckCircle2,
  Edit3,
} from "lucide-react";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const { isAuthenticated, signOut, dbProfile, user } = useAuth();
  const {
    profile,
    loaded,
    profileCompletion,
    profileHealth,
    hasValidProfile,
  } = useUserProfile();

  // 1. Unauthenticated State: Show About Vayam landing page first!
  if (!isAuthenticated) {
    return (
      <PageContainer width="wide">
        <AboutVayamLanding />
      </PageContainer>
    );
  }

  // 2. Authenticated State: Use actual user profile details
  const currentProfile = profile as UserProfile;
  const civicState = profile && hasValidProfile ? getPersonalizedCivicState(currentProfile) : null;
  const personalizedRecords = profile && hasValidProfile ? getPersonalizedKnowledge(currentProfile) : [];

  const primaryProfileLabel =
    dbProfile?.full_name || profile?.name?.trim() || user?.email?.split("@")[0] || "Citizen Profile";

  // Calculate age from DOB if present
  let calculatedAgeStr = "Not provided";
  if (profile?.dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth)) {
    const dob = new Date(profile.dateOfBirth);
    const diffYears = new Date().getFullYear() - dob.getFullYear();
    calculatedAgeStr = `${profile.dateOfBirth} (${diffYears} years old)`;
  }

  return (
    <PageContainer width="wide">
      <div className="space-y-10 pb-12">
        {/* ── 1. Welcome Banner ── */}
        <section className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-accent/15 via-card to-accent-subtle/30 border border-accent/30 shadow-md space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-saffron font-bold text-caption uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} /> Authenticated Citizen Dashboard
              </span>
              <span className="badge badge-accent text-[10px] uppercase font-bold">
                Supabase Account Verified
              </span>
            </div>

            <button
              onClick={() => signOut()}
              className="btn btn-ghost btn-xs text-muted-foreground hover:text-destructive gap-1 font-semibold cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-h1 font-black text-foreground tracking-tight leading-tight">
              Namaste, {primaryProfileLabel}!
            </h1>
            <p className="text-h4 font-medium text-muted-foreground leading-relaxed">
              Vayam matches your verified profile details against Indian government knowledge records to deliver personalized scheme recommendations, RTO steps, and rights guidance.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/explore"
              className="btn btn-primary px-6 py-3 rounded-xl gap-2 font-bold shadow-sm"
            >
              <Compass size={18} />
              <span>{t("home.exploreSchemes")}</span>
            </Link>

            <Link
              href="/profile"
              className="btn btn-outline px-6 py-3 rounded-xl gap-2 font-bold shadow-xs hover:btn-primary"
            >
              <Edit3 size={18} />
              <span>Manage Profile Details</span>
            </Link>

            <Link
              href="/assistant"
              className="btn btn-ghost px-5 py-3 rounded-xl gap-2 font-semibold text-muted-foreground hover:text-foreground"
            >
              <Bot size={18} />
              <span>{t("home.askAssistant")}</span>
            </Link>
          </div>
        </section>

        {/* ── 2. Incomplete Profile Notification Banner (If Missing Required Details) ── */}
        {!hasValidProfile && (
          <section className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 space-y-4 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-h3 font-bold text-foreground">
                    Action Required: Complete Your Profile
                  </h3>
                  <span className="badge badge-amber font-mono font-bold text-caption">
                    {profileCompletion.percent}% Completed
                  </span>
                </div>
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  Vayam needs your actual Date of Birth, State of Residence, Education Stage, and Employment Status to accurately calculate your scheme eligibility, RTO licensing prerequisites, and civic rights.
                </p>

                {/* Missing Fields Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-caption font-bold text-foreground">Missing Details:</span>
                  {profileCompletion.missingFields.map((field) => (
                    <span
                      key={field}
                      className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 font-bold text-[12px]"
                    >
                      {field}
                    </span>
                  ))}
                </div>

                <div className="pt-3">
                  <Link
                    href="/profile"
                    className="btn btn-primary px-6 py-3 rounded-xl font-bold gap-2 shadow-sm inline-flex items-center"
                  >
                    <UserCheck size={18} />
                    <span>Complete Profile Now</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. Real Account Details Breakdown Card ── */}
        <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border-subtle space-y-6 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-border-subtle pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-h3 font-bold text-foreground">Your Registered Account Details</h3>
                {civicState ? (
                  <span className="badge badge-accent font-mono font-bold">
                    {civicState.lifeStage.stage.replace(/_/g, " ").toUpperCase()}
                  </span>
                ) : (
                  <span className="badge badge-warning text-[11px] font-bold">Incomplete Profile</span>
                )}
              </div>
              <p className="text-caption text-muted-foreground mt-1">
                Stored in Supabase database (`profiles` table). No hardcoded or dummy values.
              </p>
            </div>

            <Link href="/profile" className="btn btn-outline btn-xs font-bold gap-1">
              <Edit3 size={12} />
              <span>Edit Details</span>
            </Link>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Full Name */}
            <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground uppercase tracking-wider">
                <User size={14} className="text-accent" /> Full Name
              </div>
              <p className="text-body-sm font-bold text-foreground truncate">
                {dbProfile?.full_name || profile?.name || "Not set"}
              </p>
            </div>

            {/* Email */}
            <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground uppercase tracking-wider">
                <Mail size={14} className="text-accent" /> Email
              </div>
              <p className="text-body-sm font-bold text-foreground truncate">
                {user?.email || "Not set"}
              </p>
            </div>

            {/* Date of Birth */}
            <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground uppercase tracking-wider">
                <Calendar size={14} className="text-accent" /> Date of Birth
              </div>
              <p className="text-body-sm font-bold text-foreground truncate">
                {calculatedAgeStr}
              </p>
            </div>

            {/* State of Residence */}
            <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground uppercase tracking-wider">
                <MapPin size={14} className="text-accent" /> State of Residence
              </div>
              <p className="text-body-sm font-bold text-foreground truncate">
                {currentProfile.location?.stateName
                  ? `${currentProfile.location.stateName} (${currentProfile.location.stateCode})`
                  : "Not provided"}
              </p>
            </div>

            {/* Education Level */}
            <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground uppercase tracking-wider">
                <GraduationCap size={14} className="text-accent" /> Education Stage
              </div>
              <p className="text-body-sm font-bold text-foreground truncate capitalize">
                {currentProfile.educationLevel
                  ? currentProfile.educationLevel.replace(/_/g, " ")
                  : "Not provided"}
              </p>
            </div>

            {/* Employment Status */}
            <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground uppercase tracking-wider">
                <Briefcase size={14} className="text-accent" /> Employment Status
              </div>
              <p className="text-body-sm font-bold text-foreground truncate capitalize">
                {currentProfile.employmentStatus
                  ? currentProfile.employmentStatus.replace(/_/g, " ")
                  : "Not provided"}
              </p>
            </div>

            {/* Annual Income */}
            <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground uppercase tracking-wider">
                <IndianRupee size={14} className="text-accent" /> Annual Income
              </div>
              <p className="text-body-sm font-bold text-foreground truncate">
                {currentProfile.annualIncomeInr
                  ? `₹${currentProfile.annualIncomeInr.toLocaleString("en-IN")}`
                  : "Optional / Not set"}
              </p>
            </div>

            {/* Profile Completion */}
            <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-accent" /> Completion Score
              </div>
              <p className="text-body-sm font-bold text-accent">
                {profileCompletion.percent}% Complete
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. NOW / NEXT / LATER Personalized Recommendations ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-h2 font-extrabold text-foreground">{t("home.recommended")}</h2>
              <p className="text-body-sm text-muted-foreground max-w-2xl">
                {profile && hasValidProfile
                  ? "Based on your verified profile details, here are your top matched opportunities."
                  : "Complete your profile details above to calculate your exact scheme eligibility."}
              </p>
            </div>
            <Link href="/timeline" className="btn btn-outline btn-xs gap-1 font-bold">
              <Clock size={12} />
              <span>View Civic Timeline</span>
            </Link>
          </div>

          <div className="space-y-8">
            {profile && hasValidProfile ? (
              personalizedRecords.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {personalizedRecords.slice(0, 6).map((item) => (
                    <KnowledgeCard
                      key={item.record.id}
                      record={item.record}
                      personalized={item.recommendation}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-border-subtle bg-card p-8 text-center space-y-3">
                  <p className="text-body-sm text-muted-foreground">
                    We could not identify relevant recommendations yet based on your current filters.
                  </p>
                  <Link href="/profile" className="btn btn-primary btn-sm">
                    Update Profile Details
                  </Link>
                </div>
              )
            ) : (
              <div className="rounded-3xl border border-border-subtle bg-card p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h4 className="text-h4 font-bold text-foreground">Profile Information Needed</h4>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    Personalized scheme and right recommendations require your Date of Birth, State, Education Stage, and Employment details.
                  </p>
                </div>
                <Link href="/profile" className="btn btn-primary btn-sm font-bold gap-2">
                  <UserCheck size={16} />
                  <span>Fill Required Profile Details</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── 5. Data Provenance Trust Banner ── */}
        <section className="p-8 rounded-3xl bg-surface-secondary/60 border border-border-subtle space-y-4 text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-success/15 text-success flex items-center justify-center mx-auto">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-h3 font-bold text-foreground">Official Government Data Provenance</h3>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              Vayam does not replace official government portals. It helps citizens discover and understand relevant information. Official government gazettes and ministry portals remain the final authority.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dev-sources" className="btn btn-outline btn-xs font-bold gap-1">
              <span>Inspect Source Verification Panel</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
