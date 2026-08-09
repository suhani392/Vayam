"use client";

/**
 * components/ui/tooltip.tsx
 *
 * Lightweight Tooltip component for Vayam.
 * Renders on hover and focus for auxiliary information.
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClass = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }[position];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 px-2.5 py-1 text-caption font-medium text-popover-foreground bg-popover border border-border shadow-md rounded-md whitespace-nowrap pointer-events-none animate-in fade-in duration-150",
            positionClass,
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
