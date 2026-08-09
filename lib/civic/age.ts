/**
 * lib/civic/age.ts
 *
 * Deterministic age and life-stage calculations.
 *
 * This module is the single source of truth for all age-related logic
 * in Vayam.  It must not import anything from lib/ai/ or lib/eligibility/.
 *
 * All functions are pure — given the same inputs they always return the
 * same outputs and have no side effects.
 */

import type { LifeStage, LifeStageContext } from "@/types/civic";

/**
 * Calculate the user's completed age in full years as of a reference date.
 *
 * @param dateOfBirth - ISO 8601 date string: "YYYY-MM-DD"
 * @param referenceDate - Defaults to today (UTC) if not provided
 */
export function calculateAgeInYears(
  dateOfBirth: string,
  referenceDate: Date = new Date()
): number {
  const dob = new Date(dateOfBirth);

  let years = referenceDate.getFullYear() - dob.getFullYear();

  // Subtract one year if the birthday hasn't occurred yet this calendar year
  const hasHadBirthdayThisYear =
    referenceDate.getMonth() > dob.getMonth() ||
    (referenceDate.getMonth() === dob.getMonth() &&
      referenceDate.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    years -= 1;
  }

  return years;
}

/**
 * Calculate the user's age in complete months as of a reference date.
 */
export function calculateAgeInMonths(
  dateOfBirth: string,
  referenceDate: Date = new Date()
): number {
  const dob = new Date(dateOfBirth);
  const years = referenceDate.getFullYear() - dob.getFullYear();
  const months = referenceDate.getMonth() - dob.getMonth();
  const dayAdjustment = referenceDate.getDate() < dob.getDate() ? -1 : 0;

  return years * 12 + months + dayAdjustment;
}

/**
 * Determine the life stage based on completed years of age.
 *
 * These boundaries are used across the eligibility and relevance engines
 * to filter and prioritise scheme recommendations.  They are deliberately
 * kept as a pure function so the boundaries can be changed in one place.
 */
export function deriveLifeStage(ageInYears: number): LifeStage {
  if (ageInYears < 14) return "child";
  if (ageInYears < 18) return "adolescent";
  if (ageInYears < 26) return "young_adult";
  if (ageInYears < 46) return "adult";
  if (ageInYears < 60) return "middle_aged";
  return "senior";
}

/**
 * Build a complete LifeStageContext from a date of birth.
 * This is the primary entry point for the rest of the Civic Intelligence layer.
 */
export function buildLifeStageContext(
  dateOfBirth: string,
  referenceDate: Date = new Date()
): LifeStageContext {
  const ageInYears = calculateAgeInYears(dateOfBirth, referenceDate);
  const ageInMonths = calculateAgeInMonths(dateOfBirth, referenceDate);
  const stage = deriveLifeStage(ageInYears);

  return { stage, ageInYears, ageInMonths };
}
