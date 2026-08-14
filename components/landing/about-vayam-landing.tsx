"use client";

/**
 * components/landing/about-vayam-landing.tsx
 *
 * Visually stunning "About Vayam" Landing Page Component.
 * Seen by unauthenticated visitors first before signing in / signing up via Supabase.
 * Matching Vayam's rich aesthetics (paper warmth, saffron/emerald badges, glassmorphism, micro-animations).
 */

import React from "react";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Sparkles,
  Compass,
  Bot,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Car,
  Vote,
  Tractor,
  Globe2,
  Lock,
  CheckCircle2,
  Layers,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export function AboutVayamLanding() {
  const { setAuthModalOpen, signInDemo } = useAuth();

  return (
    <div className="space-y-32 pb-32 select-none">
      {/* ── 1. Hero Section ── */}
      <section className="relative overflow-hidden p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-accent/20 via-card to-accent-subtle/40 border border-accent/30 shadow-xl space-y-8 text-center sm:text-left">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <img
            src="/assets/Vayam_Icon.png?v=2"
            alt="Vayam Icon Logo"
            className="h-12 w-auto object-contain dark:hidden"
          />
          <img
            src="/assets/Vayam_Text.png?v=2"
            alt="Vayam"
            className="h-8 w-auto object-contain dark:hidden"
          />
          <img
            src="/assets/Vayam_Dark_Icon.png?v=2"
            alt="Vayam Icon Dark"
            className="h-12 w-auto object-contain hidden dark:block"
          />
          <img
            src="/assets/Vayam_Dark_Text.png?v=2"
            alt="Vayam Dark"
            className="h-8 w-auto object-contain hidden dark:block"
          />
        </div>

        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
            Government shouldn't be complicated.
          </h1>
          <p className="text-h3 font-medium text-muted-foreground leading-relaxed">
            Vayam turns fragmented government gazettes and ministry portals into personalized civic guidance that makes sense for your age, education, state, and goals.
          </p>
        </div>

        {/* Primary Auth CTAs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="btn btn-primary px-8 py-4 rounded-2xl gap-3 text-body font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
          >
            <UserCheck size={20} />
            <span>Sign In / Create Account</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Key Highlights row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border-subtle/80">
          <div>
            <div className="text-h2 font-black text-accent">25+</div>
            <div className="text-caption text-muted-foreground font-medium">Verified Government Datasets</div>
          </div>
          <div>
            <div className="text-h2 font-black text-foreground">3 Languages</div>
            <div className="text-caption text-muted-foreground font-medium">English, Hindi & Marathi</div>
          </div>
          <div>
            <div className="text-h2 font-black text-success">100%</div>
            <div className="text-caption text-muted-foreground font-medium">Official Source Provenance</div>
          </div>
          <div>
            <div className="text-h2 font-black text-amber-500">Zero</div>
            <div className="text-caption text-muted-foreground font-medium">Hallucinated URLs or Fake Schemes</div>
          </div>
        </div>
      </section>

      {/* ── 2. What Vayam Is & Why It Matters ── */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="badge badge-accent font-bold text-caption uppercase tracking-wider">
            Problem & Solution
          </span>
          <h2 className="text-h1 font-extrabold text-foreground tracking-tight">
            Bridging the gap between Citizens and Government Opportunities
          </h2>
          <p className="text-body text-muted-foreground leading-relaxed">
            Every year, billions in scholarships, driving services, voter rights, and social benefits go unclaimed simply because citizens do not know what applies to them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-card border border-border-subtle space-y-4 shadow-sm hover:border-destructive/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center font-black text-h3">
              <span className="pt-[2px]">✕</span>
            </div>
            <h3 className="text-h3 font-bold text-foreground">The Current Reality</h3>
            <ul className="space-y-3 text-body-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Scattered across 100+ state and central government portals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Heavy legal jargon and ambiguous eligibility rules.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Third-party scam websites charging fees for free government forms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Lack of proactive notification before deadlines expire.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-card via-card to-accent/5 border border-accent/30 space-y-4 shadow-sm hover:border-accent/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center font-black text-h3">
              <span className="pt-[2px]">✓</span>
            </div>
            <h3 className="text-h3 font-bold text-foreground">The Vayam Approach</h3>
            <ul className="space-y-3 text-body-sm text-foreground font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                <span>Single unified database powered by Supabase PostgreSQL RLS.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                <span>Deterministic rule engine providing 100% explainable eligibility.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                <span>Verified official portal links with zero third-party agents.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                <span>Personalized NOW / NEXT / LATER life stage recommendation engine.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 3. Core Feature Pillars ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-h1 font-extrabold text-foreground">Explore What Vayam Covers</h2>
          <p className="text-body-sm text-muted-foreground">
            From higher education scholarships to motor vehicle licensing and farmer income support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-3 hover:border-accent/40 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-h4 font-bold text-foreground">Education & Scholarships</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">
              PM-USP Central Sector Scholarships, NMMSS Merit Schemes, and Post-Matric aid mapped directly to your academic progress and family income.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-3 hover:border-accent/40 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 flex items-center justify-center">
              <Car size={24} />
            </div>
            <h3 className="text-h4 font-bold text-foreground">RTO & Parivahan Services</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">
              Learner licence applications, permanent driving licence prerequisites, medical fitness criteria, and Parivahan portal guidance.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-3 hover:border-accent/40 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Vote size={24} />
            </div>
            <h3 className="text-h4 font-bold text-foreground">Citizen Rights & Voter Registration</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">
              Election Commission of India Form 6 registration, voter ID eligibility at age 18, and electoral roll verification.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-3 hover:border-accent/40 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-600 flex items-center justify-center">
              <Tractor size={24} />
            </div>
            <h3 className="text-h4 font-bold text-foreground">Agriculture & Kisan Benefits</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">
              PM-KISAN Samman Nidhi Rs 6,000 yearly income support, e-KYC guidelines, and landholding farmer eligibility rules.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-3 hover:border-accent/40 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
              <Bot size={24} />
            </div>
            <h3 className="text-h4 font-bold text-foreground">Conversational AI Assistant</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">
              Ask Vayam anything in natural language. Powered by strict grounded data retrieval to ensure zero hallucinations or fake URLs.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-3 hover:border-accent/40 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center">
              <Globe2 size={24} />
            </div>
            <h3 className="text-h4 font-bold text-foreground">Multilingual STT/TTS Voice</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">
              Native support for English, Hindi, and Marathi with voice speech recognition and audio readout for all citizens.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. 4-Tier Architecture Overview ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-surface-secondary/70 border border-border-subtle space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-accent">
            <Layers size={14} /> Product Architecture
          </div>
          <h2 className="text-h1 font-extrabold text-foreground">The Vayam 4-Tier Civic Stack</h2>
          <p className="text-body-sm text-muted-foreground">
            Engineered for high reliability, zero hallucination, and PostgreSQL security.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-card border border-border-subtle space-y-3">
            <div className="w-8 h-8 rounded-xl bg-accent text-accent-foreground font-black text-body-sm flex items-center justify-center">
              1
            </div>
            <h4 className="text-h4 font-bold text-foreground">Civic Intelligence Core</h4>
            <p className="text-caption text-muted-foreground leading-relaxed">
              Deterministic rule evaluation calculating exact age, life stage, education eligibility, and missing fields.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border-subtle space-y-3">
            <div className="w-8 h-8 rounded-xl bg-accent text-accent-foreground font-black text-body-sm flex items-center justify-center">
              2
            </div>
            <h4 className="text-h4 font-bold text-foreground">Verified Knowledge Engine</h4>
            <p className="text-caption text-muted-foreground leading-relaxed">
              Supabase PostgreSQL database storing verified government sources, metadata JSONB, and eligibility rules.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border-subtle space-y-3">
            <div className="w-8 h-8 rounded-xl bg-accent text-accent-foreground font-black text-body-sm flex items-center justify-center">
              3
            </div>
            <h4 className="text-h4 font-bold text-foreground">Grounded AI Layer</h4>
            <p className="text-caption text-muted-foreground leading-relaxed">
              RAG-based AI assistant referencing ONLY verified knowledge items and source tables without web inventions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border-subtle space-y-3">
            <div className="w-8 h-8 rounded-xl bg-accent text-accent-foreground font-black text-body-sm flex items-center justify-center">
              4
            </div>
            <h4 className="text-h4 font-bold text-foreground">Voice & Accessibility</h4>
            <p className="text-caption text-muted-foreground leading-relaxed">
              Browser Web Speech API integration supporting hands-free voice search and audio playback in local Indian languages.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Data Provenance & Trust ── */}
      <section className="p-8 rounded-3xl bg-card border border-border-subtle space-y-6 text-center max-w-3xl mx-auto shadow-md">
        <div className="w-14 h-14 rounded-2xl bg-success/15 text-success flex items-center justify-center mx-auto">
          <ShieldCheck size={28} />
        </div>
        <div className="space-y-2">
          <h3 className="text-h2 font-bold text-foreground">Official Source Provenance Guaranteed</h3>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Vayam does not issue certificates or store sensitive financial credentials. We connect you directly to official government portals (`voters.eci.gov.in`, `scholarships.gov.in`, `sarathi.parivahan.gov.in`, `pmkisan.gov.in`).
          </p>
        </div>
        <div>
          <Link
            href="/dev-sources"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm font-bold gap-2 hover:btn-primary"
          >
            <FileCheck2 size={16} />
            <span className="pt-[2px]">Inspect Verified Source Registry</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </section>

      {/* ── 6. Bottom Sign In Callout ── */}
      <section className="p-10 rounded-3xl bg-gradient-to-r from-accent/20 via-card to-accent-subtle/30 border border-accent/40 text-center space-y-6 shadow-lg">
        <h2 className="text-h1 font-black text-foreground">Ready to discover what you are eligible for?</h2>
        <p className="text-body text-muted-foreground max-w-xl mx-auto">
          Sign in or create an account in less than 30 seconds to get your personalized civic timeline.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="btn btn-primary px-8 py-4 rounded-2xl font-bold gap-2 text-body shadow-md cursor-pointer"
          >
            <span className="pt-[2px]">Sign In / Register Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
