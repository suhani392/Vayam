"use client";

/**
 * components/civic/deadline-indicator.tsx
 *
 * DeadlineIndicator component for displaying pre-calculated deadline information.
 * Does NOT perform date calculations internally — receives structured props.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Clock, Calendar, AlertCircle } from "lucide-react";

export type DeadlineState = "active" | "urgent" | "passed" | "ongoing";

export interface DeadlineIndicatorProps {
  deadlineDate?: string;
  daysRemaining?: number;
  label?: string;
  state?: DeadlineState;
  className?: string;
}

export function DeadlineIndicator({
  deadlineDate,
  daysRemaining,
  label,
  state = "active",
  className,
}: DeadlineIndicatorProps) {
  const isPassed = state === "passed" || (daysRemaining !== undefined && daysRemaining <= 0);
  const isUrgent = state === "urgent" || (daysRemaining !== undefined && daysRemaining > 0 && daysRemaining <= 7);

  const displayState: DeadlineState = isPassed
    ? "passed"
    : isUrgent
    ? "urgent"
    : state;

  const stateConfig = {
    active: {
      badge: "bg-surface-secondary text-foreground border-border-subtle",
      icon: <Clock size={12} className="text-accent" />,
      text: label || (daysRemaining !== undefined ? `${daysRemaining} days left` : `Deadline: ${deadlineDate}`),
    },
    urgent: {
      badge: "bg-warning-subtle text-warning border-warning/30",
      icon: <AlertCircle size={12} />,
      text: label || (daysRemaining !== undefined ? `Only ${daysRemaining} days left!` : `Closing Soon: ${deadlineDate}`),
    },
    passed: {
      badge: "bg-muted text-muted-foreground border-border-subtle opacity-70",
      icon: <Clock size={12} />,
      text: label || "Deadline passed",
    },
    ongoing: {
      badge: "bg-success-subtle text-success border-success/30",
      icon: <Calendar size={12} />,
      text: label || "Ongoing Scheme",
    },
  }[displayState];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-caption font-semibold",
        stateConfig.badge,
        className
      )}
    >
      {stateConfig.icon}
      <span>{stateConfig.text}</span>
    </div>
  );
}
