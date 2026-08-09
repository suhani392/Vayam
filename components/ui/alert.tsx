"use client";

/**
 * components/ui/alert.tsx
 *
 * Calm, accessible Alert components for Vayam.
 * Includes Alert, InfoAlert, SuccessAlert, WarningAlert, ErrorAlert.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

export type AlertType = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export function Alert({
  type = "info",
  title,
  onClose,
  icon,
  children,
  className,
  ...props
}: AlertProps) {
  const typeConfig = {
    info: {
      container: "bg-info-subtle border-info/30 text-foreground",
      iconColor: "text-info",
      defaultIcon: <Info size={18} />,
    },
    success: {
      container: "bg-success-subtle border-success/30 text-foreground",
      iconColor: "text-success",
      defaultIcon: <CheckCircle2 size={18} />,
    },
    warning: {
      container: "bg-warning-subtle border-warning/30 text-foreground",
      iconColor: "text-warning",
      defaultIcon: <AlertTriangle size={18} />,
    },
    error: {
      container: "bg-destructive-subtle border-destructive/30 text-foreground",
      iconColor: "text-destructive",
      defaultIcon: <AlertCircle size={18} />,
    },
  }[type];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border",
        typeConfig.container,
        className
      )}
      {...props}
    >
      <div className={cn("flex-shrink-0 mt-0.5", typeConfig.iconColor)}>
        {icon || typeConfig.defaultIcon}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-body-sm font-bold text-foreground mb-0.5">
            {title}
          </h4>
        )}
        <div className="text-body-sm leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export function InfoAlert(props: Omit<AlertProps, "type">) {
  return <Alert type="info" {...props} />;
}

export function SuccessAlert(props: Omit<AlertProps, "type">) {
  return <Alert type="success" {...props} />;
}

export function WarningAlert(props: Omit<AlertProps, "type">) {
  return <Alert type="warning" {...props} />;
}

export function ErrorAlert(props: Omit<AlertProps, "type">) {
  return <Alert type="error" {...props} />;
}
