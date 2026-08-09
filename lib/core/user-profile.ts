import type { UserProfile, EducationLevel, EmploymentStatus } from "./types";

export const PROFILE_STORAGE_KEY = "vayam_user_profile";

export type UserProfileDraft = Omit<Partial<UserProfile>, "location"> & {
  id: string;
  preferredLanguage: string;
  location: Partial<UserProfile["location"]>;
};

export const PROFILE_REQUIRED_FIELDS: Array<keyof UserProfile> = [
  "name",
  "dateOfBirth",
  "gender",
  "location",
  "educationLevel",
  "employmentStatus",
];

export const PROFILE_OPTIONAL_FIELDS: Array<keyof UserProfile> = ["annualIncomeInr"];

export const EMPTY_PROFILE: UserProfileDraft = {
  id: "",
  name: "",
  dateOfBirth: "",
  gender: "prefer_not_to_say",
  location: {
    stateCode: "",
    stateName: "",
    residenceType: "urban",
  },
  educationLevel: "" as any,
  employmentStatus: "" as any,
  preferredLanguage: "en",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function isProfileValid(profile: Partial<UserProfile> | UserProfileDraft): profile is UserProfile {
  if (!profile) return false;
  if (!profile.name?.trim()) return false;
  if (!profile.dateOfBirth || !/^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth)) return false;
  if (!profile.location || !profile.location.stateCode?.trim()) return false;
  if (!profile.location.stateName?.trim()) return false;
  if (!profile.educationLevel) return false;
  if (!profile.employmentStatus) return false;
  return true;
}

export function getProfileCompletion(profile: Partial<UserProfile> | UserProfileDraft): {
  percent: number;
  completedFields: string[];
  missingFields: string[];
} {
  const fieldDefinitions: Array<{ key: keyof UserProfile; label: string; weight: number }> = [
    { key: "name", label: "Name", weight: 15 },
    { key: "dateOfBirth", label: "Date of birth", weight: 20 },
    { key: "location", label: "State of residence", weight: 20 },
    { key: "educationLevel", label: "Education stage", weight: 20 },
    { key: "employmentStatus", label: "Employment status", weight: 15 },
    { key: "annualIncomeInr", label: "Annual income", weight: 10 },
  ];

  let total = 0;
  const completedFields: string[] = [];
  const missingFields: string[] = [];

  fieldDefinitions.forEach((field) => {
    const value = profile[field.key];
    const filled =
      field.key === "location"
        ? Boolean(profile.location && profile.location.stateCode && profile.location.stateName)
        : value !== undefined && value !== null && String(value).trim().length > 0;

    if (filled) {
      total += field.weight;
      completedFields.push(field.label);
    } else {
      missingFields.push(field.label);
    }
  });

  return {
    percent: Math.min(100, Math.round(total)),
    completedFields,
    missingFields,
  };
}

export function getProfileHealthInsights(profile: Partial<UserProfile> | UserProfileDraft): Array<{ title: string; description: string }> {
  const insights: Array<{ title: string; description: string }> = [];

  if (!profile.location?.stateCode) {
    insights.push({
      title: "Missing state of residence",
      description: "State helps Vayam surface local schemes, services and authority-specific eligibility.",
    });
  }

  if (!profile.annualIncomeInr) {
    insights.push({
      title: "Missing income information",
      description: "Income helps determine eligibility for scholarships, welfare and pension schemes.",
    });
  }

  if (!profile.educationLevel) {
    insights.push({
      title: "Missing education stage",
      description: "Education level helps personalise opportunities for studies, training and skill support.",
    });
  }

  if (!profile.employmentStatus) {
    insights.push({
      title: "Missing employment status",
      description: "Employment details help Vayam recommend career, job and business support services.",
    });
  }

  if (!profile.dateOfBirth || !/^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth)) {
    insights.push({
      title: "Missing date of birth",
      description: "Age-based rights and milestone guidance depend on a correct date of birth.",
    });
  }

  if (!profile.name?.trim()) {
    insights.push({
      title: "Complete your name",
      description: "Your name keeps the profile easier to manage and saves your preferences locally.",
    });
  }

  return insights;
}

export function buildProfileSummary(profile: Partial<UserProfile>): string[] {
  const summary: string[] = [];
  if (profile.dateOfBirth) {
    summary.push(`Age from DOB: ${profile.dateOfBirth}`);
  }
  if (profile.location?.stateName) {
    summary.push(`State: ${profile.location.stateName}`);
  }
  if (profile.educationLevel) {
    summary.push(`Education: ${profile.educationLevel.replace(/_/g, " ")}`);
  }
  if (profile.employmentStatus) {
    summary.push(`Employment: ${profile.employmentStatus.replace(/_/g, " ")}`);
  }
  return summary;
}
