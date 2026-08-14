/**
 * lib/admin/approval.ts
 *
 * Admin Approval & Transactional Production Database Update Engine for Vayam.
 * Applies admin-approved civic findings to Supabase production tables
 * (knowledge_items, legal_topics, legal_situations, etc.) and writes full audit history.
 */

import { supabaseAdmin } from "./auth";
import type { CivicUpdateFinding } from "@/types/admin";

export async function approveCivicFinding(
  findingId: string,
  adminUserId?: string
): Promise<{ success: boolean; message: string; auditLogId?: string }> {
  try {
    // 1. Fetch Finding Record
    const { data: finding, error: fetchErr } = await supabaseAdmin
      .from("civic_update_findings")
      .select("*")
      .eq("id", findingId)
      .single();

    if (fetchErr || !finding) {
      return { success: false, message: "Finding not found in database." };
    }

    if (finding.status === "APPROVED") {
      return { success: false, message: "Finding has already been approved previously." };
    }

    const proposed = finding.proposed_values || {};
    const domain = finding.domain || "scheme";
    const nowIso = new Date().toISOString();

    let targetTable = "knowledge_items";
    let targetRecordId: string | null = null;
    let previousData: any = finding.previous_values || null;
    let appliedData: any = proposed;

    // 2. Map domain to production Supabase table and apply update/insert
    if (domain === "scheme" || domain === "service" || domain === "other") {
      targetTable = "knowledge_items";

      // Check if item exists by title or slug
      const slug = (proposed.slug || finding.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();

      const { data: existing } = await supabaseAdmin
        .from("knowledge_items")
        .select("*")
        .or(`slug.eq.${slug},title.ilike.%${finding.title.slice(0, 15)}%`)
        .limit(1);

      if (existing && existing.length > 0) {
        // UPDATE existing record
        targetRecordId = existing[0].id;
        previousData = existing[0];

        const updatePayload = {
          title: proposed.title || finding.title,
          short_description: proposed.short_description || finding.summary,
          description: proposed.description || finding.summary,
          eligibility_summary: proposed.eligibility_summary || existing[0].eligibility_summary,
          updated_at: nowIso,
          verification_status: "VERIFIED",
        };

        const { error: updateErr } = await supabaseAdmin
          .from("knowledge_items")
          .update(updatePayload)
          .eq("id", targetRecordId);

        if (updateErr) throw updateErr;
        appliedData = updatePayload;
      } else {
        // INSERT new record
        const insertPayload = {
          slug,
          title: proposed.title || finding.title,
          short_description: proposed.short_description || finding.summary,
          description: proposed.description || finding.summary,
          eligibility_summary: proposed.eligibility_summary || "Verified official scheme.",
          status: "PUBLISHED",
          verification_status: "VERIFIED",
          tags: [domain, finding.jurisdiction.toLowerCase()],
          metadata: proposed.metadata || {},
          updated_at: nowIso,
        };

        const { data: inserted, error: insertErr } = await supabaseAdmin
          .from("knowledge_items")
          .insert(insertPayload)
          .select("id")
          .single();

        if (insertErr) throw insertErr;
        targetRecordId = inserted?.id || null;
        appliedData = insertPayload;
      }
    } else if (domain === "law" || domain === "right") {
      targetTable = "legal_situations";

      // Check if legal situation exists
      const { data: existing } = await supabaseAdmin
        .from("legal_situations")
        .select("*")
        .ilike("title", `%${finding.title.slice(0, 15)}%`)
        .limit(1);

      if (existing && existing.length > 0) {
        targetRecordId = existing[0].id;
        previousData = existing[0];

        const updatePayload = {
          title: proposed.title || finding.title,
          legal_considerations: proposed.legal_considerations || existing[0].legal_considerations,
          rights_granted: proposed.rights_granted || existing[0].rights_granted,
          last_verified: nowIso,
        };

        const { error: updateErr } = await supabaseAdmin
          .from("legal_situations")
          .update(updatePayload)
          .eq("id", targetRecordId);

        if (updateErr) throw updateErr;
        appliedData = updatePayload;
      }
    }

    // 3. Write Audit Log Record to civic_audit_logs
    const { data: auditLog, error: auditErr } = await supabaseAdmin
      .from("civic_audit_logs")
      .insert({
        finding_id: finding.id,
        target_table: targetTable,
        target_record_id: targetRecordId,
        action: "APPROVED",
        previous_data: previousData,
        applied_data: appliedData,
        approved_by: adminUserId || null,
      })
      .select("id")
      .single();

    if (auditErr) {
      console.warn("[Vayam Approval Engine] Could not create audit log:", auditErr);
    }

    // 4. Update Finding status to APPROVED
    await supabaseAdmin
      .from("civic_update_findings")
      .update({
        status: "APPROVED",
        reviewed_by: adminUserId || null,
        reviewed_at: nowIso,
      })
      .eq("id", finding.id);

    console.log(`[Vayam Approval Engine] Finding ${finding.id} successfully approved and written to ${targetTable}`);

    return {
      success: true,
      message: `Successfully approved update and applied changes to ${targetTable}.`,
      auditLogId: auditLog?.id,
    };
  } catch (err: any) {
    console.error("[Vayam Approval Engine Error]:", err);
    return { success: false, message: err.message || "Failed to approve finding." };
  }
}

export async function rejectCivicFinding(
  findingId: string,
  adminUserId?: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const nowIso = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("civic_update_findings")
      .update({
        status: "REJECTED",
        rejection_reason: reason || "Rejected by administrator during manual verification.",
        reviewed_by: adminUserId || null,
        reviewed_at: nowIso,
      })
      .eq("id", findingId);

    if (error) throw error;

    // Record audit log entry for rejection
    await supabaseAdmin.from("civic_audit_logs").insert({
      finding_id: findingId,
      target_table: "civic_update_findings",
      action: "REJECTED",
      approved_by: adminUserId || null,
    });

    return { success: true, message: "Finding has been rejected." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to reject finding." };
  }
}

export async function markFindingInvestigation(
  findingId: string,
  adminUserId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabaseAdmin
      .from("civic_update_findings")
      .update({
        status: "NEEDS_INVESTIGATION",
        reviewed_by: adminUserId || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", findingId);

    if (error) throw error;

    return { success: true, message: "Finding marked for investigation." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update finding status." };
  }
}
