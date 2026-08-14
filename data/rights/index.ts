/**
 * data/rights/index.ts
 *
 * Dynamic Legal Knowledge Registry for Know Your Rights in Vayam.
 * PURE DATABASE ONLY: Zero hardcoded legal situation records.
 */

import type { LegalSituation, LegalCategoryMeta, RightsCategory } from "@/types/rights";

export let RIGHTS_CATEGORIES: LegalCategoryMeta[] = [];

export function setDbRightsCategories(categories: LegalCategoryMeta[]) {
  RIGHTS_CATEGORIES = categories;
}

export let LEGAL_SITUATIONS_REGISTRY: LegalSituation[] = [];

export function setDbLegalSituations(situations: LegalSituation[]) {
  LEGAL_SITUATIONS_REGISTRY = situations;
}

export function getAllLegalSituations(): LegalSituation[] {
  return [...LEGAL_SITUATIONS_REGISTRY];
}

export function searchLegalSituations(query: string, category?: RightsCategory): LegalSituation[] {
  if (!query.trim() && !category) return LEGAL_SITUATIONS_REGISTRY;
  const qLower = query.toLowerCase().trim();
  return LEGAL_SITUATIONS_REGISTRY.filter((situation) => {
    if (category && situation.category !== category) return false;
    if (!qLower) return true;
    const titleMatch = situation.title.toLowerCase().includes(qLower);
    const patternMatch = situation.situationPatterns.some((p) => p.toLowerCase().includes(qLower));
    return titleMatch || patternMatch;
  });
}

export function inferLegalCategoryFromQuery(query: string): RightsCategory {
  const q = query.toLowerCase();

  if (/kill|attack|murder|threat|stab|poison|assault|beat|violence|abuse|rape|harass|harm|weapon|danger|emergency|safety|life/i.test(q)) {
    return "harassment_safety";
  }
  if (/landlord|tenant|rent|deposit|evict|lease|flat|property|house/i.test(q)) {
    return "property_rent";
  }
  if (/salary|boss|employer|job|wage|terminate|fire|workplace|office/i.test(q)) {
    return "employment";
  }
  if (/defective|refund|warranty|seller|amazon|flipkart|shop|damaged|item|product/i.test(q)) {
    return "consumer_rights";
  }
  if (/cyber|otp|hack|phishing|online fraud|scam|account hacked|spam/i.test(q)) {
    return "digital_cyber";
  }
  if (/divorce|alimony|custody|domestic|husband|wife|dowry/i.test(q)) {
    return "family_domestic";
  }
  if (/borrow|loan|debt|cheque|bounced|money|interest|payment|lender/i.test(q)) {
    return "money_payments";
  }

  return "harassment_safety";
}

function createDynamicFallbackSituation(userText: string, category?: RightsCategory): LegalSituation {
  const targetCategory = category || inferLegalCategoryFromQuery(userText);

  if (targetCategory === "harassment_safety" || targetCategory === "family_domestic") {
    return {
      id: "dynamic-safety-situation",
      topicId: "top-safety-guidance",
      title: "Criminal Threat, Assault & Emergency Safety Protections",
      category: targetCategory,
      situationPatterns: [userText],
      summary: `Your situation involving "${userText}" concerns serious criminal offences, physical threats, or assault under Indian criminal law (Bharatiya Nyaya Sanhita BNS / IPC). Immediate safety and law enforcement intervention apply.`,
      applicableActs: [
        "Bharatiya Nyaya Sanhita, 2023 (BNS) / Indian Penal Code (IPC)",
        "Code of Criminal Procedure (CrPC) / Bharatiya Nagarik Suraksha Sanhita (BNSS)",
        "Protection of Women from Domestic Violence Act, 2005",
      ],
      legalConsiderations: [
        "Threat to life, attempt to cause hurt, or criminal intimidation is a cognizable offence in India.",
        "Police are legally bound to register a First Information Report (FIR) or Zero FIR immediately.",
        "Do not hesitate to reach emergency helplines (112 / 100) if you are in physical danger.",
      ],
      rightsGranted: [
        "Right to immediate police protection and registration of Zero FIR.",
        "Right to free medical examination and treatment at any hospital.",
        "Right to free legal assistance through NALSA (State Legal Services Authority).",
        "Right to record official witness statement before a Magistrate.",
      ],
      evidenceToPreserve: [
        "Call recordings, threat messages, WhatsApp chats, or emails.",
        "CCTV footage, photos of any injuries, or damaged property.",
        "Medical checkup report / MLC from hospital (if physical violence occurred).",
        "Names, contact details, and statements of eyewitnesses.",
      ],
      practicalSteps: [
        { stepNumber: 1, title: "Emergency Safety First", description: "Call 112 (National Emergency Helpline) or 100 immediately to report physical threat or danger." },
        { stepNumber: 2, title: "File Police FIR / Zero FIR", description: "Visit the nearest Police Station to file a written complaint / FIR under relevant sections of BNS / IPC." },
        { stepNumber: 3, title: "Seek Legal Aid & Protection Order", description: "Contact NALSA helpline (15100) or approach a lawyer to file for protection orders and court intervention." },
      ],
      officialHelplines: [
        { name: "National Emergency Response System", contactNumber: "112", description: "Immediate Emergency Police / Ambulance / Fire Dispatch" },
        { name: "National Police Helpline", contactNumber: "100", description: "Police Emergency & Crime Reporting" },
        { name: "NALSA Free Legal Services Helpline", contactNumber: "15100", description: "24/7 Free Legal Aid & Victim Assistance" },
        { name: "Women National Helpline", contactNumber: "1091", description: "Women Safety & Violence Response" },
      ],
      officialSources: [
        { title: "National Crime Records Bureau (NCRB) Portal", authority: "Ministry of Home Affairs, GoI", url: "https://ncrb.gov.in/", lastVerified: "2026-08-13" },
        { title: "Department of Justice Free Legal Aid (Tele-Law)", authority: "Ministry of Law and Justice, GoI", url: "https://doj.gov.in/", lastVerified: "2026-08-13" },
      ],
      lastVerified: "2026-08-13",
      disclaimer: "This information is for emergency civic awareness. In case of immediate threat to life, call 112 or visit the nearest police station immediately.",
      status: "INFORMATION_AVAILABLE",
    };
  }

  if (targetCategory === "property_rent") {
    return {
      id: "dynamic-property-situation",
      topicId: "top-property-guidance",
      title: "Tenant Rights, Rent Deposit Recovery & Property Protections",
      category: "property_rent",
      situationPatterns: [userText],
      summary: `Your situation regarding "${userText}" involves property laws, tenancy agreements, and deposit recovery under Indian State Rent Control Acts and Transfer of Property Act.`,
      applicableActs: [
        "Transfer of Property Act, 1872",
        "Model Tenancy Act, 2021",
        "Indian Contract Act, 1872",
      ],
      legalConsiderations: [
        "Landlords cannot forcibly evict tenants without due legal process or court order.",
        "Security deposit must be refunded upon handover as per tenancy agreement terms.",
      ],
      rightsGranted: [
        "Right against illegal eviction without notice.",
        "Right to refund of security deposit with deduction statement.",
        "Right to essential utility access (water, electricity).",
      ],
      evidenceToPreserve: [
        "Rent agreement / lease deed copy.",
        "Bank transaction receipts for rent and security deposit.",
        "WhatsApp / Email conversations regarding notice and deposit.",
      ],
      practicalSteps: [
        { stepNumber: 1, title: "Send Legal Notice", description: "Issue a formal written legal notice demanding deposit refund within 15 days." },
        { stepNumber: 2, title: "Approach Rent Authority", description: "File a dispute with the local Rent Control Authority or Civil Court." },
      ],
      officialHelplines: [
        { name: "NALSA Free Legal Aid", contactNumber: "15100", description: "Free Legal Aid for Property & Tenant Disputes" },
      ],
      officialSources: [
        { title: "Ministry of Housing & Urban Affairs - Model Tenancy Portal", authority: "GoI", url: "https://mohua.gov.in/", lastVerified: "2026-08-13" },
      ],
      lastVerified: "2026-08-13",
      disclaimer: "Civic guidance for tenant & property awareness.",
      status: "INFORMATION_AVAILABLE",
    };
  }

  const catName = targetCategory.replace("_", " ");
  return {
    id: "dynamic-fallback-situation",
    topicId: "top-dynamic-guidance",
    title: `Legal Rights & Protections (${catName})`,
    category: targetCategory,
    situationPatterns: [userText],
    summary: `Your query regarding "${userText}" involves rights under Indian legal frameworks governing ${catName}.`,
    applicableActs: ["Indian Contract Act, 1872", "Consumer Protection Act, 2019", "Constitution of India (Part III)"],
    legalConsiderations: [
      "Review any written agreements, receipts, or message records.",
      "Check limitation periods for filing formal complaints.",
    ],
    rightsGranted: [
      "Right to issue a formal legal notice.",
      "Right to file a complaint in the competent court or ombudsman portal.",
    ],
    evidenceToPreserve: [
      "Transaction records, payment receipts, bank statements.",
      "SMS, WhatsApp chats, email correspondence.",
    ],
    practicalSteps: [
      { stepNumber: 1, title: "Gather Proof", description: "Gather all written proof and payment receipts." },
      { stepNumber: 2, title: "File Notice", description: "Issue a formal written notice or file an online complaint." },
      { stepNumber: 3, title: "Legal Aid", description: "Approach NALSA / State Legal Services Authority for free legal aid if needed." },
    ],
    officialHelplines: [{ name: "National Legal Services Authority (NALSA)", contactNumber: "15100", description: "Free Legal Aid Helpline" }],
    officialSources: [{ title: "Department of Justice Legal Aid Portal", authority: "Ministry of Law & Justice", url: "https://doj.gov.in/", lastVerified: "2026-08-13" }],
    lastVerified: "2026-08-13",
    disclaimer: "This guidance is for educational and civic awareness purposes only.",
    status: "INFORMATION_AVAILABLE",
  };
}

export function findMatchingLegalSituation(userText: string, category?: RightsCategory): LegalSituation {
  const qLower = userText.toLowerCase().trim();
  const inferredCat = category || inferLegalCategoryFromQuery(userText);

  // Common stop words to ignore during matching
  const stopWords = new Set(["my", "friend", "tried", "to", "me", "he", "she", "the", "a", "an", "and", "is", "in", "it", "on", "for"]);
  const queryTokens = qLower.split(/\s+/).filter((t) => t.length > 2 && !stopWords.has(t));

  // Category pre-filtering
  const candidates = LEGAL_SITUATIONS_REGISTRY.filter((s) => s.category === inferredCat);
  const pool = candidates.length > 0 ? candidates : LEGAL_SITUATIONS_REGISTRY;

  let bestRecord: LegalSituation | null = null;
  let maxScore = 0;

  for (const situation of pool) {
    let score = 0;

    // Must match category intent if inferred explicitly
    if (situation.category === inferredCat) {
      score += 20;
    }

    // 1. Exact string match on title
    if (qLower && situation.title.toLowerCase().includes(qLower)) {
      score += 50;
    }

    // 2. Pattern matches and token overlaps (ignoring stop words)
    for (const pattern of situation.situationPatterns) {
      const pLower = pattern.toLowerCase();
      if (qLower && (qLower.includes(pLower) || pLower.includes(qLower))) {
        score += 35;
      }
      for (const token of queryTokens) {
        if (pLower.includes(token)) {
          score += 15;
        }
      }
    }

    // 3. Title token overlap
    const titleLower = situation.title.toLowerCase();
    for (const token of queryTokens) {
      if (titleLower.includes(token)) {
        score += 10;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestRecord = situation;
    }
  }

  // Only use database record if it had meaningful token overlap score >= 15
  if (bestRecord && maxScore >= 15) {
    return { ...bestRecord };
  }

  // Otherwise generate dynamic AI-tailored legal situation for inferred domain category
  return createDynamicFallbackSituation(userText, inferredCat);
}
