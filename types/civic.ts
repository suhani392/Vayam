/**
 * Types for the Vayam Civic Intelligence layer.
 *
 * These types describe what the civic engine produces — eligibility
 * results, relevance scores, timeline events, and life-stage context.
 *
 * None of these types contain calculation logic.
 * Logic lives in lib/civic/*, lib/eligibility/*, lib/timeline/*, etc.
 */

import type { UserProfile } from "./user";

// ---------------------------------------------------------------------------
// Life stage
// ---------------------------------------------------------------------------

/**
 * Broad life stage derived from age and socio-economic context.
 * Used to filter and prioritize scheme recommendations.
 */
export type LifeStage =
  | "child"           // 0–13
  | "adolescent"      // 14–17
  | "young_adult"     // 18–25
  | "adult"           // 26–45
  | "middle_aged"     // 46–59
  | "senior";         // 60+

export interface LifeStageContext {
  stage: LifeStage;
  ageInYears: number;
  ageInMonths: number;
}

// ---------------------------------------------------------------------------
// Eligibility
// ---------------------------------------------------------------------------

export type EligibilityStatus = "eligible" | "ineligible" | "unknown" | "requires_verification" | "not_eligible";

/**
 * Result of evaluating a single scheme or service against a UserProfile.
 */
export interface EligibilityResult {
  schemeId: string;
  status: EligibilityStatus;
  /**
   * Human-readable reasons explaining why the user is or isn't eligible.
   * The AI layer may translate/explain these — the Civic layer generates them.
   */
  reasons: string[];
  /**
   * Fields on UserProfile that are missing and required for a conclusive result.
   */
  missingProfileFields: (keyof UserProfile)[];
}

// ---------------------------------------------------------------------------
// Relevance
// ---------------------------------------------------------------------------

/**
 * How strongly a scheme, service, or right is relevant to a user.
 * Scores are in [0, 1].  The Civic Intelligence layer calculates these;
 * the UI layer only renders them.
 */
export interface RelevanceResult {
  schemeId: string;
  /** 0 = not relevant, 1 = highly relevant */
  score: number;
  /** Top contributing factors, for transparency */
  topFactors: string[];
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export type TimelineEventCategory =
  | "deadline"
  | "application_window"
  | "renewal"
  | "civic_action"
  | "life_event"
  | "government_date";

/**
 * A time-bound event relevant to the user — e.g. a scheme deadline,
 * an application window opening, or a civic registration date.
 */
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  category: TimelineEventCategory;
  date: string;        // ISO 8601 date
  schemeId?: string;   // Link back to a scheme if applicable
  isRecurring: boolean;
  /** Whether the user should take action (true) or just be aware (false) */
  requiresAction: boolean;
}

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface Notification {
  id: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  relatedSchemeId?: string;
  relatedTimelineEventId?: string;
  createdAt: string;
  readAt?: string;
}
