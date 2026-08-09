/**
 * lib/theme/index.ts
 *
 * Theme types, constants, and the anti-flash inline script for Vayam.
 *
 * This module is intentionally pure — no React imports, no DOM access.
 * DOM manipulation lives in components/ui/theme-provider.tsx.
 * React state lives in hooks/useTheme.ts.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const THEME_STORAGE_KEY = "vayam-theme" as const;
export const THEME_ATTRIBUTE   = "data-theme"   as const;
export const THEME_DARK_VALUE  = "dark"          as const;

export const THEME_PREFERENCES: readonly ThemePreference[] = [
  "light",
  "dark",
  "system",
] as const;

export const THEME_LABELS: Record<ThemePreference, string> = {
  light:  "Light",
  dark:   "Dark",
  system: "System",
};

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Parse a raw localStorage value into a ThemePreference.
 * Falls back to "system" for any unknown / null value.
 */
export function parseThemePreference(raw: string | null): ThemePreference {
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "system";
}

// ---------------------------------------------------------------------------
// Anti-flash inline script
// ---------------------------------------------------------------------------

/**
 * Minified inline script injected into <head> via dangerouslySetInnerHTML.
 *
 * It runs synchronously during HTML parsing — BEFORE React, BEFORE the
 * browser paints anything — and sets data-theme="dark" on <html> when
 * dark mode is required.  This eliminates the light-flash on dark-preferring
 * users.
 *
 * Logic:
 *   stored === "dark"                          → dark
 *   stored !== "light" && OS prefers dark      → dark (includes stored="system" or null)
 *   otherwise                                  → light (no attribute set)
 *
 * Keep this script SMALL.  Every byte here blocks the parser.
 */
export const THEME_SCRIPT = /* js */ `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s==="${THEME_DARK_VALUE}"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.setAttribute("${THEME_ATTRIBUTE}","${THEME_DARK_VALUE}");}catch(e){}})();`;
