"use client";

/**
 * components/ui/theme-toggle.tsx
 *
 * Theme toggle button — cycles through Light → Dark → System.
 * Hydration-safe implementation: renders consistent fallback state during SSR
 * and syncs after client hydration completes.
 */

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils/cn";

const NEXT_THEME: Record<ThemePreference, ThemePreference> = {
  light:  "dark",
  dark:   "light",
  system: "dark",
};

const LABELS: Record<ThemePreference, string> = {
  light:  "Switch to dark mode",
  dark:   "Switch to light mode",
  system: "Switch to dark mode",
};

const ICON_SIZE = 18;

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { preference, mounted, setTheme } = useTheme();

  function handleToggle() {
    setTheme(NEXT_THEME[preference]);
  }

  // Before client hydration completes, render default "system" state to match SSR
  const activePref = mounted ? preference : "system";

  const Icon =
    activePref === "light"
      ? Sun
      : activePref === "dark"
      ? Moon
      : Monitor;

  const label = LABELS[activePref];

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      className={cn(
        "btn btn-ghost",
        "h-9 w-9 rounded-full p-0",
        "text-muted-foreground hover:text-foreground",
        "transition-colors duration-150",
        className
      )}
    >
      <Icon size={ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />
      {showLabel && (
        <span className="sr-only">{label}</span>
      )}
    </button>
  );
}
