/**
 * lib/eligibility/engine.ts
 *
 * Deterministic eligibility evaluation engine.
 *
 * The engine takes a UserProfile and a GovernmentScheme and returns
 * a structured EligibilityResult.  It is entirely rule-based —
 * no AI is involved in this calculation.
 *
 * Architectural constraint: this file must not import from lib/ai/.
 * The AI layer may use EligibilityResult to generate explanations,
 * but it must never compute eligibility itself.
 */

import type { UserProfile } from "@/types/user";
import type { GovernmentScheme, SchemeRule } from "@/types/schemes";
import type { EligibilityResult, EligibilityStatus } from "@/types/civic";
import { calculateAgeInYears } from "@/lib/civic/age";

// ---------------------------------------------------------------------------
// Rule evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluate a single SchemeRule against a UserProfile.
 * Returns true if the rule passes (user satisfies the criterion).
 */
function evaluateRule(rule: SchemeRule, profile: UserProfile): boolean {
  // Safely traverse dot-notation field paths (e.g. "location.stateCode")
  const fieldValue = rule.field
    .split(".")
    .reduce<unknown>((obj, key) => {
      if (obj !== null && typeof obj === "object" && key in obj) {
        return (obj as Record<string, unknown>)[key];
      }
      return undefined;
    }, profile as unknown);

  switch (rule.operator) {
    case "exists":
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
    case "eq":
      return fieldValue === rule.value;
    case "ne":
      return fieldValue !== rule.value;
    case "gt":
      return typeof fieldValue === "number" && typeof rule.value === "number" && fieldValue > rule.value;
    case "gte":
      return typeof fieldValue === "number" && typeof rule.value === "number" && fieldValue >= rule.value;
    case "lt":
      return typeof fieldValue === "number" && typeof rule.value === "number" && fieldValue < rule.value;
    case "lte":
      return typeof fieldValue === "number" && typeof rule.value === "number" && fieldValue <= rule.value;
    case "in":
      return Array.isArray(rule.values) && rule.values.includes(fieldValue);
    case "not_in":
      return Array.isArray(rule.values) && !rule.values.includes(fieldValue);
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// Main eligibility evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluate a user's eligibility for a single government scheme.
 *
 * Returns EligibilityStatus "unknown" when required profile fields are
 * missing — the UI layer can then prompt the user to provide them.
 */
export function evaluateEligibility(
  profile: UserProfile,
  scheme: GovernmentScheme
): EligibilityResult {
  const reasons: string[] = [];
  const missingProfileFields: (keyof UserProfile)[] = [];
  let status: EligibilityStatus = "eligible";

  const ageInYears = calculateAgeInYears(profile.dateOfBirth);

  // Age checks
  if (scheme.minAge !== undefined && ageInYears < scheme.minAge) {
    status = "ineligible";
    reasons.push(`Minimum age requirement is ${scheme.minAge} years.`);
  }
  if (scheme.maxAge !== undefined && ageInYears > scheme.maxAge) {
    status = "ineligible";
    reasons.push(`Maximum age for this scheme is ${scheme.maxAge} years.`);
  }

  // Gender check
  if (scheme.eligibleGenders && scheme.eligibleGenders.length > 0) {
    if (!scheme.eligibleGenders.includes(profile.gender)) {
      status = "ineligible";
      reasons.push(`This scheme is only available for: ${scheme.eligibleGenders.join(", ")}.`);
    }
  }

  // State check
  if (scheme.stateCode && profile.location.stateCode !== scheme.stateCode) {
    status = "ineligible";
    reasons.push(`This is a state scheme for ${scheme.stateCode}. Your registered state is ${profile.location.stateCode}.`);
  }

  // Income check
  if (scheme.maxAnnualIncomeInr !== undefined) {
    if (profile.annualIncomeInr === undefined) {
      missingProfileFields.push("annualIncomeInr");
      if (status === "eligible") status = "unknown";
    } else if (profile.annualIncomeInr > scheme.maxAnnualIncomeInr) {
      status = "ineligible";
      reasons.push(
        `Annual income must be below ₹${scheme.maxAnnualIncomeInr.toLocaleString("en-IN")}.`
      );
    }
  }

  // Residence type check
  if (scheme.eligibleResidenceTypes && scheme.eligibleResidenceTypes.length > 0) {
    if (!scheme.eligibleResidenceTypes.includes(profile.location.residenceType)) {
      status = "ineligible";
      reasons.push(
        `This scheme is only available in: ${scheme.eligibleResidenceTypes.join(", ")} areas.`
      );
    }
  }

  // Education check
  if (scheme.eligibleEducationLevels && scheme.eligibleEducationLevels.length > 0) {
    if (!scheme.eligibleEducationLevels.includes(profile.educationLevel)) {
      status = "ineligible";
      reasons.push(`Required education level: ${scheme.eligibleEducationLevels.join(", ")}.`);
    }
  }

  // Employment status check
  if (scheme.eligibleEmploymentStatuses && scheme.eligibleEmploymentStatuses.length > 0) {
    if (!scheme.eligibleEmploymentStatuses.includes(profile.employmentStatus)) {
      status = "ineligible";
      reasons.push(`This scheme targets: ${scheme.eligibleEmploymentStatuses.join(", ")}.`);
    }
  }

  // Custom rules
  for (const rule of scheme.rules) {
    if (!evaluateRule(rule, profile)) {
      status = "ineligible";
      reasons.push(`Eligibility rule not met: ${rule.field} ${rule.operator} ${rule.value ?? ""}`);
    }
  }

  return {
    schemeId: scheme.id,
    status,
    reasons,
    missingProfileFields,
  };
}

/**
 * Evaluate eligibility across multiple schemes.
 * Returns results in the same order as the input schemes array.
 */
export function evaluateEligibilityBatch(
  profile: UserProfile,
  schemes: GovernmentScheme[]
): EligibilityResult[] {
  return schemes.map((scheme) => evaluateEligibility(profile, scheme));
}
