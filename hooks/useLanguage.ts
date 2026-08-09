"use client";

/**
 * hooks/useLanguage.ts
 *
 * Convenience hook for Vayam language access.
 * Returns { lang, setLang, t } from the LanguageContext.
 * All components should use this hook instead of accessing context directly.
 */

export { useLanguageContext as useLanguage } from "@/lib/i18n/language-context";
export type { LanguageContextValue } from "@/lib/i18n/language-context";
