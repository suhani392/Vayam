/**
 * lib/knowledge/repository.ts
 *
 * Vayam Knowledge Repository Service Abstraction.
 * Provides a clean, decoupled access layer for querying normalized KnowledgeRecords
 * from local storage, database, CMS, or future government data pipelines.
 *
 * Zero UI dependencies. Zero AI dependencies.
 */

import type { KnowledgeRecord, KnowledgeFilterQuery } from "./types";
import { KNOWLEDGE_RECORDS } from "./records";
import { knowledgeRecordsToCivicItems, knowledgeRecordToCivicItem } from "./adapter";
import type { CivicItem } from "../core/types";
import { isRecordVerified, checkReviewDue } from "./source/validator";
import { fetchDbKnowledgeItems } from "@/lib/db/fetchers";

export class KnowledgeRepository {
  private static records: KnowledgeRecord[] = [];
  private static dbSynced: boolean = false;

  /**
   * Syncs records from Supabase database dynamically.
   */
  public static async syncWithDatabase(forceRefresh: boolean = true): Promise<KnowledgeRecord[]> {
    if (this.dbSynced && !forceRefresh) return this.records;
    try {
      const dbItems = await fetchDbKnowledgeItems();
      if (dbItems && dbItems.length > 0) {
        const mappedRecords: KnowledgeRecord[] = dbItems.map((item) => {
          const catSlug = item.category_rel?.slug || item.metadata?.category || "education";
          return {
            id: item.slug || item.id,
            type: "SCHEME",
            title: item.title,
            shortDescription: item.short_description || "",
            fullDescription: item.description || "",
            category: catSlug,
            keywords: item.tags || [],
            authority: {
              name: item.authority_name || "Government of India",
              level: "CENTRAL",
            },
            minAge: item.metadata?.min_age,
            maxAge: item.metadata?.max_age,
            maxAnnualIncomeInr: item.metadata?.max_annual_income,
            benefitAmountInr: item.metadata?.benefit_amount_inr,
            benefits: item.eligibility_summary ? [item.eligibility_summary] : [],
            application: {
              method: "ONLINE",
              officialUrl: item.action_url || "#",
              portalName: item.action_label || "Official Portal",
              steps: [],
              documentsRequired: [],
            },
            timing: {
              deadline: item.deadline || null,
              deadlineType: item.deadline ? "FIXED_DATE" : "NO_DEADLINE",
              recurring: false,
              lastVerified: item.updated_at ? item.updated_at.substring(0, 10) : "2026-08-09",
            },
            source: {
              name: item.authority_name || "Government Source",
              url: item.action_url || "#",
              authority: item.authority_name || "Official Authority",
              sourceType: "OFFICIAL_GOVERNMENT",
              sourceTrust: "OFFICIAL_GOVERNMENT",
              lastVerified: item.updated_at ? item.updated_at.substring(0, 10) : "2026-08-09",
              verificationStatus: "VERIFIED",
            },
            status: "ACTIVE",
          };
        });

        // PURE DATABASE ONLY: Zero hardcoded fallback records
        this.records = mappedRecords;
        this.dbSynced = true;
      } else {
        this.records = [];
      }
    } catch (err) {
      console.warn("KnowledgeRepository database sync warning:", err);
      this.records = [];
    }
    return this.records;
  }

  /**
   * Retrieves all canonical KnowledgeRecords.
   */
  public static getAllKnowledgeRecords(): KnowledgeRecord[] {
    return [...this.records];
  }

  /**
   * Retrieves a single KnowledgeRecord by stable ID.
   */
  public static getKnowledgeRecordById(id: string): KnowledgeRecord | undefined {
    return this.records.find((rec) => rec.id === id);
  }

  /**
   * Retrieves only strictly VERIFIED records passing metadata checks.
   */
  public static getVerifiedKnowledgeRecords(): KnowledgeRecord[] {
    return this.records.filter((rec) => isRecordVerified(rec));
  }

  /**
   * Retrieves records where verification review is due (older than review period).
   */
  public static getRecordsRequiringReview(reviewPeriodDays: number = 180): KnowledgeRecord[] {
    return this.records.filter((rec) => checkReviewDue(rec.source?.lastVerified, reviewPeriodDays));
  }

  /**
   * Retrieves unverified or demo records.
   */
  public static getUnverifiedRecords(): KnowledgeRecord[] {
    return this.records.filter((rec) => !isRecordVerified(rec));
  }

  /**
   * Retrieves records issued by a specific authority or source.
   */
  public static getRecordsBySource(sourceName: string): KnowledgeRecord[] {
    const queryLower = sourceName.toLowerCase();
    return this.records.filter(
      (rec) =>
        rec.source?.name.toLowerCase().includes(queryLower) ||
        rec.authority?.name.toLowerCase().includes(queryLower)
    );
  }

  /**
   * Filters KnowledgeRecords based on structured criteria.
   */
  public static getKnowledgeRecords(query: KnowledgeFilterQuery = {}): KnowledgeRecord[] {
    return this.records.filter((rec) => {
      if (query.category && rec.category.toLowerCase() !== query.category.toLowerCase()) {
        return false;
      }

      if (query.type && rec.type !== query.type) {
        return false;
      }

      if (query.status && rec.status !== query.status) {
        return false;
      }

      if (query.verificationStatus && rec.source.verificationStatus !== query.verificationStatus) {
        return false;
      }

      if (query.stateCode && rec.authority.stateCode && rec.authority.stateCode !== query.stateCode) {
        return false;
      }

      if (query.minAge !== undefined && rec.maxAge !== undefined && query.minAge > rec.maxAge) {
        return false;
      }

      if (query.maxAge !== undefined && rec.minAge !== undefined && query.maxAge < rec.minAge) {
        return false;
      }

      return true;
    });
  }

  /**
   * Canonical Bridge Method for Phase 5 Civic Intelligence Engine.
   * Returns records converted to Phase 5 CivicItems.
   */
  public static getKnowledgeRecordsAsCivicItems(query: KnowledgeFilterQuery = {}): CivicItem[] {
    const records = this.getKnowledgeRecords(query);
    return knowledgeRecordsToCivicItems(records);
  }
}

// Convenient export functions
export function getAllKnowledgeRecords(): KnowledgeRecord[] {
  return KnowledgeRepository.getAllKnowledgeRecords();
}

export function getKnowledgeRecordById(id: string): KnowledgeRecord | undefined {
  return KnowledgeRepository.getKnowledgeRecordById(id);
}

export function getVerifiedKnowledgeRecords(): KnowledgeRecord[] {
  return KnowledgeRepository.getVerifiedKnowledgeRecords();
}

export function getRecordsRequiringReview(reviewPeriodDays?: number): KnowledgeRecord[] {
  return KnowledgeRepository.getRecordsRequiringReview(reviewPeriodDays);
}

export function getUnverifiedRecords(): KnowledgeRecord[] {
  return KnowledgeRepository.getUnverifiedRecords();
}

export function getRecordsBySource(sourceName: string): KnowledgeRecord[] {
  return KnowledgeRepository.getRecordsBySource(sourceName);
}

export function getKnowledgeRecords(query: KnowledgeFilterQuery = {}): KnowledgeRecord[] {
  return KnowledgeRepository.getKnowledgeRecords(query);
}

export function getKnowledgeRecordsAsCivicItems(query: KnowledgeFilterQuery = {}): CivicItem[] {
  return KnowledgeRepository.getKnowledgeRecordsAsCivicItems(query);
}

