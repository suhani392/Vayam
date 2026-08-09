/**
 * lib/i18n/__tests__/i18n.test.ts
 *
 * Test Suite for Vayam Phase 9 i18n & Multilingual System.
 * Validates translation lookup, language fallback, key coverage,
 * multilingual intent classification, and code-mixed input handling.
 */

import { t } from "../index";
import { en } from "../en";
import { hi } from "../hi";
import { mr } from "../mr";
import { SUPPORTED_LANGUAGES } from "../types";
import type { TranslationMap } from "../types";
import { classifyUserIntent } from "../../ai/intents";
import { processAssistantQuery } from "../../ai/orchestrator";
import { TEST_PROFILES } from "../../core/data/test-profiles";

export async function runI18nTests() {
  const results: { name: string; status: "PASS" | "FAIL"; details?: string }[] = [];

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    results.push({
      name: testName,
      status: condition ? "PASS" : "FAIL",
      details: condition ? undefined : (failureDetails || "Assertion failed"),
    });
  }

  console.log("🧪 Starting Vayam Phase 9 i18n & Multilingual Test Suite...\n");

  // ── 1. Translation Lookup ──
  assert(t("nav.home", "en") === "Home", "T1: English t('nav.home') returns 'Home'");
  assert(t("nav.home", "hi") === "होम", "T1: Hindi t('nav.home') returns 'होम'");
  assert(t("nav.home", "mr") === "होम", "T1: Marathi t('nav.home') returns 'होम'");

  // ── 2. English Fallback ──
  // If a key doesn't exist in a language map, it should fallback to English
  const enKeys = Object.keys(en) as (keyof TranslationMap)[];
  const hiKeys = Object.keys(hi) as (keyof TranslationMap)[];
  const mrKeys = Object.keys(mr) as (keyof TranslationMap)[];
  assert(enKeys.length === hiKeys.length, "T2: Hindi translation has same key count as English");
  assert(enKeys.length === mrKeys.length, "T2: Marathi translation has same key count as English");

  // ── 3. Key Coverage — no missing keys ──
  let missingHi: string[] = [];
  let missingMr: string[] = [];
  enKeys.forEach((key) => {
    if (!(key in hi)) missingHi.push(key);
    if (!(key in mr)) missingMr.push(key);
  });
  assert(missingHi.length === 0, "T3: Hindi has no missing translation keys", `Missing: ${missingHi.join(", ")}`);
  assert(missingMr.length === 0, "T3: Marathi has no missing translation keys", `Missing: ${missingMr.join(", ")}`);

  // ── 4. Language metadata ──
  assert(SUPPORTED_LANGUAGES.length === 3, "T4: 3 supported languages (en, hi, mr)");
  assert(SUPPORTED_LANGUAGES[0].voiceLocale === "en-IN", "T4: English voice locale is en-IN");
  assert(SUPPORTED_LANGUAGES[1].voiceLocale === "hi-IN", "T4: Hindi voice locale is hi-IN");
  assert(SUPPORTED_LANGUAGES[2].voiceLocale === "mr-IN", "T4: Marathi voice locale is mr-IN");

  // ── 5. Multilingual Intent Classification ──

  // English
  const enScholarship = classifyUserIntent("What scholarships are available for me?");
  assert(enScholarship.intent === "EDUCATION_GUIDANCE", "T5: English scholarship query → EDUCATION_GUIDANCE");

  // Hindi (Devanagari)
  const hiScholarship = classifyUserIntent("मेरे लिए कौन सी छात्रवृत्तियां उपलब्ध हैं?");
  assert(hiScholarship.intent === "EDUCATION_GUIDANCE", "T5: Hindi scholarship query → EDUCATION_GUIDANCE");

  // Marathi (Devanagari)
  const mrScholarship = classifyUserIntent("माझ्यासाठी कोणत्या शिष्यवृत्ती उपलब्ध आहेत?");
  assert(mrScholarship.intent === "EDUCATION_GUIDANCE", "T5: Marathi scholarship query → EDUCATION_GUIDANCE");

  // Code-mixed Hindi (Romanized)
  const codeMixedHi = classifyUserIntent("Mujhe scholarship ke liye kya chahiye?");
  assert(codeMixedHi.intent === "EDUCATION_GUIDANCE", "T5: Code-mixed Hindi scholarship → EDUCATION_GUIDANCE");

  // Code-mixed Marathi
  const codeMixedMr = classifyUserIntent("मला scholarship साठी काय लागेल?");
  assert(codeMixedMr.intent === "EDUCATION_GUIDANCE", "T5: Code-mixed Marathi scholarship → EDUCATION_GUIDANCE");

  // ── 6. Milestone Intent — Multilingual ──
  const enMilestone = classifyUserIntent("I'm turning 18 soon. What changes?");
  assert(enMilestone.intent === "UPCOMING_MILESTONES", "T6: English milestone → UPCOMING_MILESTONES");

  const hiMilestone = classifyUserIntent("मैं 18 साल का होने वाला हूँ, मुझे क्या करना चाहिए?");
  assert(hiMilestone.intent === "UPCOMING_MILESTONES", "T6: Hindi milestone → UPCOMING_MILESTONES");

  const mrMilestone = classifyUserIntent("मी लवकरच 18 वर्षांचा होणार आहे, मला काय करायला हवं?");
  assert(mrMilestone.intent === "UPCOMING_MILESTONES", "T6: Marathi milestone → UPCOMING_MILESTONES");

  // ── 7. Eligibility Intent — Multilingual ──
  const hiElig = classifyUserIntent("क्या मैं इस scholarship के लिए eligible हूं?");
  assert(hiElig.intent === "CHECK_ELIGIBILITY", "T7: Hindi eligibility query → CHECK_ELIGIBILITY");

  const mrElig = classifyUserIntent("मी या scholarship साठी eligible आहे का?");
  assert(mrElig.intent === "CHECK_ELIGIBILITY", "T7: Marathi eligibility query → CHECK_ELIGIBILITY");

  // ── 8. AI Response Language ──
  const enRes = await processAssistantQuery("Find scholarships for higher education", TEST_PROFILES.profileB, "en");
  assert(enRes.content.length > 0 && !enRes.content.includes("छात्रवृत्ति"), "T8: English response is in English");

  const hiRes = await processAssistantQuery("छात्रवृत्ति खोजें", TEST_PROFILES.profileB, "hi");
  assert(hiRes.content.includes("छात्रवृत्ति") || hiRes.content.includes("शिक्षा") || hiRes.content.includes("प्रोफ़ाइल"), "T8: Hindi response is in Hindi");

  const mrRes = await processAssistantQuery("शिष्यवृत्ती शोधा", TEST_PROFILES.profileB, "mr");
  assert(mrRes.content.includes("शिष्यवृत्ती") || mrRes.content.includes("शिक्षण") || mrRes.content.includes("प्रोफाइल"), "T8: Marathi response is in Marathi");

  // ── 9. Source Preservation Across Languages ──
  assert(enRes.sources.length > 0, "T9: English response includes verified sources");
  assert(hiRes.sources.length > 0, "T9: Hindi response includes verified sources");
  assert(mrRes.sources.length > 0, "T9: Marathi response includes verified sources");

  // ── 10. Same Intelligence Engine for all languages ──
  assert(enRes.records.length > 0, "T10: English query produces records");
  assert(hiRes.records.length > 0, "T10: Hindi query produces records");
  assert(mrRes.records.length > 0, "T10: Marathi query produces records");
  // All education queries should reach the same category
  assert(
    enRes.records.every((r) => r.category === "education") &&
    hiRes.records.every((r) => r.category === "education") &&
    mrRes.records.every((r) => r.category === "education"),
    "T10: All 3 languages reach same education records"
  );

  // ── 11. Unknown query defense (multilingual) ──
  const unknownEn = await processAssistantQuery("What is the official grant for quantum computing rockets?", TEST_PROFILES.profileB, "en");
  assert(unknownEn.intent.intent === "UNKNOWN", "T11: Unknown English query → UNKNOWN");
  const unknownHi = await processAssistantQuery("क्वांटम कंप्यूटिंग रॉकेट के लिए क्या ग्रांट है?", TEST_PROFILES.profileB, "hi");
  assert(unknownHi.intent.intent === "UNKNOWN", "T11: Unknown Hindi query → UNKNOWN");

  // ── Print Results ──
  console.log("\n📊 i18n & Multilingual Test Results Summary:");
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
  runI18nTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
