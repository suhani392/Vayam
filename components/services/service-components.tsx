"use client";

/**
 * components/services/service-components.tsx
 *
 * Presentation building blocks for government service workflows:
 * ServiceCard, ServiceStep, ServiceJourney, ServiceStatus, ServiceDocumentList.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CategoryBadge, SourceBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import type { SchemeCategory } from "@/types/schemes";

/* --------------------------------------------------------------------------
   ServiceCard
   -------------------------------------------------------------------------- */
export interface ServiceCardProps {
  id: string;
  name: string;
  summary: string;
  category: SchemeCategory | string;
  department: string;
  processingTimeDays?: number;
  serviceUrl?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function ServiceCard({
  id,
  name,
  summary,
  category,
  department,
  processingTimeDays,
  serviceUrl,
  onSelect,
  className,
}: ServiceCardProps) {
  return (
    <Card variant="interactive" className={className} onClick={() => onSelect?.(id)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-1">
          <CategoryBadge category={category} />
          {processingTimeDays && (
            <span className="badge badge-blue">
              <Clock size={12} /> {processingTimeDays} Days Processing
            </span>
          )}
        </div>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>

      <CardContent>
        <SourceBadge verified sourceName={department} />
      </CardContent>

      <CardFooter>
        <span className="text-caption text-muted-foreground">Digital Service Portal</span>
        <Button size="sm" variant="ghost" rightIcon={<ArrowRight size={14} />}>
          Start Service
        </Button>
      </CardFooter>
    </Card>
  );
}

/* --------------------------------------------------------------------------
   ServiceJourney (Eligibility → Documents → Application → Processing → Completion)
   -------------------------------------------------------------------------- */
export type JourneyStepState = "completed" | "current" | "upcoming";

export interface JourneyStep {
  id: string;
  title: string;
  description?: string;
  state: JourneyStepState;
}

export interface ServiceJourneyProps {
  steps: JourneyStep[];
  className?: string;
}

export function ServiceJourney({ steps, className }: ServiceJourneyProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-label text-muted-foreground uppercase tracking-wider font-bold">
        Service Progress Journey
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
        {steps.map((step, index) => {
          const stateClass = {
            completed: "bg-success-subtle text-success border-success/30 font-bold",
            current: "bg-accent-saffron-subtle text-accent border-accent font-bold ring-2 ring-accent/20",
            upcoming: "bg-surface-secondary text-muted-foreground border-border-subtle",
          }[step.state];

          return (
            <div
              key={step.id}
              className={cn("p-3 rounded-xl border flex flex-col items-start gap-1 text-caption", stateClass)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono font-bold text-[10px]">STEP 0{index + 1}</span>
                {step.state === "completed" && <CheckCircle2 size={14} />}
              </div>
              <p className="font-bold text-body-sm text-foreground">{step.title}</p>
              {step.description && (
                <p className="text-[11px] text-muted-foreground truncate">{step.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   ServiceStatus
   -------------------------------------------------------------------------- */
export interface ServiceStatusProps {
  status: "applied" | "under_review" | "approved" | "rejected";
  applicationId?: string;
  submittedDate?: string;
  className?: string;
}

export function ServiceStatus({
  status,
  applicationId,
  submittedDate,
  className,
}: ServiceStatusProps) {
  const config = {
    applied: {
      bg: "bg-accent-blue-subtle text-accent-blue border-accent-blue/30",
      icon: <FileText size={16} />,
      label: "Application Submitted",
    },
    under_review: {
      bg: "bg-warning-subtle text-warning border-warning/30",
      icon: <Clock size={16} />,
      label: "Under Department Review",
    },
    approved: {
      bg: "bg-success-subtle text-success border-success/30",
      icon: <ShieldCheck size={16} />,
      label: "Approved & Issued",
    },
    rejected: {
      bg: "bg-destructive-subtle text-destructive border-destructive/30",
      icon: <Clock size={16} />,
      label: "Action Required / Returned",
    },
  }[status];

  return (
    <div className={cn("p-4 rounded-xl border flex items-center justify-between gap-4", config.bg, className)}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">{config.icon}</div>
        <div>
          <h4 className="text-body-sm font-bold">{config.label}</h4>
          {applicationId && (
            <p className="text-caption font-mono opacity-80">Ref ID: {applicationId}</p>
          )}
        </div>
      </div>
      {submittedDate && (
        <span className="text-caption font-mono opacity-80">{submittedDate}</span>
      )}
    </div>
  );
}
