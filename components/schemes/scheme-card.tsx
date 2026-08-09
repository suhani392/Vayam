"use client";

/**
 * components/schemes/scheme-card.tsx
 *
 * Presentation-only SchemeCard component for displaying government schemes.
 * Receives structured props — no direct data fetching or calculation.
 */

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CategoryBadge, SourceBadge } from "@/components/ui/badge";
import { EligibilityBadge } from "@/components/civic/eligibility-indicator";
import { DeadlineIndicator } from "@/components/civic/deadline-indicator";
import { BenefitChip } from "./benefit-chip";
import { ArrowRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SchemeCategory } from "@/types/schemes";
import type { EligibilityStatus } from "@/types/civic";

export interface SchemeCardProps {
  id: string;
  name: string;
  summary: string;
  category: SchemeCategory | string;
  benefitSummary: string;
  benefitAmountInr?: number;
  eligibilityStatus?: EligibilityStatus;
  deadlineDate?: string;
  daysRemaining?: number;
  isOngoing?: boolean;
  department?: string;
  isVerified?: boolean;
  onSelect?: (id: string) => void;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
  className?: string;
}

export function SchemeCard({
  id,
  name,
  summary,
  category,
  benefitSummary,
  benefitAmountInr,
  eligibilityStatus = "requires_verification",
  deadlineDate,
  daysRemaining,
  isOngoing = true,
  department,
  isVerified = true,
  onSelect,
  onBookmark,
  isBookmarked = false,
  className,
}: SchemeCardProps) {
  return (
    <Card variant="interactive" className={className} onClick={() => onSelect?.(id)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-1">
          <CategoryBadge category={category} />
          <div className="flex items-center gap-2">
            <EligibilityBadge status={eligibilityStatus} />
            {onBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(id);
                }}
                aria-label="Save scheme"
                className="p-1 rounded-lg text-muted-foreground hover:text-accent"
              >
                <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>
        </div>

        <CardTitle>{name}</CardTitle>
        <CardDescription className="line-clamp-2">{summary}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <BenefitChip summary={benefitSummary} amountInr={benefitAmountInr} />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <DeadlineIndicator
            deadlineDate={deadlineDate}
            daysRemaining={daysRemaining}
            state={isOngoing ? "ongoing" : "active"}
          />
          <SourceBadge verified={isVerified} sourceName={department} />
        </div>
      </CardContent>

      <CardFooter>
        <span className="text-caption text-muted-foreground">Click to view details</span>
        <Button size="sm" variant="ghost" rightIcon={<ArrowRight size={14} />}>
          Explore Scheme
        </Button>
      </CardFooter>
    </Card>
  );
}
