/**
 * hooks/useFeatureFlag.ts
 *
 * React hook for reading Vayam feature flags.
 *
 * Components should use this hook rather than reading FEATURE_FLAGS
 * directly so the flag-checking pattern is consistent and can be
 * extended with remote config in the future.
 */

"use client";

import { FEATURE_FLAGS, type FeatureFlagKey } from "@/config/flags";

/**
 * Returns the current boolean value of a feature flag.
 *
 * Example:
 *   const aiEnabled = useFeatureFlag("enableAIAssistant");
 */
export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  // In Phase 01, flags are statically read from environment variables.
  // In a future phase, this hook can be extended to check a remote
  // feature-flag service (e.g. PostHog, LaunchDarkly) without changing
  // any call sites.
  return FEATURE_FLAGS[flag];
}
