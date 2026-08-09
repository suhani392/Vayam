/**
 * lib/core/__tests__/core-engine.test.ts
 *
 * Deterministic Test Suite for Vayam Civic Intelligence Core.
 * Validates Age Engine, Life Stage Engine, Milestones, Rule Engine, Eligibility Engine,
 * Relevance Engine, and Recommendation Ranking across test profiles.
 */

import { calculateAgeDetailed, getAgeInYears } from "../age/index";
import { evaluateLifeStage } from "../lifestage/index";
import { deriveCivicMilestones } from "../milestones/index";
import { evaluateAtomicCondition, evaluateRuleExpression } from "../rules/evaluator";
import { evaluateEligibility } from "../eligibility/index";
import { calculateRelevance } from "../relevance/index";
import { rankRecommendations } from "../recommendations/index";
import { TEST_PROFILES } from "../data/test-profiles";
import { DEMO_CIVIC_ITEMS } from "../data/demo-items";
import type { UserProfile, CivicItem } from "../types";

export function runCoreEngineTests() {
  const results: { name: string; status: "PASS" | "FAIL"; details?: string }[] = [];

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    if (condition) {
      results.push({ name: testName, status: "PASS" });
    } else {
      results.push({ name: testName, status: "FAIL", details: failureDetails || "Assertion failed" });
    }
  }

  console.log("🧪 Starting Vayam Civic Intelligence Core Test Suite...\n");

  // 1. Age Engine Tests
  const dob17 = "2009-02-15";
  const refDate = new Date(Date.UTC(2026, 7, 9)); // 2026-08-09
  const age17 = calculateAgeDetailed(dob17, refDate);
  assert(age17.years === 17, "Age Engine: 17-year-old DOB correctly yields 17 years", `Got ${age17.years}`);

  const leapDob = "2004-02-29";
  const leapAge = calculateAgeDetailed(leapDob, refDate);
  assert(leapAge.years === 22, "Age Engine: Feb 29 leap year birthday calculated correctly", `Got ${leapAge.years}`);

  const bdayTodayDob = "2008-08-09";
  const bdayTodayAge = calculateAgeDetailed(bdayTodayDob, refDate);
  assert(bdayTodayAge.daysUntilBirthday === 0, "Age Engine: Exact birthday today yields daysUntilBirthday === 0", `Got ${bdayTodayAge.daysUntilBirthday}`);

  // 2. Life Stage Engine Tests
  const lifeStageA = evaluateLifeStage(TEST_PROFILES.profileA, refDate);
  assert(lifeStageA.stage === "adolescent", "Life Stage Engine: 17yo classified as adolescent", `Got ${lifeStageA.stage}`);

  const lifeStageB = evaluateLifeStage(TEST_PROFILES.profileB, refDate);
  assert(lifeStageB.stage === "young_adult", "Life Stage Engine: 18yo student classified as young_adult", `Got ${lifeStageB.stage}`);

  const lifeStageD = evaluateLifeStage(TEST_PROFILES.profileD, refDate);
  assert(lifeStageD.stage === "senior", "Life Stage Engine: 65yo classified as senior", `Got ${lifeStageD.stage}`);

  // 3. Civic Milestones Tests
  const milestonesA = deriveCivicMilestones(TEST_PROFILES.profileA, refDate);
  const voterUpcoming = milestonesA.find((m) => m.id === "voter-registration-upcoming");
  assert(Boolean(voterUpcoming), "Milestones Engine: 17yo gets upcoming voter registration milestone");

  const milestonesB = deriveCivicMilestones(TEST_PROFILES.profileB, refDate);
  const voterActive = milestonesB.find((m) => m.id === "voter-registration-18");
  assert(Boolean(voterActive), "Milestones Engine: 18yo gets active voter registration milestone");

  // 4. Rule Engine Tests
  const atomicGte = evaluateAtomicCondition(
    { field: "age", operator: "gte", value: 18 },
    TEST_PROFILES.profileB
  );
  assert(atomicGte.passed, "Rule Engine: 18yo satisfies age >= 18 condition");

  const atomicIn = evaluateAtomicCondition(
    { field: "location.stateCode", operator: "in", values: ["MH", "DL"] },
    TEST_PROFILES.profileB
  );
  assert(atomicIn.passed, "Rule Engine: Maharashtra profile satisfies state IN [MH, DL]");

  // 5. Missing Information & Eligibility Engine Tests
  const incompleteProfile: UserProfile = {
    ...TEST_PROFILES.profileB,
    annualIncomeInr: undefined, // Missing income
  };
  const incomeScheme = DEMO_CIVIC_ITEMS.find((i) => i.id === "pm-kisan-scheme")!;
  const eligUnknown = evaluateEligibility(incompleteProfile, incomeScheme);
  assert(eligUnknown.status === "UNKNOWN", "Eligibility Engine: Missing annualIncomeInr returns UNKNOWN status", `Got ${eligUnknown.status}`);
  assert(eligUnknown.missingFields.includes("annualIncomeInr"), "Eligibility Engine: Identifies annualIncomeInr in missingFields");

  // 17-year-old evaluating 18+ voter registration -> NOT_YET
  const voterScheme = DEMO_CIVIC_ITEMS.find((i) => i.id === "eci-voter-form6-service")!;
  const eligNotYet = evaluateEligibility(TEST_PROFILES.profileA, voterScheme);
  assert(eligNotYet.status === "NOT_YET", "Eligibility Engine: 17yo evaluating 18+ scheme returns NOT_YET", `Got ${eligNotYet.status}`);

  // 6. Recommendation Engine Tests & Differentiation
  const recsB = rankRecommendations(TEST_PROFILES.profileB, DEMO_CIVIC_ITEMS);
  const recsD = rankRecommendations(TEST_PROFILES.profileD, DEMO_CIVIC_ITEMS);

  assert(recsB.length > 0 && recsD.length > 0, "Recommendation Engine: Generates non-empty ranked recommendations");
  assert(recsB[0].item.id !== recsD[0].item.id, "Recommendation Engine: Profile B (18yo student) and Profile D (65yo senior) receive different top recommendation");

  console.log("\n📊 Core Intelligence Engine Test Results Summary:");
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
  const success = runCoreEngineTests();
  process.exit(success ? 0 : 1);
}
