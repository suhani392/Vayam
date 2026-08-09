/**
 * types/db.ts
 *
 * Comprehensive TypeScript types reflecting the 42-section Vayam PostgreSQL/Supabase Database Schema.
 */

export type UserRole = "citizen" | "admin" | "reviewer";

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

export type AuthorityLevel =
  | "CENTRAL"
  | "STATE"
  | "LOCAL"
  | "STATUTORY"
  | "OTHER";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type RecommendationBucket = "NOW" | "NEXT" | "LATER";

export type NotificationType =
  | "MILESTONE"
  | "SCHEME"
  | "SERVICE"
  | "DEADLINE"
  | "REMINDER"
  | "SYSTEM";

export type NotificationStatus = "UNREAD" | "READ" | "DISMISSED";

export type MilestoneStatus = "UPCOMING" | "CURRENT" | "COMPLETED" | "MISSED";

export type EligibilityStatus =
  | "ELIGIBLE"
  | "NOT_ELIGIBLE"
  | "REQUIRES_VERIFICATION"
  | "UNKNOWN";

export interface DbState {
  id: string;
  code: string;
  name: string;
  is_union_territory: boolean;
  is_active: boolean;
  created_at: string;
}

export interface DbCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: string; // references auth.users(id)
  full_name: string | null;
  date_of_birth: string | null; // ISO YYYY-MM-DD
  state_id: string | null;
  district: string | null;
  city: string | null;
  education_level: string | null;
  employment_status: string | null;
  occupation: string | null;
  annual_income_inr: number | null;
  is_student: boolean;
  gender: string | null;
  preferred_language: string;
  avatar_url: string | null;
  role: UserRole;
  onboarding_completed: boolean;
  profile_completion: number;
  is_demo_user: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbUserPreferences {
  user_id: string;
  theme: string;
  language: string;
  voice_enabled: boolean;
  notifications_enabled: boolean;
  milestone_notifications: boolean;
  deadline_notifications: boolean;
  recommendation_notifications: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbKnowledgeSource {
  id: string;
  name: string;
  url: string;
  source_type: SourceType;
  authority_level: AuthorityLevel;
  verification_status: VerificationStatus;
  last_verified: string | null;
  verified_by: string | null;
  review_due: string | null;
  notes: string | null;
  trust_score: number | null;
  risk_level: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbKnowledgeItem {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  authority_name: string | null;
  status: ContentStatus;
  verification_status: VerificationStatus;
  icon: string | null;
  image_url: string | null;
  tags: string[];
  metadata: Record<string, any>;
  eligibility_summary: string | null;
  required_documents: any[];
  action_label: string | null;
  action_url: string | null;
  deadline: string | null;
  effective_from: string | null;
  effective_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbEligibilityRuleSet {
  id: string;
  knowledge_item_id: string;
  name: string | null;
  description: string | null;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbEligibilityRule {
  id: string;
  rule_set_id: string;
  rule_order: number;
  rule_type: string;
  conditions: Record<string, any>;
  explanation: string | null;
  is_required: boolean;
  created_at: string;
}

export interface DbMilestone {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category_id: string | null;
  age_min: number | null;
  age_max: number | null;
  trigger_config: Record<string, any>;
  action_label: string | null;
  action_url: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbUserMilestone {
  id: string;
  user_id: string;
  milestone_id: string;
  status: MilestoneStatus;
  target_date: string | null;
  days_remaining: number | null;
  completed_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DbUserRecommendation {
  id: string;
  user_id: string;
  knowledge_item_id: string;
  bucket: RecommendationBucket;
  eligibility_status: EligibilityStatus;
  relevance_score: number | null;
  urgency_score: number | null;
  reasons: any[];
  missing_fields: string[];
  calculated_at: string;
  expires_at: string | null;
  is_dismissed: boolean;
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  knowledge_item_id: string | null;
  milestone_id: string | null;
  action_url: string | null;
  scheduled_for: string | null;
  read_at: string | null;
  dismissed_at: string | null;
  created_at: string;
}

export interface DbAiConversation {
  id: string;
  user_id: string;
  title: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface DbAiMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  language: string | null;
  knowledge_item_ids: string[];
  source_ids: string[];
  metadata: Record<string, any>;
  created_at: string;
}
