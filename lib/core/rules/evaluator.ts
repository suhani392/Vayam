/**
 * lib/core/rules/evaluator.ts
 *
 * Generic Rule Engine for Vayam.
 * Evaluates composable rule expressions (Atomic conditions and AND/OR/NOT RuleGroups)
 * against a UserProfile safely and deterministically.
 */

import type {
  UserProfile,
  AtomicRuleCondition,
  RuleGroup,
  RuleExpression,
  RuleOperator,
} from "../types";
import { getAgeInYears } from "../age";

export interface RuleEvaluationDetail {
  passed: boolean;
  missingField?: keyof UserProfile;
  reason?: string;
}

/**
 * Resolves a field value from UserProfile or dynamic calculated getters (like age).
 */
export function getFieldValue(profile: UserProfile, field: string): unknown {
  if (field === "age" || field === "ageInYears") {
    return getAgeInYears(profile.dateOfBirth);
  }

  if (field.startsWith("location.")) {
    const sub = field.split(".")[1];
    return profile.location ? (profile.location as any)[sub] : undefined;
  }

  if (field === "isStudent") {
    return profile.isStudent ?? (profile.employmentStatus === "student");
  }

  return (profile as any)[field];
}

/**
 * Evaluates a single atomic rule condition on UserProfile.
 */
export function evaluateAtomicCondition(
  condition: AtomicRuleCondition,
  profile: UserProfile
): RuleEvaluationDetail {
  const value = getFieldValue(profile, condition.field);

  // Missing value check
  if (value === undefined || value === null || value === "") {
    if (condition.operator === "exists") {
      return { passed: false, reason: `${condition.field} is missing` };
    }
    return {
      passed: false,
      missingField: condition.field as keyof UserProfile,
      reason: `Required field ${condition.field} is not provided`,
    };
  }

  switch (condition.operator) {
    case "eq":
      return {
        passed: value === condition.value,
        reason: value === condition.value ? undefined : `${condition.field} does not match ${condition.value}`,
      };
    case "ne":
      return {
        passed: value !== condition.value,
        reason: value !== condition.value ? undefined : `${condition.field} equals ${condition.value}`,
      };
    case "gt":
      return {
        passed: Number(value) > Number(condition.value),
        reason: Number(value) > Number(condition.value) ? undefined : `${condition.field} (${value}) is not > ${condition.value}`,
      };
    case "gte":
      return {
        passed: Number(value) >= Number(condition.value),
        reason: Number(value) >= Number(condition.value) ? undefined : `${condition.field} (${value}) is not >= ${condition.value}`,
      };
    case "lt":
      return {
        passed: Number(value) < Number(condition.value),
        reason: Number(value) < Number(condition.value) ? undefined : `${condition.field} (${value}) is not < ${condition.value}`,
      };
    case "lte":
      return {
        passed: Number(value) <= Number(condition.value),
        reason: Number(value) <= Number(condition.value) ? undefined : `${condition.field} (${value}) is not <= ${condition.value}`,
      };
    case "in":
      if (!Array.isArray(condition.values)) return { passed: false };
      return {
        passed: condition.values.includes(value),
        reason: condition.values.includes(value) ? undefined : `${condition.field} (${value}) is not in allowed list`,
      };
    case "not_in":
      if (!Array.isArray(condition.values)) return { passed: true };
      return {
        passed: !condition.values.includes(value),
        reason: !condition.values.includes(value) ? undefined : `${condition.field} (${value}) is in excluded list`,
      };
    case "range":
      const min = condition.rangeMin ?? -Infinity;
      const max = condition.rangeMax ?? Infinity;
      const numVal = Number(value);
      const inRange = numVal >= min && numVal <= max;
      return {
        passed: inRange,
        reason: inRange ? undefined : `${condition.field} (${numVal}) is out of range [${min}, ${max}]`,
      };
    case "exists":
      return { passed: true };
    default:
      return { passed: false, reason: "Unsupported operator" };
  }
}

/**
 * Type guard checking if an expression is a RuleGroup.
 */
export function isRuleGroup(expr: RuleExpression): expr is RuleGroup {
  return "combinator" in expr && Array.isArray(expr.conditions);
}

/**
 * Evaluates an entire RuleExpression (AtomicCondition or RuleGroup).
 */
export function evaluateRuleExpression(
  expr: RuleExpression,
  profile: UserProfile
): { passed: boolean; missingFields: (keyof UserProfile)[]; reasons: string[] } {
  const missingFields: (keyof UserProfile)[] = [];
  const reasons: string[] = [];

  if (!isRuleGroup(expr)) {
    const res = evaluateAtomicCondition(expr, profile);
    if (res.missingField) missingFields.push(res.missingField);
    if (res.reason) reasons.push(res.reason);
    return { passed: res.passed, missingFields, reasons };
  }

  const group = expr;
  let groupPassed = group.combinator === "AND";

  for (const cond of group.conditions) {
    const subRes = evaluateRuleExpression(cond, profile);
    subRes.missingFields.forEach((f) => {
      if (!missingFields.includes(f)) missingFields.push(f);
    });
    subRes.reasons.forEach((r) => reasons.push(r));

    if (group.combinator === "AND") {
      groupPassed = groupPassed && subRes.passed;
    } else {
      groupPassed = groupPassed || subRes.passed;
    }
  }

  if (group.negate) {
    groupPassed = !groupPassed;
  }

  return { passed: groupPassed, missingFields, reasons };
}
