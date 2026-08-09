/**
 * lib/relevance/scorer.ts
 *
 * Relevance scoring engine.
 *
 * Given a UserProfile and a GovernmentScheme, produces a numeric score
 * in [0, 1] indicating how relevant that scheme is to the user's current
 * life situation.
 *
 * This is distinct from eligibility:
 * - Eligibility answers: "Can this user apply?"
 * - Relevance answers:   "Should we show this scheme prominently?"
 *
 * The scorer is deterministic and does not use AI.
 */

import type { UserProfile } from "@/types/user";
import type { GovernmentScheme } from "@/types/schemes";
import type { RelevanceResult, LifeStageContext } from "@/types/civic";

/**
 * Score a single scheme's relevance for a user.
 * Returns a RelevanceResult with score in [0, 1] and top contributing factors.
 */
export function scoreRelevance(
  profile: UserProfile,
  scheme: GovernmentScheme,
  lifeStageContext: LifeStageContext
): RelevanceResult {
  let score = 0;
  const factors: Array<{ label: string; weight: number }> = [];

  // Age fit: schemes whose age range covers the user score higher
  if (scheme.minAge !== undefined || scheme.maxAge !== undefined) {
    const { ageInYears } = lifeStageContext;
    const minOk = scheme.minAge === undefined || ageInYears >= scheme.minAge;
    const maxOk = scheme.maxAge === undefined || ageInYears <= scheme.maxAge;
    if (minOk && maxOk) {
      score += 0.3;
      factors.push({ label: "Age range matches", weight: 0.3 });
    }
  } else {
    // No age restriction — applicable to all
    score += 0.1;
    factors.push({ label: "No age restriction", weight: 0.1 });
  }

  // State match: state-level schemes in the user's state score higher
  if (!scheme.stateCode || scheme.stateCode === profile.location.stateCode) {
    score += 0.2;
    factors.push({ label: "Available in your state", weight: 0.2 });
  }

  // Gender match
  if (!scheme.eligibleGenders || scheme.eligibleGenders.length === 0 ||
      scheme.eligibleGenders.includes(profile.gender)) {
    score += 0.15;
    factors.push({ label: "Applies to your gender", weight: 0.15 });
  }

  // Education match
  if (!scheme.eligibleEducationLevels || scheme.eligibleEducationLevels.length === 0 ||
      scheme.eligibleEducationLevels.includes(profile.educationLevel)) {
    score += 0.15;
    factors.push({ label: "Matches your education level", weight: 0.15 });
  }

  // Employment status match
  if (!scheme.eligibleEmploymentStatuses || scheme.eligibleEmploymentStatuses.length === 0 ||
      scheme.eligibleEmploymentStatuses.includes(profile.employmentStatus)) {
    score += 0.1;
    factors.push({ label: "Matches your employment status", weight: 0.1 });
  }

  // Residence match
  if (!scheme.eligibleResidenceTypes || scheme.eligibleResidenceTypes.length === 0 ||
      scheme.eligibleResidenceTypes.includes(profile.location.residenceType)) {
    score += 0.1;
    factors.push({ label: "Matches your area type", weight: 0.1 });
  }

  // Normalise to [0, 1] and cap at 1.0
  const normalisedScore = Math.min(score, 1.0);

  // Return top 3 factors for transparency
  const topFactors = factors
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((f) => f.label);

  return {
    schemeId: scheme.id,
    score: normalisedScore,
    topFactors,
  };
}

/**
 * Score multiple schemes and return them sorted by relevance (highest first).
 */
export function scoreAndRankSchemes(
  profile: UserProfile,
  schemes: GovernmentScheme[],
  lifeStageContext: LifeStageContext
): RelevanceResult[] {
  return schemes
    .map((scheme) => scoreRelevance(profile, scheme, lifeStageContext))
    .sort((a, b) => b.score - a.score);
}
