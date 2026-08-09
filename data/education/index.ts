/**
 * data/education/index.ts
 *
 * Data access layer for education paths, scholarships, and
 * skill-development opportunities.
 */

import type { EducationPath } from "@/types/schemes";

export function getAllEducationPaths(): EducationPath[] {
  return EDUCATION_REGISTRY;
}

export function getEducationPathById(id: string): EducationPath | undefined {
  return EDUCATION_REGISTRY.find((e) => e.id === id);
}

const EDUCATION_REGISTRY: EducationPath[] = [
  // Education paths will be added in future phases.
];
