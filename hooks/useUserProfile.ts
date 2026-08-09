"use client";

/**
 * hooks/useUserProfile.ts
 *
 * User Profile Hook integrated with Supabase Auth Context.
 * Evaluates profile completion, profile health insights, and provides save/reset functionality.
 */

import { useCallback, useMemo } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import type { UserProfile } from "@/lib/core/types";
import {
  EMPTY_PROFILE,
  getProfileCompletion,
  getProfileHealthInsights,
  isProfileValid,
  UserProfileDraft,
} from "@/lib/core/user-profile";

export function useUserProfile() {
  const { userProfile, updateProfile, loading, isAuthenticated } = useAuth();

  const profile = userProfile || EMPTY_PROFILE;

  const saveProfile = useCallback(
    async (nextProfile: UserProfileDraft) => {
      const updatedProfile: UserProfileDraft = {
        ...nextProfile,
        updatedAt: new Date().toISOString(),
      };
      await updateProfile(updatedProfile);
    },
    [updateProfile]
  );

  const resetProfile = useCallback(async () => {
    await updateProfile(EMPTY_PROFILE);
  }, [updateProfile]);

  const profileCompletion = useMemo(
    () => (profile ? getProfileCompletion(profile) : getProfileCompletion(EMPTY_PROFILE)),
    [profile]
  );

  const profileHealth = useMemo(
    () => (profile ? getProfileHealthInsights(profile) : getProfileHealthInsights(EMPTY_PROFILE)),
    [profile]
  );

  return {
    profile,
    loaded: !loading,
    saveProfile,
    resetProfile,
    setProfile: (p: UserProfileDraft) => updateProfile(p),
    profileCompletion,
    profileHealth,
    hasValidProfile: profile ? isProfileValid(profile) : false,
    isAuthenticated,
  };
}
