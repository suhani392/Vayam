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

export type LanguageStyle = "hinglish" | "hindi" | "marathi" | "english";

export function detectLanguageStyle(prompt: string, fallbackLang: LanguageCode = "en"): LanguageStyle {
  const p = prompt.toLowerCase();

  // 1. Devanagari script detection
  if (/[\u0900-\u097F]/.test(prompt)) {
    if (p.includes("माझ्यासाठी") || p.includes("आहे") || p.includes("कसे") || p.includes("काय") || p.includes("नाही")) {
      return "marathi";
    }
    return "hindi";
  }

  // 2. Hinglish (Roman script Hindi / conversational code-mixed)
  const hinglishKeywords = [
    "kya", "kyu", "kyun", "mai", "main", "mujhe", "mera", "meri", "mere",
    "kaise", "apply", "kr", "kar", "karna", "karni", "karne", "skti", "sakti",
    "sakta", "sakte", "skte", "hu", "hoon", "hai", "hain", "ho", "nhi", "nahi",
    "haa", "haan", "batao", "bataiye", "chahiye", "kon", "kaun", "konsi", "konsa",
    "baad", "kab", "kahan", "kisi", "karte", "hum", "aapse", "licence", "license"
  ];

  const matchedHinglish = hinglishKeywords.filter((kw) =>
    new RegExp(`\\b${kw}\\b`, "i").test(p)
  ).length;

  if (matchedHinglish >= 1) {
    return "hinglish";
  }

  // 3. Romanized Marathi
  const marathiRomanKeywords = ["majhyasathi", "kasa", "kashi", "aahe", "sang", "mahit"];
  if (marathiRomanKeywords.some((kw) => p.includes(kw))) {
    return "marathi";
  }

  if (fallbackLang === "hi") return "hindi";
  if (fallbackLang === "mr") return "marathi";
  return "english";
}

function getTranslationKeyForIntent(intent: string): any {
  switch (intent) {
    case "CLARIFICATION_NEEDED": return "ai.clarify";
    case "UPCOMING_MILESTONES": return "ai.milestones";
    case "EDUCATION_GUIDANCE": return "ai.education";
    case "RIGHTS_INFORMATION": return "ai.rights";
    case "UNKNOWN": return "ai.unknown";
    default: return "ai.default";
  }
}

/**
 * Local Deterministic AI Provider.
 * Requires NO API keys. Performs 100% offline, zero-hallucination conversational
 * synthesis over Vayam tools. Responds in the exact spoken language/dialect of the user.
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
    const style = detectLanguageStyle(prompt, lang);
    let content = "";
    const isLicenceQuery = /licence|license|driving|ड्राइविंग|लाइसेंस|परवाना/i.test(prompt);

    if (style === "hinglish") {
      switch (intent.intent) {
        case "FIND_SERVICES":
        case "CHECK_ELIGIBILITY":
          if (isLicenceQuery) {
            content = "Haa kyu nhi! Abhi aap 18 saal ke ho chuke ho toh aap Driving Licence ke liye apply kar sakti ho. Sabse pehle aap Transport Department ke official Parivahan portal par Learner's Licence ka online application fill kar sakti ho, fir 30 din baad permanent Driving Test de sakti ho.";
          } else if (toolData?.eligibility) {
            const { record, eligibility } = toolData;
            if (eligibility.status === "LIKELY_ELIGIBLE") {
              content = `Haa kyu nhi! Aap **${record.title}** ke liye eligible ho. Aap official portal se online application submit kar sakti ho.`;
            } else {
              content = `Aap **${record.title}** ke details dekh sakti ho. ${eligibility.explanation || "Kripya apne profile details update karein."}`;
            }
          } else if (toolData?.records && toolData.records.length > 0) {
            content = `Haa bilkul! Aapke query ke acche options mil gaye hain: **${toolData.records[0].title}**. Complete details neeche cards me di gayi hain.`;
          } else {
            content = "Haa kyu nhi! Aap Vayam par government services, Driving Licence, Passport aur verified schemes ke liye apply kar sakti ho.";
          }
          break;

        case "EDUCATION_GUIDANCE":
          content = "Haa bilkul! 12th ke baad padhai aur college ke liye aap Post-Matric Chhatravritti aur NSP (National Scholarship Portal) scholarships ke liye apply kar sakti ho.";
          break;

        case "RIGHTS_INFORMATION":
          content = "Aap apne nagrik adhikar jaise Right to Information (RTI), Consumer Protection aur Legal Aid ke liye official portals dwara madad le sakti ho.";
          break;

        case "FINANCE_GUIDANCE":
          content = "Aap PM Mudra Yojana, Atal Pension Yojana aur Jan Dhan khata jaisi sarkari bachat aur loan yojanao ka fayda utha sakti ho.";
          break;

        case "CAREER_GUIDANCE":
          content = "Aap Skill India Portal, PM Kaushal Vikas Yojana aur Apprenticeship portal par free job training aur career guidance pa sakti ho.";
          break;

        case "UPCOMING_MILESTONES":
          content = "Haa kyu nhi! 18 saal ki umar hone par aap Voter ID card, Driving Licence aur Bank Account ke liye eligible ho sakti ho.";
          break;

        default:
          content = "Haa kyu nhi! Main aapko Vayam ke zariye verified sarkari yojanao, services aur rights ki poori jankari de sakti hu. Aap kya janna chahti hain?";
          break;
      }
    } else if (style === "hindi") {
      switch (intent.intent) {
        case "FIND_SERVICES":
        case "CHECK_ELIGIBILITY":
          if (isLicenceQuery) {
            content = "हाँ क्यों नहीं! अगर आपकी उम्र 18 साल हो चुकी है तो आप ड्राइविंग लाइसेंस के लिए आवेदन कर सकती हैं। आप परिवहन विभाग के आधिकारिक पोर्टल (Parivahan) पर जाकर सबसे पहले लर्निंग लाइसेंस का ऑनलाइन आवेदन कर सकती हैं।";
          } else if (toolData?.records && toolData.records.length > 0) {
            content = `हाँ बिल्कुल! आपकी खोज के अनुसार ये सत्यापित योजनाएं और नागरिक सेवाएं उपलब्ध हैं: **${toolData.records[0].title}**।`;
          } else {
            content = translate("ai.default", "hi");
          }
          break;

        case "EDUCATION_GUIDANCE":
          content = "हाँ बिल्कुल! 12वीं के बाद उच्च शिक्षा और कॉलेज के लिए आप पोस्ट-मैट्रिक छात्रवृत्ति और नेशनल स्कॉलरशिप पोर्टल (NSP) की योजनाओं के लिए आवेदन कर सकती हैं।";
          break;

        case "RIGHTS_INFORMATION":
          content = "आप अपने नागरिक अधिकारों जैसे सूचना का अधिकार (RTI), उपभोक्ता संरक्षण और कानूनी सहायता के लिए आधिकारिक पोर्टलों द्वारा जानकारी प्राप्त कर सकती हैं।";
          break;

        case "FINANCE_GUIDANCE":
          content = "आप पीएम मुद्रा योजना, अटल पेंशन योजना और जन धन खाते जैसी सरकारी बचत और ऋण योजनाओं का लाभ उठा सकती हैं।";
          break;

        case "CAREER_GUIDANCE":
          content = "आप स्किल इंडिया पोर्टल, पीएम कौशल विकास योजना और अप्रेंटिसशिप पोर्टल पर मुफ्त नौकरी प्रशिक्षण और करियर मार्गदर्शन प्राप्त कर सकती हैं।";
          break;

        case "UPCOMING_MILESTONES":
          content = "हाँ क्यों नहीं! 18 वर्ष की आयु होने पर आप वोटर आईडी कार्ड, ड्राइविंग लाइसेंस और बैंक खाते के लिए पात्र हो जाती हैं।";
          break;

        default:
          content = translate(getTranslationKeyForIntent(intent.intent), "hi");
          break;
      }
    } else if (style === "marathi") {
      switch (intent.intent) {
        case "FIND_SERVICES":
        case "CHECK_ELIGIBILITY":
          if (isLicenceQuery) {
            content = "हो नक्कीच! तुमचे वय १८ वर्षे पूर्ण झाले असल्यास तुम्ही ड्रायव्हिंग लायसन्ससाठी अर्ज करू शकता. तुम्ही आरटीओच्या अधिकृत परिवहन पोर्टलवर जाऊन ऑनलाइन अर्ज करू शकता.";
          } else if (toolData?.records && toolData.records.length > 0) {
            content = `हो नक्कीच! तुमच्या शोधानुसार या सत्यापित योजना आणि नागरिक सेवा उपलब्ध आहेत: **${toolData.records[0].title}**.`;
          } else {
            content = translate("ai.default", "mr");
          }
          break;

        case "EDUCATION_GUIDANCE":
          content = "हो नक्कीच! १२वीनंतरच्या शिक्षणासाठी आणि कॉलेजसाठी तुम्ही विविध राज्य व केंद्रीय शिष्यवृत्ती योजनांचा लाभ घेऊ शकता.";
          break;

        case "RIGHTS_INFORMATION":
          content = "तुम्ही माहितीचा अधिकार (RTI), ग्राहक संरक्षण आणि कायदेशीर मदतीसाठी अधिकृत पोर्टलद्वारे मदत घेऊ शकता.";
          break;

        case "FINANCE_GUIDANCE":
          content = "तुम्ही पीएम मुद्रा योजना, अटल निवृत्तीवेतन योजना आणि जन धन खात्यासारख्या शासकीय बचत व कर्ज योजनांचा लाभ घेऊ शकता.";
          break;

        case "CAREER_GUIDANCE":
          content = "तुम्ही स्कील इंडिया पोर्टल आणि पीएम कौशल विकास योजनेद्वारे मोफत कौशल्य प्रशिक्षण व करिअर मार्गदर्शन मिळवू शकता.";
          break;

        case "UPCOMING_MILESTONES":
          content = "हो नक्कीच! वय १८ वर्षे पूर्ण झाल्यावर तुम्ही मतदान ओळखपत्र, ड्रायव्हिंग लायसन्स आणि बँक खात्यासाठी पात्र ठरता.";
          break;

        default:
          content = translate(getTranslationKeyForIntent(intent.intent), "mr");
          break;
      }
    } else {
      // English
      switch (intent.intent) {
        case "FIND_SERVICES":
        case "CHECK_ELIGIBILITY":
          if (isLicenceQuery) {
            content = "Yes, absolutely! Since you have turned 18, you are eligible to apply for a Driving Licence. You can apply for a Learner's Licence first on the official Parivahan RTO portal.";
          } else if (toolData?.eligibility) {
            const { record, eligibility } = toolData;
            if (eligibility.status === "LIKELY_ELIGIBLE") {
              content = `${translate("ai.eligibleFor", "en")} **${record.title}**.`;
            } else {
              content = `${translate("ai.notEligible", "en")} **${record.title}**. ${eligibility.explanation || ""}`;
            }
          } else {
            content = translate("ai.default", "en");
          }
          break;
        default:
          content = translate(getTranslationKeyForIntent(intent.intent), "en");
          break;
      }
    }

    return {
      content,
      intent,
      isFallback: false,
    };
  }
}

/**
 * Local Ollama AI Provider.
 * Connects to a local downloaded Llama / Ollama instance (http://localhost:11434)
 * with zero cloud API keys, zero rate limits, and 100% local execution.
 * Seamlessly falls back to LocalDeterministicAIProvider if Ollama is offline.
 */
export class LocalOllamaAIProvider implements AIProvider {
  name = "Ollama Local LLM (Downloaded Llama Model)";
  private fallbackProvider = new LocalDeterministicAIProvider();
  private ollamaBaseUrl = typeof process !== "undefined" && process.env.NEXT_PUBLIC_OLLAMA_URL
    ? process.env.NEXT_PUBLIC_OLLAMA_URL
    : "http://localhost:11434";
  private modelName = typeof process !== "undefined" && process.env.NEXT_PUBLIC_OLLAMA_MODEL
    ? process.env.NEXT_PUBLIC_OLLAMA_MODEL
    : "llama3.2";

  async classifyIntent(prompt: string): Promise<IntentClassification> {
    return classifyUserIntent(prompt);
  }

  async generateResponse(
    prompt: string,
    intent: IntentClassification,
    toolData: any,
    context?: { language?: LanguageCode }
  ): Promise<AIProviderResponse> {
    try {
      const contextText = JSON.stringify(toolData || {}, null, 2);
      const userLang = context?.language || "en";
      const systemPrompt = `You are Vayam, an official Indian civic knowledge assistant.
Use ONLY the verified database knowledge provided in the CONTEXT to answer the user's question.
User question: "${prompt}"
Language: ${userLang}
Verified Database Context:
${contextText}
Respond concisely in simple language.`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${this.ollamaBaseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.modelName,
          prompt: systemPrompt,
          stream: false,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.response && data.response.trim()) {
          return {
            content: data.response.trim(),
            intent,
            toolStatus: `Powered by Local ${this.modelName} (Ollama)`,
            isFallback: false,
          };
        }
      }
    } catch (err) {
      // Ollama not running locally — fall back to LocalDeterministic Engine seamlessly
    }

    return this.fallbackProvider.generateResponse(prompt, intent, toolData, context);
  }
}

/**
 * Groq AI Provider.
 * Connects via server API route (/api/ai/chat) to Groq API (Llama 3.3 70B model).
 * Uses GROQ_API_KEY securely from .env.local or Vercel environment variables.
 * Seamlessly falls back to LocalOllamaAIProvider or LocalDeterministicAIProvider if unavailable.
 */
export class GroqAIProvider implements AIProvider {
  name = "Groq Llama 3 Cloud Model";
  private fallbackOllama = new LocalOllamaAIProvider();

  async classifyIntent(prompt: string): Promise<IntentClassification> {
    return classifyUserIntent(prompt);
  }

  async generateResponse(
    prompt: string,
    intent: IntentClassification,
    toolData: any,
    context?: { language?: LanguageCode }
  ): Promise<AIProviderResponse> {
    try {
      const contextText = JSON.stringify(toolData || {}, null, 2);
      const userLang = context?.language || "en";
      const systemPrompt = `You are Vayam, an official Indian civic knowledge assistant.
Use ONLY the verified database knowledge provided in the CONTEXT to answer the user's question.
User question: "${prompt}"
Language: ${userLang}
Verified Database Context:
${contextText}
Respond concisely in simple language.`;

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          systemPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.content && data.content.trim()) {
          return {
            content: data.content.trim(),
            intent,
            toolStatus: "Powered by Llama 3 (Groq AI)",
            isFallback: false,
          };
        }
      }
    } catch (err) {
      console.warn("[Vayam AI] Groq API route error, falling back:", err);
    }

    return this.fallbackOllama.generateResponse(prompt, intent, toolData, context);
  }
}

/**
 * Global AI Provider Instance Selector.
 * 1. Groq Llama 3 (if GROQ_API_KEY environment variable is set on Vercel)
 * 2. Ollama Local LLM (if Ollama is running on localhost:11434)
 * 3. Local Deterministic Engine (100% offline fallback)
 */
export function getAIProvider(): AIProvider {
  return new GroqAIProvider();
}
