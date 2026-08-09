/**
 * lib/core/types.ts
 *
 * Comprehensive TypeScript definitions for Vayam's Core Civic Intelligence Layer.
 * Defines models for UserProfile, CivicItem, RuleEngine, Eligibility, Relevance,
 * LifeStage, Milestones, and Recommendations.
 */

// ---------------------------------------------------------------------------
// 1. User Profile & Demographics
// ---------------------------------------------------------------------------

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type EducationLevel =
  | "no_formal_education"
  | "primary"
  | "middle"
  | "secondary"
  | "higher_secondary"
  | "diploma"
  | "undergraduate"
  | "postgraduate"
  | "doctorate";

export type EducationStatus = "enrolled" | "completed" | "dropped_out" | "seeking_admission";

export type EmploymentStatus =
  | "student"
  | "employed_private"
  | "employed_government"
  | "self_employed"
  | "unemployed"
  | "homemaker"
  | "retired";

export type ResidenceType = "urban" | "rural" | "semi_urban";

export type SocialCategory = "general" | "obc" | "sc" | "st" | "ewis" | "minority";

export interface ProfileLocation {
  stateCode: string; // ISO 3166-2:IN, e.g. "MH", "DL", "KA"
  stateName: string;
  district?: string;
  residenceType: ResidenceType;
}

export interface UserProfile {
  id: string;
  name: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  gender: Gender;
  location: ProfileLocation;

  // Education
  educationLevel: EducationLevel;
  stream?: string; // e.g. "Science", "Commerce", "Arts", "Engineering"
  completedYear?: number;
  educationStatus?: EducationStatus;

  // Employment
  employmentStatus: EmploymentStatus;
  occupation?: string;

  // Financial & Socio-Economic Context
  annualIncomeInr?: number;
  category?: SocialCategory;
  isStudent?: boolean;
  isKisan?: boolean; // Farmer
  hasPwd?: boolean; // Persons with Disabilities
  maritalStatus?: "single" | "married" | "widowed" | "divorced";

  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 2. Age & Life Stage
// ---------------------------------------------------------------------------

export interface DetailedAge {
  years: number;
  months: number;
  days: number;
  nextBirthday: string; // "YYYY-MM-DD"
  daysUntilBirthday: number;
  hasHadBirthdayThisYear: boolean;
}

export type LifeStageType =
  | "child"          // 0–13
  | "adolescent"     // 14–17
  | "young_adult"    // 18–25
  | "adult"          // 26–45
  | "middle_aged"    // 46–59
  | "senior";        // 60+

export interface LifeStageResult {
  stage: LifeStageType;
  lifeStageLabel: string;
  confidence: "high" | "medium";
  reasons: string[];
}

// ---------------------------------------------------------------------------
// 3. Civic Milestones
// ---------------------------------------------------------------------------

export type MilestoneCategory =
  | "civic_right"
  | "education_transition"
  | "employment_transition"
  | "senior_welfare"
  | "health_and_financial";

export type MilestoneTiming = "past" | "current" | "upcoming";

export interface CivicMilestone {
  id: string;
  title: string;
  description: string;
  trigger: string;
  category: MilestoneCategory;
  importance: "high" | "medium" | "low";
  timing: MilestoneTiming;
  triggerAgeYears?: number;
  actionRequired?: boolean;
  relatedCategory?: string;
}

// ---------------------------------------------------------------------------
// 4. Rule Engine
// ---------------------------------------------------------------------------

export type RuleOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "not_in"
  | "contains"
  | "range"
  | "exists";

export interface AtomicRuleCondition {
  field: keyof UserProfile | string;
  operator: RuleOperator;
  value?: unknown;
  values?: unknown[];
  rangeMin?: number;
  rangeMax?: number;
}

export interface RuleGroup {
  combinator: "AND" | "OR";
  conditions: (AtomicRuleCondition | RuleGroup)[];
  negate?: boolean;
}

export type RuleExpression = AtomicRuleCondition | RuleGroup;

// ---------------------------------------------------------------------------
// 5. Civic Items & Provenance
// ---------------------------------------------------------------------------

export type CivicItemCategory =
  | "education"
  | "scholarship"
  | "agriculture"
  | "employment"
  | "finance"
  | "health"
  | "housing"
  | "social_welfare"
  | "rights"
  | "documents"
  | "services"
  | "senior_citizens"
  | "youth"
  | "women";

export type VerificationStatus = "VERIFIED" | "NEEDS_REVIEW" | "OUTDATED" | "DEMO_DATA";

export interface SourceProvenance {
  sourceName: string;
  officialUrl: string;
  lastVerifiedDate: string;
  department: string;
  verificationStatus: VerificationStatus;
}

export interface CivicItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category: CivicItemCategory;
  level: "central" | "state" | "district";
  stateCode?: string; // null for nationwide central schemes

  // Rule constraints
  rules?: RuleExpression[];

  // Direct constraint fields for quick indexing
  minAge?: number;
  maxAge?: number;
  eligibleGenders?: Gender[];
  eligibleEducationLevels?: EducationLevel[];
  eligibleEmploymentStatuses?: EmploymentStatus[];
  maxAnnualIncomeInr?: number;

  benefits: string[];
  benefitAmountInr?: number;
  requiredDocuments: string[];
  deadline?: string; // "YYYY-MM-DD"
  isOngoing?: boolean;

  provenance: SourceProvenance;
}

// ---------------------------------------------------------------------------
// 6. Eligibility & Missing Information
// ---------------------------------------------------------------------------

export type EvaluationEligibilityStatus =
  | "LIKELY_ELIGIBLE"
  | "MAYBE_ELIGIBLE"
  | "NOT_ELIGIBLE"
  | "NOT_YET"
  | "UNKNOWN";

export interface EligibilityResult {
  itemId: string;
  status: EvaluationEligibilityStatus;
  reasons: string[];
  missingFields: (keyof UserProfile)[];
  explanation: string;
}

// ---------------------------------------------------------------------------
// 7. Relevance & Recommendation Output
// ---------------------------------------------------------------------------

export interface RelevanceScoreConfig {
  ageWeight: number;
  lifeStageWeight: number;
  educationWeight: number;
  locationWeight: number;
  eligibilityWeight: number;
  deadlineWeight: number;
}

export interface RelevanceResult {
  itemId: string;
  score: number; // 0 to 1
  factors: {
    ageMatch: boolean;
    lifeStageMatch: boolean;
    educationMatch: boolean;
    locationMatch: boolean;
    eligibilityMatch: boolean;
    deadlineApproaching: boolean;
  };
  reasons: string[];
}

export interface Recommendation {
  item: CivicItem;
  score: number;
  eligibility: EligibilityResult;
  relevance: RelevanceResult;
  reasons: string[];
  urgency: "urgent" | "high" | "normal" | "low";
  category: CivicItemCategory;
}
