/**
 * lib/knowledge/source/report.ts
 *
 * Development-only Knowledge Quality Report Generator for Vayam.
 * Analyzes stored KnowledgeRecords to report metrics on verified, unverified,
 * demo, review-due, and malformed metadata records.
 *
 * Zero UI dependencies.
 */

import { KnowledgeRepository } from "../repository";
import { validateKnowledgeRecord, isRecordVerified, checkReviewDue } from "./validator";
import type { KnowledgeQualityReport } from "./types";

/**
 * Generates a comprehensive Knowledge Quality Report over all repository records.
 */
export function generateKnowledgeQualityReport(
  referenceDate: Date = new Date()
): KnowledgeQualityReport {
  const records = KnowledgeRepository.getAllKnowledgeRecords();

  let verifiedRecords = 0;
  let unverifiedRecords = 0;
  let demoRecords = 0;
  let recordsRequiringReview = 0;
  let recordsMissingSource = 0;
  let recordsMissingVerificationDate = 0;
  let invalidMetadataCount = 0;

  const recordsSummary = records.map((record) => {
    const isVerified = isRecordVerified(record);
    const isDemo = record.source?.verificationStatus === "DEMO" || record.source?.sourceType === "DEMO";
    const reviewDue = checkReviewDue(record.source?.lastVerified, 180, referenceDate);
    const validation = validateKnowledgeRecord(record);

    if (isDemo) demoRecords += 1;
    else if (isVerified) verifiedRecords += 1;
    else unverifiedRecords += 1;

    if (reviewDue && !isDemo) recordsRequiringReview += 1;
    if (!record.source) recordsMissingSource += 1;
    if (isVerified && !record.source?.lastVerified) recordsMissingVerificationDate += 1;
    if (!validation.valid) invalidMetadataCount += 1;

    return {
      id: record.id,
      title: record.title,
      type: record.type,
      sourceName: record.source?.name || "Missing Source",
      verificationStatus: record.source?.verificationStatus || "UNVERIFIED",
      lastVerified: record.source?.lastVerified || "None",
      reviewDue,
      valid: validation.valid,
    };
  });

  return {
    totalRecords: records.length,
    verifiedRecords,
    unverifiedRecords,
    demoRecords,
    recordsRequiringReview,
    recordsMissingSource,
    recordsMissingVerificationDate,
    invalidMetadataCount,
    recordsSummary,
  };
}
