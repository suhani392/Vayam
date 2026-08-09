/**
 * lib/core/eligibility/index.ts
 *
 * Deterministic Eligibility Engine for Vayam.
 * Evaluates a UserProfile against a CivicItem's rules and constraints.
 * Distinguishes between LIKELY_ELIGIBLE, MAYBE_ELIGIBLE, NOT_ELIGIBLE, NOT_YET, and UNKNOWN.
 */

import type {
  UserProfile,
  CivicItem,
  EligibilityResult,
  EvaluationEligibilityStatus,
} from "../types";
import { getAgeInYears } from "../age";
import { evaluateRuleExpression } from "../rules/evaluator";

/**
 * Evaluates user profile eligibility for a given civic item.
 *
 * @param profile - User profile
 * @param item - Civic item (scheme, service, right, scholarship)
 */
export function evaluateEligibility(
  profile: UserProfile,
  item: CivicItem
): EligibilityResult {
  const reasons: string[] = [];
  const missingFields: (keyof UserProfile)[] = [];
  const age = getAgeInYears(profile.dateOfBirth);

  let isNotYet = false;

  // 1. Direct Age Constraints
  if (item.minAge !== undefined) {
    if (age < item.minAge) {
      isNotYet = true;
      reasons.push(`Minimum age requirement is ${item.minAge} years (current age: ${age})`);
    } else {
      reasons.push(`Age criterion (${item.minAge}+) met`);
    }
  }

  if (item.maxAge !== undefined) {
    if (age > item.maxAge) {
      reasons.push(`Maximum age limit is ${item.maxAge} years (current age: ${age})`);
      return {
        itemId: item.id,
        status: "NOT_ELIGIBLE",
        reasons,
        missingFields: [],
        explanation: `Age exceeds maximum limit of ${item.maxAge} years.`,
      };
    } else {
      reasons.push(`Age limit (${item.maxAge} years max) met`);
    }
  }

  // 2. Gender Constraints
  if (item.eligibleGenders && item.eligibleGenders.length > 0) {
    if (!item.eligibleGenders.includes(profile.gender)) {
      reasons.push(`Gender requirement (${item.eligibleGenders.join(", ")}) not matched`);
      return {
        itemId: item.id,
        status: "NOT_ELIGIBLE",
        reasons,
        missingFields: [],
        explanation: `Gender criteria does not match target demographic.`,
      };
    } else {
      reasons.push(`Gender criteria (${profile.gender}) met`);
    }
  }

  // 3. Location / State Constraints
  if (item.stateCode) {
    if (!profile.location || !profile.location.stateCode) {
      missingFields.push("location");
    } else if (profile.location.stateCode !== item.stateCode && item.stateCode !== "IN") {
      reasons.push(`Scheme applicable in state ${item.stateCode} (profile state: ${profile.location.stateCode})`);
      return {
        itemId: item.id,
        status: "NOT_ELIGIBLE",
        reasons,
        missingFields: [],
        explanation: `State residence does not match scheme location constraints.`,
      };
    } else {
      reasons.push(`State residence (${profile.location.stateName}) verified`);
    }
  }

  // 4. Education Constraints
  if (item.eligibleEducationLevels && item.eligibleEducationLevels.length > 0) {
    if (!profile.educationLevel) {
      missingFields.push("educationLevel");
    } else if (!item.eligibleEducationLevels.includes(profile.educationLevel)) {
      reasons.push(`Education level (${profile.educationLevel}) does not match allowed levels`);
      return {
        itemId: item.id,
        status: "NOT_ELIGIBLE",
        reasons,
        missingFields: [],
        explanation: `Current education level does not satisfy scheme criteria.`,
      };
    } else {
      reasons.push(`Education level criteria met`);
    }
  }

  // 5. Income Constraints (Missing Field Handling)
  if (item.maxAnnualIncomeInr !== undefined) {
    if (profile.annualIncomeInr === undefined || profile.annualIncomeInr === null) {
      missingFields.push("annualIncomeInr");
      reasons.push(`Income criteria requires annual household income information`);
    } else if (profile.annualIncomeInr > item.maxAnnualIncomeInr) {
      reasons.push(`Annual income (₹${profile.annualIncomeInr.toLocaleString("en-IN")}) exceeds ceiling limit of ₹${item.maxAnnualIncomeInr.toLocaleString("en-IN")}`);
      return {
        itemId: item.id,
        status: "NOT_ELIGIBLE",
        reasons,
        missingFields: [],
        explanation: `Annual household income exceeds maximum ceiling limit.`,
      };
    } else {
      reasons.push(`Income ceiling (₹${item.maxAnnualIncomeInr.toLocaleString("en-IN")} max) met`);
    }
  }

  // 6. Custom Rules Evaluation
  if (item.rules && item.rules.length > 0) {
    for (const rule of item.rules) {
      const ruleRes = evaluateRuleExpression(rule, profile);
      ruleRes.missingFields.forEach((f) => {
        if (!missingFields.includes(f)) missingFields.push(f);
      });
      ruleRes.reasons.forEach((r) => reasons.push(r));

      if (!ruleRes.passed && ruleRes.missingFields.length === 0) {
        return {
          itemId: item.id,
          status: "NOT_ELIGIBLE",
          reasons,
          missingFields: [],
          explanation: `Specific eligibility rule evaluation failed.`,
        };
      }
    }
  }

  // 7. Determine Final Status
  let status: EvaluationEligibilityStatus = "LIKELY_ELIGIBLE";

  if (missingFields.length > 0) {
    status = "UNKNOWN";
    reasons.push(`Additional profile fields required: ${missingFields.join(", ")}`);
  } else if (isNotYet) {
    status = "NOT_YET";
  }

  const explanation =
    status === "LIKELY_ELIGIBLE"
      ? "The available profile information suggests that you qualify for this opportunity."
      : status === "NOT_YET"
      ? "You will become eligible when reaching the minimum age/criteria threshold."
      : status === "UNKNOWN"
      ? "We do not have enough profile information to determine full eligibility."
      : "You meet conditional criteria; official department verification is required.";

  return {
    itemId: item.id,
    status,
    reasons,
    missingFields,
    explanation,
  };
}
