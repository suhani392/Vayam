/**
 * Types for government schemes, services, rights, education paths,
 * and financial opportunities in the Vayam data layer.
 *
 * Every record must eventually carry source provenance so users
 * can trace information back to official Indian government sources.
 */

import type { EducationLevel, EmploymentStatus, Gender, ResidenceType } from "./user";

// ---------------------------------------------------------------------------
// Source provenance (required on all data records)
// ---------------------------------------------------------------------------

/**
 * Tracks where a piece of information came from.
 * This is a data-integrity requirement — Vayam must never present
 * information without a verifiable official source.
 */
export interface SourceProvenance {
  /** Official name of the source (e.g. "Ministry of Finance, GoI") */
  sourceName: string;
  /** Direct URL to the official page */
  officialUrl: string;
  /** ISO 8601 date the record was last verified */
  lastVerifiedDate: string;
  /** Responsible authority or department */
  department: string;
}

// ---------------------------------------------------------------------------
// Scheme categories
// ---------------------------------------------------------------------------

export type SchemeCategory =
  | "agriculture"
  | "education"
  | "employment"
  | "finance"
  | "health"
  | "housing"
  | "social_welfare"
  | "skill_development"
  | "women_and_child"
  | "disability"
  | "senior_citizen"
  | "youth"
  | "tribal"
  | "minority"
  | "other";

export type SchemeLevel = "central" | "state" | "district";

// ---------------------------------------------------------------------------
// Eligibility rules (deterministic, not AI)
// ---------------------------------------------------------------------------

/**
 * A single eligibility criterion that can be evaluated programmatically.
 * The eligibility engine in lib/eligibility/ will process these rules.
 */
export interface SchemeRule {
  /** What field on UserProfile this rule evaluates */
  field: string;
  /** The type of comparison to perform */
  operator:
    | "eq"          // equals
    | "ne"          // not equals
    | "gt"          // greater than
    | "gte"         // greater than or equal
    | "lt"          // less than
    | "lte"         // less than or equal
    | "in"          // value is in list
    | "not_in"      // value is not in list
    | "exists";     // field must be present and truthy
  value?: unknown;
  values?: unknown[];
}

// ---------------------------------------------------------------------------
// Government Scheme
// ---------------------------------------------------------------------------

export interface GovernmentScheme {
  id: string;
  name: string;
  /** Short description (1–2 sentences, shown in cards) */
  summary: string;
  /** Full description for the detail page */
  description: string;

  category: SchemeCategory;
  level: SchemeLevel;
  /**
   * ISO 3166-2:IN state code for state-level schemes.
   * Null for central schemes applicable nationwide.
   */
  stateCode?: string;

  // Eligibility constraints
  minAge?: number;
  maxAge?: number;
  eligibleGenders?: Gender[];
  eligibleResidenceTypes?: ResidenceType[];
  eligibleEducationLevels?: EducationLevel[];
  eligibleEmploymentStatuses?: EmploymentStatus[];
  /** Maximum annual household income in INR */
  maxAnnualIncomeInr?: number;
  eligibleStateCodes?: string[];
  rules: SchemeRule[];

  // Application
  applicationUrl?: string;
  applicationDeadline?: string; // ISO 8601
  isOngoing: boolean;

  // Benefits
  benefitSummary: string;
  benefitAmountInr?: number;

  provenance: SourceProvenance;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Government Service
// ---------------------------------------------------------------------------

/**
 * A civic service (e.g. Aadhaar, PAN, voter registration) as distinct
 * from a welfare scheme.  Services are generally rights/entitlements
 * rather than benefit programs.
 */
export interface GovernmentService {
  id: string;
  name: string;
  summary: string;
  category: SchemeCategory;
  serviceUrl?: string;
  provenance: SourceProvenance;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Rights
// ---------------------------------------------------------------------------

export interface Right {
  id: string;
  title: string;
  description: string;
  /** Governing legislation, e.g. "Right to Information Act, 2005" */
  legislation: string;
  provenance: SourceProvenance;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Education path
// ---------------------------------------------------------------------------

export interface EducationPath {
  id: string;
  title: string;
  description: string;
  minimumEducation: EducationLevel;
  provenance: SourceProvenance;
  updatedAt: string;
}
