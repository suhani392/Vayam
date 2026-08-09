"use client";

/**
 * components/schemes/benefit-chip.tsx
 *
 * BenefitChip & BenefitItem components for presenting financial or entitlement benefits.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Coins, Gift } from "lucide-react";

export interface BenefitChipProps {
  summary: string;
  amountInr?: number;
  className?: string;
}

export function BenefitChip({ summary, amountInr, className }: BenefitChipProps) {
  const formattedAmount =
    amountInr !== undefined
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(amountInr)
      : null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl bg-accent-green-subtle border border-accent-green/20 text-accent-green",
        className
      )}
    >
      <div className="p-1.5 rounded-lg bg-accent-green/10 flex-shrink-0">
        <Coins size={16} />
      </div>
      <div className="min-w-0 flex-1">
        {formattedAmount && (
          <p className="text-body-sm font-extrabold text-accent-green leading-tight">
            {formattedAmount}
          </p>
        )}
        <p className="text-caption font-medium truncate opacity-90">{summary}</p>
      </div>
    </div>
  );
}

export interface BenefitItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function BenefitItem({ title, description, icon }: BenefitItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary border border-border-subtle">
      <div className="p-1.5 rounded-lg bg-accent-saffron-subtle text-accent mt-0.5">
        {icon || <Gift size={16} />}
      </div>
      <div>
        <h5 className="text-body-sm font-bold text-foreground">{title}</h5>
        {description && (
          <p className="text-caption text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
