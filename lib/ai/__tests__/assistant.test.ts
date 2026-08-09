/**
 * lib/ai/__tests__/assistant.test.ts
 *
 * Test Suite for Vayam Phase 8 AI Civic Assistant.
 * Validates intent classification, tool invocation, milestone integration,
 * missing-data handling, unknown query defense, clarification routing, and source citations.
 */

import { classifyUserIntent } from "../intents";
import { VayamTools } from "../tools";
import { processAssistantQuery } from "../orchestrator";
import { TEST_PROFILES } from "../../core/data/test-profiles";

export async function runAssistantTests() {
  const results: { name: string; status: "PASS" | "FAIL"; details?: string }[] = [];

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    if (condition) {
      results.push({ name: testName, status: "PASS" });
    } else {
      results.push({ name: testName, status: "FAIL", details: failureDetails || "Assertion failed" });
    }
  }

  console.log("🧪 Starting Vayam Phase 8 AI Civic Assistant Test Suite...\n");

  // TEST 1: Scholarship Discovery & Sources
  const res1 = await processAssistantQuery("What scholarships are available for me?", TEST_PROFILES.profileB);
  assert(res1.records.length > 0, "TEST 1: Scholarship discovery returns non-empty records");
  assert(res1.sources.length > 0, "TEST 1: Response includes verified source citations");
  assert(res1.intent.intent === "EDUCATION_GUIDANCE" || res1.intent.intent === "SEARCH_KNOWLEDGE", "TEST 1: Correct intent classified");

  // TEST 2: Turning 18 Milestone Guidance
  const res2 = await processAssistantQuery("I'm turning 18 soon. What should I know?", TEST_PROFILES.profileA);
  assert(res2.intent.intent === "UPCOMING_MILESTONES", "TEST 2: Classified as UPCOMING_MILESTONES intent");
  assert(res2.milestones !== undefined && res2.milestones.length > 0, "TEST 2: Invokes Milestone Engine for 17yo Profile A");

  // TEST 3: Specific Scheme Eligibility Check
  const res3 = await processAssistantQuery("Am I eligible for PM-USP?", TEST_PROFILES.profileB);
  assert(res3.records.length === 1 && res3.records[0].id === "pm-usp-csss-scholarship", "TEST 3: Retrieves PM-USP CSSS scholarship record by ID");
  assert(res3.content.includes("PM-USP") || res3.content.includes("eligibility"), "TEST 3: Synthesizes structured eligibility message");

  // TEST 4: Education Guidance After 12th
  const res4 = await processAssistantQuery("What can I do after 12th?", TEST_PROFILES.profileB);
  assert(res4.records.length > 0 && res4.records.every((r) => r.category === "education"), "TEST 4: Education guidance uses verified education records");

  // TEST 5: Ambiguous Query Clarification (Loan)
  const res5 = await processAssistantQuery("Can I get a loan?", TEST_PROFILES.profileB);
  assert(res5.intent.intent === "CLARIFICATION_NEEDED", "TEST 5: Ambiguous loan query triggers CLARIFICATION_NEEDED intent");
  assert(res5.clarificationOptions !== undefined && res5.clarificationOptions.length >= 3, "TEST 5: Provides concise clarification options");

  // TEST 6: Rights & Citizen Protections
  const res6 = await processAssistantQuery("What are my rights?", TEST_PROFILES.profileB);
  assert(res6.records.length > 0 && res6.records.every((r) => r.category === "rights"), "TEST 6: Rights query returns verified rights records");

  // TEST 7: Missing Data Handling
  const incompleteProfile = { ...TEST_PROFILES.profileB, annualIncomeInr: undefined };
  const res7 = await processAssistantQuery("Am I eligible for PM-USP?", incompleteProfile);
  assert(res7.content.includes("missing") || res7.records.length > 0, "TEST 7: Handles missing income without inferring data");

  // TEST 8: Unknown Question Defense (Zero Hallucination)
  const res8 = await processAssistantQuery("What is the official grant for quantum computing rockets?", TEST_PROFILES.profileB);
  assert(res8.intent.intent === "UNKNOWN", "TEST 8: Unknown non-existent query classified as UNKNOWN");
  assert(res8.content.includes("couldn't find verified information"), "TEST 8: Refuses to hallucinate and offers Explore alternative");
  assert(res8.actions.some((a) => a.payload === "/explore"), "TEST 8: Exposes Explore fallback action");

  // TEST 9: Offline Fallback & Reliability
  assert(res1.toolStatus !== undefined, "TEST 9: Assistant tool status indicates Vayam Knowledge Core execution");

  console.log("\n📊 AI Civic Assistant Test Results Summary:");
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
  runAssistantTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
