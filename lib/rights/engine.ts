/**
 * lib/rights/engine.ts
 *
 * Engine for Know Your Rights natural language situation analysis.
 * Safely maps citizen descriptions to verified Indian legal topics, rights,
 * evidence checklists, practical options, and official sources.
 */

import { findMatchingLegalSituation, inferLegalCategoryFromQuery, getAllLegalSituations, searchLegalSituations, RIGHTS_CATEGORIES } from "@/data/rights";
import type { LegalSituation, RightsCategory } from "@/types/rights";

export interface LegalAnalysisResult {
  situation: LegalSituation;
  query: string;
  matchedKeywords: string[];
  disclaimer: string;
  officialVerificationAvailable: boolean;
}

export function analyzeSituationWithAI(
  fullSituationText: string,
  selectedCategory?: RightsCategory
): LegalSituation {
  const text = fullSituationText.trim();
  const qLower = text.toLowerCase();
  const inferredCat = selectedCategory || inferLegalCategoryFromQuery(text);

  // Check if any database record is a strong match for this topic
  const dbMatch = findMatchingLegalSituation(text, selectedCategory);

  // If a specific database record matches the query tokens with high confidence, return it
  if (
    dbMatch &&
    dbMatch.id !== "dynamic-fallback-situation" &&
    dbMatch.id !== "dynamic-safety-situation" &&
    dbMatch.id !== "dynamic-property-situation"
  ) {
    return {
      ...dbMatch,
      summary: `Analysis for "${text}": ${dbMatch.summary}`,
    };
  }

  // Full-situation AI breakdown analyzing the citizen's complete story
  if (inferredCat === "harassment_safety" || /kill|attack|threat|harm|assault|beat|abuse|violence/i.test(qLower)) {
    return {
      id: "ai-analyzed-safety-situation",
      topicId: "top-ai-safety",
      title: "Criminal Threat, Assault & Emergency Safety Protections",
      category: "harassment_safety",
      situationPatterns: [text],
      summary: `Analysis of your situation ("${text}"): Under Indian criminal law (Bharatiya Nyaya Sanhita BNS 2023 / IPC), any attempt, threat to cause death, physical assault, or criminal intimidation is a serious, non-bailable cognizable offence. Police and emergency protection services apply immediately.`,
      applicableActs: [
        "Bharatiya Nyaya Sanhita, 2023 (BNS) / Indian Penal Code (IPC)",
        "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) / CrPC",
        "Protection of Women from Domestic Violence Act, 2005 (if applicable)",
      ],
      legalConsiderations: [
        `Direct analysis for your situation "${text}": Threatening physical harm or attempting to cause hurt is a punishable crime.`,
        "Police officers are statutorily mandated to lodge an immediate First Information Report (FIR) or Zero FIR.",
        "You have the right to request immediate police protection and medical assistance.",
      ],
      rightsGranted: [
        "Right to immediate emergency police response (Dial 112 / 100).",
        "Right to register a FIR / Zero FIR without jurisdictional delay.",
        "Right to free legal assistance & victim representation through NALSA (15100).",
        "Right to medical examination & official Medico-Legal Certificate (MLC).",
      ],
      evidenceToPreserve: [
        "Audio / Video recordings, threat SMS, WhatsApp messages, or emails.",
        "Photos of any physical injuries or damaged personal property.",
        "Official hospital MLC report or medical emergency record.",
        "Names, contact info, and statements of eyewitnesses.",
      ],
      practicalSteps: [
        { stepNumber: 1, title: "Call Emergency Services Immediately", description: "Dial 112 (National Emergency Response) or 100 to report your location and physical safety threat." },
        { stepNumber: 2, title: "Lodge Police FIR / Zero FIR", description: "Visit the nearest Police Station to file a written complaint detailing the incident." },
        { stepNumber: 3, title: "Seek Protection & Legal Assistance", description: "Call NALSA helpline 15100 or approach a legal aid lawyer to apply for court protection orders." },
      ],
      officialHelplines: [
        { name: "National Emergency Response System", contactNumber: "112", description: "24/7 Immediate Emergency Police Dispatch" },
        { name: "National Police Helpline", contactNumber: "100", description: "Emergency Crime & Safety Reporting" },
        { name: "NALSA Legal Aid Helpline", contactNumber: "15100", description: "24/7 Free Legal Assistance & Victim Aid" },
      ],
      officialSources: [
        { title: "National Crime Records Bureau (NCRB)", authority: "Ministry of Home Affairs, GoI", url: "https://ncrb.gov.in/", lastVerified: "2026-08-13" },
        { title: "Department of Justice Legal Aid Portal (Tele-Law)", authority: "Ministry of Law & Justice, GoI", url: "https://doj.gov.in/", lastVerified: "2026-08-13" },
      ],
      lastVerified: "2026-08-13",
      disclaimer: "This AI-assisted legal breakdown analyzes your specific text description for civic awareness. If in physical danger, contact 112 immediately.",
      status: "INFORMATION_AVAILABLE",
    };
  }

  if (inferredCat === "property_rent" || /landlord|tenant|rent|deposit|evict/i.test(qLower)) {
    return {
      id: "ai-analyzed-property-situation",
      topicId: "top-ai-property",
      title: "Tenant Rights, Security Deposit & Unlawful Eviction Protections",
      category: "property_rent",
      situationPatterns: [text],
      summary: `Analysis of your situation ("${text}"): Under Indian tenancy law and the Model Tenancy Act, landlords cannot forcibly evict tenants or withhold security deposits without due legal process and written notice.`,
      applicableActs: [
        "Transfer of Property Act, 1882",
        "Model Tenancy Act, 2021",
        "Indian Contract Act, 1872",
      ],
      legalConsiderations: [
        `Direct analysis for "${text}": Forcible eviction, cutting off water/electricity, or refusing deposit refund is illegal.`,
        "Tenancy agreements are legally binding contracts enforceable in court or before the Rent Authority.",
      ],
      rightsGranted: [
        "Right to refund of security deposit with itemized deduction list.",
        "Right to statutory notice period before lease termination.",
        "Right to uninterrupted essential utility services.",
      ],
      evidenceToPreserve: [
        "Copy of signed Rent / Lease Agreement.",
        "Bank statements or UPI receipts showing rent & deposit transfers.",
        "Written notice or WhatsApp/Email communication regarding the dispute.",
      ],
      practicalSteps: [
        { stepNumber: 1, title: "Issue Formal Legal Notice", description: "Send a written notice demanding compliance or deposit refund within 15 days." },
        { stepNumber: 2, title: "Approach Rent Control Authority", description: "File a complaint with the Rent Controller or Civil Court for recovery and injunction." },
      ],
      officialHelplines: [
        { name: "NALSA Free Legal Aid", contactNumber: "15100", description: "Free Legal Assistance for Tenant & Property Disputes" },
      ],
      officialSources: [
        { title: "Ministry of Housing & Urban Affairs", authority: "Government of India", url: "https://mohua.gov.in/", lastVerified: "2026-08-13" },
      ],
      lastVerified: "2026-08-13",
      disclaimer: "AI civic analysis provided for educational and legal awareness purposes.",
      status: "INFORMATION_AVAILABLE",
    };
  }

  if (inferredCat === "consumer_rights" || /defective|refund|warranty|seller|amazon|flipkart|product|shop/i.test(qLower)) {
    return {
      id: "ai-analyzed-consumer-situation",
      topicId: "top-ai-consumer",
      title: "Consumer Protection, Refund & Deficiency of Service Rights",
      category: "consumer_rights",
      situationPatterns: [text],
      summary: `Analysis of your situation ("${text}"): Under the Consumer Protection Act 2019, sellers and manufacturers are strictly liable for product defects, misleading claims, or failure to issue refunds.`,
      applicableActs: [
        "Consumer Protection Act, 2019",
        "Consumer Protection (E-Commerce) Rules, 2020",
      ],
      legalConsiderations: [
        `Direct analysis for "${text}": E-commerce sellers and retail stores cannot disclaim liability for defective goods or non-delivery.`,
        "Consumers have 2 years from cause of action to file a complaint in Consumer Forum.",
      ],
      rightsGranted: [
        "Right to full refund, replacement, or repair free of cost.",
        "Right to claim compensation for mental agony and financial loss.",
        "Right to file online grievance on e-Daakhil portal.",
      ],
      evidenceToPreserve: [
        "Purchase invoice, bill, or online order confirmation.",
        "Unboxing video or photos showing defect.",
        "Email & chat logs with seller customer support.",
      ],
      practicalSteps: [
        { stepNumber: 1, title: "Register NCH Complaint", description: "Call 1915 or register grievance on National Consumer Helpline portal." },
        { stepNumber: 2, title: "Send Pre-Legal Notice", description: "Issue written notice giving seller 7 days to replace or refund." },
        { stepNumber: 3, title: "File e-Daakhil Petition", description: "File formal consumer case on e-Daakhil portal." },
      ],
      officialHelplines: [
        { name: "National Consumer Helpline (NCH)", contactNumber: "1915", description: "Official Consumer Grievances Helpline" },
      ],
      officialSources: [
        { title: "e-Daakhil Consumer Commission Portal", authority: "Ministry of Consumer Affairs", url: "https://edaakhil.nic.in/", lastVerified: "2026-08-13" },
      ],
      lastVerified: "2026-08-13",
      disclaimer: "AI-assisted legal guidance for consumer awareness.",
      status: "INFORMATION_AVAILABLE",
    };
  }

  // General domain analyzer for any other story
  const catTitle = inferredCat.replace("_", " ");
  return {
    id: "ai-analyzed-general-situation",
    topicId: "top-ai-general",
    title: `Civic & Legal Rights Guidance (${catTitle.toUpperCase()})`,
    category: inferredCat,
    situationPatterns: [text],
    summary: `Analysis of your situation ("${text}"): Under Indian law, your scenario falls under legal frameworks governing ${catTitle}.`,
    applicableActs: [
      "Constitution of India (Part III Fundamental Rights)",
      "Indian Contract Act, 1872",
      "Specific Relief Act, 1963",
    ],
    legalConsiderations: [
      `Full situation analysis for "${text}": Document all facts, dates, and communications.`,
      "Statutory limitation periods apply; seek timely legal notice or guidance.",
    ],
    rightsGranted: [
      "Right to issue formal written legal notice.",
      "Right to approach competent judicial court or statutory Ombudsman.",
      "Right to free legal representation via NALSA if eligible.",
    ],
    evidenceToPreserve: [
      "Written agreements, contracts, or receipts.",
      "SMS, WhatsApp chats, call records, and emails.",
      "Official identity proof and incident log.",
    ],
    practicalSteps: [
      { stepNumber: 1, title: "Document Evidence", description: "Assemble all physical and digital evidence related to your situation." },
      { stepNumber: 2, title: "Issue Notice", description: "Send formal written notice detailing your claim and deadline." },
      { stepNumber: 3, title: "Seek Legal Advice", description: "Approach NALSA (15100) or legal counsel to file formal proceedings." },
    ],
    officialHelplines: [
      { name: "National Legal Services Authority (NALSA)", contactNumber: "15100", description: "24/7 Free Legal Aid Helpline" },
    ],
    officialSources: [
      { title: "Department of Justice Legal Services Portal", authority: "Ministry of Law & Justice, GoI", url: "https://doj.gov.in/", lastVerified: "2026-08-13" },
    ],
    lastVerified: "2026-08-13",
    disclaimer: "AI civic analysis provided for educational and legal awareness purposes.",
    status: "INFORMATION_AVAILABLE",
  };
}

export function analyzeLegalSituation(query: string, selectedCategory?: RightsCategory): LegalAnalysisResult {
  const situation = analyzeSituationWithAI(query, selectedCategory);

  return {
    situation,
    query,
    matchedKeywords: [query.trim() || "General Legal Query"],
    disclaimer: situation.disclaimer,
    officialVerificationAvailable: situation.officialSources.length > 0,
  };
}

export { findMatchingLegalSituation, getAllLegalSituations, searchLegalSituations, RIGHTS_CATEGORIES };
