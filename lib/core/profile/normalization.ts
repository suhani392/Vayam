/**
 * lib/core/profile/normalization.ts
 *
 * Profile Normalization & Data Minimization Layer.
 * Sanitizes and normalizes raw user inputs into standardized internal formats.
 */

import type { UserProfile, EducationLevel, ProfileLocation, SocialCategory } from "../types";

export const ALL_INDIAN_STATES: Array<{ code: string; name: string }> = [
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CG", name: "Chhattisgarh" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OD", name: "Odisha" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TS", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "CH", name: "Chandigarh" },
  { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "LA", name: "Ladakh" },
  { code: "LD", name: "Lakshadweep" },
  { code: "PY", name: "Puducherry" },
];

/**
 * Maps raw education string inputs to canonical EducationLevel.
 */
export function normalizeEducationLevel(input: string): EducationLevel {
  if (!input) return "" as any;
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
export function normalizeStateCode(input?: string | null): { stateCode: string; stateName: string } {
  if (!input || !input.trim()) {
    return { stateCode: "", stateName: "" };
  }

  const raw = input.trim().toUpperCase();

  const found = ALL_INDIAN_STATES.find(
    (s) => s.code === raw || s.name.toUpperCase() === raw || s.name.toUpperCase().replace(/\s+/g, "") === raw.replace(/\s+/g, "")
  );

  if (found) {
    return { stateCode: found.code, stateName: found.name };
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
