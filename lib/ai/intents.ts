/**
 * lib/ai/intents.ts
 *
 * Controlled Intent Classification System for Vayam AI Civic Assistant.
 * Classifies natural language queries into deterministic civic intent types.
 *
 * Phase 9: Supports English, Hindi (Devanagari + Romanized), Marathi (Devanagari + Romanized),
 * and code-mixed input (e.g. "Mujhe scholarship ke liye kya chahiye?").
 *
 * Zero AI API requirement for intent routing.
 */

export type AssistantIntentType =
  | "SEARCH_KNOWLEDGE"
  | "CHECK_ELIGIBILITY"
  | "EXPLAIN_SCHEME"
  | "FIND_SERVICES"
  | "EDUCATION_GUIDANCE"
  | "CAREER_GUIDANCE"
  | "FINANCE_GUIDANCE"
  | "RIGHTS_INFORMATION"
  | "UPCOMING_MILESTONES"
  | "PROFILE_HELP"
  | "GENERAL_VAYAM_HELP"
  | "CLARIFICATION_NEEDED"
  | "UNKNOWN";

export interface IntentClassification {
  intent: AssistantIntentType;
  confidence: number;
  extractedQuery?: string;
  targetCategory?: string;
  targetRecordId?: string;
  requiresClarification?: boolean;
  clarificationOptions?: string[];
}

// ── Multilingual keyword sets ──────────────────────────────────────────

const MILESTONE_KEYWORDS = [
  // English
  "turning 18", "turn 18", "upcoming milestone", "what changes", "next in life",
  // Hindi
  "18 साल", "18 sal", "18 ka hone", "अठारह", "मील का पत्थर",
  // Marathi
  "18 वर्ष", "18 varsha", "वय 18",
  // Code-mixed
  "18 ke baad", "18 nantara", "18 nantar",
];

const EDUCATION_KEYWORDS = [
  // English
  "scholarship", "after 12th", "college fund", "study scheme", "education",
  // Hindi
  "छात्रवृत्ति", "12वीं के बाद", "शिक्षा", "पढ़ाई",
  // Marathi
  "शिष्यवृत्ती", "12वी नंतर", "शिक्षण",
  // Romanized Hindi/Marathi
  "chhatravritti", "padhai", "scholarship ke liye", "shishyavritti",
  "12vi ke baad", "12vi nantar",
];

const SERVICE_KEYWORDS = [
  // English
  "driving", "licence", "voter", "pan", "passport", "aadhaar", "aadhar",
  // Hindi
  "ड्राइविंग", "लाइसेंस", "वोटर", "पासपोर्ट", "आधार",
  // Marathi
  "परवाना", "मतदार",
  // Romanized
  "driving licence", "voter id", "kaise milega",
];

const RIGHTS_KEYWORDS = [
  // English
  "rights", "rti", "legal aid", "cybercrime", "consumer helpline", "fundamental right",
  // Hindi
  "अधिकार", "कानूनी सहायता", "साइबर अपराध", "उपभोक्ता",
  // Marathi
  "हक्क", "कायदेशीर मदत",
  // Romanized
  "adhikar", "hakk",
];

const FINANCE_KEYWORDS = [
  // English
  "finance", "jan dhan", "mudra", "pension", "atal pension", "bank",
  // Hindi
  "वित्त", "जन धन", "मुद्रा", "पेंशन",
  // Marathi
  "वित्त", "निवृत्तीवेतन",
  // Romanized
  "paisa", "loan", "karz",
];

const CAREER_KEYWORDS = [
  // English
  "job", "career", "skill", "apprenticeship", "work", "employment",
  // Hindi
  "नौकरी", "करियर", "कौशल", "रोजगार",
  // Marathi
  "नोकरी", "करिअर", "कौशल्य", "रोजगार",
  // Romanized
  "naukri", "kaam", "rozgar",
];

const RELEVANCE_KEYWORDS = [
  // English
  "relevant", "available for me", "what can i get", "recommend",
  // Hindi
  "मेरे लिए", "मुझे क्या मिल", "सुझाव", "उपलब्ध",
  // Marathi
  "माझ्यासाठी", "मला काय मिळ", "सुचवा", "उपलब्ध",
  // Romanized
  "mere liye", "majhyasathi", "mala kay",
];

const GREETING_KEYWORDS = [
  "help", "namaste", "hello", "vayam", "hi", "hey",
  "नमस्ते", "नमस्कार", "मदद", "सहायता",
];

const LOAN_EXACT = [
  "can i get a loan?", "i need a loan", "loan",
  "क्या मुझे लोन मिल सकता है?", "मुझे लोन चाहिए", "लोन",
  "मला कर्ज मिळू शकते का?", "कर्ज", "karz", "loan chahiye",
];

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

/**
 * Deterministically classifies a user's prompt into a controlled intent.
 * Supports English, Hindi, Marathi, and code-mixed input.
 */
export function classifyUserIntent(prompt: string): IntentClassification {
  const p = prompt.trim().toLowerCase();

  // ── Ambiguous Loan → Clarification ──
  if (LOAN_EXACT.some((exact) => p === exact || p === exact.toLowerCase())) {
    return {
      intent: "CLARIFICATION_NEEDED",
      confidence: 0.95,
      requiresClarification: true,
      clarificationOptions: [
        "Business / MUDRA Loan",
        "Education / Student Support",
        "Housing / PMAY Scheme",
        "Agricultural Loan / PM-KISAN",
      ],
    };
  }

  // ── Milestones ──
  if (matchesAny(p, MILESTONE_KEYWORDS)) {
    return { intent: "UPCOMING_MILESTONES", confidence: 0.9 };
  }

  // ── Specific Scheme Inquiry ──
  if (p.includes("pm-kisan") || p.includes("pm kisan") || p.includes("pm-usp") || p.includes("csss") || p.includes("nmmss")) {
    let targetRecordId = "";
    if (p.includes("kisan")) targetRecordId = "pm-kisan-scheme";
    if (p.includes("usp") || p.includes("csss")) targetRecordId = "pm-usp-csss-scholarship";
    if (p.includes("nmmss")) targetRecordId = "nmmss-merit-scholarship";

    return {
      intent: p.includes("eligible") || p.includes("पात्र") || p.includes("eligibl") ? "CHECK_ELIGIBILITY" : "EXPLAIN_SCHEME",
      confidence: 0.95,
      targetRecordId,
    };
  }

  // ── Eligibility check patterns (multilingual) ──
  if (
    p.includes("eligible") || p.includes("eligibility") ||
    p.includes("पात्र") || p.includes("पात्रता") ||
    p.includes("paatra")
  ) {
    return {
      intent: "CHECK_ELIGIBILITY",
      confidence: 0.8,
      extractedQuery: p,
    };
  }

  // ── Education / Scholarships ──
  if (matchesAny(p, EDUCATION_KEYWORDS)) {
    return {
      intent: "EDUCATION_GUIDANCE",
      confidence: 0.9,
      extractedQuery: p,
      targetCategory: "education",
    };
  }

  // ── Services ──
  if (matchesAny(p, SERVICE_KEYWORDS)) {
    return {
      intent: "FIND_SERVICES",
      confidence: 0.9,
      extractedQuery: p,
      targetCategory: "services",
    };
  }

  // ── Rights ──
  if (matchesAny(p, RIGHTS_KEYWORDS)) {
    return {
      intent: "RIGHTS_INFORMATION",
      confidence: 0.9,
      extractedQuery: p,
      targetCategory: "rights",
    };
  }

  // ── Specific Scheme Inquiry ──
  if (p.includes("pm-kisan") || p.includes("pm kisan") || p.includes("pm-usp") || p.includes("csss") || p.includes("nmmss")) {
    let targetRecordId = "";
    if (p.includes("kisan")) targetRecordId = "pm-kisan-scheme";
    if (p.includes("usp") || p.includes("csss")) targetRecordId = "pm-usp-csss-scholarship";
    if (p.includes("nmmss")) targetRecordId = "nmmss-merit-scholarship";

    return {
      intent: p.includes("eligible") || p.includes("पात्र") || p.includes("eligibl") ? "CHECK_ELIGIBILITY" : "EXPLAIN_SCHEME",
      confidence: 0.95,
      targetRecordId,
    };
  }

  // ── Finance ──
  if (matchesAny(p, FINANCE_KEYWORDS)) {
    return {
      intent: "FINANCE_GUIDANCE",
      confidence: 0.85,
      extractedQuery: p,
      targetCategory: "finance",
    };
  }

  // ── Career ──
  if (matchesAny(p, CAREER_KEYWORDS)) {
    return {
      intent: "CAREER_GUIDANCE",
      confidence: 0.85,
      extractedQuery: p,
      targetCategory: "career",
    };
  }

  // ── Personalized / What's relevant ──
  if (matchesAny(p, RELEVANCE_KEYWORDS)) {
    return { intent: "SEARCH_KNOWLEDGE", confidence: 0.8 };
  }

  // ── General Help / Greeting ──
  if (matchesAny(p, GREETING_KEYWORDS)) {
    return { intent: "GENERAL_VAYAM_HELP", confidence: 0.8 };
  }

  // ── Eligibility check patterns (multilingual) ──
  if (
    p.includes("eligible") || p.includes("eligibility") ||
    p.includes("पात्र") || p.includes("पात्रता") ||
    p.includes("paatra")
  ) {
    return {
      intent: "CHECK_ELIGIBILITY",
      confidence: 0.8,
      extractedQuery: p,
    };
  }

  // ── Unknown / Unrecognized ──
  return {
    intent: "UNKNOWN",
    confidence: 0.5,
    extractedQuery: p,
  };
}
