/**
 * lib/core/data/test-profiles.ts
 *
 * Test Profiles for Vayam Phase 5.
 * Structured mock profiles representing different life stages (Adolescent 17yo, Student 18yo, Employed 25yo, Senior 65yo)
 * to verify deterministic recommendation variance.
 */

import type { UserProfile } from "../types";

export const TEST_PROFILES: Record<string, UserProfile> = {
  profileA: {
    id: "prof-a-17yo",
    name: "Aarav Deshmukh",
    dateOfBirth: "2009-02-15", // 17 years old (in 2026)
    gender: "male",
    location: {
      stateCode: "MH",
      stateName: "Maharashtra",
      district: "Pune",
      residenceType: "urban",
    },
    educationLevel: "higher_secondary",
    stream: "Science",
    educationStatus: "enrolled",
    employmentStatus: "student",
    isStudent: true,
    annualIncomeInr: 180000,
    category: "obc",
    preferredLanguage: "mr",
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },

  profileB: {
    id: "prof-b-18yo",
    name: "Suhani Sharma",
    dateOfBirth: "2008-05-10", // 18 years old (in 2026)
    gender: "female",
    location: {
      stateCode: "MH",
      stateName: "Maharashtra",
      district: "Mumbai Suburban",
      residenceType: "urban",
    },
    educationLevel: "higher_secondary",
    stream: "Commerce",
    educationStatus: "completed",
    employmentStatus: "student",
    isStudent: true,
    annualIncomeInr: 200000,
    category: "general",
    preferredLanguage: "en",
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },

  profileC: {
    id: "prof-c-25yo",
    name: "Rohan Patil",
    dateOfBirth: "2001-09-20", // 25 years old (in 2026)
    gender: "male",
    location: {
      stateCode: "MH",
      stateName: "Maharashtra",
      district: "Nashik",
      residenceType: "semi_urban",
    },
    educationLevel: "undergraduate",
    employmentStatus: "employed_private",
    isStudent: false,
    annualIncomeInr: 450000,
    category: "general",
    preferredLanguage: "hi",
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },

  profileD: {
    id: "prof-d-65yo",
    name: "Rameshwar Prasad",
    dateOfBirth: "1961-04-12", // 65 years old (in 2026)
    gender: "male",
    location: {
      stateCode: "MH",
      stateName: "Maharashtra",
      district: "Mumbai",
      residenceType: "urban",
    },
    educationLevel: "undergraduate",
    employmentStatus: "retired",
    isStudent: false,
    annualIncomeInr: 90000,
    category: "general",
    preferredLanguage: "hi",
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },

  profileMissing: {
    id: "prof-missing-fields",
    name: "Unverified Citizen (Missing Data)",
    dateOfBirth: "2005-01-01", // Valid DOB (21yo)
    gender: "prefer_not_to_say",
    location: {
      stateCode: "",
      stateName: "Unspecified State",
      residenceType: "urban",
    },
    educationLevel: undefined as any,
    employmentStatus: "unemployed",
    annualIncomeInr: undefined,
    preferredLanguage: "en",
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
};
