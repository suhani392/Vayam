"use client";

/**
 * components/layout/page-container.tsx
 *
 * Reusable PageContainer abstraction for Vayam pages.
 * Handles responsive horizontal padding, max-width presets (standard, wide, full),
 * and header spacing so pages don't re-implement wrapper layout styles.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

export type PageWidthPreset = "standard" | "wide" | "full" | "narrow";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: PageWidthPreset;
  children: React.ReactNode;
}

export function PageContainer({
  width = "standard",
  children,
  className,
  ...props
}: PageContainerProps) {
  const widthClass = {
    narrow: "max-w-3xl",
    standard: "max-w-6xl",
    wide: "max-w-7xl",
    full: "max-w-full",
  }[width];

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8 animate-in fade-in duration-200",
        widthClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
