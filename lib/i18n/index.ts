/**
 * lib/i18n/index.ts
 *
 * Vayam i18n central hub.
 * - t(key, lang) utility function
 * - Translation map lookup
 * - Fallback to English for unsupported languages
 */

import type { LanguageCode, TranslationMap } from "./types";
import { en } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";

export type { LanguageCode };
export { SUPPORTED_LANGUAGES } from "./types";

const translations: Record<LanguageCode, TranslationMap> = { en, hi, mr };

/**
 * Translate a key into the given language.
 * Falls back to English if the key is not found in the selected language.
 */
export function t(key: keyof TranslationMap, lang: LanguageCode = "en"): string {
  const langMap = translations[lang] ?? translations.en;
  return langMap[key] ?? translations.en[key] ?? key;
}

/**
 * Returns a bound translator for a specific language.
 * Convenient for components that call t() many times.
 */
export function createTranslator(lang: LanguageCode) {
  return (key: keyof TranslationMap): string => t(key, lang);
}

export { en, hi, mr };
