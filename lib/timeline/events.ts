/**
 * lib/timeline/events.ts
 *
 * 100% Database-Driven Life Event Engine for Vayam Civic Timeline.
 * Queries KnowledgeRepository (Supabase DB records) for official identity documents,
 * voter cards, driving licences, passports, PAN cards, and constitutional milestones.
 *
 * Hero Banner Selection: Strictly chooses the nearest, most urgent mandatory task
 * (e.g. Voter ID, Driving Licence, Aadhaar update) and filters out far-future candidacy (1500+ days).
 */

import type { UserProfile } from "@/lib/core/types";
import { calculateAgeDetailed } from "@/lib/core/age";
import { KnowledgeRepository } from "@/lib/knowledge/repository";
import type { LifeEvent, SmartTimelineState } from "./types";

function formatDateISO(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Derive database-driven civic identity & documentation events for a citizen profile.
 */
export function deriveLifeEvents(
  profile: UserProfile | null,
  referenceDateObj: Date = new Date()
): LifeEvent[] {
  if (!profile || !profile.dateOfBirth) return [];

  const age = calculateAgeDetailed(profile.dateOfBirth, referenceDateObj);
  const events: LifeEvent[] = [];

  const dobParts = profile.dateOfBirth.split("-").map(Number);
  const birthYear = dobParts[0];
  const birthMonth = dobParts[1] - 1;
  const birthDay = dobParts[2];

  const birthday18Date = new Date(birthYear + 18, birthMonth, birthDay);
  const birthday18Str = formatDateISO(birthday18Date);

  const birthday21Date = new Date(birthYear + 21, birthMonth, birthDay);
  const birthday21Str = formatDateISO(birthday21Date);

  const birthday25Date = new Date(birthYear + 25, birthMonth, birthDay);
  const birthday25Str = formatDateISO(birthday25Date);

  const birthday60Date = new Date(birthYear + 60, birthMonth, birthDay);
  const birthday60Str = formatDateISO(birthday60Date);

  // Fetch all dynamic database records
  const allDbRecords = KnowledgeRepository.getAllKnowledgeRecords();

  // Find exact database records for official civic services
  const voterDbRec = allDbRecords.find(
    (r) => r.id === "eci-voter-form6-service" || r.title.toLowerCase().includes("voter")
  );
  const licenceDbRec = allDbRecords.find(
    (r) => r.id === "morth-learners-licence" || r.title.toLowerCase().includes("licence") || r.title.toLowerCase().includes("driving")
  );
  const aadhaarDbRec = allDbRecords.find(
    (r) => r.id === "uidai-aadhaar-enrolment" || r.title.toLowerCase().includes("aadhaar")
  );
  const passportDbRec = allDbRecords.find(
    (r) => r.id === "passport-seva-adult" || r.title.toLowerCase().includes("passport")
  );

  // -------------------------------------------------------------------------
  // 1. Mandatory Aadhaar Identity Update (Ages 15–17)
  // -------------------------------------------------------------------------
  if (age.years >= 15 && age.years < 18) {
    events.push({
      id: "event-aadhaar-update",
      title: aadhaarDbRec ? aadhaarDbRec.title : "Mandatory Aadhaar Biometric Update (Age 15)",
      description: aadhaarDbRec
        ? aadhaarDbRec.shortDescription
        : "Mandatory biometric update (iris, fingerprints, photo) at UIDAI enrolment center for citizens reaching age 15.",
      category: "services",
      status: "CURRENT",
      triggerAgeYears: 15,
      urgency: "high",
      priority: "HIGH",
      relatedKnowledgeIds: aadhaarDbRec ? [aadhaarDbRec.id] : [],
      relatedRecords: aadhaarDbRec ? [aadhaarDbRec] : [],
      ruleReasons: [
        `Date of birth: ${profile.dateOfBirth}`,
        `Current age: ${age.years} years`,
        "UIDAI regulation requires mandatory biometric re-verification at age 15",
      ],
      source: aadhaarDbRec?.source,
      actionLabel: "Official UIDAI Aadhaar Portal",
      actionUrl: aadhaarDbRec?.application?.officialUrl && aadhaarDbRec.application.officialUrl !== "#"
        ? aadhaarDbRec.application.officialUrl
        : "https://myaadhaar.uidai.gov.in",
    });
  }

  // -------------------------------------------------------------------------
  // 2. Voter ID Registration (ECI Form 6) — Age 18+ (or 17yo upcoming)
  // -------------------------------------------------------------------------
  if (age.years === 17) {
    const daysUntil18 = age.daysUntilBirthday;
    events.push({
      id: "event-voter-id-upcoming",
      title: voterDbRec ? voterDbRec.title : "Voter ID Card Registration (Form 6)",
      description: voterDbRec
        ? `Upcoming on your 18th birthday (${daysUntil18} days to go): ${voterDbRec.shortDescription}`
        : `Your 18th birthday is in ${daysUntil18} days! Prepare to register for your official ECI Voter Identity Card.`,
      category: "age_milestone",
      status: "UPCOMING",
      eventDate: birthday18Str,
      daysUntil: daysUntil18,
      triggerAgeYears: 18,
      urgency: daysUntil18 <= 60 ? "urgent" : "high",
      priority: "HIGH",
      relatedKnowledgeIds: voterDbRec ? [voterDbRec.id] : [],
      relatedRecords: voterDbRec ? [voterDbRec] : [],
      ruleReasons: [
        `Date of birth: ${profile.dateOfBirth}`,
        `18th Birthday: ${birthday18Str} (${daysUntil18} days away)`,
        "Constitutional voting rights (Article 326) apply at age 18",
      ],
      source: voterDbRec?.source,
      actionLabel: "Apply on ECI Voter Portal",
      actionUrl: voterDbRec?.application?.officialUrl && voterDbRec.application.officialUrl !== "#"
        ? voterDbRec.application.officialUrl
        : "https://voters.eci.gov.in",
    });
  } else if (age.years >= 18) {
    events.push({
      id: "event-voter-id-active",
      title: voterDbRec ? voterDbRec.title : "ECI Voter Identity Card (Electoral Roll)",
      description: voterDbRec
        ? voterDbRec.shortDescription
        : "You are legally eligible to hold an Indian Voter ID card and vote in National, State & Local elections.",
      category: "civic_right",
      status: "CURRENT",
      triggerAgeYears: 18,
      urgency: "high",
      priority: "HIGH",
      relatedKnowledgeIds: voterDbRec ? [voterDbRec.id] : [],
      relatedRecords: voterDbRec ? [voterDbRec] : [],
      ruleReasons: [`Current age: ${age.years} years (Age >= 18 satisfies voting eligibility)`],
      source: voterDbRec?.source,
      actionLabel: "Apply on ECI Voter Portal",
      actionUrl: voterDbRec?.application?.officialUrl && voterDbRec.application.officialUrl !== "#"
        ? voterDbRec.application.officialUrl
        : "https://voters.eci.gov.in",
    });
  }

  // -------------------------------------------------------------------------
  // 3. Driving Licence (MoRTH Learner's & Permanent) — Age 18+
  // -------------------------------------------------------------------------
  if (age.years >= 18) {
    events.push({
      id: "event-driving-licence-active",
      title: licenceDbRec ? licenceDbRec.title : "Motor Vehicle Driving Licence",
      description: licenceDbRec
        ? licenceDbRec.shortDescription
        : "Eligible to apply for a MoRTH Learner's Licence and Permanent Driving Licence for private motor vehicles.",
      category: "services",
      status: "CURRENT",
      triggerAgeYears: 18,
      urgency: "medium",
      priority: "HIGH",
      relatedKnowledgeIds: licenceDbRec ? [licenceDbRec.id] : [],
      relatedRecords: licenceDbRec ? [licenceDbRec] : [],
      ruleReasons: [`Current age: ${age.years} years (Age >= 18 satisfies motor driving licence eligibility)`],
      source: licenceDbRec?.source,
      actionLabel: "Apply on Parivahan Licence Portal",
      actionUrl: licenceDbRec?.application?.officialUrl && licenceDbRec.application.officialUrl !== "#"
        ? licenceDbRec.application.officialUrl
        : "https://sarathi.parivahan.gov.in",
    });
  }

  // -------------------------------------------------------------------------
  // 4. Passport Application (Adult Passport) — Age 18+
  // -------------------------------------------------------------------------
  if (age.years >= 18) {
    events.push({
      id: "event-passport-application",
      title: passportDbRec ? passportDbRec.title : "Indian Passport Application (Passport Seva)",
      description: passportDbRec
        ? passportDbRec.shortDescription
        : "Apply for a 10-year validity adult Indian Passport via Passport Seva portal for official identity and international travel.",
      category: "services",
      status: "CURRENT",
      triggerAgeYears: 18,
      urgency: "low",
      priority: "MEDIUM",
      relatedKnowledgeIds: passportDbRec ? [passportDbRec.id] : [],
      relatedRecords: passportDbRec ? [passportDbRec] : [],
      ruleReasons: [`Age: ${age.years} years (Eligible for adult 10-year Indian passport)`],
      source: passportDbRec?.source,
      actionLabel: "Apply on Passport Seva Portal",
      actionUrl: passportDbRec?.application?.officialUrl && passportDbRec.application.officialUrl !== "#"
        ? passportDbRec.application.officialUrl
        : "https://www.passportindia.gov.in",
    });
  }

  // -------------------------------------------------------------------------
  // 5. Local Body Electoral Candidacy — Age 21
  // -------------------------------------------------------------------------
  if (age.years < 21) {
    const daysUntil21 = Math.max(0, Math.ceil((birthday21Date.getTime() - referenceDateObj.getTime()) / (1000 * 3600 * 24)));
    events.push({
      id: "event-local-elections-candidacy",
      title: "Local Body Electoral Candidacy (Gram Panchayat / Ward Councillor)",
      description: `Under Article 243V of the Constitution, turning 21 makes you legally eligible to contest local municipal and panchayat elections.`,
      category: "civic_right",
      status: "UPCOMING",
      eventDate: birthday21Str,
      daysUntil: daysUntil21,
      triggerAgeYears: 21,
      urgency: "low",
      priority: "LOW",
      relatedKnowledgeIds: [],
      ruleReasons: [
        `Current age: ${age.years} years`,
        `Article 243V local candidacy age threshold is 21 (Unlocks in ~${21 - age.years} year(s))`,
      ],
      actionLabel: "Official ECI Election Portal",
      actionUrl: "https://eci.gov.in",
    });
  }

  // -------------------------------------------------------------------------
  // 6. Senior Citizen Identity Card & Social Security — Age 60
  // -------------------------------------------------------------------------
  if (age.years < 60) {
    const daysUntil60 = Math.max(0, Math.ceil((birthday60Date.getTime() - referenceDateObj.getTime()) / (1000 * 3600 * 24)));
    events.push({
      id: "event-senior-card-later",
      title: "Senior Citizen Official Identity Card & Social Security",
      description: "Reaching age 60 unlocks official Senior Citizen Identity Cards, travel concessions, higher bank FD interest rates, and pension support.",
      category: "senior",
      status: "LATER",
      eventDate: birthday60Str,
      daysUntil: daysUntil60,
      triggerAgeYears: 60,
      urgency: "low",
      priority: "LOW",
      relatedKnowledgeIds: [],
      ruleReasons: [`Current age: ${age.years} years (Senior citizen milestone at age 60)`],
      actionLabel: "Official National Social Pension Portal",
      actionUrl: "https://nsap.nic.in",
    });
  }

  return events;
}

/**
 * Computes Smart Timeline state for a user.
 * Strictly selects the nearest, most urgent mandatory document/registration for the Hero card.
 */
export function getSmartTimelineState(
  profile: UserProfile | null,
  referenceDateObj: Date = new Date()
): SmartTimelineState {
  if (!profile) {
    return {
      profile: null,
      age: null,
      heroEvent: null,
      nowEvents: [],
      nextEvents: [],
      laterEvents: [],
      completedEvents: [],
      allEvents: [],
    };
  }

  const age = calculateAgeDetailed(profile.dateOfBirth, referenceDateObj);
  const allEvents = deriveLifeEvents(profile, referenceDateObj);

  const nowEvents = allEvents.filter(
    (e) => e.status === "CURRENT" || e.status === "REQUIRES_VERIFICATION"
  );
  const nextEvents = allEvents.filter((e) => e.status === "UPCOMING");
  const laterEvents = allEvents.filter((e) => e.status === "LATER");
  const completedEvents = allEvents.filter((e) => e.status === "COMPLETED");

  // Hero Selection: Filter strictly for nearest, most urgent mandatory items (daysUntil <= 365)
  // NEVER select a far-future candidacy event (e.g. 1500+ days away) over urgent current identity documents!
  let heroEvent: LifeEvent | null = null;

  // 1. High priority NOW event (e.g. Aadhaar update, Voter ID, Driving Licence)
  const highPriorityNow = nowEvents.find((e) => e.priority === "HIGH" || e.urgency === "high" || e.urgency === "urgent");
  // 2. Urgent near-term UPCOMING event (daysUntil <= 365)
  const nearUpcoming = nextEvents.find((e) => e.daysUntil !== undefined && e.daysUntil <= 365);

  heroEvent = highPriorityNow || nearUpcoming || nowEvents[0] || nextEvents[0] || allEvents[0] || null;

  return {
    profile,
    age,
    heroEvent,
    nowEvents,
    nextEvents,
    laterEvents,
    completedEvents,
    allEvents,
  };
}
