/**
 * types/rights.ts
 *
 * Type definitions for Vayam Know Your Rights capability.
 * Source-backed structured legal knowledge models.
 */

export type RightsCategory =
  | "money_payments"
  | "consumer_rights"
  | "employment"
  | "property_rent"
  | "digital_cyber"
  | "family_domestic"
  | "harassment_safety"
  | "identity_documents"
  | "public_services";

export type LegalResponseStatus =
  | "INFORMATION_AVAILABLE"
  | "REQUIRES_MORE_CONTEXT"
  | "PROFESSIONAL_HELP_RECOMMENDED";

export interface LegalOfficialSource {
  title: string;
  authority: string;
  url: string;
  lastVerified: string;
}

export interface LegalHelpline {
  name: string;
  contactNumber: string;
  description: string;
  websiteUrl?: string;
}

export interface PracticalActionStep {
  stepNumber: number;
  title: string;
  description: string;
  suggestedTimeline?: string;
}

export interface LegalSituation {
  id: string;
  topicId: string;
  title: string;
  category: RightsCategory;
  situationPatterns: string[]; // Keywords & natural language matching triggers
  summary: string;
  applicableActs: string[];
  legalConsiderations: string[];
  rightsGranted: string[];
  evidenceToPreserve: string[];
  practicalSteps: PracticalActionStep[];
  officialHelplines: LegalHelpline[];
  officialSources: LegalOfficialSource[];
  lastVerified: string;
  disclaimer: string;
  status: LegalResponseStatus;
}

export interface LegalAct {
  id: string;
  actNumber?: string;
  title: string;
  shortTitle?: string;
  enactmentYear: number;
  ministry?: string;
  jurisdiction?: string;
  summary?: string;
  category?: RightsCategory | string;
}

export interface LegalRight {
  id: string;
  actId?: string;
  sectionNumber?: string;
  rightTitle: string;
  legalText: string;
  plainLanguageExplanation: string;
  penaltyOrRemedy?: string;
  category?: RightsCategory | string;
}

export interface LegalCategoryMeta {
  id: RightsCategory;
  title: string;
  description: string;
  iconName: string;
  sampleQueries: string[];
}
