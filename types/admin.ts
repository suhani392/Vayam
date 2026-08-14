/**
 * types/admin.ts
 *
 * TypeScript definitions for Vayam Admin Civic Intelligence & Knowledge Update System.
 */

export type SourceAuthorityType = "CENTRAL" | "STATE" | "MUNICIPAL" | "JUDICIAL";

export type SourceCategory =
  | "Government Scheme"
  | "Ministry"
  | "Government Department"
  | "State Government"
  | "Legal / Legislative"
  | "Education"
  | "Public Service"
  | "Official Notification"
  | "Official Circular"
  | "Official Press Release";

export interface MonitoredSource {
  id: string;
  name: string;
  organization: string;
  authority_type: SourceAuthorityType;
  url: string;
  source_type: string;
  jurisdiction: string;
  state?: string | null;
  category: SourceCategory;
  active: boolean;
  scan_frequency: string;
  last_scanned_at?: string | null;
  last_changed_at?: string | null;
  last_content_hash?: string | null;
  reliability_level: "HIGH" | "MEDIUM" | "VERIFIED";
  created_at: string;
}

export type FindingType = "NEW" | "UPDATED" | "REMOVED" | "EXPIRED" | "CONFLICT";

export type FindingDomain = "scheme" | "service" | "law" | "right" | "education" | "milestone" | "other";

export type FindingStatus =
  | "NEW"
  | "ANALYZING"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_INVESTIGATION"
  | "CONFLICT"
  | "ERROR";

export interface FindingEvidence {
  excerpt: string;
  location?: string;
}

export interface CivicUpdateFinding {
  id: string;
  source_id?: string | null;
  finding_type: FindingType;
  domain: FindingDomain;
  title: string;
  summary: string;
  change_summary: string;
  affected_fields: string[];
  previous_values: Record<string, any>;
  proposed_values: Record<string, any>;
  eligibility_changes: Array<{
    rule: string;
    old_value?: any;
    new_value?: any;
    type: string;
  }>;
  effective_date?: string | null;
  expiry_date?: string | null;
  jurisdiction: string;
  confidence: number; // 0 - 100
  source_metadata: {
    name: string;
    url: string;
    authority: string;
    document_title?: string;
    document_date?: string;
  };
  evidence: FindingEvidence[];
  status: FindingStatus;
  requires_human_review: boolean;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  source?: MonitoredSource | null;
}

export interface CivicAuditLog {
  id: string;
  finding_id?: string | null;
  target_table: string;
  target_record_id?: string | null;
  action: "APPROVED" | "REJECTED" | "EDITED";
  previous_data?: Record<string, any> | null;
  applied_data?: Record<string, any> | null;
  approved_by?: string | null;
  created_at: string;
  finding_title?: string;
  user_email?: string;
}

export interface AdminDashboardMetrics {
  sourcesMonitored: number;
  totalKnowledgeRecords: number;
  newFindings: number;
  pendingReview: number;
  approvedUpdates: number;
  rejectedUpdates: number;
  lastSuccessfulScan: string | null;
}

export interface AdminActivityItem {
  id: string;
  timestamp: string;
  type:
    | "SOURCE_SCANNED"
    | "NEW_CONTENT_DETECTED"
    | "AI_ANALYSIS_COMPLETED"
    | "CHANGE_PROPOSED"
    | "ADMIN_APPROVED"
    | "ADMIN_REJECTED"
    | "DATABASE_UPDATED"
    | "SOURCE_UNAVAILABLE"
    | "SCAN_FAILED";
  title: string;
  details?: string;
  source_name?: string;
  url?: string;
}
