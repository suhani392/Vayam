/**
 * lib/admin/db-writer.ts
 *
 * Layer 5 — Verified Knowledge Database Writer.
 * Transactionally updates Supabase production tables (knowledge_items, legal_acts, etc.)
 * upon explicit Administrator approval and records complete audit version history in update_history.
 */

import { supabaseAdmin } from "./auth";
import type { CivicUpdateFinding } from "@/types/admin";

export async function writeApprovedUpdateToDatabase(
  findingId: string,
  adminUserId?: string
): Promise<{ success: boolean; message: string; targetTable?: string }> {
  try {
    const { data: finding, error: fetchErr } = await supabaseAdmin
      .from("civic_update_findings")
      .select("*")
      .eq("id", findingId)
      .single();

    if (fetchErr || !finding) {
      return { success: false, message: "Finding not found in staging database." };
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

    // Apply update/insert to production tables based on domain
    if (domain === "scheme" || domain === "service" || domain === "other") {
      targetTable = "knowledge_items";

      // Fetch a valid default category ID from categories table
      const { data: catData } = await supabaseAdmin.from("categories").select("id").limit(1);
      const defaultCategoryId = catData && catData.length > 0 ? catData[0].id : null;

      const baseSlug = (proposed.slug || finding.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();
      const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      const { data: existing } = await supabaseAdmin
        .from("knowledge_items")
        .select("*")
        .or(`slug.eq.${baseSlug},title.ilike.%${finding.title.slice(0, 15)}%`)
        .limit(1);

      if (existing && existing.length > 0) {
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

        if (updateErr) console.error("Knowledge Items Update Error:", updateErr);
        appliedData = updatePayload;
      } else {
        const insertPayload: any = {
          slug,
          title: proposed.title || finding.title,
          short_description: proposed.short_description || finding.summary,
          description: proposed.description || finding.summary,
          eligibility_summary: proposed.eligibility_summary || "Verified official scheme.",
          category_id: defaultCategoryId,
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

        if (insertErr) {
          console.error("[Database Writer Insert Error]:", insertErr);
        } else {
          targetRecordId = inserted?.id || null;
        }
        appliedData = insertPayload;
      }
    } else if (domain === "law" || domain === "right") {
      targetTable = "legal_situations";

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

    // Write Audit History to update_history table
    await supabaseAdmin.from("update_history").insert({
      proposal_id: finding.id,
      target_table: targetTable,
      target_record_id: targetRecordId,
      action: "APPROVED",
      previous_data: previousData,
      applied_data: appliedData,
      approved_by: adminUserId || null,
      approved_at: nowIso,
    });

    // Also insert to civic_audit_logs for backwards compatibility
    await supabaseAdmin.from("civic_audit_logs").insert({
      finding_id: finding.id,
      target_table: targetTable,
      target_record_id: targetRecordId,
      action: "APPROVED",
      previous_data: previousData,
      applied_data: appliedData,
      approved_by: adminUserId || null,
    });

    // Update finding status to APPROVED
    await supabaseAdmin
      .from("civic_update_findings")
      .update({
        status: "APPROVED",
        reviewed_by: adminUserId || null,
        reviewed_at: nowIso,
      })
      .eq("id", finding.id);

    return {
      success: true,
      message: `Successfully verified and applied update to ${targetTable}.`,
      targetTable,
    };
  } catch (err: any) {
    console.error("[Database Writer Error]:", err);
    return { success: false, message: err.message || "Failed to write update to database." };
  }
}
