"use client";

/**
 * components/timeline/timeline.tsx
 *
 * Presentation-only Timeline components for Vayam life stage & scheme schedules.
 * Includes Timeline, TimelineItem, TimelineConnector, TimelineEvent, TimelineMarker.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Clock, Sparkles, AlertCircle, Calendar } from "lucide-react";
import type { TimelineEventCategory } from "@/types/civic";

export type TimelineEventType = "current" | "upcoming" | "completed" | "milestone" | "deadline";

export interface TimelineMarkerProps {
  type?: TimelineEventType;
  icon?: React.ReactNode;
}

export function TimelineMarker({ type = "upcoming", icon }: TimelineMarkerProps) {
  const config = {
    completed: "bg-success text-success-foreground border-success",
    current: "bg-accent text-accent-foreground border-accent ring-4 ring-accent/20 animate-pulse",
    milestone: "bg-primary text-primary-foreground border-primary",
    deadline: "bg-warning text-warning-foreground border-warning",
    upcoming: "bg-muted text-muted-foreground border-border",
  }[type];

  const defaultIcon = {
    completed: <CheckCircle2 size={12} />,
    current: <Sparkles size={12} />,
    milestone: <Sparkles size={12} />,
    deadline: <AlertCircle size={12} />,
    upcoming: <Clock size={12} />,
  }[type];

  return (
    <div
      className={cn(
        "h-7 w-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10",
        config
      )}
    >
      {icon || defaultIcon}
    </div>
  );
}

export function TimelineConnector({ isCompleted = false }: { isCompleted?: boolean }) {
  return (
    <div
      className={cn(
        "w-0.5 min-h-[40px] flex-1 my-1 self-center",
        isCompleted ? "bg-success/50" : "bg-border-subtle"
      )}
    />
  );
}

export interface TimelineEventProps {
  title: string;
  description: string;
  date: string;
  category?: TimelineEventCategory | string;
  requiresAction?: boolean;
  type?: TimelineEventType;
  onClick?: () => void;
  className?: string;
}

export function TimelineEvent({
  title,
  description,
  date,
  category,
  requiresAction = false,
  type = "upcoming",
  onClick,
  className,
}: TimelineEventProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl border bg-card transition-colors flex-1 space-y-1.5",
        type === "current" && "border-accent/40 bg-accent-subtle/30 shadow-xs",
        requiresAction && "border-l-4 border-l-accent",
        onClick && "cursor-pointer hover:border-border",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-caption font-mono font-semibold text-muted-foreground flex items-center gap-1">
          <Calendar size={12} /> {date}
        </span>
        {requiresAction && (
          <span className="badge badge-saffron">Action Required</span>
        )}
      </div>

      <h4 className="text-h4 font-bold text-foreground">{title}</h4>
      <p className="text-body-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {category && (
        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-accent font-mono pt-1">
          #{category.replace(/_/g, " ")}
        </span>
      )}
    </div>
  );
}

export interface TimelineItemProps {
  children: React.ReactNode;
  isLast?: boolean;
  className?: string;
}

export function TimelineItem({ children, className }: TimelineItemProps) {
  return (
    <div className={cn("flex items-start gap-4 relative", className)}>
      {children}
    </div>
  );
}

export function Timeline({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-4 relative", className)}>{children}</div>;
}
