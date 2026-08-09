/**
 * lib/ai/tools.ts
 *
 * Deterministic Vayam Tool Layer for AI Civic Assistant.
 * Exposes canonical query and evaluation methods over KnowledgeRepository,
 * Civic Intelligence Core, Eligibility Engine, Milestone Engine, and Life Event Engine.
 *
 * The AI Assistant MUST call these tools to retrieve facts instead of hallucinating.
 */

import { KnowledgeRepository } from "../knowledge/repository";
import { searchKnowledgeRecords, getPersonalizedKnowledge, getKnowledgeDetails } from "../knowledge/search";
import { evaluateEligibility as evaluateCoreEligibility, getPersonalizedCivicState } from "../core";
import { deriveLifeEvents, getSmartTimelineState } from "../timeline/events";
import type { KnowledgeRecord } from "../knowledge/types";
import type { UserProfile, EligibilityResult } from "../core/types";
import { knowledgeRecordToCivicItem } from "../knowledge/adapter";

export interface VayamToolResult<T> {
  success: boolean;
  toolName: string;
  data: T;
  sourceCount: number;
}

export const VayamTools = {
  /**
   * Search knowledge records with optional category/type filters.
   */
  searchKnowledge(query: string, category?: string, type?: string): VayamToolResult<KnowledgeRecord[]> {
    const records = searchKnowledgeRecords({
      query,
      category,
      type: type as any,
    });
    return {
      success: true,
      toolName: "searchKnowledge",
      data: records,
      sourceCount: records.length,
    };
  },

  /**
   * Get single KnowledgeRecord by stable ID.
   */
  getKnowledgeById(id: string): VayamToolResult<KnowledgeRecord | null> {
    const record = KnowledgeRepository.getKnowledgeRecordById(id);
    return {
      success: Boolean(record),
      toolName: "getKnowledgeById",
      data: record || null,
      sourceCount: record ? 1 : 0,
    };
  },

  /**
   * Get all records by category.
   */
  getKnowledgeByCategory(category: string): VayamToolResult<KnowledgeRecord[]> {
    const records = KnowledgeRepository.getKnowledgeRecords({ category });
    return {
      success: true,
      toolName: "getKnowledgeByCategory",
      data: records,
      sourceCount: records.length,
    };
  },

  /**
   * Get personalized KnowledgeRecords ranked by Phase 5 Core.
   */
  getPersonalizedKnowledge(profile: UserProfile): VayamToolResult<ReturnType<typeof getPersonalizedKnowledge>> {
    const items = getPersonalizedKnowledge(profile);
    return {
      success: true,
      toolName: "getPersonalizedKnowledge",
      data: items,
      sourceCount: items.length,
    };
  },

  /**
   * Evaluate eligibility of a specific record for a user profile.
   */
  evaluateEligibility(recordId: string, profile: UserProfile): VayamToolResult<{
    record: KnowledgeRecord | null;
    eligibility: EligibilityResult | null;
  }> {
    const record = KnowledgeRepository.getKnowledgeRecordById(recordId);
    if (!record) {
      return {
        success: false,
        toolName: "evaluateEligibility",
        data: { record: null, eligibility: null },
        sourceCount: 0,
      };
    }

    const civicItem = knowledgeRecordToCivicItem(record);
    const eligibility = evaluateCoreEligibility(profile, civicItem);

    return {
      success: true,
      toolName: "evaluateEligibility",
      data: { record, eligibility },
      sourceCount: 1,
    };
  },

  /**
   * Get upcoming life milestones for a user profile.
   */
  getUpcomingMilestones(profile: UserProfile): VayamToolResult<any[]> {
    const civicState = getPersonalizedCivicState(profile);
    return {
      success: true,
      toolName: "getUpcomingMilestones",
      data: civicState.upcomingMilestones,
      sourceCount: civicState.upcomingMilestones.length,
    };
  },

  /**
   * Get deterministic Life Events & Timeline state for a user profile.
   */
  getLifeEvents(profile: UserProfile): VayamToolResult<ReturnType<typeof getSmartTimelineState>> {
    const timeline = getSmartTimelineState(profile);
    return {
      success: true,
      toolName: "getLifeEvents",
      data: timeline,
      sourceCount: timeline.allEvents.length,
    };
  },
};
