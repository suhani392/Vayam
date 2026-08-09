/**
 * lib/knowledge/source/types.ts
 *
 * Vayam Phase 6B: Source & Verification Layer Types.
 * Defines models for SourceModel, VerificationStatus, SourceType, SourceTrustLevel,
 * VerificationPolicy, and SourceDisplayMetadata.
 *
 * Zero UI/React dependencies. Zero AI dependencies.
 */

import type { AuthorityLevel } from "../types";

export type SourceType =
  | "OFFICIAL_GOVERNMENT"
  | "OFFICIAL_MINISTRY"
  | "OFFICIAL_STATE_GOVERNMENT"
  | "OFFICIAL_AUTHORITY"
  | "OFFICIAL_DOCUMENT"
  | "SECONDARY_REFERENCE"
  | "DEMO";

export type VerificationStatus =
  | "VERIFIED"
  | "UNVERIFIED"
  | "EXPIRED"
  | "REQUIRES_REVIEW"
  | "DEMO";

export type SourceTrustLevel =
  | "OFFICIAL_GOVERNMENT" // Highest confidence
  | "OFFICIAL_AUTHORITY"  // High confidence
  | "OFFICIAL_DOCUMENT"   // High confidence
  | "SECONDARY_REFERENCE" // Reference only
  | "DEMO";               // Development only

export type RecordStatus = "ACTIVE" | "INACTIVE" | "EXPIRED" | "UNKNOWN";

export interface SourceModel {
  id: string;
  name: string;
  url: string;
  sourceType: SourceType;
  authorityLevel: AuthorityLevel;
  verificationStatus: VerificationStatus;
  lastVerified?: string; // YYYY-MM-DD
  verifiedBy?: string;   // e.g. "Vayam Knowledge Review"
  reviewDue?: boolean;
  notes?: string;
}

export interface SourceValidationResult {
  valid: boolean;
  errors: string[];
}

export interface KnowledgeValidationResult {
  valid: boolean;
  errors: string[];
}

export interface SourceDisplayMetadata {
  label: string; // "Verified source" | "Needs verification" | "Demo data" | "Review required"
  sourceName: string;
  authorityName?: string;
  lastVerified: string;
  isVerified: boolean;
  isDemo: boolean;
  reviewDue: boolean;
  officialUrl?: string;
}

export interface KnowledgeQualityReport {
  totalRecords: number;
  verifiedRecords: number;
  unverifiedRecords: number;
  demoRecords: number;
  recordsRequiringReview: number;
  recordsMissingSource: number;
  recordsMissingVerificationDate: number;
  invalidMetadataCount: number;
  recordsSummary: {
    id: string;
    title: string;
    type: string;
    sourceName: string;
    verificationStatus: VerificationStatus;
    lastVerified: string;
    reviewDue: boolean;
    valid: boolean;
  }[];
}
