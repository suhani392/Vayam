/**
 * lib/timeline/types.ts
 *
 * Strongly typed LifeEvent and Timeline models for Vayam Phase 10.
 * Reuses Phase 5 UserProfile, CivicMilestone, and KnowledgeRecord schemas.
 */

import type { UserProfile, DetailedAge, CivicMilestone } from "@/lib/core/types";
import type { KnowledgeRecord } from "@/lib/knowledge/types";

export type LifeEventState =
  | "CURRENT"
  | "UPCOMING"
  | "LATER"
  | "COMPLETED"
  | "REQUIRES_VERIFICATION";

export type LifeEventPriority = "HIGH" | "MEDIUM" | "LOW";

export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  category: "age_milestone" | "education" | "career" | "senior" | "civic_right" | "services";
  status: LifeEventState;
  eventDate?: string; // YYYY-MM-DD
  daysUntil?: number;
  isToday?: boolean;
  triggerAgeYears?: number;
  urgency: "urgent" | "high" | "medium" | "low";
  priority: LifeEventPriority;
  relatedKnowledgeIds: string[];
  relatedRecords?: KnowledgeRecord[];
  ruleReasons: string[];
  source?: { name: string; url: string };
  actionLabel?: string;
  actionUrl?: string;
  missingFields?: string[];
}

export interface SmartTimelineState {
  profile: UserProfile | null;
  age: DetailedAge | null;
  heroEvent: LifeEvent | null;
  nowEvents: LifeEvent[];
  nextEvents: LifeEvent[];
  laterEvents: LifeEvent[];
  completedEvents: LifeEvent[];
  allEvents: LifeEvent[];
}
