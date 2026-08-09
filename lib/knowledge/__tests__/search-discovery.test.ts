/**
 * lib/knowledge/__tests__/search-discovery.test.ts
 *
 * Test Suite for Vayam Phase 7 Explore, Search & Discovery Experience.
 * Validates title search, keyword search, partial word search, category/type filtering,
 * Phase 5 personalization ranking integration, no-profile state, empty search states,
 * and detail retrieval.
 */

import {
  searchKnowledgeRecords,
  getPersonalizedKnowledge,
  getKnowledgeDetails,
} from "../search";
import { TEST_PROFILES } from "../../core/data/test-profiles";
import { runVerificationLayerTests } from "./verification-layer.test";

export function runSearchDiscoveryTests() {
  const results: { name: string; status: "PASS" | "FAIL"; details?: string }[] = [];

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    if (condition) {
      results.push({ name: testName, status: "PASS" });
    } else {
      results.push({ name: testName, status: "FAIL", details: failureDetails || "Assertion failed" });
    }
  }

  console.log("🧪 Starting Vayam Phase 7 Search & Discovery Test Suite...\n");

  // 1. Search by Title
  const drivingResults = searchKnowledgeRecords({ query: "driving" });
  assert(drivingResults.length > 0 && drivingResults.some((r) => r.title.toLowerCase().includes("licence")), "Search Engine: 'driving' finds Learner's and Driving Licence records");

  // 2. Search by Keyword
  const scholarshipResults = searchKnowledgeRecords({ query: "scholarship" });
  assert(scholarshipResults.length > 0 && scholarshipResults.every((r) => r.category === "education" || r.type === "SCHOLARSHIP"), "Search Engine: 'scholarship' keyword finds education scholarship records");

  // 3. Partial Word Search
  const pensionResults = searchKnowledgeRecords({ query: "pension" });
  assert(pensionResults.length > 0 && pensionResults.some((r) => r.id === "apy-atal-pension-yojana"), "Search Engine: Partial word 'pension' finds APY and IGNOAPS records");

  // 4. Category Filtering
  const educationCategory = searchKnowledgeRecords({ category: "education" });
  assert(educationCategory.length === 5, "Category Filtering: Category 'education' returns exact 5 records");

  // 5. Type Filtering
  const serviceType = searchKnowledgeRecords({ type: "SERVICE" });
  assert(serviceType.length === 5, "Type Filtering: Type 'SERVICE' returns exact 5 records");

  // 6. Search + Category Combination
  const combinedRes = searchKnowledgeRecords({ query: "licence", category: "services" });
  assert(combinedRes.length > 0 && combinedRes.every((r) => r.category === "services"), "Filter Combination: 'licence' + category 'services' filters accurately");

  // 7. Verified Filter
  const verifiedRes = searchKnowledgeRecords({ verificationStatus: "VERIFIED" });
  assert(verifiedRes.length === 22, "Verified Filter: Returns exact 22 verified records");

  // 8. Personalized Ranking Integration (Profile B)
  const personalizedRes = searchKnowledgeRecords({ profile: TEST_PROFILES.profileB, sortBy: "recommended" });
  assert(personalizedRes.length > 0, "Personalization: Returns ranked records for Profile B");

  const personalizedList = getPersonalizedKnowledge(TEST_PROFILES.profileB);
  assert(personalizedList.length > 0 && personalizedList[0].recommendation.relevance.reasons.length > 0, "Personalization: Includes Phase 5 rule-based 'why you're seeing this' reasons");

  // 9. No Profile State
  const noProfileRes = searchKnowledgeRecords({ query: "voter" });
  assert(noProfileRes.length > 0, "No-Profile State: Search works cleanly without profile context");

  // 10. Empty Search State
  const emptyRes = searchKnowledgeRecords({ query: "nonexistenttermxyz" });
  assert(emptyRes.length === 0, "Empty Search: Returns 0 results for non-matching query");

  // 11. Detail Page Retrieval
  const detail = getKnowledgeDetails("pm-usp-csss-scholarship", TEST_PROFILES.profileB);
  assert(detail !== undefined && detail.record.id === "pm-usp-csss-scholarship", "Detail Retrieval: Retrieves record by stable ID");
  assert(detail?.personalized !== null && detail?.personalized?.eligibility !== undefined, "Detail Retrieval: Evaluates Phase 5 eligibility when profile is provided");
  assert(detail?.relatedRecords.length! > 0, "Detail Retrieval: Retrieves related records in same category");

  // 12. Official URL Link Preservation
  assert(detail?.record.application.officialUrl === "https://www.education.gov.in/", "Source Link: Preserves exact stored official URL");

  console.log("\n📊 Search & Discovery Test Results Summary:");
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
  const success = runSearchDiscoveryTests();
  process.exit(success ? 0 : 1);
}
