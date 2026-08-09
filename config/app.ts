/**
 * Application-level configuration for Vayam.
 *
 * All values here are static and safe to import on the client.
 * Secrets and API keys must NEVER appear in this file — use
 * environment variables and server-side code only.
 */

export const APP_CONFIG = {
  name: "Vayam",
  /** Sanskrit: वयम् — "We, the People" */
  tagline: "Civic intelligence for every Indian",
  description:
    "Vayam helps you discover government schemes, services, rights, and opportunities relevant to your life — powered by deterministic civic intelligence.",

  version: "0.1.0",

  /** Default UI language (BCP-47) */
  defaultLanguage: "en",

  /** All languages supported by the Vayam UI */
  supportedLanguages: [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
    { code: "mr", label: "मराठी" },
    { code: "bn", label: "বাংলা" },
    { code: "gu", label: "ગુજરાતી" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "ml", label: "മലയാളം" },
    { code: "pa", label: "ਪੰਜਾਬੀ" },
    { code: "or", label: "ଓଡ଼ିଆ" },
    { code: "as", label: "অসমীয়া" },
  ],
} as const;

export type SupportedLanguageCode =
  (typeof APP_CONFIG.supportedLanguages)[number]["code"];
