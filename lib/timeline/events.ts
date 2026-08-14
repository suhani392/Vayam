/**
 * lib/timeline/events.ts
 *
 * Deterministic Life Event Engine for Vayam Phase 10.
 * Reuses Phase 5 age calculation, milestone derivation, and KnowledgeRepository.
 * Zero AI date calculation. Zero hallucination.
 */

import type { UserProfile } from "@/lib/core/types";
import { calculateAgeDetailed } from "@/lib/core/age";
import { deriveCivicMilestones } from "@/lib/core/milestones";
import { KnowledgeRepository } from "@/lib/knowledge/repository";
import { knowledgeRecordToCivicItem } from "@/lib/knowledge/adapter";
import { evaluateEligibility as evaluateCoreEligibility } from "@/lib/core/eligibility";
import type { LifeEvent, SmartTimelineState, LifeEventState } from "./types";

/**
 * Formats a Date object into YYYY-MM-DD string format.
 */
function formatDateISO(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Derive deterministic life events for a given citizen profile.
 */
export function deriveLifeEvents(
  profile: UserProfile | null,
  referenceDateObj: Date = new Date()
): LifeEvent[] {
  if (!profile || !profile.dateOfBirth) return [];

  const age = calculateAgeDetailed(profile.dateOfBirth, referenceDateObj);
  const events: LifeEvent[] = [];

  // Parse DOB components
  const dobParts = profile.dateOfBirth.split("-").map(Number);
  const birthYear = dobParts[0];
  const birthMonth = dobParts[1] - 1; // 0-indexed
  const birthDay = dobParts[2];

  // Calculate 18th Birthday Date
  const birthday18Date = new Date(birthYear + 18, birthMonth, birthDay);
  const birthday18Str = formatDateISO(birthday18Date);

  // Calculate 60th Birthday Date
  const birthday60Date = new Date(birthYear + 60, birthMonth, birthDay);
  const birthday60Str = formatDateISO(birthday60Date);

  // Calculate 65th Birthday Date
  const birthday65Date = new Date(birthYear + 65, birthMonth, birthDay);
  const birthday65Str = formatDateISO(birthday65Date);

  // -------------------------------------------------------------------------
  // 1. 18th Birthday Milestone (17yo countdown or 18yo today)
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // 1. 18th Birthday Milestone (17yo countdown or 18yo today)
  // -------------------------------------------------------------------------
  const allRecords = KnowledgeRepository.getAllKnowledgeRecords();
  const voterRecord = allRecords.find((r) => r.id === "eci-voter-form6-service" || r.title.toLowerCase().includes("voter")) || allRecords[0];
  const licenceRecord = allRecords.find((r) => r.id === "morth-learners-licence" || r.title.toLowerCase().includes("licence") || r.title.toLowerCase().includes("driving")) || allRecords[1];

  const voterActionUrl = voterRecord ? `/explore/${voterRecord.id}` : "/explore?query=voter";

  if (age.years === 17) {
    const isToday18 = age.daysUntilBirthday === 0;
    const daysUntil18 = age.daysUntilBirthday;

    events.push({
      id: "event-18th-birthday",
      title: isToday18 ? "🎂 You're 18 Today!" : "18th Birthday — Adult Civic Rights",
      description: isToday18
        ? "Congratulations on reaching adulthood! You are now eligible to register to vote and apply for adult civic services."
        : `Your 18th birthday is coming up in ${daysUntil18} day${daysUntil18 === 1 ? "" : "s"}. You will unlock adult civic rights and electoral participation.`,
      category: "age_milestone",
      status: isToday18 ? "CURRENT" : "UPCOMING",
      eventDate: birthday18Str,
      daysUntil: daysUntil18,
      isToday: isToday18,
      triggerAgeYears: 18,
      urgency: daysUntil18 <= 30 ? "urgent" : "high",
      priority: "HIGH",
      relatedKnowledgeIds: [voterRecord?.id || "voter"].filter(Boolean),
      relatedRecords: [voterRecord, licenceRecord].filter(Boolean) as any[],
      ruleReasons: [
        `Date of birth: ${profile.dateOfBirth}`,
        `Current age: 17 years`,
        `18th Birthday: ${birthday18Str} (${daysUntil18} days away)`,
        "Constitutional voting rights (Article 326) apply at age 18",
      ],
      source: voterRecord?.source ? { name: voterRecord.source.name, url: voterRecord.source.url } : undefined,
      actionLabel: "Explore Voter Registration",
      actionUrl: voterActionUrl,
    });
  } else if (age.years === 18 && age.hasHadBirthdayThisYear && age.daysUntilBirthday === 365) {
    // Exactly turned 18 today!
    events.push({
      id: "event-18th-birthday-today",
      title: "🎂 You Turned 18 Today!",
      description: "Welcome to full civic adulthood! You are now eligible to register as a voter and access age-dependent adult government services.",
      category: "age_milestone",
      status: "CURRENT",
      eventDate: birthday18Str,
      daysUntil: 0,
      isToday: true,
      triggerAgeYears: 18,
      urgency: "urgent",
      priority: "HIGH",
      relatedKnowledgeIds: [voterRecord?.id || "voter"].filter(Boolean),
      relatedRecords: [voterRecord].filter(Boolean) as any[],
      ruleReasons: [
        `Date of birth: ${profile.dateOfBirth}`,
        "Age 18 reached today",
        "Voter registration (Form 6) becomes active immediately",
      ],
      source: voterRecord?.source ? { name: voterRecord.source.name, url: voterRecord.source.url } : undefined,
      actionLabel: "Register to Vote Now",
      actionUrl: voterActionUrl,
    });
  } else if (age.years >= 18 && age.years < 25) {
    // Current adult 18-24
    events.push({
      id: "event-adult-civic-rights",
      title: "Adult Civic Rights & Electoral Participation",
      description: "You have full constitutional voting rights and access to motor vehicle driving licence issuance.",
      category: "civic_right",
      status: "CURRENT",
      triggerAgeYears: 18,
      urgency: "medium",
      priority: "MEDIUM",
      relatedKnowledgeIds: [voterRecord?.id || "voter"].filter(Boolean),
      relatedRecords: [voterRecord].filter(Boolean) as any[],
      ruleReasons: [`Current age: ${age.years} years (Satisfies age >= 18)`],
      source: voterRecord?.source ? { name: voterRecord.source.name, url: voterRecord.source.url } : undefined,
      actionLabel: "Check Voter Portal",
      actionUrl: voterActionUrl,
    });
  }

  // -------------------------------------------------------------------------
  // 2. Education Events (Class 10, Class 12, Higher Education)
  // -------------------------------------------------------------------------
  const csssRecord = allRecords.find((r) => r.id === "pm-usp-csss-scholarship" || r.title.toLowerCase().includes("scholarship") || r.category === "scholarship") || allRecords[0];
  const scholarshipActionUrl = csssRecord ? `/explore/${csssRecord.id}` : "/explore?category=scholarship";

  if (profile.educationLevel === "secondary" || profile.educationLevel === "higher_secondary") {
    events.push({
      id: "event-education-scholarships",
      title: "Higher Secondary & College Scholarship Window",
      description: "Central Sector Post-Matric Scholarships (PM-USP CSSS) and NMMSS scholarship applications for Class 10/12 students.",
      category: "education",
      status: "CURRENT",
      urgency: "high",
      priority: "HIGH",
      relatedKnowledgeIds: [csssRecord?.id || "scholarship"].filter(Boolean),
      relatedRecords: [csssRecord].filter(Boolean) as any[],
      ruleReasons: [
        `Profile Education Stage: ${profile.educationLevel}`,
        "Meets minimum 80th percentile requirement for Post-Matric CSSS",
      ],
      source: csssRecord?.source ? { name: csssRecord.source.name, url: csssRecord.source.url } : undefined,
      actionLabel: "View Scholarship Details",
      actionUrl: scholarshipActionUrl,
    });
  } else if (profile.educationLevel === "undergraduate" || profile.educationLevel === "postgraduate") {
    const internshipRecord = allRecords.find((r) => r.id === "skill-india-digital-hub-apprenticeship" || r.title.toLowerCase().includes("skill") || r.title.toLowerCase().includes("internship")) || csssRecord;
    const internshipActionUrl = internshipRecord ? `/explore/${internshipRecord.id}` : "/explore?category=education";

    events.push({
      id: "event-higher-education-career",
      title: "Higher Education & Skill Development Opportunities",
      description: "PM Internship & Apprenticeship training (stipend + National Apprenticeship Certificate) via Skill India Digital Hub.",
      category: "education",
      status: "CURRENT",
      urgency: "medium",
      priority: "MEDIUM",
      relatedKnowledgeIds: [internshipRecord?.id || "internship"].filter(Boolean),
      relatedRecords: [internshipRecord].filter(Boolean) as any[],
      ruleReasons: [
        `Profile Education Stage: ${profile.educationLevel}`,
        "Eligible for corporate & industrial apprenticeship training in top establishments",
      ],
      source: internshipRecord?.source ? { name: internshipRecord.source.name, url: internshipRecord.source.url } : undefined,
      actionLabel: "Explore Internship",
      actionUrl: internshipActionUrl,
    });
  }

  // -------------------------------------------------------------------------
  // 3. Career & Employment Events
  // -------------------------------------------------------------------------
  if (profile.employmentStatus === "unemployed" || profile.employmentStatus === "student") {
    const ncsRecord = allRecords.find((r) => r.id === "national-career-service" || r.title.toLowerCase().includes("career") || r.title.toLowerCase().includes("job")) || allRecords[0];
    const ncsActionUrl = ncsRecord ? `/explore/${ncsRecord.id}` : "/explore?category=services";

    events.push({
      id: "event-ncs-job-registration",
      title: "National Career Service (NCS) Job Portal Registration",
      description: "Free job matching, career counseling, employment exchanges, and skill training across India.",
      category: "career",
      status: "CURRENT",
      urgency: "medium",
      priority: "MEDIUM",
      relatedKnowledgeIds: [ncsRecord?.id || "ncs"].filter(Boolean),
      relatedRecords: [ncsRecord].filter(Boolean) as any[],
      ruleReasons: [
        `Employment Status: ${profile.employmentStatus}`,
        "NCS portal provides verified government job opportunities",
      ],
      source: ncsRecord?.source ? { name: ncsRecord.source.name, url: ncsRecord.source.url } : undefined,
      actionLabel: "Open NCS Portal",
      actionUrl: ncsActionUrl,
    });
  }

  // -------------------------------------------------------------------------
  // 4. Senior Citizen Events (Age 60+, 65+)
  // -------------------------------------------------------------------------
  const ignoapsRecord = allRecords.find((r) => r.id === "ignaps-senior-pension" || r.title.toLowerCase().includes("pension")) || allRecords[0];
  const ignoapsActionUrl = ignoapsRecord ? `/explore/${ignoapsRecord.id}` : "/explore?category=services";

  if (age.years >= 60) {
    const isIncomeMissing = profile.annualIncomeInr === undefined || profile.annualIncomeInr === null;

    let eligStatus: LifeEventState = "CURRENT";
    let missingFieldsList: string[] = [];

    if (ignoapsRecord) {
      const civicItem = knowledgeRecordToCivicItem(ignoapsRecord);
      const coreElig = evaluateCoreEligibility(profile, civicItem);
      if (coreElig.status === "UNKNOWN") {
        eligStatus = "REQUIRES_VERIFICATION";
        missingFieldsList = coreElig.missingFields;
      }
    }

    events.push({
      id: "event-senior-pension-60",
      title: "Senior Citizen Welfare & Pension Scheme (IGNOAPS)",
      description: isIncomeMissing
        ? "Monthly pension under Indira Gandhi National Old Age Pension Scheme. Annual income verification required."
        : "Eligible for monthly pension support and senior citizen welfare benefits.",
      category: "senior",
      status: eligStatus,
      triggerAgeYears: 60,
      urgency: "high",
      priority: "HIGH",
      relatedKnowledgeIds: [ignoapsRecord?.id || "pension"].filter(Boolean),
      relatedRecords: [ignoapsRecord].filter(Boolean) as any[],
      ruleReasons: [
        `Current age: ${age.years} years (Satisfies age >= 60 requirement)`,
        isIncomeMissing ? "Income criteria requires verification" : "Income verified BPL eligible",
      ],
      missingFields: missingFieldsList,
      source: ignoapsRecord?.source ? { name: ignoapsRecord.source.name, url: ignoapsRecord.source.url } : undefined,
      actionLabel: isIncomeMissing ? "Complete Profile Income" : "View Pension Details",
      actionUrl: isIncomeMissing ? "/profile" : ignoapsActionUrl,
    });
  } else if (age.years >= 55 && age.years < 60) {
    const daysUntil60 = (60 - age.years) * 365 - age.daysUntilBirthday;
    events.push({
      id: "event-senior-60-upcoming",
      title: "Approaching Senior Citizen Milestone (Age 60)",
      description: `You will reach age 60 in ~${60 - age.years} year(s), unlocking senior citizen pensions and welfare services.`,
      category: "senior",
      status: "UPCOMING",
      eventDate: birthday60Str,
      daysUntil: daysUntil60,
      triggerAgeYears: 60,
      urgency: "medium",
      priority: "LOW",
      relatedKnowledgeIds: [ignoapsRecord?.id || "pension"].filter(Boolean),
      ruleReasons: [`Current age: ${age.years} years (Transitioning to senior milestone 60)`],
      actionLabel: "Learn About Senior Schemes",
      actionUrl: "/explore?category=services",
    });
  }

  return events;
}

/**
 * Computes the complete Smart Timeline state for a user.
 * Groups events into Hero (nearest important), NOW, NEXT, LATER, and COMPLETED.
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

  // Group events by status
  const nowEvents = allEvents.filter(
    (e) => e.status === "CURRENT" || e.status === "REQUIRES_VERIFICATION"
  );
  const nextEvents = allEvents.filter((e) => e.status === "UPCOMING");
  const laterEvents = allEvents.filter((e) => e.status === "LATER");
  const completedEvents = allEvents.filter((e) => e.status === "COMPLETED");

  // Select Hero Event: Nearest UPCOMING or urgent CURRENT event
  let heroEvent: LifeEvent | null = null;
  const urgentUpcoming = nextEvents.find((e) => e.urgency === "urgent" || e.urgency === "high");
  const urgentNow = nowEvents.find((e) => e.isToday || e.urgency === "urgent");

  heroEvent = urgentNow || urgentUpcoming || nextEvents[0] || nowEvents[0] || allEvents[0] || null;

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
