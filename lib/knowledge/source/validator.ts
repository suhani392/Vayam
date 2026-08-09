/**
 * lib/knowledge/source/validator.ts
 *
 * Validation & Verification Policy Engine for Vayam Knowledge Records.
 * Implements strict rules for verifying sources, checking verification freshness,
 * detecting missing metadata, and generating UI display metadata.
 *
 * Core Rule: Vayam NEVER treats an unverified or demo record as verified government information.
 */

import type { KnowledgeRecord } from "../types";
import type {
  SourceModel,
  SourceValidationResult,
  KnowledgeValidationResult,
  SourceDisplayMetadata,
  SourceType,
} from "./types";

// Standard review period policy (180 days)
export const DEFAULT_REVIEW_PERIOD_DAYS = 180;

/**
 * Validates a SourceModel or source metadata object against Vayam's strict verification policy.
 */
export function validateSource(source: Partial<SourceModel>): SourceValidationResult {
  const errors: string[] = [];

  if (!source.name || source.name.trim() === "") {
    errors.push("Source name is required.");
  }

  if (!source.url || source.url.trim() === "") {
    errors.push("Source URL is required.");
  } else if (!source.url.startsWith("http://") && !source.url.startsWith("https://")) {
    errors.push("Source URL must be a valid HTTP/HTTPS web URL.");
  }

  if (!source.verificationStatus) {
    errors.push("Verification status is required.");
  }

  if (source.verificationStatus === "VERIFIED") {
    if (!source.lastVerified || source.lastVerified.trim() === "") {
      errors.push("Verified source requires a valid lastVerified date (YYYY-MM-DD).");
    } else {
      const dateParsed = new Date(source.lastVerified);
      if (isNaN(dateParsed.getTime())) {
        errors.push("Verified source contains an invalid lastVerified ISO date.");
      }
    }

    const validOfficialSourceTypes: SourceType[] = [
      "OFFICIAL_GOVERNMENT",
      "OFFICIAL_MINISTRY",
      "OFFICIAL_STATE_GOVERNMENT",
      "OFFICIAL_AUTHORITY",
      "OFFICIAL_DOCUMENT",
    ];

    if (source.sourceType && !validOfficialSourceTypes.includes(source.sourceType as SourceType)) {
      errors.push(`Verified status requires an official source type (got ${source.sourceType}).`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Determines whether a KnowledgeRecord's verification review is due based on freshness policy.
 * Does NOT change verificationStatus to EXPIRED automatically; flags reviewDue = true.
 */
export function checkReviewDue(
  lastVerified?: string | null,
  reviewPeriodDays: number = DEFAULT_REVIEW_PERIOD_DAYS,
  referenceDate: Date = new Date()
): boolean {
  if (!lastVerified) return true;

  const verifiedTime = new Date(lastVerified).getTime();
  if (isNaN(verifiedTime)) return true;

  const diffDays = Math.floor((referenceDate.getTime() - verifiedTime) / (1000 * 60 * 60 * 24));
  return diffDays > reviewPeriodDays;
}

/**
 * Evaluates if a KnowledgeRecord is genuinely verified.
 * Returns true ONLY when verificationStatus === "VERIFIED" AND all source metadata checks pass.
 */
export function isRecordVerified(record: KnowledgeRecord): boolean {
  if (record.source?.verificationStatus !== "VERIFIED") {
    return false;
  }

  const validation = validateSource({
    name: record.source.name,
    url: record.source.url || record.application?.officialUrl,
    sourceType: record.source.sourceType as any,
    verificationStatus: record.source.verificationStatus as any,
    lastVerified: record.source.lastVerified,
  });

  return validation.valid;
}

/**
 * Validates complete KnowledgeRecord schema & verification metadata integrity.
 */
export function validateKnowledgeRecord(record: KnowledgeRecord): KnowledgeValidationResult {
  const errors: string[] = [];

  if (!record.id || record.id.trim() === "") {
    errors.push("Knowledge record must have a stable id.");
  }

  if (!record.title || record.title.trim() === "") {
    errors.push("Knowledge record must have a title.");
  }

  if (!record.type) {
    errors.push("Knowledge record must have a type.");
  }

  if (!record.category) {
    errors.push("Knowledge record must have a category.");
  }

  if (!record.source) {
    errors.push("Knowledge record must contain source metadata.");
  } else {
    const sourceValidation = validateSource({
      name: record.source.name,
      url: record.source.url || record.application?.officialUrl,
      sourceType: record.source.sourceType as any,
      verificationStatus: record.source.verificationStatus as any,
      lastVerified: record.source.lastVerified,
    });
    errors.push(...sourceValidation.errors);
  }

  if (record.source?.verificationStatus === "VERIFIED" && record.source?.sourceTrust === "DEMO") {
    errors.push("Conflict: Record cannot be marked VERIFIED with sourceTrust === DEMO.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Formats non-misleading display metadata for safe UI rendering.
 */
export function getSourceDisplayMetadata(
  record: KnowledgeRecord,
  referenceDate: Date = new Date()
): SourceDisplayMetadata {
  const isDemo = record.source?.verificationStatus === "DEMO" || record.source?.sourceType === "DEMO";
  const verified = isRecordVerified(record);
  const reviewDue = checkReviewDue(record.source?.lastVerified, DEFAULT_REVIEW_PERIOD_DAYS, referenceDate);

  let label = "Needs verification";
  if (isDemo) {
    label = "Demo data";
  } else if (verified && reviewDue) {
    label = "Review required";
  } else if (verified) {
    label = "Verified source";
  }

  // Format date display (e.g., "5 Aug 2026")
  let lastVerifiedStr = record.source?.lastVerified || "Unverified";
  if (record.source?.lastVerified) {
    const d = new Date(record.source.lastVerified);
    if (!isNaN(d.getTime())) {
      lastVerifiedStr = d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }

  return {
    label,
    sourceName: record.source?.name || record.authority?.name || "Official Source",
    authorityName: record.authority?.name,
    lastVerified: lastVerifiedStr,
    isVerified: verified && !isDemo,
    isDemo,
    reviewDue,
    officialUrl: record.application?.officialUrl || record.source?.url,
  };
}
