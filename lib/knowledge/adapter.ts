/**
 * lib/knowledge/adapter.ts
 *
 * Compatibility Adapter between Phase 6A Canonical KnowledgeRecord
 * and Phase 5 CivicItem domain model.
 *
 * Ensures 100% backwards compatibility so the Civic Intelligence Core
 * consumes Knowledge Layer data without duplicating records or changing logic.
 */

import type { KnowledgeRecord } from "./types";
import type { CivicItem, CivicItemCategory, VerificationStatus } from "../core/types";

/**
 * Maps a canonical KnowledgeRecord to a Phase 5 CivicItem.
 */
export function knowledgeRecordToCivicItem(record: KnowledgeRecord): CivicItem {
  const mapVerificationStatus = (status: string): VerificationStatus => {
    switch (status) {
      case "VERIFIED":
        return "VERIFIED";
      case "DEMO":
        return "DEMO_DATA";
      default:
        return "NEEDS_REVIEW";
    }
  };

  return {
    id: record.id,
    title: record.title,
    shortDescription: record.shortDescription,
    fullDescription: record.fullDescription,
    category: record.category as CivicItemCategory,
    level: record.authority.level === "CENTRAL" ? "central" : record.authority.level === "STATE" ? "state" : "district",
    stateCode: record.authority.stateCode,

    rules: record.eligibilityRules,

    minAge: record.minAge,
    maxAge: record.maxAge,
    eligibleGenders: record.eligibleGenders,
    eligibleEducationLevels: record.eligibleEducationLevels,
    eligibleEmploymentStatuses: record.eligibleEmploymentStatuses,
    maxAnnualIncomeInr: record.maxAnnualIncomeInr,

    benefits: record.benefits,
    benefitAmountInr: record.benefitAmountInr,
    requiredDocuments: record.application.documentsRequired.map((doc) => doc.name),
    deadline: record.timing.deadline || undefined,
    isOngoing: record.timing.deadlineType === "NO_DEADLINE" || record.timing.recurring,

    provenance: {
      sourceName: record.source.name,
      officialUrl: record.application.officialUrl || record.source.url,
      lastVerifiedDate: record.source.lastVerified,
      department: record.authority.department || record.authority.name,
      verificationStatus: mapVerificationStatus(record.source.verificationStatus),
    },
  };
}

/**
 * Batch maps an array of KnowledgeRecords to CivicItems.
 */
export function knowledgeRecordsToCivicItems(records: KnowledgeRecord[]): CivicItem[] {
  return records.map(knowledgeRecordToCivicItem);
}
