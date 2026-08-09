"use client";

/**
 * components/feedback/feedback.tsx
 *
 * Reusable feedback state components for Vayam:
 * Skeleton, LoadingIndicator, EmptyState, ErrorState, NotFoundState.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2, AlertCircle, FileSearch, RefreshCw, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const variantClass = {
    text: "h-4 rounded-md w-full",
    circular: "rounded-full h-10 w-10",
    rectangular: "h-24 rounded-2xl w-full",
  }[variant];

  return (
    <div
      className={cn("bg-muted animate-pulse", variantClass, className)}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

export function LoadingIndicator({ label = "Loading civic data...", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 gap-3 text-center", className)}>
      <Loader2 size={28} className="text-accent animate-spin" />
      <span className="text-body-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No matching opportunities found",
  description = "No government schemes or services match your current profile criteria yet. Try adjusting your search or updating your profile details.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-3xl bg-card border border-border-subtle max-w-lg mx-auto space-y-4", className)}>
      <div className="p-4 rounded-full bg-surface-secondary text-accent">
        {icon || <FileSearch size={32} />}
      </div>
      <div className="space-y-1">
        <h3 className="text-h3 font-bold text-foreground">{title}</h3>
        <p className="text-body-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Unable to load civic information",
  message = "A temporary connection issue occurred while fetching verified scheme data. Please verify your internet connection and try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-destructive-subtle border border-destructive/20 max-w-lg mx-auto space-y-4 text-destructive", className)}>
      <div className="p-3 rounded-full bg-destructive/10">
        <AlertCircle size={28} />
      </div>
      <div className="space-y-1">
        <h3 className="text-h3 font-bold">{title}</h3>
        <p className="text-body-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw size={14} />}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export function NotFoundState({
  title = "Resource Not Found",
  description = "The scheme, service, or civic page you are looking for is unavailable or has been relocated.",
  action,
}: EmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={<Compass size={32} />}
      action={action}
    />
  );
}
