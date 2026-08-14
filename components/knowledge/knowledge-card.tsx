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
import { ArrowRight, Sparkles, Building2, CheckCircle2, XCircle, Clock, AlertCircle, HelpCircle, Info } from "lucide-react";
import type { KnowledgeRecord } from "@/lib/knowledge/types";
import type { Recommendation } from "@/lib/core/types";
import { getSourceDisplayMetadata } from "@/lib/knowledge/source/validator";

export interface KnowledgeCardProps {
  record: KnowledgeRecord;
  personalized?: Recommendation | null;
  className?: string;
  showWhyItMatters?: boolean;
}

export function KnowledgeCard({ record, personalized, className, showWhyItMatters = true }: KnowledgeCardProps) {
  const displaySource = getSourceDisplayMetadata(record);

  // Eligibility Status mapping from Phase 5 Core
  const eligStatus = personalized?.eligibility.status;

  const mapEligibilityStatus = (status?: string) => {
    switch (status) {
      case "LIKELY_ELIGIBLE":
        return {
          label: "Likely Eligible",
          icon: <CheckCircle2 size={12} />,
          className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "MAYBE_ELIGIBLE":
        return {
          label: "Eligible",
          icon: <CheckCircle2 size={12} />,
          className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "NOT_YET":
      case "APPROACHING":
        return {
          label: "Approaching",
          icon: <Clock size={12} />,
          className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "NOT_ELIGIBLE":
        return {
          label: "Not Eligible",
          icon: <XCircle size={12} />,
          className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
        };
      case "UNKNOWN":
      case "REQUIRES_VERIFICATION":
        return {
          label: "Requires Verification",
          icon: <AlertCircle size={12} />,
          className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
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
        "card card-interactive p-6 flex flex-col justify-between space-y-5 rounded-2xl border transition-all duration-200 hover:border-accent/50",
        personalized ? "border-accent/30 bg-card/90 shadow-sm" : "border-border-subtle bg-card",
        className
      )}
    >
      {/* ── Top Header Badge Row ── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
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

        {/* ── Card Title & Description ── */}
        <div className="space-y-2.5 pt-2">
          <h3 className="text-h4 font-bold text-foreground leading-snug line-clamp-2">
            {record.title}
          </h3>
          <p className="text-body-sm text-muted-foreground line-clamp-3 leading-relaxed pt-0.5">
            {record.shortDescription}
          </p>
        </div>
      </div>

      {/* ── Rule Reasons ("Why you're seeing this") ── */}
      {showWhyItMatters && personalized && ruleReasons.length > 0 && (
        <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border-subtle space-y-1.5 text-[11px] my-2">
          <span className="font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
            <Info size={11} className="text-accent" /> Why you're seeing this:
          </span>
          <p className="text-foreground leading-relaxed font-medium line-clamp-2">
            {ruleReasons.slice(0, 2).join(" • ")}
          </p>
        </div>
      )}

      {/* ── Footer Row: Authority & Action Button ── */}
      <div className="pt-4 mt-3 border-t border-border-subtle flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {eligBadge ? (
            <span className={cn("badge text-[11px] font-bold px-2.5 py-1 rounded-lg border inline-flex items-center gap-1.5", eligBadge.className)}>
              {eligBadge.icon}
              <span>{eligBadge.label}</span>
            </span>
          ) : record.authority ? (
            <span className="text-caption text-muted-foreground font-medium flex items-center gap-1.5 truncate max-w-[160px]">
              <Building2 size={13} /> {record.authority.name}
            </span>
          ) : null}
        </div>

        <Link
          href={`/explore/${record.id}`}
          className="btn btn-outline btn-xs gap-1.5 px-3 py-1.5 font-bold hover:btn-primary transition-all shrink-0"
        >
          View Details <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
