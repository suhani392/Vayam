import { NextRequest, NextResponse } from "next/server";
import { isUserAdmin, supabaseAdmin } from "@/lib/admin/auth";
import { runSentinelOnSource } from "@/lib/admin/sentinel";
import { runAnalystOnScan } from "@/lib/admin/analyst";
import { validateProposal } from "@/lib/admin/validator";
import type { MonitoredSource } from "@/types/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sourceId, userId, email } = body;

    const isAdmin = await isUserAdmin(userId, email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required to trigger source scans." },
        { status: 403 }
      );
    }

    const sourcesToScan: MonitoredSource[] = [];

    if (sourceId) {
      const { data: source } = await supabaseAdmin
        .from("monitored_sources")
        .select("*")
        .eq("id", sourceId)
        .single();
      if (source) sourcesToScan.push(source as MonitoredSource);
    } else {
      const seenUrls = new Set<string>();

      const { data: ksData } = await supabaseAdmin.from("knowledge_sources").select("*");
      if (ksData) {
        ksData.forEach((ks) => {
          if (ks.url && !seenUrls.has(ks.url)) {
            seenUrls.add(ks.url);
            sourcesToScan.push({
              id: ks.id,
              name: ks.name,
              organization: ks.name,
              authority_type: (ks.authority_level || "CENTRAL") as any,
              url: ks.url,
              source_type: ks.source_type || "OFFICIAL_MINISTRY",
              jurisdiction: ks.authority_level || "Central",
              category: "Government Scheme",
              active: true,
              scan_frequency: "daily",
              reliability_level: "HIGH",
              created_at: ks.created_at || new Date().toISOString(),
            });
          }
        });
      }

      const { data: msData } = await supabaseAdmin.from("monitored_sources").select("*");
      if (msData) {
        msData.forEach((ms) => {
          if (ms.url && !seenUrls.has(ms.url)) {
            seenUrls.add(ms.url);
            sourcesToScan.push(ms as MonitoredSource);
          }
        });
      }
    }

    let scanned = 0;
    let findingsCreated = 0;
    let errors = 0;

    for (const source of sourcesToScan) {
      try {
        // Layer 1: Vayam Sentinel (Source Intelligence Crawl & Hash Diff)
        const sentinelResult = await runSentinelOnSource(source);
        scanned++;

        if (sentinelResult.hasChanged && !sentinelResult.error) {
          // Layer 2: Vayam Analyst (Civic Intelligence — Groq AI)
          const analystOutput = await runAnalystOnScan(sentinelResult);

          // Layer 3: Vayam Validator (Deterministic Code Checks)
          const validationReport = await validateProposal(analystOutput, sentinelResult.authorityLevel);

          // Ensure source exists in monitored_sources table to satisfy foreign key constraint
          try {
            await supabaseAdmin.from("monitored_sources").upsert({
              id: source.id,
              name: source.name,
              organization: source.organization || "Government Authority",
              authority_type: source.authority_type || "CENTRAL",
              url: source.url,
              source_type: source.source_type || "MINISTRY_SITE",
              jurisdiction: source.jurisdiction || "Central",
              category: source.category || "Government Scheme",
              active: true,
              reliability_level: "HIGH",
            }, { onConflict: "id" });
          } catch {
            // Ignore if already present
          }

          // Save Proposal into civic_update_findings table in Supabase DB
          const { error: insertErr } = await supabaseAdmin
            .from("civic_update_findings")
            .insert({
              source_id: source.id,
              finding_type: analystOutput.finding_type || "NEW",
              domain: analystOutput.domain || "scheme",
              title: analystOutput.title || source.name,
              summary: analystOutput.summary || "Government source update detected.",
              change_summary: analystOutput.change_summary || "Policy change detected from official source.",
              affected_fields: analystOutput.affected_fields || [],
              previous_values: analystOutput.previous_values || {},
              proposed_values: analystOutput.proposed_values || {},
              eligibility_changes: analystOutput.eligibility_changes || [],
              effective_date: (typeof analystOutput.effective_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(analystOutput.effective_date)) ? analystOutput.effective_date : null,
              expiry_date: (typeof analystOutput.expiry_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(analystOutput.expiry_date)) ? analystOutput.expiry_date : null,
              jurisdiction: analystOutput.jurisdiction || source.jurisdiction,
              confidence: analystOutput.confidence || 90,
              source_metadata: {
                name: source.name,
                url: source.url,
                authority: source.organization,
              },
              evidence: analystOutput.evidence || [{ excerpt: sentinelResult.newContent.slice(0, 300) }],
              status: "PENDING_REVIEW",
              requires_human_review: true,
            });

          if (!insertErr) {
            findingsCreated++;
          } else {
            console.error("Insert finding error:", insertErr);
            if (insertErr.code === "PGRST205") {
              return NextResponse.json({
                success: false,
                error: "Table 'civic_update_findings' is missing in Supabase. Please run the provided SQL DDL in Supabase SQL Editor to enable staging review queue.",
                code: "PGRST205",
              }, { status: 400 });
            }
          }
        }
      } catch (err) {
        console.error(`Error processing ${source.name}:`, err);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: { scanned, findings: findingsCreated, errors },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to execute scan." }, { status: 500 });
  }
}
