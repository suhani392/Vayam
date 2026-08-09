/**
 * lib/knowledge/types.ts
 *
 * Vayam Phase 6A: Knowledge Architecture & Source Layer Types.
 * Defines common base record models, source provenance, authority levels,
 * application methods, timing schemas, and trust classifications.
 *
 * Zero UI/React dependencies. Zero AI dependencies.
 */

import type {
  RuleExpression,
  Gender,
  EducationLevel,
  EmploymentStatus,
} from "../core/types";

// ---------------------------------------------------------------------------
// 1. Enums & Union Types
// ---------------------------------------------------------------------------

export type KnowledgeRecordType =
  | "SCHEME"
  | "SERVICE"
  | "SCHOLARSHIP"
  | "RIGHT"
  | "LAW"
  | "EDUCATION_OPPORTUNITY"
  | "FINANCIAL_SUPPORT"
  | "DOCUMENT"
  | "MILESTONE"
  | "CAREER"
  | "SKILL_OPPORTUNITY";

export type AuthorityLevel = "CENTRAL" | "STATE" | "LOCAL" | "STATUTORY" | "OTHER";

export type ApplicationMethod = "ONLINE" | "OFFLINE" | "BOTH" | "UNKNOWN";

export type TimingType = "FIXED_DATE" | "RECURRING" | "NO_DEADLINE" | "UNKNOWN";

import type {
  SourceType,
  SourceTrustLevel,
  VerificationStatus,
  RecordStatus as ContentStatus,
} from "./source/types";

export type { SourceType, SourceTrustLevel, VerificationStatus, ContentStatus };

// ---------------------------------------------------------------------------
// 2. Sub-structures
// ---------------------------------------------------------------------------

export interface AuthorityInfo {
  name: string;
  level: AuthorityLevel;
  department?: string;
  stateCode?: string; // ISO 3166-2:IN state code if state/local
}

export interface DocumentRequirement {
  id: string;
  name: string;
  required: boolean; // true = compulsory, false = optional/conditional
  condition?: string;
}

export interface ApplicationInfo {
  method: ApplicationMethod;
  officialUrl?: string;
  portalName?: string;
  steps?: string[];
  documentsRequired: DocumentRequirement[];
}

export interface TimingInfo {
  deadline?: string | null; // ISO "YYYY-MM-DD" or null if no deadline
  deadlineType: TimingType;
  recurring?: boolean;
  lastVerified?: string;
}

export interface KnowledgeSource {
  name: string;
  url: string;
  authority: string;
  sourceType: SourceType;
  sourceTrust: SourceTrustLevel;
  lastVerified: string; // ISO "YYYY-MM-DD"
  verificationStatus: VerificationStatus;
}

// ---------------------------------------------------------------------------
// 3. Common Canonical Knowledge Record Model
// ---------------------------------------------------------------------------

export interface KnowledgeRecord {
  id: string; // Stable string identifier
  type: KnowledgeRecordType;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category: string; // "education", "rights", "services", "health", "finance", "career", etc.
  keywords?: string[];

  authority: AuthorityInfo;

  // Eligibility Constraints (compatible with Phase 5 Rule Engine)
  eligibilityRules?: RuleExpression[];
  minAge?: number;
  maxAge?: number;
  eligibleGenders?: Gender[];
  eligibleEducationLevels?: EducationLevel[];
  eligibleEmploymentStatuses?: EmploymentStatus[];
  maxAnnualIncomeInr?: number;

  benefits: string[];
  benefitAmountInr?: number;

  application: ApplicationInfo;
  timing: TimingInfo;
  source: KnowledgeSource;
  status: ContentStatus;
}

// ---------------------------------------------------------------------------
// 4. Repository Filter Query Interface
// ---------------------------------------------------------------------------

export interface KnowledgeFilterQuery {
  category?: string;
  type?: KnowledgeRecordType;
  status?: ContentStatus;
  verificationStatus?: VerificationStatus;
  stateCode?: string;
  minAge?: number;
  maxAge?: number;
}
