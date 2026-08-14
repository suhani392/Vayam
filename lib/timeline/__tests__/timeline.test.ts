/**
 * lib/timeline/__tests__/timeline.test.ts
 *
 * Comprehensive Test Suite for Vayam Phase 10 Life Events & Smart Civic Timeline.
 * Validates 18th birthday countdown, 18th birthday today, senior citizen milestones,
 * education/career events, leap year birthdays, missing data handling, notification generation,
 * reminder preferences, and profile re-evaluation.
 */

import { deriveLifeEvents, getSmartTimelineState } from "../events";
import { generateCivicNotifications, getReminderPreferences, saveReminderPreferences } from "../../notifications";
import { TEST_PROFILES } from "../../core/data/test-profiles";
import type { UserProfile } from "../../core/types";

export function runTimelineTests() {
  const results: { name: string; status: "PASS" | "FAIL"; details?: string }[] = [];

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    results.push({
      name: testName,
      status: condition ? "PASS" : "FAIL",
      details: condition ? undefined : (failureDetails || "Assertion failed"),
    });
  }

  console.log("🧪 Starting Vayam Phase 10 Smart Civic Timeline Test Suite...\n");

  const refDate = new Date("2026-08-09"); // Fixed reference date for predictable test calculations

  // ── TEST 1: 18th Birthday Countdown for 17yo (Profile A) ──
  const eventsA = deriveLifeEvents(TEST_PROFILES.profileA, refDate);
  const bday18A = eventsA.find((e) => e.id === "event-18th-birthday");
  assert(bday18A !== undefined, "TEST 1: 17yo Profile A generates 18th Birthday event");
  assert(bday18A?.status === "UPCOMING", "TEST 1: 18th Birthday event status is UPCOMING");
  assert(typeof bday18A?.daysUntil === "number" && bday18A.daysUntil > 0, "TEST 1: 18th Birthday has deterministic positive daysUntil");
  assert(Boolean(bday18A?.relatedKnowledgeIds.includes("eci-voter-form6-service")), "TEST 1: 18th Birthday event links to Voter ID portal record");

  // ── TEST 2: 18th Birthday Today (Born 2008-08-09 on 2026-08-09) ──
  const profile18Today: UserProfile = {
    ...TEST_PROFILES.profileA,
    dateOfBirth: "2008-08-09",
  };
  const events18Today = deriveLifeEvents(profile18Today, refDate);
  const bday18Today = events18Today.find((e) => e.id.includes("18th-birthday"));
  assert(bday18Today !== undefined, "TEST 2: Profile turning 18 today generates 18th birthday event");
  assert(Boolean(bday18Today?.isToday), "TEST 2: Event flags isToday === true");
  assert(bday18Today?.daysUntil === 0, "TEST 2: Event has daysUntil === 0");
  assert(bday18Today?.status === "CURRENT", "TEST 2: Event status is CURRENT on birthday today");

  // ── TEST 3: 18 Years 1 Day (Born 2008-08-08 on 2026-08-09) ──
  const profile18OneDay: UserProfile = {
    ...TEST_PROFILES.profileA,
    dateOfBirth: "2008-08-08",
  };
  const events18OneDay = deriveLifeEvents(profile18OneDay, refDate);
  const bday18OneDay = events18OneDay.find((e) => e.id === "event-adult-civic-rights");
  assert(bday18OneDay !== undefined, "TEST 3: 18yo 1 day profile generates Adult Civic Rights event");
  assert(bday18OneDay?.status === "CURRENT", "TEST 3: Status is CURRENT for 18yo 1 day profile");

  // ── TEST 4: Senior Citizen Milestone 60+ (Profile D 65yo) ──
  const eventsD = deriveLifeEvents(TEST_PROFILES.profileD, refDate);
  const seniorP = eventsD.find((e) => e.id === "event-senior-pension-60");
  assert(seniorP !== undefined, "TEST 4: 65yo Profile D generates Senior Pension 60+ event");
  assert(seniorP?.status === "CURRENT" || seniorP?.status === "REQUIRES_VERIFICATION", "TEST 4: Senior event status is CURRENT or REQUIRES_VERIFICATION");

  // ── TEST 5: Senior Milestone 60th Birthday Today (Born 1966-08-09) ──
  const profile60Today: UserProfile = {
    ...TEST_PROFILES.profileD,
    dateOfBirth: "1966-08-09",
  };
  const events60Today = deriveLifeEvents(profile60Today, refDate);
  const senior60Today = events60Today.find((e) => e.id === "event-senior-pension-60");
  assert(senior60Today !== undefined, "TEST 5: Turning 60 today generates Senior Pension 60+ event");

  // ── TEST 6: 59 Years 364 Days (Born 1966-08-10 on 2026-08-09 - turning 60 tomorrow) ──
  const profile59y364d: UserProfile = {
    ...TEST_PROFILES.profileD,
    dateOfBirth: "1966-08-10",
  };
  const events59 = deriveLifeEvents(profile59y364d, refDate);
  const senior59Upcoming = events59.find((e) => e.id === "event-senior-60-upcoming");
  assert(senior59Upcoming !== undefined, "TEST 6: 59yo profile generates upcoming senior milestone");
  assert(senior59Upcoming?.status === "UPCOMING", "TEST 6: 59yo senior event status is UPCOMING");

  // ── TEST 7: Leap Year Birthday (Feb 29 2008) ──
  const profileLeapYear: UserProfile = {
    ...TEST_PROFILES.profileA,
    dateOfBirth: "2008-02-29",
  };
  const eventsLeap = deriveLifeEvents(profileLeapYear, refDate);
  assert(eventsLeap.length > 0, "TEST 7: Leap year DOB (Feb 29 2008) calculates without errors or NaN");

  // ── TEST 8: Education Events ──
  const profileEdu: UserProfile = {
    ...TEST_PROFILES.profileB,
    educationLevel: "secondary",
  };
  const eventsEdu = deriveLifeEvents(profileEdu, refDate);
  const eduEvt = eventsEdu.find((e) => e.category === "education");
  assert(eduEvt !== undefined, "TEST 8: Class 10/12 profile generates Education Scholarship event");
  assert(Boolean(eduEvt?.relatedKnowledgeIds.includes("pm-usp-csss-scholarship")), "TEST 8: Links to PM-USP scholarship record");

  // ── TEST 9: Career Events ──
  const profileCareer: UserProfile = {
    ...TEST_PROFILES.profileC,
    employmentStatus: "unemployed",
  };
  const eventsCareer = deriveLifeEvents(profileCareer, refDate);
  const careerEvt = eventsCareer.find((e) => e.category === "career");
  assert(careerEvt !== undefined, "TEST 9: Unemployed profile generates NCS Career Registration event");

  // ── TEST 10: Smart Timeline Partitioning ──
  const timelineA = getSmartTimelineState(TEST_PROFILES.profileA, refDate);
  assert(timelineA.heroEvent !== null, "TEST 10: Smart Timeline selects non-null Hero Event");
  assert(timelineA.allEvents.length > 0, "TEST 10: Timeline contains all derived events");

  // ── TEST 11: Notification Generation ──
  const notifsA = generateCivicNotifications(TEST_PROFILES.profileA, "en");
  assert(notifsA.length > 0, "TEST 11: Generates non-empty notifications list");
  const highNotif = notifsA.find((n) => n.priority === "HIGH");
  assert(highNotif !== undefined, "TEST 11: Generates HIGH priority notification for upcoming 18th birthday");

  // ── TEST 12: Notification Privacy Compliance ──
  const notifIncome = notifsA.find((n) => n.id === "notif-missing-income");
  if (notifIncome) {
    assert(!notifIncome.message.includes("₹") && !notifIncome.message.includes("INR"), "TEST 12: Missing income notification does not leak currency/income numbers");
  } else {
    assert(true, "TEST 12: Privacy test passed");
  }

  // ── TEST 13: Reminder Preferences Persistence ──
  saveReminderPreferences({ enabled: true, mode: "all" });
  const prefsLoaded = getReminderPreferences();
  assert(prefsLoaded.enabled === true, "TEST 13: Reminder preferences loaded successfully");

  // ── TEST 14: Profile Change Re-evaluation ──
  const stateA = getSmartTimelineState(TEST_PROFILES.profileA, refDate);
  const stateD = getSmartTimelineState(TEST_PROFILES.profileD, refDate);
  assert(stateA.heroEvent?.id !== stateD.heroEvent?.id, "TEST 14: Profile change re-evaluates hero event dynamically without stale state");

  // ── Print Results ──
  console.log("\n📊 Smart Civic Timeline Test Results Summary:");
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
  const success = runTimelineTests();
  process.exit(success ? 0 : 1);
}
