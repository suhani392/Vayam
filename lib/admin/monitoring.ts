/**
 * lib/admin/monitoring.ts
 *
 * Source Monitoring Agent & Semantic Change Detector for Vayam.
 * Periodically inspects registered government and civic sources, detects substantive updates,
 * triggers Groq AI analysis, and populates the civic_update_findings staging table.
 */

import { supabaseAdmin } from "./auth";
import { analyzeContentWithGroq } from "./groq-analyzer";
import type { MonitoredSource, CivicUpdateFinding } from "@/types/admin";

/**
 * Utility to extract clean text content from HTML markup.
 */
export function extractCleanTextFromHtml(html: string): string {
  if (!html) return "";

  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}

/**
 * Calculate simple string hash for change detection comparison.
 */

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}

/**
 * Scan a single registered source by ID or source object.
 */
export async function scanSingleSource(
  source: MonitoredSource
): Promise<{ success: boolean; findingCreated?: boolean; error?: string }> {
  try {
    console.log(`[Vayam Monitoring Agent] Scanning source: ${source.name} (${source.url})`);

    // 1. Fetch web page content
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 sec timeout

    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VayamCivicBot/1.0 (+https://vayam.gov.in)",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      // Record fetch error
      await supabaseAdmin.from("monitored_sources").update({
        last_scanned_at: new Date().toISOString(),
      }).eq("id", source.id);

      return {
        success: false,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const htmlContent = await res.text();
    const cleanText = extractCleanTextFromHtml(htmlContent);
    const contentHash = hashString(cleanText);

    const nowIso = new Date().toISOString();

    // 2. Check if content changed compared to previous scan
    const hasChanged = source.last_content_hash !== contentHash;

    if (!hasChanged && source.last_content_hash) {
      // Update last scanned timestamp
      await supabaseAdmin.from("monitored_sources").update({
        last_scanned_at: nowIso,
      }).eq("id", source.id);

      return { success: true, findingCreated: false };
    }

    // 3. Find matching existing database record in Vayam knowledge_items or legal_situations
    const { data: existingRecords } = await supabaseAdmin
      .from("knowledge_items")
      .select("*")
      .ilike("title", `%${source.name.slice(0, 15)}%`)
      .limit(1);

    const existingRecord = existingRecords && existingRecords.length > 0 ? existingRecords[0] : null;

    // 4. Run Groq AI Analysis Pipeline
    const aiResult = await analyzeContentWithGroq({
      sourceName: source.name,
      sourceAuthority: source.organization,
      sourceUrl: source.url,
      jurisdiction: source.jurisdiction,
      previousContent: source.last_content_hash ? "Previous snapshot recorded" : "",
      newContent: cleanText,
      existingRecord,
    });

    // 5. Create Finding Record in civic_update_findings staging table
    const { data: findingData, error: findingErr } = await supabaseAdmin
      .from("civic_update_findings")
      .insert({
        source_id: source.id,
        finding_type: aiResult.finding_type || "NEW",
        domain: aiResult.domain || "scheme",
        title: aiResult.title || source.name,
        summary: aiResult.summary || "Official source policy update detected.",
        change_summary: aiResult.change_summary || "Substantive content change detected from monitored source.",
        affected_fields: aiResult.affected_fields || [],
        previous_values: aiResult.previous_values || {},
        proposed_values: aiResult.proposed_values || {},
        eligibility_changes: aiResult.eligibility_changes || [],
        effective_date: aiResult.effective_date || null,
        expiry_date: aiResult.expiry_date || null,
        jurisdiction: source.jurisdiction,
        confidence: aiResult.confidence || 90,
        source_metadata: {
          name: source.name,
          url: source.url,
          authority: source.organization,
        },
        evidence: aiResult.evidence || [{ excerpt: cleanText.slice(0, 300) }],
        status: "PENDING_REVIEW",
        requires_human_review: true,
      })
      .select("*")
      .single();

    if (findingErr) {
      console.error("[Vayam Monitoring Agent] Failed to save finding:", findingErr);
    }

    // 6. Update Source record with scan timestamp and hash
    await supabaseAdmin.from("monitored_sources").update({
      last_scanned_at: nowIso,
      last_changed_at: nowIso,
      last_content_hash: contentHash,
    }).eq("id", source.id);

    return { success: true, findingCreated: true };
  } catch (err: any) {
    console.error(`[Vayam Monitoring Agent] Scan exception for ${source.name}:`, err);
    return { success: false, error: err.message || "Failed to scan source" };
  }
}

/**
 * Scan all active monitored sources in the database.
 */
export async function scanAllActiveSources(): Promise<{
  scanned: number;
  findings: number;
  errors: number;
  details: Array<{ sourceName: string; success: boolean; error?: string }>;
}> {
  const activeSources: MonitoredSource[] = [];
  const seenUrls = new Set<string>();

  // Fetch sources from database knowledge_sources table
  const { data: ksData } = await supabaseAdmin.from("knowledge_sources").select("*");
  if (ksData) {
    ksData.forEach((ks) => {
      if (ks.url && !seenUrls.has(ks.url)) {
        seenUrls.add(ks.url);
        activeSources.push({
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

  // Fetch sources from database monitored_sources table
  const { data: msData } = await supabaseAdmin.from("monitored_sources").select("*").eq("active", true);
  if (msData) {
    msData.forEach((ms) => {
      if (ms.url && !seenUrls.has(ms.url)) {
        seenUrls.add(ms.url);
        activeSources.push(ms as MonitoredSource);
      }
    });
  }

  if (activeSources.length === 0) {
    return { scanned: 0, findings: 0, errors: 0, details: [] };
  }

  let scanned = 0;
  let findings = 0;
  let errors = 0;
  const details: Array<{ sourceName: string; success: boolean; error?: string }> = [];

  for (const source of activeSources) {
    const result = await scanSingleSource(source as MonitoredSource);
    scanned++;
    if (result.success) {
      if (result.findingCreated) findings++;
    } else {
      errors++;
    }
    details.push({
      sourceName: source.name,
      success: result.success,
      error: result.error,
    });
  }

  return { scanned, findings, errors, details };
}
