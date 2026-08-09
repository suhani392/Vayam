"use client";

/**
 * app/page.tsx
 *
 * Vayam Main Landing & Personalized Dashboard.
 * Phase 11 Hackathon Polish:
 * - Hero Statement: "Government shouldn't be complicated."
 * - Integrated Demo Profile Switcher for hackathon judges
 * - NOW / NEXT / LATER personalized recommendations using KnowledgeRecord repository
 * - Trust Section (Official sources remain final authority)
 * - Why Vayam / About Section (Problem, Solution, Technology)
 * - 100% Multilingual via useLanguage() t()
 */

import React, { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { DemoBar } from "@/components/civic/demo-bar";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { useLanguage } from "@/hooks/useLanguage";
import { getPersonalizedCivicState } from "@/lib/core/civic-state";
import { getPersonalizedKnowledge } from "@/lib/knowledge/search";
import { TEST_PROFILES } from "@/lib/core/data/test-profiles";
import type { UserProfile } from "@/lib/core/types";
import {
  Sparkles,
  Compass,
  Bot,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Globe2,
  FileCheck2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const [activeProfileKey, setActiveProfileKey] = useState<keyof typeof TEST_PROFILES>("profileB");
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(TEST_PROFILES.profileB);

  const civicState = getPersonalizedCivicState(currentProfile);
  const personalizedRecords = getPersonalizedKnowledge(currentProfile);

  const handleProfileSelect = (key: keyof typeof TEST_PROFILES, profile: UserProfile) => {
    setActiveProfileKey(key);
    setCurrentProfile(profile);
  };

  return (
    <PageContainer width="wide">
      <div className="space-y-10 pb-12">

        {/* ── Demo Profile Switcher for Judges ── */}
        <DemoBar
          activeProfileKey={activeProfileKey}
          onProfileSelect={handleProfileSelect}
        />

        {/* ── Hero Landing Banner ── */}
        <section className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-accent/15 via-card to-accent-subtle/30 border border-accent/30 shadow-md space-y-6">
          <div className="flex items-center gap-2">
            <span className="badge badge-saffron font-bold text-caption uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Vayam Civic Intelligence
            </span>
            <span className="badge badge-success text-[10px] uppercase font-semibold">Phase 11 Production Ready</span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-h1 font-black text-foreground tracking-tight leading-tight">
              Government shouldn't be complicated.
            </h1>
            <p className="text-h4 font-medium text-muted-foreground leading-relaxed">
              Vayam turns government information into personalized civic guidance that makes sense for you — across every stage of your life.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/explore"
              className="btn btn-primary px-6 py-3 rounded-xl gap-2 font-bold shadow-sm"
            >
              <Compass size={18} />
              <span>{t("home.exploreSchemes")}</span>
            </Link>

            <Link
              href="/assistant"
              className="btn btn-outline px-6 py-3 rounded-xl gap-2 font-bold shadow-xs hover:btn-primary"
            >
              <Bot size={18} />
              <span>{t("home.askAssistant")}</span>
            </Link>

            <Link
              href="/timeline"
              className="btn btn-ghost px-5 py-3 rounded-xl gap-2 font-semibold text-muted-foreground hover:text-foreground"
            >
              <Clock size={18} />
              <span>{t("home.viewTimeline")}</span>
            </Link>
          </div>
        </section>

        {/* ── Active Profile Context & Summary ── */}
        <section className="p-6 rounded-2xl bg-card border border-border-subtle space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-h3 font-bold text-foreground">{currentProfile.name}</h3>
                <span className="badge badge-accent">DOB: {currentProfile.dateOfBirth}</span>
                <span className="badge badge-muted font-mono">{civicState.lifeStage.stage.replace(/_/g, " ").toUpperCase()}</span>
              </div>
              <p className="text-body-sm text-muted-foreground mt-1">
                State: {currentProfile.location.stateName} · Education: {currentProfile.educationLevel} · Employment: {currentProfile.employmentStatus}
              </p>
            </div>

            <Link href="/profile" className="btn btn-outline btn-xs gap-1 font-bold">
              <span>{t("header.profile.viewProfile")}</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        {/* ── NOW / NEXT / LATER Personalized Insights ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h2 font-extrabold text-foreground">{t("home.recommended")}</h2>
              <p className="text-body-sm text-muted-foreground">
                Evaluated deterministically by Vayam's Civic Intelligence Core over verified government records
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Top Recommended Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedRecords.slice(0, 6).map((item) => (
                <KnowledgeCard
                  key={item.record.id}
                  record={item.record}
                  personalized={item.recommendation}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust & Official Provenance Section ── */}
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

        {/* ── Why Vayam / Product Architecture Section ── */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-h2 font-extrabold text-foreground">How Vayam Works</h2>
            <p className="text-body-sm text-muted-foreground">
              A 4-tier architecture connecting citizen profile with verified government facts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-h4 font-bold text-foreground">Civic Intelligence Core</h4>
              <p className="text-caption text-muted-foreground leading-relaxed">
                Deterministic rule engine calculating age, lifestage, and eligibility with 100% explainability.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-h4 font-bold text-foreground">Verified Knowledge</h4>
              <p className="text-caption text-muted-foreground leading-relaxed">
                25 official Indian government records with source provenance metadata and verification status.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-h4 font-bold text-foreground">Conversational AI Layer</h4>
              <p className="text-caption text-muted-foreground leading-relaxed">
                AI interface routing queries to Vayam tools without inventing schemes or hallucinating URLs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border-subtle space-y-2">
              <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="text-h4 font-bold text-foreground">Multilingual Voice</h4>
              <p className="text-caption text-muted-foreground leading-relaxed">
                English, Hindi, and Marathi support with Web Speech STT/TTS and natural code-mixed understanding.
              </p>
            </div>
          </div>
        </section>

      </div>
    </PageContainer>
  );
}
