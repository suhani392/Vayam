/**
 * Types related to a Vayam user's profile.
 *
 * These are intentionally minimal for Phase 01.  Fields will be expanded
 * in later phases once the eligibility and relevance engines are built.
 *
 * Architectural note: UserProfile is the single source of truth that flows
 * into the Civic Intelligence layer.  The AI layer receives a read-only
 * view of this — it never mutates it.
 */

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type EducationLevel =
  | "no_formal_education"
  | "primary"           // up to Class 5
  | "middle"            // up to Class 8
  | "secondary"         // Class 10 / SSC
  | "higher_secondary"  // Class 12 / HSC
  | "diploma"
  | "undergraduate"
  | "postgraduate"
  | "doctorate";

export type EmploymentStatus =
  | "student"
  | "employed_private"
  | "employed_government"
  | "self_employed"
  | "unemployed"
  | "homemaker"
  | "retired";

export type ResidenceType = "urban" | "rural" | "semi_urban";

/**
 * Geographic location within India.
 * State code follows ISO 3166-2:IN (e.g. "MH" for Maharashtra).
 */
export interface Location {
  stateCode: string;
  stateName: string;
  district?: string;
  pincode?: string;
  residenceType: ResidenceType;
}

/**
 * Core user profile used across the Civic Intelligence layer.
 * All fields that affect eligibility or relevance must be typed here.
 */
export interface UserProfile {
  id: string;

  // Demographics
  dateOfBirth: string; // ISO 8601 date string: "YYYY-MM-DD"
  gender: Gender;
  location: Location;

  // Socio-economic
  educationLevel: EducationLevel;
  employmentStatus: EmploymentStatus;

  /**
   * Annual household income in Indian Rupees.
   * Used for income-based scheme eligibility.
   */
  annualIncomeInr?: number;

  /** Whether the user belongs to a Scheduled Caste / Scheduled Tribe */
  isScSt?: boolean;

  /** Whether the user belongs to an Other Backward Class */
  isObc?: boolean;

  /** Whether the user has a disability (PwD) */
  hasPwd?: boolean;

  /** Whether the user is a farmer (Kisan) */
  isKisan?: boolean;

  /** Preferred UI language (BCP-47 tag, e.g. "hi", "en", "ta") */
  preferredLanguage: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * A lightweight, read-only snapshot of UserProfile
 * passed to the AI layer for contextual assistance.
 *
 * Never include sensitive fields (income, caste, disability)
 * in this type — those stay in the Civic Intelligence layer.
 */
export interface UserProfileSnapshot {
  ageInYears: number;
  gender: Gender;
  stateCode: string;
  educationLevel: EducationLevel;
  employmentStatus: EmploymentStatus;
  preferredLanguage: string;
}
