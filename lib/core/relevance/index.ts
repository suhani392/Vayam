/**
 * lib/core/relevance/index.ts
 *
 * Deterministic Relevance Engine for Vayam.
 * Computes an explainable relevance score [0, 1] based on weighted factors.
 * No black-box AI scores.
 */

import type {
  UserProfile,
  CivicItem,
  EligibilityResult,
  RelevanceResult,
  RelevanceScoreConfig,
} from "../types";
import { getAgeInYears } from "../age";
import { evaluateLifeStage } from "../lifestage";

export const DEFAULT_RELEVANCE_CONFIG: RelevanceScoreConfig = {
  ageWeight: 0.2,
  lifeStageWeight: 0.2,
  educationWeight: 0.15,
  locationWeight: 0.15,
  eligibilityWeight: 0.2,
  deadlineWeight: 0.1,
};

/**
 * Calculates a transparent, explainable relevance score for a civic item.
 */
export function calculateRelevance(
  profile: UserProfile,
  item: CivicItem,
  eligibility: EligibilityResult,
  config: RelevanceScoreConfig = DEFAULT_RELEVANCE_CONFIG
): RelevanceResult {
  const age = getAgeInYears(profile.dateOfBirth);
  const lifeStage = evaluateLifeStage(profile).stage;
  const reasons: string[] = [];

  let ageScore = 0;
  let lifeStageScore = 0;
  let educationScore = 0;
  let locationScore = 0;
  let eligibilityScore = 0;
  let deadlineScore = 0;

  // 1. Age Factor
  if (item.minAge !== undefined || item.maxAge !== undefined) {
    const min = item.minAge ?? 0;
    const max = item.maxAge ?? 100;
    if (age >= min && age <= max) {
      ageScore = 1;
      reasons.push(`✓ Age ${age} matches target range (${min}–${max} years)`);
    }
  } else {
    ageScore = 0.8;
  }

  // 2. Life Stage Factor
  if (
    (lifeStage === "young_adult" || lifeStage === "adolescent") &&
    (item.category === "education" || item.category === "scholarship" || item.category === "youth")
  ) {
    lifeStageScore = 1;
    reasons.push(`✓ Category (${item.category}) aligns with ${lifeStage} life stage`);
  } else if (lifeStage === "senior" && (item.category === "senior_citizens" || item.category === "social_welfare")) {
    lifeStageScore = 1;
    reasons.push(`✓ Senior citizen welfare focus matches profile`);
  } else {
    lifeStageScore = 0.7;
  }

  // 3. Education Factor
  if (item.eligibleEducationLevels && item.eligibleEducationLevels.length > 0) {
    if (item.eligibleEducationLevels.includes(profile.educationLevel)) {
      educationScore = 1;
      reasons.push(`✓ Education level (${profile.educationLevel}) matches requirement`);
    }
  } else {
    educationScore = 0.8;
  }

  // 4. Location Factor
  if (!item.stateCode || item.stateCode === "IN") {
    locationScore = 1;
    reasons.push(`✓ Central nationwide scheme available in ${profile.location.stateName}`);
  } else if (profile.location && profile.location.stateCode === item.stateCode) {
    locationScore = 1;
    reasons.push(`✓ State-specific scheme matches residence (${profile.location.stateName})`);
  }

  // 5. Eligibility Factor
  if (eligibility.status === "LIKELY_ELIGIBLE") {
    eligibilityScore = 1;
    reasons.push(`✓ Profile satisfies eligibility constraints`);
  } else if (eligibility.status === "UNKNOWN") {
    eligibilityScore = 0.5;
  } else if (eligibility.status === "NOT_YET") {
    eligibilityScore = 0.4;
  }

  // 6. Deadline Proximity Factor
  if (item.deadline) {
    const deadlineDate = new Date(item.deadline);
    const diffDays = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays <= 30) {
      deadlineScore = 1;
      reasons.push(`✓ Application deadline approaching in ${diffDays} days`);
    } else {
      deadlineScore = 0.5;
    }
  } else {
    deadlineScore = 0.5;
  }

  // Weighted sum calculation
  const totalScore =
    ageScore * config.ageWeight +
    lifeStageScore * config.lifeStageWeight +
    educationScore * config.educationWeight +
    locationScore * config.locationWeight +
    eligibilityScore * config.eligibilityWeight +
    deadlineScore * config.deadlineWeight;

  const finalScore = Math.min(1, Math.max(0, Math.round(totalScore * 100) / 100));

  return {
    itemId: item.id,
    score: finalScore,
    factors: {
      ageMatch: ageScore === 1,
      lifeStageMatch: lifeStageScore === 1,
      educationMatch: educationScore === 1,
      locationMatch: locationScore === 1,
      eligibilityMatch: eligibilityScore === 1,
      deadlineApproaching: deadlineScore === 1,
    },
    reasons,
  };
}
