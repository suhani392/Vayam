/**
 * lib/core/recommendations/index.ts
 *
 * Deterministic Recommendation Engine for Vayam.
 * Ranks civic opportunities for a user by evaluating eligibility, relevance, and urgency.
 * Completely deterministic — zero AI ranking.
 */

import type {
  UserProfile,
  CivicItem,
  Recommendation,
  EvaluationEligibilityStatus,
} from "../types";
import { evaluateEligibility } from "../eligibility";
import { calculateRelevance } from "../relevance";

/**
 * Ranks available civic items for a given user profile.
 *
 * @param profile - User profile
 * @param items - Array of available civic items
 */
export function rankRecommendations(
  profile: UserProfile,
  items: CivicItem[]
): Recommendation[] {
  const recommendations: Recommendation[] = items.map((item) => {
    const eligibility = evaluateEligibility(profile, item);
    const relevance = calculateRelevance(profile, item, eligibility);

    // Calculate urgency
    let urgency: "urgent" | "high" | "normal" | "low" = "normal";
    if (item.deadline) {
      const diffDays = Math.ceil(
        (new Date(item.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays <= 7 && diffDays > 0) urgency = "urgent";
      else if (diffDays <= 30 && diffDays > 0) urgency = "high";
    }

    const combinedReasons = [
      ...relevance.reasons,
      ...eligibility.reasons.map((r) => `Eligibility: ${r}`),
    ];

    return {
      item,
      score: relevance.score,
      eligibility,
      relevance,
      reasons: combinedReasons,
      urgency,
      category: item.category,
    };
  });

  // Deterministic sorting hierarchy:
  // 1. Likely Eligible / Unknown prior to Not Eligible
  // 2. Higher relevance score
  // 3. Urgent deadlines first
  const statusPriority: Record<EvaluationEligibilityStatus, number> = {
    LIKELY_ELIGIBLE: 4,
    UNKNOWN: 3,
    MAYBE_ELIGIBLE: 2,
    NOT_YET: 1,
    NOT_ELIGIBLE: 0,
  };

  return recommendations.sort((a, b) => {
    const statusDiff = statusPriority[b.eligibility.status] - statusPriority[a.eligibility.status];
    if (statusDiff !== 0) return statusDiff;

    const scoreDiff = b.score - a.score;
    if (scoreDiff !== 0) return scoreDiff;

    return a.item.title.localeCompare(b.item.title);
  });
}
