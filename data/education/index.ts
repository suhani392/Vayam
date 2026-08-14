/**
 * data/education/index.ts
 *
 * Dynamic Education Pathfinder Registry for Vayam.
 * PURE DATABASE ONLY: Zero hardcoded education career records.
 */

import type { EducationProfession } from "@/types/education";

export const CAREER_CATEGORIES = [
  { id: "technology", label: "Technology & Computing", icon: "Code" },
  { id: "healthcare", label: "Medicine & Healthcare", icon: "Stethoscope" },
  { id: "law", label: "Law & Legal Services", icon: "Scale" },
  { id: "finance", label: "Finance & Accounting", icon: "Calculator" },
  { id: "design", label: "Design & Creative", icon: "Palette" },
  { id: "civil", label: "Engineering & Civil Works", icon: "Building2" },
  { id: "education", label: "Teaching & Education", icon: "GraduationCap" },
  { id: "public_service", label: "Public & Civil Services", icon: "Landmark" },
  { id: "entrepreneurship", label: "Business & Startups", icon: "Rocket" },
] as const;

export let EDUCATION_REGISTRY: EducationProfession[] = [];

export function setDbEducationRegistry(professions: EducationProfession[]) {
  EDUCATION_REGISTRY = professions;
}

export function getAllEducationProfessions(): EducationProfession[] {
  return [...EDUCATION_REGISTRY];
}

export function searchEducationProfessions(query: string, categoryId?: string): EducationProfession[] {
  let list = [...EDUCATION_REGISTRY];

  if (categoryId && categoryId !== "all") {
    list = list.filter((p) => p.category === categoryId);
  }

  if (query.trim()) {
    const qLower = query.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(qLower) ||
        p.shortDescription.toLowerCase().includes(qLower) ||
        p.category.toLowerCase().includes(qLower)
    );
  }

  return list;
}

export function getEducationProfessionBySlug(slug: string): EducationProfession | undefined {
  return EDUCATION_REGISTRY.find((p) => p.slug === slug || p.id === slug);
}
