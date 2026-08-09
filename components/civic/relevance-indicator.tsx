"use client";

/**
 * components/civic/relevance-indicator.tsx
 *
 * RelevanceIndicator component for Vayam.
 * Displays subtle qualitative relevance feedback ("Highly Relevant", "Relevant", "Recommended")
 * derived from the Civic Intelligence layer without exposing raw math unless requested.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Sparkles, Flame, ThumbsUp } from "lucide-react";

export type RelevanceLevel = "high" | "medium" | "recommended";

export interface RelevanceIndicatorProps {
  level?: RelevanceLevel;
  score?: number; // 0 to 1
  label?: string;
  className?: string;
}

export function RelevanceIndicator({
  level,
  score,
  label,
  className,
}: RelevanceIndicatorProps) {
  const resolvedLevel: RelevanceLevel =
    level ||
    (score !== undefined
      ? score >= 0.8
        ? "high"
        : score >= 0.5
        ? "medium"
        : "recommended"
      : "recommended");

  const config = {
    high: {
      badge: "bg-accent-saffron-subtle text-accent border-accent/20",
      icon: <Flame size={12} />,
      text: label || "Highly Relevant",
    },
    medium: {
      badge: "bg-accent-blue-subtle text-accent-blue border-accent-blue/20",
      icon: <Sparkles size={12} />,
      text: label || "Relevant for You",
    },
    recommended: {
      badge: "bg-surface-secondary text-muted-foreground border-border-subtle",
      icon: <ThumbsUp size={12} />,
      text: label || "Recommended",
    },
  }[resolvedLevel];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-caption font-semibold",
        config.badge,
        className
      )}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
