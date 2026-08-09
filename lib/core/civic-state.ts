/**
 * lib/core/civic-state.ts
 *
 * Master Personalization Entry Point for Vayam Civic Intelligence Core.
 * Function: getPersonalizedCivicState(profile)
 *
 * Evaluates the user's profile against all deterministic engines:
 * - Age calculation & birthday countdown
 * - Life stage classification
 * - Approaching & current civic milestones
 * - Category relevance scores
 * - Eligibility evaluation with missing field detection
 * - Transparent relevance scoring & reasons
 * - Urgency calculation
 * - Temporal classification: NOW / NEXT / LATER
 * - Ranked recommendations
 *
 * Zero AI dependencies. Zero external network calls.
 */

import type {
  UserProfile,
  CivicItem,
  DetailedAge,
  LifeStageResult,
  CivicMilestone,
  Recommendation,
} from "./types";
import { calculateAgeDetailed } from "./age";
import { evaluateLifeStage } from "./lifestage";
import { deriveCivicMilestones } from "./milestones";
import { rankRecommendations } from "./recommendations";
import { DEMO_CIVIC_ITEMS } from "./data/demo-items";

export interface PersonalizedCategoryInfo {
  id: string;
  title: string;
  relevance: number; // 0 to 100
  count: number;
}

export interface PersonalizedCivicState {
  profile: UserProfile;
  age: DetailedAge;
  lifeStage: LifeStageResult;
  upcomingMilestones: CivicMilestone[];
  categories: PersonalizedCategoryInfo[];
  recommendations: {
    now: Recommendation[];
    next: Recommendation[];
    later: Recommendation[];
  };
  allRecommendations: Recommendation[];
}

/**
 * Computes the complete deterministic civic state for a given citizen profile.
 *
 * @param profile - Strongly typed UserProfile
 * @param availableItems - Array of CivicItems (defaults to DEMO_CIVIC_ITEMS)
 * @param referenceDate - Optional reference date string "YYYY-MM-DD"
 */
export function getPersonalizedCivicState(
  profile: UserProfile,
  availableItems: CivicItem[] = DEMO_CIVIC_ITEMS,
  referenceDate?: string
): PersonalizedCivicState {
  const refDateObj = referenceDate ? new Date(referenceDate) : new Date();

  // 1. Deterministic Age Calculation
  const age = calculateAgeDetailed(profile.dateOfBirth, refDateObj);

  // 2. Life Stage Classification
  const lifeStage = evaluateLifeStage(profile, refDateObj);

  // 3. Civic Milestones
  const milestones = deriveCivicMilestones(profile, refDateObj);
  const upcomingMilestones = milestones.filter(
    (m: CivicMilestone) => m.timing === "current" || m.timing === "upcoming"
  );

  // 4. Rank Recommendations across all available items
  const allRecommendations = rankRecommendations(profile, availableItems);

  // 5. Categorize Recommendations into NOW / NEXT / LATER
  const now: Recommendation[] = [];
  const next: Recommendation[] = [];
  const later: Recommendation[] = [];

  allRecommendations.forEach((rec) => {
    const isEligible =
      rec.eligibility.status === "LIKELY_ELIGIBLE" ||
      rec.eligibility.status === "MAYBE_ELIGIBLE" ||
      rec.eligibility.status === "UNKNOWN";

    const hasUrgentDeadline = rec.urgency === "urgent" || rec.urgency === "high";

    if (isEligible && (rec.score >= 0.65 || hasUrgentDeadline)) {
      now.push(rec);
    } else if (
      rec.eligibility.status === "NOT_YET" ||
      rec.score >= 0.4 ||
      rec.item.category === "rights"
    ) {
      next.push(rec);
    } else {
      later.push(rec);
    }
  });

  // 6. Aggregate Category Relevance Summary
  const categoryMap = new Map<string, { totalScore: number; count: number }>();

  allRecommendations.forEach((rec) => {
    const cat = rec.item.category;
    const existing = categoryMap.get(cat) || { totalScore: 0, count: 0 };
    categoryMap.set(cat, {
      totalScore: existing.totalScore + rec.score,
      count: existing.count + 1,
    });
  });

  const categories: PersonalizedCategoryInfo[] = Array.from(categoryMap.entries()).map(
    ([catId, data]) => ({
      id: catId,
      title: catId.charAt(0).toUpperCase() + catId.slice(1).replace("_", " "),
      relevance: Math.round((data.totalScore / Math.max(1, data.count)) * 100),
      count: data.count,
    })
  ).sort((a, b) => b.relevance - a.relevance);

  return {
    profile,
    age,
    lifeStage,
    upcomingMilestones,
    categories,
    recommendations: {
      now,
      next,
      later,
    },
    allRecommendations,
  };
}
