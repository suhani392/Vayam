"use client";

/**
 * components/schemes/document-requirement.tsx
 *
 * DocumentRequirement component for displaying scheme document checklists and verification states.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Clock, FileCheck, HelpCircle } from "lucide-react";

export type DocumentStatus = "verified" | "pending" | "required" | "optional";

export interface DocumentItem {
  id: string;
  name: string;
  description?: string;
  status?: DocumentStatus;
}

export interface DocumentRequirementProps {
  documents: DocumentItem[];
  title?: string;
  className?: string;
}

export function DocumentRequirement({
  documents,
  title = "Required Documents",
  className,
}: DocumentRequirementProps) {
  const statusConfig = {
    verified: {
      badge: "text-success bg-success-subtle border-success/30",
      icon: <CheckCircle2 size={14} />,
      label: "Ready / Verified",
    },
    pending: {
      badge: "text-warning bg-warning-subtle border-warning/30",
      icon: <Clock size={14} />,
      label: "Pending",
    },
    required: {
      badge: "text-accent bg-accent-subtle border-accent/30",
      icon: <FileCheck size={14} />,
      label: "Required",
    },
    optional: {
      badge: "text-muted-foreground bg-muted border-border-subtle",
      icon: <HelpCircle size={14} />,
      label: "Optional",
    },
  };

  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <h4 className="text-label text-foreground font-bold uppercase tracking-wider">
          {title}
        </h4>
      )}
      <div className="space-y-2">
        {documents.map((doc) => {
          const status = doc.status || "required";
          const config = statusConfig[status];

          return (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border-subtle"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn("p-1.5 rounded-lg border flex-shrink-0", config.badge)}>
                  {config.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-body-sm font-semibold text-foreground truncate">
                    {doc.name}
                  </p>
                  {doc.description && (
                    <p className="text-caption text-muted-foreground truncate">
                      {doc.description}
                    </p>
                  )}
                </div>
              </div>
              <span className={cn("badge text-[10px] flex-shrink-0", config.badge)}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
