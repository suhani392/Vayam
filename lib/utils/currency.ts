/**
 * lib/utils/currency.ts
 *
 * INR currency formatting utilities.
 */

/**
 * Format a number as Indian Rupees.
 * e.g. 150000 → "₹1,50,000"
 */
export function formatINR(amount: number, locale: string = "en-IN"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number using Indian numbering system (lakhs, crores).
 * e.g. 1500000 → "15 Lakh"
 */
export function formatIndianNumber(amount: number): string {
  if (amount >= 10_000_000) {
    return `${(amount / 10_000_000).toFixed(1)} Crore`;
  }
  if (amount >= 100_000) {
    return `${(amount / 100_000).toFixed(1)} Lakh`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return amount.toString();
}
