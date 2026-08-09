/**
 * lib/core/milestones/index.ts
 *
 * Deterministic Civic Milestone Engine for Vayam.
 * Generates structured civic milestones based on age, education level, and life stage.
 */

import type { UserProfile, CivicMilestone } from "../types";
import { getAgeInYears } from "../age";

/**
 * Derives personalized civic milestones for a user.
 */
export function deriveCivicMilestones(
  profile: Partial<UserProfile> & { dateOfBirth: string },
  referenceDate: Date = new Date()
): CivicMilestone[] {
  const age = getAgeInYears(profile.dateOfBirth, referenceDate);
  const milestones: CivicMilestone[] = [];

  // Age 18 Milestones
  if (age >= 18) {
    milestones.push({
      id: "voter-registration-18",
      title: "Voter ID Card Registration",
      description: "Eligible to register on Election Commission of India (NVSP) portal for voting rights.",
      trigger: "Reached Age 18",
      category: "civic_right",
      importance: "high",
      timing: age === 18 ? "current" : "past",
      triggerAgeYears: 18,
      actionRequired: true,
      relatedCategory: "rights",
    });

    milestones.push({
      id: "driving-licence-18",
      title: "Permanent Driving Licence Eligibility",
      description: "Eligible for motor vehicle driving licence issuance across Indian RTOs.",
      trigger: "Reached Age 18",
      category: "civic_right",
      importance: "medium",
      timing: age === 18 ? "current" : "past",
      triggerAgeYears: 18,
      actionRequired: false,
      relatedCategory: "services",
    });
  } else if (age === 17) {
    milestones.push({
      id: "voter-registration-upcoming",
      title: "Upcoming Voter Registration Right",
      description: "You will turn 18 in less than a year, unlocking adult civic rights and electoral participation.",
      trigger: "Age 17 (Transitioning to 18)",
      category: "civic_right",
      importance: "high",
      timing: "upcoming",
      triggerAgeYears: 18,
      actionRequired: false,
      relatedCategory: "rights",
    });
  }

  // Education Milestones
  if (profile.educationLevel === "secondary" || profile.educationLevel === "higher_secondary") {
    milestones.push({
      id: "post-matric-scholarship-window",
      title: "Post-Matric Scholarship Window",
      description: "Government scholarships for Class 11, 12, diploma, and undergraduate degrees.",
      trigger: "Completed Class 10/12",
      category: "education_transition",
      importance: "high",
      timing: "current",
      actionRequired: true,
      relatedCategory: "scholarship",
    });
  }

  // Senior Citizen Milestones (Age 60+)
  if (age >= 60) {
    milestones.push({
      id: "senior-citizen-pension-60",
      title: "Senior Citizen Welfare & Pension Benefits",
      description: "Eligible for Indira Gandhi National Old Age Pension Scheme (IGNOAPS) and Senior Citizen ID card.",
      trigger: "Reached Age 60",
      category: "senior_welfare",
      importance: "high",
      timing: "current",
      triggerAgeYears: 60,
      actionRequired: true,
      relatedCategory: "senior_citizens",
    });
  }

  return milestones;
}
