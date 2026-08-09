/**
 * lib/core/lifestage/index.ts
 *
 * Deterministic Life-Stage Engine for Vayam.
 * Classifies users into life stages based on age and socio-economic signals (education status, employment).
 */

import type { UserProfile, LifeStageType, LifeStageResult } from "../types";
import { getAgeInYears } from "../age";

/**
 * Evaluates the user's primary life stage combining age and socio-economic signals.
 *
 * @param profile - User profile or dateOfBirth
 * @param referenceDate - Reference date for age calculation
 */
export function evaluateLifeStage(
  profile: Partial<UserProfile> & { dateOfBirth: string },
  referenceDate: Date = new Date()
): LifeStageResult {
  const age = getAgeInYears(profile.dateOfBirth, referenceDate);
  const reasons: string[] = [];

  reasons.push(`Age is ${age} years`);

  // Base age classification
  let stage: LifeStageType = "young_adult";

  if (age < 14) {
    stage = "child";
    reasons.push("Under 14 years: Childhood developmental & primary education stage");
  } else if (age < 18) {
    stage = "adolescent";
    reasons.push("14–17 years: Secondary school & adolescent transition stage");
  } else if (age < 26) {
    stage = "young_adult";
    if (profile.employmentStatus === "student" || profile.isStudent) {
      reasons.push("18–25 years & enrolled: Higher education & early scholarship focus");
    } else if (profile.employmentStatus === "employed_private" || profile.employmentStatus === "employed_government" || profile.employmentStatus === "self_employed") {
      reasons.push("18–25 years & employed: Early career transition");
    } else {
      reasons.push("18–25 years: Young adulthood & skill development");
    }
  } else if (age < 46) {
    stage = "adult";
    if (profile.isKisan) {
      reasons.push("26–45 years & agricultural practitioner: Agricultural welfare & income support");
    } else {
      reasons.push("26–45 years: Working adult & family social security stage");
    }
  } else if (age < 60) {
    stage = "middle_aged";
    reasons.push("46–59 years: Mid-life, retirement planning & health security stage");
  } else {
    stage = "senior";
    reasons.push("60+ years: Senior citizen pension, healthcare & dignity benefits stage");
  }

  const labelMap: Record<LifeStageType, string> = {
    child: "Childhood",
    adolescent: "Adolescence",
    young_adult: "Young Adult",
    adult: "Adult",
    middle_aged: "Middle Aged",
    senior: "Senior Citizen",
  };

  return {
    stage,
    lifeStageLabel: labelMap[stage],
    confidence: "high",
    reasons,
  };
}
