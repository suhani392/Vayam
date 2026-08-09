"use client";

/**
 * components/schemes/scheme-meta.tsx
 *
 * SchemeMeta component for displaying scheme metadata (level, state, department, authority).
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Landmark, Building2, MapPin } from "lucide-react";
import type { SchemeLevel } from "@/types/schemes";

export interface SchemeMetaProps {
  level: SchemeLevel;
  department: string;
  stateCode?: string;
  authorityName?: string;
  className?: string;
}

export function SchemeMeta({
  level,
  department,
  stateCode,
  authorityName,
  className,
}: SchemeMetaProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-surface-secondary border border-border-subtle text-caption",
        className
      )}
    >
      <div>
        <span className="text-muted-foreground block font-medium">Scheme Scope</span>
        <span className="text-foreground font-bold capitalize flex items-center gap-1 mt-0.5">
          <Landmark size={12} className="text-accent" />
          {level} Government
        </span>
      </div>

      <div>
        <span className="text-muted-foreground block font-medium">Department</span>
        <span className="text-foreground font-semibold flex items-center gap-1 mt-0.5 truncate">
          <Building2 size={12} className="text-accent-blue" />
          {department}
        </span>
      </div>

      {stateCode && (
        <div>
          <span className="text-muted-foreground block font-medium">Applicable State</span>
          <span className="text-foreground font-semibold flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="text-accent-purple" />
            {stateCode}
          </span>
        </div>
      )}
    </div>
  );
}
