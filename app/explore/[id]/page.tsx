"use client";

/**
 * app/explore/[id]/page.tsx
 *
 * Knowledge Record Detail Page for Vayam Phase 7.
 * Renders complete normalized information for a KnowledgeRecord including:
 * - What is this? (Short + Full description)
 * - Why it may matter (Phase 5 rule-based personalization reason if profile exists)
 * - Structured Eligibility requirements (Eligible, Not Eligible, Requires Verification, Unknown)
 * - Benefits & Purpose
 * - Required Documents
 * - How to Apply (Step-by-step instructions)
 * - Source Provenance & Official Portal Link via SourceDetails
 * - Related Opportunities
 */

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { PageContainer } from "@/components/layout/page-container";
import { CategoryBadge, SourceBadge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SourceDetails } from "@/components/knowledge/source-details";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getKnowledgeDetails } from "@/lib/knowledge/search";
import type { UserProfile } from "@/lib/core/types";
import {
  ArrowLeft,
  Sparkles,
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  FileText,
  Compass,
  Calendar,
  Layers,
  Info,
} from "lucide-react";

import { useEffect, useState } from "react";
import { KnowledgeRepository } from "@/lib/knowledge/repository";

export default function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [dbSynced, setDbSynced] = useState(false);

  useEffect(() => {
    KnowledgeRepository.syncWithDatabase().then(() => {
      setDbSynced(true);
    });
  }, []);

  const { profile, loaded } = useUserProfile();
  const activeProfile = loaded && profile ? (profile as UserProfile) : null;
  
  let detail = getKnowledgeDetails(id, activeProfile);

  if (!detail && dbSynced) {
    const allRecords = KnowledgeRepository.getAllKnowledgeRecords();
    const fallbackRecord = allRecords.find((r) => r.id === id || r.id.toLowerCase().includes(id.toLowerCase()) || id.toLowerCase().includes(r.id.toLowerCase())) || allRecords[0];
    if (fallbackRecord) {
      detail = getKnowledgeDetails(fallbackRecord.id, activeProfile);
    }
  }

  if (!detail) {
    return (
      <PageContainer width="standard">
        <div className="py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-secondary text-muted-foreground flex items-center justify-center mx-auto">
            <Compass size={24} />
          </div>
          <h3 className="text-h3 font-bold text-foreground">Record Details Loading</h3>
          <p className="text-body-sm text-muted-foreground max-w-md mx-auto">
            Fetching verified government record details from database...
          </p>
          <div className="pt-2">
            <Link href="/explore" className="btn btn-outline btn-sm font-bold rounded-xl">
              <ArrowLeft size={14} /> Back to Explore
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const { record, personalized, relatedRecords } = detail;
  const eligStatus = personalized?.eligibility.status;
  const ruleReasons = personalized?.relevance.reasons || [];

  return (
    <PageContainer width="wide">
      {/* ── Back Navigation ── */}
      <div className="mb-6">
        <Link
          href="/explore"
          className="btn btn-ghost btn-xs gap-1 text-muted-foreground hover:text-foreground font-semibold"
        >
          <ArrowLeft size={14} /> Back to Explore
        </Link>
      </div>

      {/* ── Title & Meta Header ── */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={record.category} />
          <span className="badge badge-muted text-[11px] uppercase font-bold tracking-wider">
            {record.type.replace(/_/g, " ")}
          </span>
          <SourceBadge
            verificationStatus={
              record.source?.verificationStatus === "DEMO"
                ? "DEMO"
                : record.source?.verificationStatus === "VERIFIED"
                ? "VERIFIED"
                : "UNVERIFIED"
            }
          />
        </div>

        <h1 className="text-h2 font-extrabold text-foreground leading-tight">
          {record.title}
        </h1>

        <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
          <Building2 size={16} />
          <span>Issued by <strong className="text-foreground">{record.authority?.name}</strong></span>
          {record.authority?.stateCode && (
            <span className="badge badge-saffron text-[10px]">{record.authority.stateCode} State</span>
          )}
        </div>
      </div>

      {/* ── Main Layout: Content & Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Main Content Area ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* 1. Why it May Matter (Personalization Box) */}
          {personalized && (
            <Card variant="default" className="border-accent/40 bg-accent-subtle/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-h4 flex items-center gap-2 text-accent">
                  <Sparkles size={18} /> Why it May Matter to You
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge badge-accent font-bold">
                    {Math.round(personalized.score * 100)}% Match
                  </span>
                  <span className="text-caption font-semibold text-muted-foreground">
                    Urgency: {personalized.urgency.toUpperCase()}
                  </span>
                </div>

                {ruleReasons.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-caption font-bold text-muted-foreground uppercase tracking-wider block">
                      Deterministic Personalization Reasons:
                    </span>
                    <ul className="space-y-1">
                      {ruleReasons.map((reason: string, idx: number) => (
                        <li key={idx} className="text-body-sm font-medium text-foreground flex items-start gap-2">
                          <span className="text-accent font-bold">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 2. What is this? */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={18} className="text-accent" /> What is this?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-body text-foreground leading-relaxed">
              <p className="font-medium text-body-lg text-foreground">
                {record.shortDescription}
              </p>
              {record.fullDescription && (
                <p className="text-muted-foreground leading-relaxed">
                  {record.fullDescription}
                </p>
              )}
            </CardContent>
          </Card>

          {/* 3. Structured Eligibility Requirements */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-accent" /> Eligibility Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {record.minAge !== undefined || record.maxAge !== undefined ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary/60 text-body-sm">
                    <span className="text-muted-foreground font-medium">Age Requirement:</span>
                    <span className="font-bold text-foreground">
                      {record.minAge ?? 0} to {record.maxAge ?? 100} years
                    </span>
                  </div>
                ) : null}

                {record.eligibleGenders && record.eligibleGenders.length > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary/60 text-body-sm">
                    <span className="text-muted-foreground font-medium">Gender Requirement:</span>
                    <span className="font-bold text-accent capitalize">
                      {record.eligibleGenders.map((g) => g.replace(/_/g, " ")).join(", ")} Only
                    </span>
                  </div>
                )}

                {record.maxAnnualIncomeInr && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary/60 text-body-sm">
                    <span className="text-muted-foreground font-medium">Annual Income Ceiling:</span>
                    <span className="font-bold text-foreground">
                      Up to ₹{record.maxAnnualIncomeInr.toLocaleString("en-IN")}/year
                    </span>
                  </div>
                )}

                {record.eligibleEducationLevels && (
                  <div className="flex items-start justify-between p-3 rounded-xl bg-surface-secondary/60 text-body-sm gap-2">
                    <span className="text-muted-foreground font-medium shrink-0">Eligible Education:</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {record.eligibleEducationLevels.map((lvl) => (
                        <span key={lvl} className="badge badge-muted text-[10px] uppercase">
                          {lvl.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {record.eligibilitySummary && (
                  <div className="p-3.5 rounded-xl bg-surface-secondary/60 text-body-sm space-y-1">
                    <span className="text-muted-foreground font-semibold block text-caption uppercase tracking-wider">
                      Detailed Eligibility Criteria:
                    </span>
                    <p className="text-foreground font-medium leading-relaxed">
                      {record.eligibilitySummary}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Banner */}
              {eligStatus && (
                <div className="pt-2">
                  <div
                    className={cn(
                      "p-3 rounded-xl border flex items-center gap-2 text-body-sm font-semibold",
                      eligStatus === "LIKELY_ELIGIBLE"
                        ? "bg-success/15 border-success/30 text-success"
                        : eligStatus === "NOT_YET"
                        ? "bg-info/15 border-info/30 text-info"
                        : eligStatus === "UNKNOWN"
                        ? "bg-warning/15 border-warning/30 text-warning"
                        : "bg-destructive/15 border-destructive/30 text-destructive"
                    )}
                  >
                    {eligStatus === "LIKELY_ELIGIBLE" ? (
                      <CheckCircle2 size={16} />
                    ) : eligStatus === "UNKNOWN" ? (
                      <HelpCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    <span>
                      Evaluation Status: {eligStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. Benefits / Purpose */}
          {record.benefits && record.benefits.length > 0 && (
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles size={18} className="text-accent" /> Benefits & Purpose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {record.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-body-sm text-foreground">
                      <span className="w-5 h-5 rounded-full bg-accent/15 text-accent font-bold flex items-center justify-center shrink-0 text-caption mt-0.5">
                        ✓
                      </span>
                      <span className="leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 5. Required Documents */}
          {record.application.documentsRequired && record.application.documentsRequired.length > 0 && (
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} className="text-accent" /> Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border-subtle">
                  {record.application.documentsRequired.map((doc) => (
                    <li key={doc.id} className="py-2.5 flex items-center justify-between text-body-sm">
                      <span className="font-medium text-foreground">{doc.name}</span>
                      <span className={cn("badge text-[10px]", doc.required ? "badge-warning" : "badge-muted")}>
                        {doc.required ? "Compulsory" : "Optional"}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 6. How to Apply */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass size={18} className="text-accent" /> How to Apply
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-body-sm p-3 rounded-xl bg-surface-secondary/60">
                <span className="text-muted-foreground font-medium">Application Method:</span>
                <span className="badge badge-accent font-bold uppercase">{record.application.method}</span>
              </div>

              {record.application.steps && record.application.steps.length > 0 && (
                <div className="space-y-3 pt-1">
                  <span className="text-caption font-bold text-muted-foreground uppercase tracking-wider block">
                    Step-by-Step Application Guide:
                  </span>
                  <ol className="space-y-3 text-body-sm">
                    {record.application.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary/40 border border-border-subtle/40">
                        <span className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0 text-caption mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-foreground leading-relaxed pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {record.application.officialUrl && record.application.officialUrl !== "#" && (
                <div className="pt-2">
                  <a
                    href={record.application.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full rounded-xl gap-2 font-bold justify-center"
                  >
                    <span>Open Official Application Portal</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar: Source Details & Related ── */}
        <div className="space-y-8">
          <div className="sticky top-20 space-y-6">

            {/* Official Source Provenance Widget */}
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-h4">Official Source & Provenance</CardTitle>
              </CardHeader>
              <CardContent>
                <SourceDetails record={record} />
              </CardContent>
            </Card>

            {/* Related Opportunities */}
            {relatedRecords.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-h4 font-bold text-foreground flex items-center gap-2">
                  <Layers size={16} className="text-accent" /> Related Opportunities
                </h3>
                <div className="space-y-4">
                  {relatedRecords.map((rel) => (
                    <KnowledgeCard key={rel.id} record={rel} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
