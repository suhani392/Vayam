/**
 * lib/education/engine.ts
 *
 * Business logic engine for Vayam Education Pathfinder.
 * Prefills profile information, derives starting educational position,
 * filters matching pathways, and links pathways to Vayam scheme eligibility engine.
 */

import { EDUCATION_REGISTRY, getAllEducationProfessions, getEducationProfessionBySlug, searchEducationProfessions, CAREER_CATEGORIES } from "@/data/education";
import type { EducationPathway, EducationProfession, UserCurrentEducationState } from "@/types/education";
import { KnowledgeRepository } from "@/lib/knowledge/repository";
import { evaluateEligibility } from "@/lib/core/eligibility";
import { knowledgeRecordToCivicItem } from "@/lib/knowledge/adapter";
import type { KnowledgeRecord } from "@/lib/knowledge/types";

export { getAllEducationProfessions, getEducationProfessionBySlug, searchEducationProfessions, CAREER_CATEGORIES };

/**
 * Matches a profession's DB category string against a selected category ID, supporting synonyms and aliases.
 */
export function matchCareerCategory(profCategory: string, selectedCatId: string): boolean {
  if (!selectedCatId || selectedCatId === "all") return true;
  if (!profCategory) return false;

  const pCat = profCategory.toLowerCase().trim();
  const sCat = selectedCatId.toLowerCase().trim();

  if (pCat === sCat) return true;

  const categoryAliases: Record<string, string[]> = {
    public_service: ["public_service", "public_services", "civil_service", "civil_services", "public", "government"],
    technology: ["technology", "tech", "computing", "software", "it", "computer"],
    healthcare: ["healthcare", "health", "medicine", "medical", "doctor"],
    law: ["law", "legal", "advocate", "judiciary"],
    finance: ["finance", "accounting", "accounts", "ca", "commerce"],
    design: ["design", "creative", "arts", "architecture"],
    civil: ["civil", "engineering", "engineer"],
    education: ["education", "teaching", "teacher"],
    entrepreneurship: ["entrepreneurship", "business", "startups", "startup"],
  };

  const aliases = categoryAliases[sCat] || [sCat];
  return aliases.some((alias) => pCat.includes(alias) || alias.includes(pCat));
}

/**
 * Derives user's current education state from Vayam UserProfile.
 */
export function deriveEducationStateFromProfile(profile?: any): UserCurrentEducationState {
  if (!profile) {
    return {
      educationLevel: "higher_secondary",
      stream: "science",
    };
  }

  let derivedStream: "science" | "commerce" | "arts" | "any" = "science";
  let classOrYear = "Class 12";

  switch (profile.educationLevel) {
    case "primary":
    case "middle":
      classOrYear = "Class 8";
      break;
    case "secondary":
      classOrYear = "Class 10";
      break;
    case "higher_secondary":
      classOrYear = "Class 12";
      break;
    case "diploma":
      classOrYear = "Polytechnic Diploma Final Year";
      break;
    case "undergraduate":
      classOrYear = "Undergraduate Final Year";
      break;
    case "postgraduate":
    case "doctorate":
      classOrYear = "Working Professional / Post-Graduate";
      break;
  }

  return {
    educationLevel: profile.educationLevel || "higher_secondary",
    classOrYear,
    stream: derivedStream,
    isDiplomaHolder: profile.educationLevel === "diploma",
    isGraduate: profile.educationLevel === "undergraduate" || profile.educationLevel === "postgraduate" || profile.educationLevel === "doctorate",
    stateCode: profile.location?.stateCode,
  };
}

/**
 * Returns suggested professions tailored to user's profile.
 */
export function getSuggestedCareersForProfile(profile?: any): EducationProfession[] {
  const currentState = deriveEducationStateFromProfile(profile);
  const allProfessions = getAllEducationProfessions();

  if (currentState.isGraduate) {
    return allProfessions.filter((p) => p.slug === "software-engineer" || p.slug === "civil-services-officer" || p.slug === "teacher" || p.slug === "entrepreneur");
  }

  if (currentState.educationLevel === "secondary") {
    return allProfessions.filter((p) => p.slug === "software-engineer" || p.slug === "doctor" || p.slug === "chartered-accountant" || p.slug === "architect");
  }

  return allProfessions.slice(0, 6);
}

/**
 * Finds matching government schemes for an education pathway.
 * Connects directly into Vayam's existing scheme eligibility engine.
 */
export function getPathwayLinkedSchemes(pathway: EducationPathway, profile?: any): { scheme: KnowledgeRecord; isEligible: boolean; reason: string }[] {
  const matchingSchemes: { scheme: KnowledgeRecord; isEligible: boolean; reason: string }[] = [];

  const candidateRecords = KnowledgeRepository.getAllKnowledgeRecords().filter(
    (rec: KnowledgeRecord) => rec.category === "education" || rec.category === "scholarship" || (pathway.relatedSchemeIds && pathway.relatedSchemeIds.includes(rec.id))
  );

  candidateRecords.forEach((rec: KnowledgeRecord) => {
    if (profile && profile.dateOfBirth) {
      const item = knowledgeRecordToCivicItem(rec);
      const eligRes = evaluateEligibility(profile as any, item);
      matchingSchemes.push({
        scheme: rec,
        isEligible: eligRes.status === "LIKELY_ELIGIBLE" || eligRes.status === "MAYBE_ELIGIBLE",
        reason: eligRes.reasons?.join("; ") || "Available for students pursuing higher education.",
      });
    } else {
      matchingSchemes.push({
        scheme: rec,
        isEligible: true,
        reason: "Available for students pursuing higher education.",
      });
    }
  });

  return matchingSchemes.slice(0, 3);
}
