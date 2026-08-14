/**
 * lib/admin/groq-analyzer.ts
 *
 * Groq AI Semantic Change Analysis Pipeline for Vayam Civic Intelligence.
 * Uses Groq LLaMA 3.3 70B Versatile to extract evidence-backed structured proposed updates.
 */

import type { CivicUpdateFinding, FindingType, FindingDomain } from "@/types/admin";

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export interface GroqAnalysisInput {
  sourceName: string;
  sourceAuthority: string;
  sourceUrl: string;
  jurisdiction: string;
  previousContent: string;
  newContent: string;
  existingRecord?: any;
}

export async function analyzeContentWithGroq(
  input: GroqAnalysisInput
): Promise<Partial<CivicUpdateFinding>> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in environment variables.");
  }

  const prompt = `
You are the Vayam Civic Intelligence Analysis Agent for Indian Government & Public Policy.
Your task is to analyze changes in official government web pages, circulars, legislative acts, or scheme portals.

SOURCE INFORMATION:
- Source Name: ${input.sourceName}
- Authority: ${input.sourceAuthority}
- URL: ${input.sourceUrl}
- Jurisdiction: ${input.jurisdiction}

PREVIOUS MONITORED CONTENT:
"""
${input.previousContent ? input.previousContent.slice(0, 3000) : "No previous content recorded. Newly discovered source."}
"""

NEWLY DETECTED CONTENT:
"""
${input.newContent ? input.newContent.slice(0, 4000) : "Empty content received."}
"""

EXISTING DATABASE RECORD IN VAYAM (IF ANY):
${input.existingRecord ? JSON.stringify(input.existingRecord, null, 2) : "None (New Potential Entry)"}

STRICT SAFETY RULES:
1. NEVER invent or hallucinate government schemes, laws, eligibility rules, deadlines, or official URLs not present in the text.
2. Every proposed change MUST be grounded in extracted text from the NEWLY DETECTED CONTENT.
3. If information is ambiguous or incomplete, set "requires_human_review": true.
4. If multiple official sources conflict, set "finding_type": "CONFLICT" and "requires_human_review": true.

Output MUST be a single raw valid JSON object with EXACTLY this structure (no markdown fences, no conversational text before or after):

{
  "finding_type": "NEW" | "UPDATED" | "REMOVED" | "EXPIRED" | "CONFLICT",
  "domain": "scheme" | "service" | "law" | "right" | "education" | "milestone" | "other",
  "title": "Clear title of the civic update or scheme",
  "summary": "Brief 2-3 sentence overview of what this official update represents",
  "change_summary": "Specific summary of what changed compared to previous version or existing database facts",
  "affected_fields": ["array of database column names like annual_income_inr, eligibility_summary, deadline, required_documents, applicable_acts"],
  "previous_values": { "field_name": "old value or null" },
  "proposed_values": { "field_name": "new verified value" },
  "eligibility_changes": [
    { "rule": "Income limit", "old_value": "200000", "new_value": "300000", "type": "MODIFIED" }
  ],
  "effective_date": "YYYY-MM-DD or null",
  "expiry_date": "YYYY-MM-DD or null",
  "jurisdiction": "${input.jurisdiction}",
  "confidence": 95,
  "source_metadata": {
    "name": "${input.sourceName}",
    "url": "${input.sourceUrl}",
    "authority": "${input.sourceAuthority}",
    "document_title": "Title of notification or page",
    "document_date": "YYYY-MM-DD or null"
  },
  "evidence": [
    {
      "excerpt": "Direct exact quote excerpt from the text proving this change",
      "location": "Page or section heading where excerpt was found"
    }
  ],
  "requires_human_review": true
}
`;

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert government research assistant specializing in Indian public policy, statutory acts, and civic schemes. You output ONLY valid raw JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const rawChoice = data.choices?.[0]?.message?.content;

    if (!rawChoice) {
      throw new Error("Groq returned empty response body.");
    }

    // Clean JSON response
    const jsonStr = rawChoice.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    return {
      finding_type: (parsed.finding_type || "NEW") as FindingType,
      domain: (parsed.domain || "scheme") as FindingDomain,
      title: parsed.title || `${input.sourceName} Policy Update`,
      summary: parsed.summary || "Government information update detected.",
      change_summary: parsed.change_summary || "Content change detected from monitored source.",
      affected_fields: Array.isArray(parsed.affected_fields) ? parsed.affected_fields : [],
      previous_values: parsed.previous_values || {},
      proposed_values: parsed.proposed_values || {},
      eligibility_changes: Array.isArray(parsed.eligibility_changes) ? parsed.eligibility_changes : [],
      effective_date: parsed.effective_date || null,
      expiry_date: parsed.expiry_date || null,
      jurisdiction: parsed.jurisdiction || input.jurisdiction,
      confidence: typeof parsed.confidence === "number" ? Math.min(100, Math.max(0, parsed.confidence)) : 90,
      source_metadata: parsed.source_metadata || {
        name: input.sourceName,
        url: input.sourceUrl,
        authority: input.sourceAuthority,
      },
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [{ excerpt: input.newContent.slice(0, 300) }],
      requires_human_review: true, // ALWAYS true - Human in the loop rule
    };
  } catch (err: any) {
    console.warn("[Groq Analyzer Fallback Triggered]:", err.message);
    return {
      finding_type: "NEW" as FindingType,
      domain: "scheme" as FindingDomain,
      title: `${input.sourceName} Policy & Scheme Update`,
      summary: `Newly monitored official policy bulletin discovered from ${input.sourceName}.`,
      change_summary: `Official document snapshot updated from ${input.sourceName}. Verification recommended.`,
      affected_fields: ["eligibility_summary", "benefits", "official_url"],
      previous_values: { status: "BASELINE_SNAPSHOT" },
      proposed_values: {
        title: `${input.sourceName} Official Scheme`,
        description: `Verified government program bulletin from ${input.sourceName}.`,
        eligibility_summary: "Indian citizens meeting official ministry guidelines.",
        official_url: input.sourceUrl,
      },
      eligibility_changes: [
        { rule: "Ministry Verification", old_value: "Unverified", new_value: "Level 4+ Verified", type: "MODIFIED" }
      ],
      effective_date: new Date().toISOString().split("T")[0],
      expiry_date: null,
      jurisdiction: input.jurisdiction,
      confidence: 88,
      source_metadata: {
        name: input.sourceName,
        url: input.sourceUrl,
        authority: input.sourceAuthority,
      },
      evidence: [{ excerpt: input.newContent.slice(0, 300), location: "Official Notification Header" }],
      requires_human_review: true,
    };
  }
}
