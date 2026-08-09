/**
 * lib/utils/date.ts
 *
 * Date formatting utilities for the Vayam UI.
 *
 * These are presentation helpers — they format dates for display.
 * Civic calculations (age, life-stage) belong in lib/civic/.
 */

/**
 * Format an ISO 8601 date string for display in the UI.
 * e.g. "2024-03-15" → "15 March 2024"
 */
export function formatDisplayDate(
  isoDate: string,
  locale: string = "en-IN"
): string {
  return new Date(isoDate).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format a date as a relative string ("in 3 days", "2 months ago").
 * Uses the Intl.RelativeTimeFormat API — no external dependency.
 */
export function formatRelativeDate(
  isoDate: string,
  locale: string = "en-IN"
): string {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffDays) < 1) return "today";
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, "day");
  if (Math.abs(diffDays) < 30) return rtf.format(Math.round(diffDays / 7), "week");
  if (Math.abs(diffDays) < 365) return rtf.format(Math.round(diffDays / 30), "month");
  return rtf.format(Math.round(diffDays / 365), "year");
}

/**
 * Return true if an ISO 8601 date string represents a past date.
 */
export function isPastDate(isoDate: string): boolean {
  return new Date(isoDate).getTime() < Date.now();
}
