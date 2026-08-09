/**
 * lib/knowledge/search.ts
 *
 * Search, Discovery & Personalization Query Layer for Vayam.
 * Features fast, client-side, whitespace-tolerant and forgiving search over KnowledgeRecords,
 * seamless integration with Phase 5 Civic Intelligence Core for ranking & explainability,
 * and clean functions prepared for future Phase 8 AI tools.
 *
 * Zero external search dependencies. Zero AI APIs.
 */

import type { KnowledgeRecord, KnowledgeFilterQuery } from "./types";
import { KnowledgeRepository } from "./repository";
import { knowledgeRecordToCivicItem } from "./adapter";
import {
  getPersonalizedCivicState,
  evaluateEligibility,
  calculateRelevance,
  type UserProfile,
  type Recommendation,
} from "../core";

export interface SearchOptions extends KnowledgeFilterQuery {
  query?: string;
  sortBy?: "recommended" | "title" | "date";
  profile?: UserProfile | null;
}

export interface KnowledgeSearchResult {
  records: KnowledgeRecord[];
  total: number;
}

export interface PersonalizedKnowledgeItem {
  record: KnowledgeRecord;
  recommendation: Recommendation;
}

export interface KnowledgeDetailView {
  record: KnowledgeRecord;
  personalized?: Recommendation | null;
  relatedRecords: KnowledgeRecord[];
}

/**
 * Searches KnowledgeRecords with title, keyword, category, and description matching.
 */
export function searchKnowledgeRecords(options: SearchOptions = {}): KnowledgeRecord[] {
  const { query = "", category, type, status, verificationStatus, stateCode, sortBy = "recommended", profile } = options;

  let records = KnowledgeRepository.getKnowledgeRecords({
    category,
    type,
    status,
    verificationStatus,
    stateCode,
  });

  const trimmedQuery = query.trim().toLowerCase();

  if (trimmedQuery.length > 0) {
    const queryTokens = trimmedQuery.split(/\s+/).filter(Boolean);

    records = records
      .map((record) => {
        let score = 0;
        const titleLower = record.title.toLowerCase();
        const shortDescLower = record.shortDescription.toLowerCase();
        const fullDescLower = (record.fullDescription || "").toLowerCase();
        const categoryLower = record.category.toLowerCase();
        const authorityLower = record.authority?.name.toLowerCase() || "";
        const keywordsLower = (record.keywords || []).map((k) => k.toLowerCase());

        // Exact & Title Matches (Highest Weight)
        if (titleLower.includes(trimmedQuery)) score += 50;
        if (titleLower.startsWith(trimmedQuery)) score += 30;

        // Keyword Matches (High Weight)
        for (const kw of keywordsLower) {
          if (kw === trimmedQuery) score += 40;
          else if (kw.includes(trimmedQuery)) score += 20;
        }

        // Category & Authority Matches (Medium Weight)
        if (categoryLower.includes(trimmedQuery)) score += 30;
        if (authorityLower.includes(trimmedQuery)) score += 20;

        // Description Matches (Base Weight)
        if (shortDescLower.includes(trimmedQuery)) score += 15;
        if (fullDescLower.includes(trimmedQuery)) score += 10;

        // Tokenized Partial Word Matching
        for (const token of queryTokens) {
          if (titleLower.includes(token)) score += 10;
          if (keywordsLower.some((kw) => kw.includes(token))) score += 8;
          if (shortDescLower.includes(token)) score += 5;
        }

        return { record, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.record);
  }

  // Sorting
  if (sortBy === "title") {
    records.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "recommended" && profile) {
    const personalizedState = getPersonalizedCivicState(profile);
    const recMap = new Map<string, number>();
    personalizedState.allRecommendations.forEach((rec, idx) => {
      recMap.set(rec.item.id, rec.score);
    });

    records.sort((a, b) => {
      const scoreA = recMap.get(a.id) ?? 0;
      const scoreB = recMap.get(b.id) ?? 0;
      return scoreB - scoreA;
    });
  }

  return records;
}

/**
 * Returns personalized KnowledgeRecords evaluated through Phase 5 Civic Intelligence Core.
 */
export function getPersonalizedKnowledge(profile: UserProfile): PersonalizedKnowledgeItem[] {
  const civicState = getPersonalizedCivicState(profile);

  return civicState.allRecommendations.map((recommendation) => {
    const record = KnowledgeRepository.getKnowledgeRecordById(recommendation.item.id) || {
      id: recommendation.item.id,
      type: "SCHEME" as const,
      title: recommendation.item.title,
      shortDescription: recommendation.item.shortDescription,
      fullDescription: recommendation.item.fullDescription,
      category: recommendation.item.category,
      authority: { name: recommendation.item.provenance.department || "Government of India", level: "CENTRAL" as const },
      benefits: recommendation.item.benefits,
      benefitAmountInr: recommendation.item.benefitAmountInr,
      application: {
        method: "ONLINE" as const,
        officialUrl: recommendation.item.provenance.officialUrl,
        documentsRequired: (recommendation.item.requiredDocuments || []).map((d, i) => ({
          id: `doc-${i}`,
          name: d,
          required: true,
        })),
      },
      timing: {
        deadline: recommendation.item.deadline || null,
        deadlineType: recommendation.item.isOngoing ? "NO_DEADLINE" as const : "FIXED_DATE" as const,
        lastVerified: recommendation.item.provenance.lastVerifiedDate,
      },
      source: {
        name: recommendation.item.provenance.sourceName,
        url: recommendation.item.provenance.officialUrl,
        authority: recommendation.item.provenance.department || "Government Authority",
        sourceType: "OFFICIAL_GOVERNMENT" as const,
        sourceTrust: "OFFICIAL_GOVERNMENT" as const,
        lastVerified: recommendation.item.provenance.lastVerifiedDate,
        verificationStatus: recommendation.item.provenance.verificationStatus === "VERIFIED" ? "VERIFIED" as const : "DEMO" as const,
      },
      status: "ACTIVE" as const,
    };

    return {
      record,
      recommendation,
    };
  });
}

/**
 * Retrieves full details for a single KnowledgeRecord including Phase 5 eligibility evaluation
 * and related opportunities.
 */
export function getKnowledgeDetails(id: string, profile?: UserProfile | null): KnowledgeDetailView | undefined {
  const record = KnowledgeRepository.getKnowledgeRecordById(id);
  if (!record) return undefined;

  let personalized: Recommendation | null = null;
  if (profile) {
    const civicItem = knowledgeRecordToCivicItem(record);
    const eligibility = evaluateEligibility(profile, civicItem);
    const relevance = calculateRelevance(profile, civicItem, eligibility);
    const urgency = relevance.factors.deadlineApproaching ? "urgent" : relevance.score >= 0.7 ? "high" : "normal";
    personalized = {
      item: civicItem,
      eligibility,
      relevance,
      reasons: relevance.reasons,
      urgency,
      category: civicItem.category,
      score: relevance.score,
    };
  }

  const relatedRecords = KnowledgeRepository.getKnowledgeRecords({ category: record.category })
    .filter((r) => r.id !== record.id)
    .slice(0, 3);

  return {
    record,
    personalized,
    relatedRecords,
  };
}
