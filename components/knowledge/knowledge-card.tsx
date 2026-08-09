"use client";

/**
 * components/knowledge/knowledge-card.tsx
 *
 * Reusable Knowledge Card component for Vayam Explore & Discovery experience.
 * Displays title, short description, category, type, authority,
 * personalized relevance score, Phase 5 rule-based "Why you're seeing this" explanations,
 * eligibility status badge, and Phase 6B verification status.
 *
 * Uses existing Vayam visual design, accessibility standards, and color tokens.
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Badge, StatusBadge, CategoryBadge, SourceBadge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Building2, CheckCircle2, AlertCircle, HelpCircle, Info } from "lucide-react";
import type { KnowledgeRecord } from "@/lib/knowledge/types";
import type { Recommendation } from "@/lib/core/types";
import { getSourceDisplayMetadata } from "@/lib/knowledge/source/validator";

export interface KnowledgeCardProps {
  record: KnowledgeRecord;
  personalized?: Recommendation | null;
  className?: string;
}

export function KnowledgeCard({ record, personalized, className }: KnowledgeCardProps) {
  const displaySource = getSourceDisplayMetadata(record);

  // Eligibility Status mapping from Phase 5 Core
  const eligStatus = personalized?.eligibility.status;

  const mapEligibilityStatus = (status?: string) => {
    switch (status) {
      case "LIKELY_ELIGIBLE":
        return { label: "✓ Likely Eligible", variant: "success" as const };
      case "MAYBE_ELIGIBLE":
        return { label: "May Be Eligible", variant: "warning" as const };
      case "NOT_YET":
        return { label: "Approaching Milestone", variant: "info" as const };
      case "UNKNOWN":
      case "REQUIRES_VERIFICATION":
        return { label: "Requires Verification", variant: "maybe" as const };
      case "NOT_ELIGIBLE":
        return { label: "Not Eligible", variant: "destructive" as const };
      default:
        return null;
    }
  };

  const eligBadge = mapEligibilityStatus(eligStatus);
  const relevancePct = personalized ? Math.round(personalized.score * 100) : null;
  const ruleReasons = personalized?.relevance.reasons || [];

  return (
    <div
      className={cn(
        "card card-interactive p-5 flex flex-col justify-between space-y-4 rounded-2xl border transition-all duration-200 hover:border-accent/50",
        personalized ? "border-accent/30 bg-card/90 shadow-sm" : "border-border-subtle bg-card",
        className
      )}
    >
      {/* ── Top Header Badge Row ── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CategoryBadge category={record.category} />
            <span className="badge badge-muted text-[10px] uppercase font-bold tracking-wider">
              {(record.type || "SCHEME").replace(/_/g, " ")}
            </span>
          </div>

          <SourceBadge
            verificationStatus={displaySource.isDemo ? "DEMO" : displaySource.isVerified ? "VERIFIED" : "UNVERIFIED"}
            sourceName={displaySource.label}
          />
        </div>

        {/* ── Personalized Tag & Score ── */}
        {personalized && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent-subtle/40 border border-accent/20 text-caption font-semibold text-accent">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles size={13} className="animate-pulse" />
              Relevant for you
            </span>
            <span className="font-mono font-extrabold text-body-sm">{relevancePct}% Match</span>
          </div>
        )}

        {/* ── Card Title & Description ── */}
        <div>
          <h3 className="text-h4 font-bold text-foreground leading-snug line-clamp-2">
            {record.title}
          </h3>
          <p className="text-body-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
            {record.shortDescription}
          </p>
        </div>
      </div>

      {/* ── Rule Reasons ("Why you're seeing this") ── */}
      {personalized && ruleReasons.length > 0 && (
        <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border-subtle space-y-1 text-[11px]">
          <span className="font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
            <Info size={11} className="text-accent" /> Why you're seeing this:
          </span>
          <p className="text-foreground leading-snug font-medium line-clamp-2">
            {ruleReasons.slice(0, 2).join(" • ")}
          </p>
        </div>
      )}

      {/* ── Footer Row: Authority & Action Button ── */}
      <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {eligBadge && (
            <span className={cn("badge text-[11px] font-bold px-2 py-0.5", `badge-${eligBadge.variant}`)}>
              {eligBadge.label}
            </span>
          )}
          {!eligBadge && record.authority && (
            <span className="text-caption text-muted-foreground font-medium flex items-center gap-1 truncate max-w-[150px]">
              <Building2 size={12} /> {record.authority.name}
            </span>
          )}
        </div>

        <Link
          href={`/explore/${record.id}`}
          className="btn btn-outline btn-xs gap-1 font-bold hover:btn-primary transition-all shrink-0"
        >
          View Details <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
