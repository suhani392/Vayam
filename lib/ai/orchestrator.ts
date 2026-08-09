/**
 * lib/ai/orchestrator.ts
 *
 * Main Assistant Query Orchestrator for Vayam AI Civic Assistant.
 * Phase 9: Accepts language parameter and passes it to the AI provider
 * so responses are generated in the user's selected language.
 *
 * Pipeline: prompt → intent → tools → response synthesis (in selected language)
 */

import { classifyUserIntent, type IntentClassification } from "./intents";
import { VayamTools } from "./tools";
import { getAIProvider } from "./provider";
import { t as translate } from "@/lib/i18n/index";
import type { LanguageCode } from "@/lib/i18n/types";
import type { UserProfile } from "../core/types";
import type { KnowledgeRecord } from "../knowledge/types";

export interface AssistantAction {
  label: string;
  type: "VIEW_DETAILS" | "EXPLORE_CATEGORY" | "OPEN_OFFICIAL_URL" | "UPDATE_PROFILE" | "SUBMIT_QUERY";
  payload: string;
}

export interface AssistantResponse {
  id: string;
  timestamp: string;
  role: "assistant";
  content: string;
  intent: IntentClassification;
  records: KnowledgeRecord[];
  milestones?: any[];
  sources: { name: string; url: string; lastVerified?: string }[];
  actions: AssistantAction[];
  clarificationOptions?: string[];
  toolStatus?: string;
  isFallback?: boolean;
}

export async function processAssistantQuery(
  prompt: string,
  profile?: UserProfile | null,
  language: LanguageCode = "en"
): Promise<AssistantResponse> {
  const provider = getAIProvider();

  // 1. Classify Intent (language-agnostic — keywords cover all languages)
  const intent = await provider.classifyIntent(prompt);
  const responseId = `res-${Date.now()}`;
  const timestamp = new Date().toISOString();

  let records: KnowledgeRecord[] = [];
  let milestones: any[] = [];
  let sources: { name: string; url: string; lastVerified?: string }[] = [];
  let actions: AssistantAction[] = [];
  let clarificationOptions: string[] | undefined = undefined;

  // Handle Clarification Requests
  if (intent.intent === "CLARIFICATION_NEEDED" && intent.clarificationOptions) {
    clarificationOptions = intent.clarificationOptions;
    return {
      id: responseId,
      timestamp,
      role: "assistant",
      content: translate("ai.clarify", language),
      intent,
      records: [],
      sources: [],
      actions: clarificationOptions.map((opt) => ({
        label: opt,
        type: "SUBMIT_QUERY",
        payload: opt,
      })),
      clarificationOptions,
    };
  }

  // 2. Execute Vayam Tools based on Intent (deterministic, language-independent)
  let toolData: any = null;

  switch (intent.intent) {
    case "UPCOMING_MILESTONES":
      if (profile) {
        const milestoneRes = VayamTools.getUpcomingMilestones(profile);
        milestones = milestoneRes.data;
      }
      const searchMilestoneRes = VayamTools.searchKnowledge("voter licence pension");
      records = searchMilestoneRes.data.slice(0, 3);
      toolData = { milestones, records };
      break;

    case "EDUCATION_GUIDANCE":
      const eduRes = VayamTools.getKnowledgeByCategory("education");
      records = eduRes.data;
      toolData = { records };
      break;

    case "RIGHTS_INFORMATION":
      const rightsRes = VayamTools.getKnowledgeByCategory("rights");
      records = rightsRes.data;
      toolData = { records };
      break;

    case "FINANCE_GUIDANCE":
      const finRes = VayamTools.getKnowledgeByCategory("finance");
      records = finRes.data;
      toolData = { records };
      break;

    case "CAREER_GUIDANCE":
      const careerRes = VayamTools.getKnowledgeByCategory("career");
      records = careerRes.data;
      toolData = { records };
      break;

    case "FIND_SERVICES":
      const serviceRes = VayamTools.searchKnowledge(intent.extractedQuery || "service", "services");
      records = serviceRes.data;
      toolData = { records };
      break;

    case "CHECK_ELIGIBILITY":
    case "EXPLAIN_SCHEME":
      if (intent.targetRecordId) {
        const singleRes = VayamTools.getKnowledgeById(intent.targetRecordId);
        if (singleRes.data) {
          records = [singleRes.data];
          if (profile) {
            const eligRes = VayamTools.evaluateEligibility(intent.targetRecordId, profile);
            toolData = { record: singleRes.data, eligibility: eligRes.data.eligibility };
          }
        }
      } else {
        const generalSearch = VayamTools.searchKnowledge(prompt);
        records = generalSearch.data.slice(0, 3);
      }
      break;

    case "SEARCH_KNOWLEDGE":
    default:
      if (profile && (
        prompt.includes("relevant") || prompt.includes("available for me") ||
        prompt.includes("मेरे लिए") || prompt.includes("माझ्यासाठी") ||
        prompt.includes("mere liye") || prompt.includes("majhyasathi")
      )) {
        const personalizedRes = VayamTools.getPersonalizedKnowledge(profile);
        records = personalizedRes.data.map((item) => item.record);
      } else {
        const searchRes = VayamTools.searchKnowledge(intent.extractedQuery || prompt);
        records = searchRes.data;
      }
      toolData = { records };
      break;
  }

  // 3. Generate Conversational Text (in selected language)
  const providerRes = await provider.generateResponse(prompt, intent, toolData, { language });

  // 4. Extract Sources & Actions from Tools
  records.forEach((record) => {
    if (record.source && record.source.name && record.source.url) {
      if (!sources.some((s) => s.url === record.source.url)) {
        sources.push({
          name: record.source.name,
          url: record.source.url,
          lastVerified: record.source.lastVerified,
        });
      }
    }
  });

  if (records.length > 0) {
    actions.push({
      label: translate("assistant.exploreCategory", language),
      type: "EXPLORE_CATEGORY",
      payload: `/explore?category=${records[0].category}`,
    });

    if (records[0].source?.url) {
      actions.push({
        label: translate("assistant.openSource", language),
        type: "OPEN_OFFICIAL_URL",
        payload: records[0].source.url,
      });
    }
  }

  if (intent.intent === "UNKNOWN" || records.length === 0) {
    actions.push({
      label: translate("assistant.exploreAll", language),
      type: "EXPLORE_CATEGORY",
      payload: "/explore",
    });
  }

  return {
    id: responseId,
    timestamp,
    role: "assistant",
    content: providerRes.content,
    intent,
    records,
    milestones,
    sources,
    actions,
    clarificationOptions,
    toolStatus: translate("assistant.toolStatus.default", language),
  };
}
