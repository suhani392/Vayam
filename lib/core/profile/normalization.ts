/**
 * lib/core/profile/normalization.ts
 *
 * Profile Normalization & Data Minimization Layer.
 * Sanitizes and normalizes raw user inputs (e.g. messy education strings, state names, income ranges)
 * into standardized internal formats.
 */

import type { UserProfile, EducationLevel, ProfileLocation, SocialCategory } from "../types";

/**
 * Maps raw education string inputs to canonical EducationLevel.
 */
export function normalizeEducationLevel(input: string): EducationLevel {
  const normalized = input.trim().toLowerCase();

  if (/^(none|no|illiterate|uneducated|0|no_formal)/i.test(normalized)) {
    return "no_formal_education";
  }
  if (/^(primary|5th|class 5|class 1|class 2|class 3|class 4|std 5)/i.test(normalized)) {
    return "primary";
  }
  if (/^(middle|8th|class 8|class 6|class 7|std 8)/i.test(normalized)) {
    return "middle";
  }
  if (/^(10th|ssc|class 10|metric|matriculation|secondary)/i.test(normalized)) {
    return "secondary";
  }
  if (/^(12th|hsc|class 12|senior secondary|higher secondary|inter|intermediate|10\+2)/i.test(normalized)) {
    return "higher_secondary";
  }
  if (/^(diploma|polytechnic)/i.test(normalized)) {
    return "diploma";
  }
  if (/^(bachelor|undergraduate|ug|b\.?tech|b\.?e|b\.?sc|b\.?com|b\.?a|degree)/i.test(normalized)) {
    return "undergraduate";
  }
  if (/^(master|postgraduate|pg|m\.?tech|m\.?sc|m\.?com|m\.?a|mba)/i.test(normalized)) {
    return "postgraduate";
  }
  if (/^(phd|doctorate|doctor of philosophy)/i.test(normalized)) {
    return "doctorate";
  }

  return "secondary";
}

/**
 * Normalizes Indian state names and codes to standardized ISO 3166-2:IN state codes.
 */
export function normalizeStateCode(input: string): { stateCode: string; stateName: string } {
  const raw = input.trim().toUpperCase();

  const stateMap: Record<string, { stateCode: string; stateName: string }> = {
    MH: { stateCode: "MH", stateName: "Maharashtra" },
    MAHARASHTRA: { stateCode: "MH", stateName: "Maharashtra" },
    DL: { stateCode: "DL", stateName: "Delhi" },
    DELHI: { stateCode: "DL", stateName: "Delhi" },
    UP: { stateCode: "UP", stateName: "Uttar Pradesh" },
    UTTARPRADESH: { stateCode: "UP", stateName: "Uttar Pradesh" },
    KA: { stateCode: "KA", stateName: "Karnataka" },
    KARNATAKA: { stateCode: "KA", stateName: "Karnataka" },
    TN: { stateCode: "TN", stateName: "Tamil Nadu" },
    TAMILNADU: { stateCode: "TN", stateName: "Tamil Nadu" },
    GJ: { stateCode: "GJ", stateName: "Gujarat" },
    GUJARAT: { stateCode: "GJ", stateName: "Gujarat" },
    WB: { stateCode: "WB", stateName: "West Bengal" },
    WESTBENGAL: { stateCode: "WB", stateName: "West Bengal" },
  };

  const key = raw.replace(/\s+/g, "");
  if (stateMap[key]) {
    return stateMap[key];
  }

  return { stateCode: raw.slice(0, 2), stateName: input };
}

/**
 * Normalizes social category inputs to standard category tags.
 */
export function normalizeCategory(input?: string): SocialCategory {
  if (!input) return "general";
  const normalized = input.trim().toLowerCase();

  if (normalized.includes("sc") || normalized.includes("scheduled caste")) return "sc";
  if (normalized.includes("st") || normalized.includes("scheduled tribe")) return "st";
  if (normalized.includes("obc") || normalized.includes("other backward")) return "obc";
  if (normalized.includes("ews")) return "ewis";
  if (normalized.includes("minority")) return "minority";

  return "general";
}

/**
 * Data Minimization Inspector.
 * Distinguishes between REQUIRED, OPTIONAL, and NOT_COLLECTED fields on UserProfile.
 */
export function inspectDataMinimization(profile: Partial<UserProfile>): {
  hasRequired: boolean;
  missingRequiredFields: string[];
} {
  const requiredFields: (keyof UserProfile)[] = ["dateOfBirth", "location", "educationLevel", "employmentStatus"];

  const missing = requiredFields.filter((field) => !profile[field]);

  return {
    hasRequired: missing.length === 0,
    missingRequiredFields: missing,
  };
}
