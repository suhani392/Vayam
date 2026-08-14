/**
 * types/education.ts
 *
 * Type definitions for Vayam Education Pathfinder capability.
 * Keeps data models separate from presentation.
 */

import type { EducationLevel } from "./user";

export type StreamRequirement = "science" | "commerce" | "arts" | "any";

export interface PathwayStep {
  stepNumber: number;
  stageName: string;
  description: string;
  type: "school" | "exam" | "degree" | "skills" | "career";
  recommendedDuration?: string;
}

export interface EntranceExam {
  name: string;
  fullName: string;
  conductingBody: string;
  websiteUrl?: string;
  description: string;
  eligibility: string;
}

export interface OfficialSourceRef {
  title: string;
  authority: string;
  url: string;
  lastVerified?: string;
}

export interface EducationPathway {
  id: string;
  pathCode: "PATH_A" | "PATH_B" | "PATH_C" | "PATH_D";
  title: string;
  startingEducationLevel: EducationLevel;
  requiredStream: StreamRequirement;
  degreeQualification: string;
  durationYears: number;
  entranceExams: EntranceExam[];
  entryRequirements: string[];
  keySkills: string[];
  steps: PathwayStep[];
  alternativeRoutes: string[];
  relatedSchemeIds?: string[];
  officialSources: OfficialSourceRef[];
}

export interface EducationProfession {
  id: string;
  slug: string;
  title: string;
  category: "technology" | "healthcare" | "law" | "finance" | "design" | "civil" | "education" | "public_service" | "entrepreneurship";
  shortDescription: string;
  iconName: string; // Lucide icon identifier
  demandLevel: "High" | "Very High" | "Moderate";
  avgStartingSalaryInr?: string;
  suitableStreams: StreamRequirement[];
  pathways: EducationPathway[];
}

export interface UserCurrentEducationState {
  educationLevel: EducationLevel;
  classOrYear?: string;
  stream?: StreamRequirement;
  isDiplomaHolder?: boolean;
  isGraduate?: boolean;
  interests?: string[];
  stateCode?: string;
}
