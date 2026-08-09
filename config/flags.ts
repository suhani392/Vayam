/**
 * Feature flags for Vayam.
 *
 * Use these to safely gate incomplete or experimental features
 * across development, staging, and production environments.
 *
 * Flags are evaluated at runtime so they can be controlled via
 * environment variables without a code deploy.
 */

function boolFlag(envKey: string, defaultValue: boolean): boolean {
  const val = process.env[envKey];
  if (val === undefined || val === "") return defaultValue;
  return val === "true" || val === "1";
}

export const FEATURE_FLAGS = {
  /** Enable the AI conversational assistant */
  enableAIAssistant: boolFlag("NEXT_PUBLIC_FEATURE_AI_ASSISTANT", false),

  /** Enable voice input / output via the Sarvam API */
  enableVoice: boolFlag("NEXT_PUBLIC_FEATURE_VOICE", false),

  /** Enable Supabase-backed user accounts */
  enableAuth: boolFlag("NEXT_PUBLIC_FEATURE_AUTH", false),

  /** Enable push notifications for deadlines and events */
  enableNotifications: boolFlag("NEXT_PUBLIC_FEATURE_NOTIFICATIONS", false),

  /** Enable multi-language UI (shows language switcher) */
  enableI18n: boolFlag("NEXT_PUBLIC_FEATURE_I18N", true),

  /** Show the developer debug panel */
  enableDebugPanel: boolFlag("NEXT_PUBLIC_FEATURE_DEBUG", false),
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;
