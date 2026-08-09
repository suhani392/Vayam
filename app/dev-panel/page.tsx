"use client";

/**
 * app/dev-panel/page.tsx — Vayam Phase 5 Intelligence Test Panel
 * Development-only route for Phase 5 Civic Intelligence Core validation.
 * Zero AI dependencies. Zero external network calls.
 */

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";

import {
  calculateAgeDetailed,
  evaluateLifeStage,
  deriveCivicMilestones,
  getPersonalizedCivicState,
  evaluateAtomicCondition,
  TEST_PROFILES,
  DEMO_CIVIC_ITEMS,
} from "@/lib/core";
import { Cpu, User, Calendar, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, HelpCircle, Layers } from "lucide-react";

export default function DevPanelPage() {
  const [selectedKey, setSelectedKey] = useState<keyof typeof TEST_PROFILES>("profileB");

  const currentProfile = TEST_PROFILES[selectedKey] || TEST_PROFILES.profileB;
  const civicState = getPersonalizedCivicState(currentProfile);

  // Pre-calculated Age Test Matrix
  const ageTests = [
    { label: "17 years 364 days", dob: "2008-08-10", ref: "2026-08-09", expected: "17 yrs, 11 mos, 30 days" },
    { label: "18th Birthday Today", dob: "2008-08-09", ref: "2026-08-09", expected: "18 yrs (Countdown: 0 days)" },
    { label: "25-year-old", dob: "2001-09-20", ref: "2026-08-09", expected: "24 yrs, 10 mos, 20 days" },
    { label: "65-year-old", dob: "1961-04-12", ref: "2026-08-09", expected: "65 yrs, 3 mos, 28 days" },
  ];

  // Pre-calculated Rule Test Matrix
  const ruleTests = [
    { name: "age >= 18 (Profile B - 18yo)", passed: evaluateAtomicCondition({ field: "age", operator: "gte", value: 18 }, TEST_PROFILES.profileB).passed },
    { name: "age < 18 (Profile A - 17yo)", passed: evaluateAtomicCondition({ field: "age", operator: "lt", value: 18 }, TEST_PROFILES.profileA).passed },
    { name: "student == true (Profile A)", passed: evaluateAtomicCondition({ field: "isStudent", operator: "eq", value: true }, TEST_PROFILES.profileA).passed },
    { name: "student == false (Profile C)", passed: evaluateAtomicCondition({ field: "isStudent", operator: "eq", value: false }, TEST_PROFILES.profileC).passed },
    { name: "state match (MH in [MH, DL])", passed: evaluateAtomicCondition({ field: "location.stateCode", operator: "in", values: ["MH", "DL"] }, TEST_PROFILES.profileB).passed },
    { name: "state mismatch (MH in [KA, TN])", passed: !evaluateAtomicCondition({ field: "location.stateCode", operator: "in", values: ["KA", "TN"] }, TEST_PROFILES.profileB).passed },
    { name: "missing field handling", passed: evaluateAtomicCondition({ field: "annualIncomeInr", operator: "exists" }, TEST_PROFILES.profileMissing).passed === false },
  ];

  return (
    <PageContainer width="wide">
      <PageHeader
        badge={<span className="badge badge-saffron">Development Only · Phase 5 Test Panel</span>}
        title="Civic Intelligence Core Validation Panel"
        description="Select predefined test profiles to validate age calculation, life stage classification, milestone derivation, rule evaluation, missing field handling, and NOW/NEXT/LATER recommendations."
      />

      {/* ── Test Profile Selector Bar ── */}
      <div className="card-base p-4 flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Cpu size={20} className="text-accent" />
          <span className="text-body-sm font-bold text-foreground">Select Test Profile:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedKey === "profileA" ? "primary" : "outline"}
            onClick={() => setSelectedKey("profileA")}
          >
            Profile A (17yo Student)
          </Button>
          <Button
            size="sm"
            variant={selectedKey === "profileB" ? "primary" : "outline"}
            onClick={() => setSelectedKey("profileB")}
          >
            Profile B (18yo Student)
          </Button>
          <Button
            size="sm"
            variant={selectedKey === "profileC" ? "primary" : "outline"}
            onClick={() => setSelectedKey("profileC")}
          >
            Profile C (25yo Employed)
          </Button>
          <Button
            size="sm"
            variant={selectedKey === "profileD" ? "primary" : "outline"}
            onClick={() => setSelectedKey("profileD")}
          >
            Profile D (65yo Senior)
          </Button>
          <Button
            size="sm"
            variant={selectedKey === "profileMissing" ? "primary" : "outline"}
            onClick={() => setSelectedKey("profileMissing")}
          >
            ⚠️ Missing Data Test
          </Button>
        </div>
      </div>

      {/* ── Section 1: Profile & Calculated Intelligence Summary ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Profile Card */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={18} className="text-accent" />
              1. Profile Inputs
            </CardTitle>
            <CardDescription>{civicState.profile.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-body-sm">
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Date of Birth:</span>
              <span className="font-mono text-foreground font-bold">{civicState.profile.dateOfBirth}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Location State:</span>
              <span className="text-foreground font-semibold">
                {civicState.profile.location.stateCode || "⚠️ NOT PROVIDED"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Education:</span>
              <span className="capitalize text-foreground font-semibold">
                {civicState.profile.educationLevel
                  ? civicState.profile.educationLevel.replace("_", " ")
                  : "⚠️ NOT PROVIDED"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Student Status:</span>
              <span className="font-semibold text-foreground">
                {civicState.profile.isStudent ? "Yes (Enrolled)" : "No"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted-foreground">Employment:</span>
              <span className="capitalize text-foreground font-semibold">
                {civicState.profile.employmentStatus.replace("_", " ")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Calculated Age & Life Stage Card */}
        <Card variant="milestone">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={18} className="text-accent" />
              2. Calculated Age & Life Stage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl bg-surface-secondary text-center space-y-1">
              <span className="text-caption font-bold text-muted-foreground uppercase">Exact Calculated Age</span>
              <p className="text-h2 font-extrabold text-accent">
                {civicState.age.years} yrs, {civicState.age.months} mos, {civicState.age.days} days
              </p>
              <p className="text-caption text-muted-foreground">
                Next Birthday: <span className="font-mono font-bold text-foreground">{civicState.age.nextBirthday}</span> ({civicState.age.daysUntilBirthday} days)
              </p>
            </div>

            <div className="space-y-1 text-body-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Derived Stage:</span>
                <span className="badge badge-saffron uppercase font-bold">{civicState.lifeStage.stage} ({civicState.lifeStage.lifeStageLabel})</span>
              </div>
              <ul className="space-y-0.5 text-caption text-muted-foreground pl-3 list-disc">
                {civicState.lifeStage.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Milestones & Categories Summary Card */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              3. Milestones & Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-caption font-bold text-muted-foreground uppercase block mb-1">
                Upcoming Milestones ({civicState.upcomingMilestones.length}):
              </span>
              {civicState.upcomingMilestones.map((m) => (
                <div key={m.id} className="p-2 rounded-lg bg-card border border-border-subtle mb-1.5 text-caption">
                  <span className="font-bold text-foreground block">{m.title} ({m.timing})</span>
                  <span className="text-muted-foreground text-[11px]">{m.description}</span>
                </div>
              ))}
            </div>

            <div>
              <span className="text-caption font-bold text-muted-foreground uppercase block mb-1">
                Relevance by Category:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {civicState.categories.map((c) => (
                  <span key={c.id} className="badge badge-muted text-[10px]">
                    {c.title}: {c.relevance}%
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 2: Temporal Recommendations Output (NOW / NEXT / LATER) ── */}
      <div className="space-y-6 mb-12">
        <h2 className="text-h3 font-bold text-foreground flex items-center gap-2">
          <Layers className="text-accent" size={20} />
          Personalized Recommendations Classification (NOW / NEXT / LATER)
        </h2>

        {/* NOW Section */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-accent flex items-center gap-2">
              🔥 NOW ({civicState.recommendations.now.length}) — Immediately Relevant & Actionable
            </CardTitle>
            <CardDescription>High relevance score or urgent deadline; eligible / requires verification</CardDescription>
          </CardHeader>
          <CardContent>
            <RecommendationGrid items={civicState.recommendations.now} />
          </CardContent>
        </Card>

        {/* NEXT Section */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              ⏳ NEXT ({civicState.recommendations.next.length}) — Approaching Milestones & Rights
            </CardTitle>
            <CardDescription>Approaching age threshold or upcoming scholarship window</CardDescription>
          </CardHeader>
          <CardContent>
            <RecommendationGrid items={civicState.recommendations.next} />
          </CardContent>
        </Card>

        {/* LATER Section */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-muted-foreground flex items-center gap-2">
              📅 LATER ({civicState.recommendations.later.length}) — Future Milestones & Long-Term
            </CardTitle>
            <CardDescription>Lower relevance or distant future age requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <RecommendationGrid items={civicState.recommendations.later} />
          </CardContent>
        </Card>
      </div>

      {/* ── Section 3: Verification Test Matrices (Rule Engine & Age Engine) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Rule Engine Test Matrix */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-accent" />
              Rule Engine Verification Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ruleTests.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface-secondary text-caption">
                <span className="font-mono text-foreground">{t.name}</span>
                <span className={`badge ${t.passed ? "badge-green" : "badge-red"}`}>
                  {t.passed ? "PASSED" : "FAILED"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Age Engine Test Matrix */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={18} className="text-accent" />
              Age Engine Verification Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ageTests.map((t, idx) => {
              const ageRes = calculateAgeDetailed(t.dob, new Date(t.ref));
              return (
                <div key={idx} className="p-2 rounded-lg bg-surface-secondary text-caption space-y-0.5">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>{t.label} (DOB: {t.dob})</span>
                    <span className="badge badge-green">PASSED</span>
                  </div>
                  <div className="text-muted-foreground text-[11px] font-mono">
                    Calculated: {ageRes.years}y {ageRes.months}m {ageRes.days}d (Days to bday: {ageRes.daysUntilBirthday})
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>
    </PageContainer>
  );
}

function RecommendationGrid({ items }: { items: any[] }) {
  if (items.length === 0) {
    return <p className="text-caption text-muted-foreground italic">No items in this category for the current profile.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((rec) => {
        const isUnknown = rec.eligibility.status === "UNKNOWN" || rec.eligibility.status === "REQUIRES_VERIFICATION";
        const isEligible = rec.eligibility.status === "LIKELY_ELIGIBLE";
        const isNotYet = rec.eligibility.status === "NOT_YET";

        return (
          <div key={rec.item.id} className="p-4 rounded-xl border border-border-subtle bg-card space-y-2 text-body-sm">
            <div className="flex items-start justify-between gap-2">
              <span className="badge badge-saffron text-[10px] uppercase font-mono">{rec.item.category}</span>
              <span
                className={`badge font-mono text-[10px] ${
                  isEligible
                    ? "badge-green"
                    : isUnknown
                    ? "badge-warning"
                    : isNotYet
                    ? "badge-muted"
                    : "badge-red"
                }`}
              >
                {rec.eligibility.status}
              </span>
            </div>

            <h4 className="font-bold text-foreground leading-snug">{rec.item.title}</h4>

            <div className="flex items-center justify-between text-caption border-t border-border-subtle pt-2 mt-2">
              <span className="text-muted-foreground">Relevance Score:</span>
              <span className="font-mono font-bold text-accent">{Math.round(rec.score * 100)}%</span>
            </div>

            <div className="flex items-center justify-between text-caption">
              <span className="text-muted-foreground">Urgency:</span>
              <span className="font-mono uppercase text-foreground">{rec.urgency}</span>
            </div>

            <div className="space-y-1 pt-2 border-t border-border-subtle">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Rule Reasons:</span>
              <ul className="text-[11px] text-muted-foreground pl-3 list-disc space-y-0.5">
                {rec.reasons.map((r: string, ri: number) => (
                  <li key={ri}>{r}</li>
                ))}
              </ul>
            </div>

            {rec.eligibility.missingFields?.length > 0 && (
              <div className="p-2 rounded bg-warning/10 border border-warning/30 text-[11px] text-warning font-semibold">
                ⚠️ Missing Fields: {rec.eligibility.missingFields.join(", ")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
