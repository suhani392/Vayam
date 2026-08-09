"use client";

/**
 * components/civic/theme-switcher.tsx
 *
 * ThemeSwitcher component for Vayam.
 * Renders explicit Light, Dark, System buttons extending existing theme context.
 */

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { ThemePreference } from "@/lib/theme";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ThemeSwitcherProps {
  className?: string;
  variant?: "segment" | "dropdown";
}

export function ThemeSwitcher({ className, variant = "segment" }: ThemeSwitcherProps) {
  const { preference, setTheme } = useTheme();

  const options: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun size={14} /> },
    { value: "dark", label: "Dark", icon: <Moon size={14} /> },
    { value: "system", label: "System", icon: <Monitor size={14} /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme mode"
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-surface-secondary border border-border-subtle rounded-xl",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = preference === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all duration-150 cursor-pointer select-none",
              isActive
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
