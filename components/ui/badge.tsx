"use client";

/**
 * components/ui/badge.tsx
 *
 * Accessible Badge primitives for Vayam.
 * Includes Badge, StatusBadge, CategoryBadge, SourceBadge.
 *
 * Accessibility rule: Status is ALWAYS communicated with both text AND icon.
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  Globe,
  Bookmark,
  Sparkles,
} from "lucide-react";
import type { SchemeCategory } from "@/types/schemes";

export type BadgeVariant =
  | "default"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "eligible"
  | "maybe"
  | "ineligible"
  | "official"
  | "verified"
  | "saffron"
  | "green"
  | "blue"
  | "purple"
  | "muted";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", icon, children, ...props }, ref) => {
    const variantClass = {
      default: "badge-muted",
      primary: "badge-primary bg-primary-subtle text-primary",
      accent: "badge-accent bg-accent-subtle text-accent",
      success: "badge-success",
      warning: "badge-warning",
      destructive: "badge-destructive",
      info: "badge-info",
      eligible: "badge-eligible",
      maybe: "badge-maybe",
      ineligible: "badge-ineligible",
      official: "badge-official",
      verified: "badge-verified",
      saffron: "badge-saffron",
      green: "badge-green",
      blue: "badge-blue",
      purple: "badge-purple",
      muted: "badge-muted",
    }[variant];

    return (
      <span ref={ref} className={cn("badge", variantClass, className)} {...props}>
        {icon}
        <span>{children}</span>
      </span>
    );
  }
);
Badge.displayName = "Badge";

/* --------------------------------------------------------------------------
   StatusBadge
   -------------------------------------------------------------------------- */
export type StatusValue =
  | "eligible"
  | "likely-eligible"
  | "needs-verification"
  | "not-eligible"
  | "upcoming"
  | "verified"
  | "official"
  | "deadline"
  | "saved";

export interface StatusBadgeProps extends Omit<BadgeProps, "variant" | "icon"> {
  status: StatusValue;
  customText?: string;
}

export function StatusBadge({ status, customText, className, ...props }: StatusBadgeProps) {
  const config: Record<
    StatusValue,
    { variant: BadgeVariant; icon: React.ReactNode; text: string }
  > = {
    eligible: {
      variant: "eligible",
      icon: <CheckCircle2 size={12} />,
      text: "Eligible",
    },
    "likely-eligible": {
      variant: "eligible",
      icon: <CheckCircle2 size={12} />,
      text: "Likely Eligible",
    },
    "needs-verification": {
      variant: "maybe",
      icon: <AlertTriangle size={12} />,
      text: "Needs Verification",
    },
    "not-eligible": {
      variant: "ineligible",
      icon: <XCircle size={12} />,
      text: "Not Eligible",
    },
    upcoming: {
      variant: "blue",
      icon: <Clock size={12} />,
      text: "Upcoming",
    },
    verified: {
      variant: "verified",
      icon: <Shield size={12} />,
      text: "Verified",
    },
    official: {
      variant: "official",
      icon: <Globe size={12} />,
      text: "Official Source",
    },
    deadline: {
      variant: "warning",
      icon: <Clock size={12} />,
      text: "Deadline Approaching",
    },
    saved: {
      variant: "purple",
      icon: <Bookmark size={12} />,
      text: "Saved",
    },
  };

  const current = config[status];

  return (
    <Badge
      variant={current.variant}
      icon={current.icon}
      className={className}
      {...props}
    >
      {customText || current.text}
    </Badge>
  );
}

/* --------------------------------------------------------------------------
   CategoryBadge (Soft Pastel Styling per Category)
   -------------------------------------------------------------------------- */
export interface CategoryBadgeProps extends Omit<BadgeProps, "variant"> {
  category: SchemeCategory | string;
}

export function CategoryBadge({ category, className, ...props }: CategoryBadgeProps) {
  const formattedLabel = category.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "badge text-[11px] uppercase tracking-wider font-bold",
        "bg-surface-secondary text-foreground border border-border-subtle",
        className
      )}
      {...props}
    >
      <Sparkles size={10} className="text-accent" />
      <span>{formattedLabel}</span>
    </span>
  );
}

/* --------------------------------------------------------------------------
   SourceBadge
   -------------------------------------------------------------------------- */
export interface SourceBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  verified?: boolean;
  verificationStatus?: "VERIFIED" | "DEMO" | "UNVERIFIED" | "EXPIRED" | "REQUIRES_REVIEW" | string;
  sourceName?: string;
}

export function SourceBadge({
  verified = true,
  verificationStatus,
  sourceName,
  className,
  ...props
}: SourceBadgeProps) {
  const isDemo = verificationStatus === "DEMO";
  const isVerified = verificationStatus ? verificationStatus === "VERIFIED" : verified;

  return (
    <span
      className={cn(
        "source-badge",
        isDemo
          ? "bg-warning/15 text-warning border-warning/40"
          : isVerified
          ? "source-badge-verified"
          : "source-badge-official",
        className
      )}
      {...props}
    >
      {isDemo ? <AlertTriangle size={10} /> : isVerified ? <Shield size={10} /> : <Globe size={10} />}
      <span>
        {isDemo
          ? "DEMO DATA"
          : sourceName || (isVerified ? "Verified Source" : "Official Portal")}
      </span>
    </span>
  );
}
