/**
 * lib/admin/validator.ts
 *
 * Layer 3 — Deterministic Validation: Vayam Validator.
 * Pure system code (NO AI). Enforces safety checks before any proposed change
 * can reach the Administrator for approval.
 */

import { supabaseAdmin } from "./auth";
import type { CivicUpdateFinding } from "@/types/admin";

export interface ValidationReport {
  isValid: boolean;
  flags: string[];
  requiresHumanReview: boolean;
  authorityLevel: number;
}

export async function validateProposal(
  proposal: Partial<CivicUpdateFinding>,
  authorityLevel: number = 4
): Promise<ValidationReport> {
  const flags: string[] = [];
  let isValid = true;

  // Check 1: Authority Level Check (Levels 3–5 required for authoritative civic updates)
  if (authorityLevel < 3) {
    flags.push("AUTHORITY_LEVEL_LOW: Source authority is below minimum required Level 3.");
    isValid = false;
  }

  // Check 2: Official URL Validation
  const url = proposal.source_metadata?.url;
  if (!url || !url.startsWith("http")) {
    flags.push("INVALID_SOURCE_URL: Official source URL is missing or invalid.");
    isValid = false;
  }

  // Check 3: Evidence Excerpt Presence
  if (!proposal.evidence || proposal.evidence.length === 0 || !proposal.evidence[0]?.excerpt) {
    flags.push("MISSING_EVIDENCE: Proposal does not contain verifiable extracted text evidence.");
    isValid = false;
  }

  // Check 4: Domain Schema Validation
  const validDomains = ["scheme", "service", "law", "right", "education", "milestone", "other"];
  if (!proposal.domain || !validDomains.includes(proposal.domain)) {
    flags.push("INVALID_DOMAIN_SCHEMA: Proposed domain is unrecognized.");
    isValid = false;
  }

  // Check 5: Duplicate Proposal Check
  if (proposal.title) {
    const { data: existing } = await supabaseAdmin
      .from("civic_update_findings")
      .select("id")
      .eq("title", proposal.title)
      .eq("status", "PENDING_REVIEW")
      .limit(1);

    if (existing && existing.length > 0) {
      flags.push("DUPLICATE_PROPOSAL: Identical proposal already pending in review queue.");
      isValid = false;
    }
  }

  // Check 7: Meaningful Civic Change Filtering (Reject generic bulletins & placeholders)
  const genericPatterns = [
    /official policy document/i,
    /notification bulletin/i,
    /general bulletin/i,
    /category:/i,
    /authority jurisdiction:/i,
    /unverified government portal/i,
  ];

  const fullText = `${proposal.title || ""} ${proposal.summary || ""}`;
  if (genericPatterns.some((pattern) => pattern.test(fullText))) {
    flags.push("GENERIC_TEXT_FILTERED: Generic policy bulletin filtered out. Only specific scheme/law/right updates allowed.");
    isValid = false;
  }

  return {
    isValid,
    flags,
    requiresHumanReview: true, // Always true - Layer 4 Admin Human Verification required
    authorityLevel,
  };
}
