/**
 * lib/knowledge/__tests__/knowledge-layer.test.ts
 *
 * Test Suite for Vayam Phase 6A Knowledge Architecture & Source Layer.
 * Validates KnowledgeRecord schema integrity, source provenance, repository filtering,
 * demo vs verified status distinction, and compatibility adapter with Phase 5 Core Intelligence Engine.
 */

import {
  getAllKnowledgeRecords,
  getKnowledgeRecordById,
  getKnowledgeRecords,
  getKnowledgeRecordsAsCivicItems,
  knowledgeRecordToCivicItem,
  KNOWLEDGE_RECORDS,
} from "../index";

import {
  evaluateEligibility,
  calculateRelevance,
  rankRecommendations,
  getPersonalizedCivicState,
  TEST_PROFILES,
} from "../../core";

export function runKnowledgeLayerTests() {
  const results: { name: string; status: "PASS" | "FAIL"; details?: string }[] = [];

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    if (condition) {
      results.push({ name: testName, status: "PASS" });
    } else {
      results.push({ name: testName, status: "FAIL", details: failureDetails || "Assertion failed" });
    }
  }

  console.log("🧪 Starting Vayam Phase 6A Knowledge Layer Test Suite...\n");

  // 1. Knowledge Schema Validation
  const allRecords = getAllKnowledgeRecords();
  assert(allRecords.length > 0, "Knowledge Repository: Returns non-empty list of canonical records");

  const sampleRecord = allRecords[0];
  assert(Boolean(sampleRecord.id && sampleRecord.type && sampleRecord.title && sampleRecord.category), "Schema Validation: Record contains required identity fields");
  assert(Boolean(sampleRecord.authority && sampleRecord.authority.level), "Schema Validation: Record contains authority information");
  assert(Boolean(sampleRecord.source && sampleRecord.source.lastVerified), "Schema Validation: Record contains source provenance metadata");

  // 2. Source Metadata & Verification Status Distinction
  const verifiedRecords = getKnowledgeRecords({ verificationStatus: "VERIFIED" });
  const reviewRecords = getKnowledgeRecords({ verificationStatus: "REQUIRES_REVIEW" });

  assert(verifiedRecords.length > 0, "Source Trust: Successfully retrieves VERIFIED official government records");
  assert(reviewRecords.length > 0, "Source Trust: Successfully retrieves REQUIRES_REVIEW records needing verification");

  const reviewItem = reviewRecords.find((r) => r.id === "nmmss-merit-scholarship");
  assert(reviewItem?.source.verificationStatus === "REQUIRES_REVIEW", "Source Trust: Unverified record carries verificationStatus === REQUIRES_REVIEW");

  const officialItem = verifiedRecords.find((r) => r.id === "pm-usp-csss-scholarship");
  assert(officialItem?.source.verificationStatus === "VERIFIED", "Source Trust: Official record carries verificationStatus === VERIFIED");
  assert(officialItem?.source.sourceTrust === "OFFICIAL_GOVERNMENT", "Source Trust: Official record carries sourceTrust === OFFICIAL_GOVERNMENT");

  // 3. Repository Retrieval & Filtering
  const scholarshipRecord = getKnowledgeRecordById("pm-usp-csss-scholarship");
  assert(scholarshipRecord?.id === "pm-usp-csss-scholarship", "Repository Retrieval: getKnowledgeRecordById finds record by stable ID");

  const educationRecords = getKnowledgeRecords({ category: "education" });
  assert(educationRecords.every((r) => r.category.toLowerCase() === "education"), "Repository Filtering: Category filter returns only education records");

  const schemeRecords = getKnowledgeRecords({ type: "SCHEME" });
  assert(schemeRecords.every((r) => r.type === "SCHEME"), "Repository Filtering: Type filter returns only SCHEME type records");

  const mhRecords = getKnowledgeRecords({ stateCode: "MH" });
  assert(mhRecords.length > 0, "Repository Filtering: State code filter returns Maharashtra specific records");

  // 4. Compatibility Adapter Test with Phase 5 Core Engine
  const civicItems = getKnowledgeRecordsAsCivicItems();
  assert(civicItems.length === allRecords.length, "Adapter Test: Converts all KnowledgeRecords to Phase 5 CivicItems");

  const convertedItem = knowledgeRecordToCivicItem(scholarshipRecord!);
  assert(convertedItem.provenance.sourceName === scholarshipRecord?.source.name, "Adapter Test: Maps sourceName accurately");
  assert(convertedItem.provenance.verificationStatus === "VERIFIED", "Adapter Test: Maps VERIFIED status to VERIFIED");

  // 5. Integration Test with Phase 5 Intelligence Engine
  const civicStateB = getPersonalizedCivicState(TEST_PROFILES.profileB);
  assert(civicStateB.allRecommendations.length > 0, "Phase 5 Core Integration: Intelligence Engine produces recommendations from Knowledge Repository");
  assert(civicStateB.recommendations.now.length > 0, "Phase 5 Core Integration: NOW recommendations populated correctly");

  const civicStateMissing = getPersonalizedCivicState(TEST_PROFILES.profileMissing);
  const unknownRec = civicStateMissing.allRecommendations.find((r) => r.item.id === "pm-usp-csss-scholarship");
  assert(unknownRec?.eligibility.status === "UNKNOWN", "Phase 5 Core Integration: Missing data profile produces UNKNOWN eligibility on knowledge records");

  console.log("\n📊 Knowledge Layer Test Results Summary:");
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
  const success = runKnowledgeLayerTests();
  process.exit(success ? 0 : 1);
}
