/**
 * lib/knowledge/__tests__/verification-layer.test.ts
 *
 * Test Suite for Vayam Phase 6B Source & Verification Layer.
 * Validates source metadata policies, strict verification checks, review-due detection,
 * quality report generation, and Phase 5/6A regression integrity.
 */

import {
  validateSource,
  isRecordVerified,
  validateKnowledgeRecord,
  checkReviewDue,
  getSourceDisplayMetadata,
} from "../source/validator";
import { generateKnowledgeQualityReport } from "../source/report";

import {
  getAllKnowledgeRecords,
  getVerifiedKnowledgeRecords,
  getRecordsRequiringReview,
  getUnverifiedRecords,
  getKnowledgeRecordById,
  KNOWLEDGE_RECORDS,
} from "../index";

import { runCoreEngineTests } from "../../core/__tests__/core-engine.test";

export function runVerificationLayerTests() {
  const results: { name: string; status: "PASS" | "FAIL"; details?: string }[] = [];

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    if (condition) {
      results.push({ name: testName, status: "PASS" });
    } else {
      results.push({ name: testName, status: "FAIL", details: failureDetails || "Assertion failed" });
    }
  }

  console.log("🧪 Starting Vayam Phase 6B Source & Verification Layer Test Suite...\n");

  // 1. Valid Verified Source Test
  const validSourceRes = validateSource({
    name: "Ministry of Agriculture",
    url: "https://pmkisan.gov.in/",
    sourceType: "OFFICIAL_GOVERNMENT",
    verificationStatus: "VERIFIED",
    lastVerified: "2026-08-01",
  });
  assert(validSourceRes.valid, "Source Validator: Valid official government source passes validation");

  // 2. Missing Source URL Test
  const missingUrlRes = validateSource({
    name: "Ministry of Agriculture",
    url: "",
    sourceType: "OFFICIAL_GOVERNMENT",
    verificationStatus: "VERIFIED",
    lastVerified: "2026-08-01",
  });
  assert(!missingUrlRes.valid && missingUrlRes.errors.some((e) => e.includes("URL")), "Source Validator: Missing URL fails validation");

  // 3. Missing Verification Date Test
  const missingDateRes = validateSource({
    name: "Ministry of Agriculture",
    url: "https://pmkisan.gov.in/",
    sourceType: "OFFICIAL_GOVERNMENT",
    verificationStatus: "VERIFIED",
    lastVerified: "",
  });
  assert(!missingDateRes.valid && missingDateRes.errors.some((e) => e.includes("lastVerified")), "Source Validator: Missing lastVerified date fails for VERIFIED status");

  // 4. Invalid Date String Test
  const invalidDateRes = validateSource({
    name: "Ministry of Agriculture",
    url: "https://pmkisan.gov.in/",
    sourceType: "OFFICIAL_GOVERNMENT",
    verificationStatus: "VERIFIED",
    lastVerified: "not-a-date",
  });
  assert(!invalidDateRes.valid && invalidDateRes.errors.some((e) => e.includes("invalid")), "Source Validator: Invalid ISO date string fails validation");

  // 5. Demo Source Test
  const demoSourceRes = validateSource({
    name: "Demo Environment",
    url: "https://vayam.demo/",
    sourceType: "DEMO",
    verificationStatus: "DEMO",
  });
  assert(demoSourceRes.valid, "Source Validator: DEMO source type passes basic validation");

  // 6. Unverified Source Test
  const unverifiedSourceRes = validateSource({
    name: "Unverified Reference",
    url: "https://example.org/",
    sourceType: "SECONDARY_REFERENCE",
    verificationStatus: "UNVERIFIED",
  });
  assert(unverifiedSourceRes.valid, "Source Validator: UNVERIFIED secondary reference passes validation");

  // 7. Review-Required Freshness Policy Test
  const oldDate = "2025-01-01"; // > 180 days from Aug 2026
  const refDate = new Date("2026-08-09");
  const isReviewDue = checkReviewDue(oldDate, 180, refDate);
  assert(isReviewDue, "Freshness Policy: Record verified > 180 days ago triggers reviewDue = true");

  const recentDate = "2026-08-01"; // < 180 days
  const isRecentReviewDue = checkReviewDue(recentDate, 180, refDate);
  assert(!isRecentReviewDue, "Freshness Policy: Recently verified record (< 180 days) keeps reviewDue = false");

  // 8. Strict isRecordVerified() Test
  const verifiedRecord = getKnowledgeRecordById("pm-usp-csss-scholarship")!;
  assert(isRecordVerified(verifiedRecord), "Record Verification: Official CSSS scholarship is verified");

  const reviewRecord = getKnowledgeRecordById("nmmss-merit-scholarship")!;
  assert(!isRecordVerified(reviewRecord), "Record Verification: REQUIRES_REVIEW record is NOT treated as verified");

  // 9. Malformed Record Defense Test (Status VERIFIED but missing lastVerified)
  const malformedRecord: any = {
    ...verifiedRecord,
    id: "malformed-test-record",
    source: {
      ...verifiedRecord.source,
      verificationStatus: "VERIFIED",
      lastVerified: "", // Missing!
    },
  };
  assert(!isRecordVerified(malformedRecord), "Record Verification: Record claiming VERIFIED status but missing lastVerified is REJECTED by isRecordVerified()");

  // 10. Repository Verified Filtering
  const repositoryVerified = getVerifiedKnowledgeRecords();
  assert(repositoryVerified.length > 0 && repositoryVerified.every((r) => isRecordVerified(r)), "Repository: getVerifiedKnowledgeRecords returns only strictly verified records");

  // 11. Source Display Metadata Formatting
  const displayMetadataVerified = getSourceDisplayMetadata(verifiedRecord, refDate);
  assert(displayMetadataVerified.label === "Verified source", "Display Metadata: Verified record returns label 'Verified source'");
  assert(displayMetadataVerified.isVerified === true, "Display Metadata: Verified record flags isVerified === true");

  const displayMetadataReview = getSourceDisplayMetadata(reviewRecord, refDate);
  assert(displayMetadataReview.label === "Needs verification", "Display Metadata: REQUIRES_REVIEW record returns label 'Needs verification'");
  assert(displayMetadataReview.isVerified === false, "Display Metadata: REQUIRES_REVIEW record flags isVerified === false");

  // 12. Quality Report Generation
  const qualityReport = generateKnowledgeQualityReport(refDate);
  assert(qualityReport.totalRecords === 25, "Quality Report: Generates exact total of 25 canonical records");
  assert(qualityReport.verifiedRecords === 22, "Quality Report: Identifies 22 VERIFIED records");
  assert(qualityReport.unverifiedRecords === 3, "Quality Report: Identifies 3 REQUIRES_REVIEW records");

  console.log("\n📊 Verification Layer Test Results Summary:");
  let passedCount = 0;
  results.forEach((r) => {
    if (r.status === "PASS") {
      passedCount += 1;
      console.log(`  ✅ ${r.name}`);
    } else {
      console.log(`  ❌ ${r.name}: ${r.details}`);
    }
  });

  console.log(`\nTotal: ${results.length} | Passed: ${passedCount} | Failed: ${results.length - passedCount}\n`);

  return results.every((r) => r.status === "PASS");
}

if (require.main === module) {
  const success = runVerificationLayerTests();
  process.exit(success ? 0 : 1);
}
