/**
 * lib/ai/provider.ts
 *
 * Provider Abstraction Layer for Vayam AI Civic Assistant.
 * Phase 9: Generates responses in the user's selected language (en, hi, mr).
 * Zero API key requirement with the LocalDeterministicAIProvider.
 */

import { classifyUserIntent, type IntentClassification } from "./intents";
import { t as translate } from "@/lib/i18n/index";
import type { LanguageCode } from "@/lib/i18n/types";
import type { KnowledgeRecord } from "../knowledge/types";

export interface AIProviderResponse {
  content: string;
  intent: IntentClassification;
  toolStatus?: string;
  isFallback?: boolean;
}

export interface AIProvider {
  name: string;
  classifyIntent(prompt: string): Promise<IntentClassification>;
  generateResponse(
    prompt: string,
    intent: IntentClassification,
    toolData: any,
    context?: { language?: LanguageCode }
  ): Promise<AIProviderResponse>;
}

/**
 * Local Deterministic AI Provider.
 * Requires NO API keys. Performs 100% offline, zero-hallucination conversational
 * synthesis over Vayam tools. Responds in the user's selected language.
 */
export class LocalDeterministicAIProvider implements AIProvider {
  name = "Vayam Local Deterministic Engine (Offline / Safe)";

  async classifyIntent(prompt: string): Promise<IntentClassification> {
    return classifyUserIntent(prompt);
  }

  async generateResponse(
    prompt: string,
    intent: IntentClassification,
    toolData: any,
    context?: { language?: LanguageCode }
  ): Promise<AIProviderResponse> {
    const lang: LanguageCode = context?.language || "en";
    let content = "";

    switch (intent.intent) {
      case "CLARIFICATION_NEEDED":
        content = translate("ai.clarify", lang);
        break;

      case "UPCOMING_MILESTONES":
        content = translate("ai.milestones", lang);
        break;

      case "EDUCATION_GUIDANCE":
        content = translate("ai.education", lang);
        break;

      case "CHECK_ELIGIBILITY":
        if (toolData?.eligibility) {
          const { record, eligibility } = toolData;
          if (eligibility.status === "LIKELY_ELIGIBLE") {
            content = `${translate("ai.eligibleFor", lang)} **${record.title}**.`;
          } else if (eligibility.status === "UNKNOWN") {
            content = `${translate("ai.missingInfo", lang)} **${record.title}** (${eligibility.missingFields.join(", ")}).`;
          } else {
            content = `${translate("ai.notEligible", lang)} **${record.title}**. ${eligibility.explanation || ""}`;
          }
        } else {
          content = translate("ai.default", lang);
        }
        break;

      case "RIGHTS_INFORMATION":
        content = translate("ai.rights", lang);
        break;

      case "UNKNOWN":
        content = translate("ai.unknown", lang);
        break;

      default:
        content = translate("ai.default", lang);
        break;
    }

    return {
      content,
      intent,
      isFallback: false,
    };
  }
}

/**
 * Global AI Provider Instance Selector.
 */
export function getAIProvider(): AIProvider {
  return new LocalDeterministicAIProvider();
}
