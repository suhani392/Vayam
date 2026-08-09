"use client";

/**
 * components/civic/official-source-badge.tsx
 *
 * OfficialSourceBadge visual trust indicator component for Vayam.
 * Displays source provenance metadata provided by the data layer.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Globe, Shield, ExternalLink } from "lucide-react";
import type { SourceProvenance } from "@/types/schemes";

export interface OfficialSourceBadgeProps {
  provenance?: SourceProvenance;
  sourceName?: string;
  department?: string;
  lastVerifiedDate?: string;
  officialUrl?: string;
  isVerified?: boolean;
  className?: string;
}

export function OfficialSourceBadge({
  provenance,
  sourceName,
  department,
  lastVerifiedDate,
  officialUrl,
  isVerified = true,
  className,
}: OfficialSourceBadgeProps) {
  const name = provenance?.sourceName || sourceName || "Government Portal";
  const dept = provenance?.department || department;
  const verifiedDate = provenance?.lastVerifiedDate || lastVerifiedDate;
  const url = provenance?.officialUrl || officialUrl;

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-2 p-2 rounded-xl bg-surface-secondary border border-border-subtle text-caption text-foreground",
        className
      )}
    >
      <span
        className={cn(
          "source-badge",
          isVerified ? "source-badge-verified" : "source-badge-official"
        )}
      >
        {isVerified ? <Shield size={10} /> : <Globe size={10} />}
        <span>{isVerified ? "Gazette Verified" : "Official Source"}</span>
      </span>

      <span className="font-semibold">{name}</span>

      {dept && (
        <span className="text-muted-foreground">· {dept}</span>
      )}

      {verifiedDate && (
        <span className="text-muted-foreground ml-auto font-mono text-[10px]">
          Verified {verifiedDate}
        </span>
      )}

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline inline-flex items-center gap-0.5 ml-1 font-medium"
        >
          <span>Link</span>
          <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}
