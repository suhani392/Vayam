"use client";

/**
 * components/ui/theme-provider.tsx
 *
 * Vayam theme engine — context, provider, and useTheme hook.
 * Hydration-safe implementation avoiding server/client mismatches.
 */

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  THEME_ATTRIBUTE,
  THEME_DARK_VALUE,
  THEME_STORAGE_KEY,
  parseThemePreference,
} from "@/lib/theme";
import type { ThemePreference, ResolvedTheme } from "@/lib/theme";

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  mounted: boolean;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemPreference(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolvePreference(pref: ThemePreference): ResolvedTheme {
  return pref === "system" ? getSystemPreference() : pref;
}

function applyToDOM(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  if (resolved === "dark") {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, THEME_DARK_VALUE);
  } else {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start with "system" on SSR and initial hydration to prevent mismatch.
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    // Sync React state with localStorage after initial mount.
    const stored = parseThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
    setPreference(stored);
    setMounted(true);
    applyToDOM(resolvePreference(stored));

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const current = parseThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
      if (current === "system") {
        applyToDOM(resolvePreference("system"));
        setPreference((p) => (p === "system" ? "system" : p));
      }
    };
    mq.addEventListener("change", handleSystemChange);
    return () => mq.removeEventListener("change", handleSystemChange);
  }, []);

  const setTheme = useCallback((newPref: ThemePreference) => {
    localStorage.setItem(THEME_STORAGE_KEY, newPref);
    setPreference(newPref);
    applyToDOM(resolvePreference(newPref));
  }, []);

  const resolved: ResolvedTheme =
    mounted && typeof window !== "undefined"
      ? resolvePreference(preference)
      : "light";

  return (
    <ThemeContext.Provider value={{ preference, resolved, mounted, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error(
      "[Vayam] useTheme() must be called inside <ThemeProvider>. " +
        "Make sure ThemeProvider is in your root layout."
    );
  }
  return ctx;
}
