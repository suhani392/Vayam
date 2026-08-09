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
        "p-4 rounded-2xl border bg-card/90 shadow-xs space-y-3 text-body-sm transition-all duration-200",
        display.isDemo
          ? "border-warning/30 bg-warning/5"
          : display.isVerified
          ? "border-success/30 bg-success/5"
          : "border-border-subtle",
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
        <div className="flex items-center gap-1.5 font-bold text-foreground text-caption">
          {display.isDemo ? (
            <AlertTriangle size={14} className="text-warning" />
          ) : (
            <ShieldCheck size={14} className="text-success" />
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
      <div className="space-y-2 text-caption">
        <div className="flex items-start justify-between gap-2">
          <span className="text-muted-foreground flex items-center gap-1">
            <Building2 size={12} /> Authority:
          </span>
          <span className="font-semibold text-foreground text-right truncate max-w-[200px]">
            {record.authority?.name || "Official Government"}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <span className="text-muted-foreground flex items-center gap-1">
            <Globe size={12} /> Source Name:
          </span>
          <span className="font-semibold text-foreground text-right truncate max-w-[200px]">
            {record.source?.name || "Government Portal"}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar size={12} /> Last Verified:
          </span>
          <span className="font-mono font-bold text-foreground">
            {display.lastVerified}
          </span>
        </div>
      </div>

      {/* Official URL Link */}
      {display.officialUrl && (
        <div className="pt-2 border-t border-border-subtle flex justify-end">
          <a
            href={display.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-xs gap-1 font-bold text-accent hover:text-accent-hover"
          >
            Visit Official Portal <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
