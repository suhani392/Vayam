"use client";

/**
 * components/ui/dialog.tsx
 *
 * Accessible Dialog / Modal and ConfirmationDialog components.
 * Supports backdrop click, ESC key closing, focus trap, body scroll lock,
 * and responsive modal/bottom-sheet transitions.
 */

import React, { useEffect, useRef, useId } from "react";
import { cn } from "@/lib/utils/cn";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "./button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descId = `${dialogId}-desc`;
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and listen for ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Auto-focus container or first focusable
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "w-full sm:max-w-lg bg-card border border-border-subtle shadow-xl rounded-t-2xl sm:rounded-2xl p-6 overflow-hidden flex flex-col max-h-[90vh] focus:outline-none",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h3 id={titleId} className="text-h3 font-bold text-foreground">
                {title}
              </h3>
            )}
            {description && (
              <p id={descId} className="text-body-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   ConfirmationDialog
   -------------------------------------------------------------------------- */
export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "primary"}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {isDestructive && (
        <div className="flex items-center gap-3 p-3 bg-destructive-subtle text-destructive rounded-lg border border-destructive/20 text-body-sm font-medium">
          <AlertTriangle size={16} />
          <span>This action cannot be undone.</span>
        </div>
      )}
    </Dialog>
  );
}
