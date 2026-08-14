"use client";

/**
 * components/knowledge/source-details.tsx
 *
 * Compact presentation component displaying source provenance metadata,
 * responsible authority, verification status, and safe official URL link.
 *
 * Uses existing Vayam visual design, color tokens, and icons.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { SourceBadge } from "@/components/ui/badge";
import { ShieldCheck, ExternalLink, Calendar, Building2, Globe, AlertTriangle } from "lucide-react";
import type { KnowledgeRecord } from "@/lib/knowledge/types";
import { getSourceDisplayMetadata } from "@/lib/knowledge/source/validator";

export interface SourceDetailsProps {
  record: KnowledgeRecord;
  className?: string;
}

export function SourceDetails({ record, className }: SourceDetailsProps) {
  const display = getSourceDisplayMetadata(record);

  return (
    <div
      className={cn(
        "p-6 rounded-3xl border bg-card/90 shadow-2xs space-y-5 text-body-sm transition-all duration-200",
        display.isDemo
          ? "border-warning/30 bg-warning/5"
          : display.isVerified
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-border-subtle",
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2 font-bold text-foreground text-body-sm">
          {display.isDemo ? (
            <AlertTriangle size={18} className="text-warning shrink-0" />
          ) : (
            <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
          )}
          <span>Source Provenance</span>
        </div>

        <SourceBadge
          verificationStatus={
            display.isDemo ? "DEMO" : display.isVerified ? "VERIFIED" : "UNVERIFIED"
          }
          sourceName={display.label}
        />
      </div>

      {/* Detail Attributes */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-border-subtle/50">
          <span className="text-caption font-semibold text-muted-foreground flex items-center gap-1.5 shrink-0 whitespace-nowrap pt-0.5">
            <Building2 size={14} className="text-accent shrink-0" /> Authority:
          </span>
          <span className="text-caption font-bold text-foreground text-right leading-snug">
            {record.authority?.name || "Official Government"}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 pb-3 border-b border-border-subtle/50">
          <span className="text-caption font-semibold text-muted-foreground flex items-center gap-1.5 shrink-0 whitespace-nowrap pt-0.5">
            <Globe size={14} className="text-accent shrink-0" /> Source Name:
          </span>
          <span className="text-caption font-bold text-foreground text-right leading-snug">
            {record.source?.name || "Government Portal"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <span className="text-caption font-semibold text-muted-foreground flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <Calendar size={14} className="text-accent shrink-0" /> Last Verified:
          </span>
          <span className="text-caption font-mono font-bold text-foreground">
            {display.lastVerified}
          </span>
        </div>
      </div>

      {/* Official URL Link */}
      {display.officialUrl && (
        <div className="pt-3 border-t border-border-subtle">
          <a
            href={display.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline w-full rounded-2xl py-2.5 px-4 font-bold text-foreground hover:text-foreground hover:bg-accent/15 border-accent/30 gap-2 transition-all flex items-center justify-center text-body-sm shadow-2xs"
          >
            <span>Visit Official Portal</span>
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
