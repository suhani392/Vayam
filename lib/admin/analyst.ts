/**
 * lib/admin/analyst.ts
 *
 * Layer 2 — Civic Intelligence: Vayam Analyst.
 * Powered by Groq AI. Converts detected government content changes into a structured proposal
 * containing old vs new values, evidence excerpts, effective dates, and affected database fields.
 */

import { analyzeContentWithGroq } from "./groq-analyzer";
import type { SentinelScanResult } from "./sentinel";
import type { CivicUpdateFinding } from "@/types/admin";

export async function runAnalystOnScan(
  sentinelResult: SentinelScanResult
): Promise<Partial<CivicUpdateFinding>> {
  console.log(`[Vayam Analyst] Running Groq AI analysis on ${sentinelResult.sourceName}...`);

  const aiOutput = await analyzeContentWithGroq({
    sourceName: sentinelResult.sourceName,
    sourceAuthority: `Authority Level ${sentinelResult.authorityLevel}`,
    sourceUrl: sentinelResult.sourceUrl,
    jurisdiction: sentinelResult.authorityLevel >= 5 ? "Central" : "State",
    previousContent: sentinelResult.previousContent,
    newContent: sentinelResult.newContent,
  });

  return {
    ...aiOutput,
    source_id: sentinelResult.sourceId,
    jurisdiction: sentinelResult.authorityLevel >= 5 ? "Central" : "State",
  };
}
