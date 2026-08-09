/**
 * hooks/useTheme.ts
 *
 * Convenience re-export of useTheme from the ThemeProvider.
 *
 * Components import from here rather than directly from the components
 * directory, maintaining the hooks/ convention and making future refactors
 * (e.g., swapping to a different provider) a single-file change.
 */
export { useTheme } from "@/components/ui/theme-provider";
export type { ThemePreference, ResolvedTheme } from "@/lib/theme";
