/**
 * lib/i18n/types.ts
 *
 * Type definitions for Vayam's internationalization (i18n) system.
 * Three fully-implemented languages for Phase 9: en, hi, mr.
 * Architecture is open for additional languages without any core rewrites.
 */

/** Phase 9 fully-supported language codes */
export type LanguageCode = "en" | "hi" | "mr";

/** All language codes configured in the app (including future ones) */
export type AllLanguageCodes =
  | "en" | "hi" | "mr"
  | "ta" | "te" | "bn" | "gu" | "kn" | "ml" | "pa" | "or" | "as";

/** Language metadata entry */
export interface LanguageMeta {
  code: LanguageCode;
  label: string;        // in native script
  labelEn: string;      // English name
  voiceLocale: string;  // BCP-47 locale for Web Speech API (Indian locale preferred)
  dir: "ltr" | "rtl";
  script: "latin" | "devanagari" | "other";
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: "en", label: "English",   labelEn: "English", voiceLocale: "en-IN", dir: "ltr", script: "latin" },
  { code: "hi", label: "हिन्दी",    labelEn: "Hindi",   voiceLocale: "hi-IN", dir: "ltr", script: "devanagari" },
  { code: "mr", label: "मराठी",     labelEn: "Marathi", voiceLocale: "mr-IN", dir: "ltr", script: "devanagari" },
];

/** Flat translation map — all UI string keys used across Vayam */
export interface TranslationMap {
  // Navigation
  "nav.home": string;
  "nav.explore": string;
  "nav.timeline": string;
  "nav.assistant": string;
  "nav.profile": string;
  "nav.section": string;
  "nav.home.desc": string;
  "nav.explore.desc": string;
  "nav.timeline.desc": string;
  "nav.assistant.desc": string;
  "nav.profile.desc": string;

  // Language selector
  "lang.select": string;
  "lang.en": string;
  "lang.hi": string;
  "lang.mr": string;
  "lang.comingSoon": string;

  // Header
  "header.badge": string;
  "header.notifications": string;
  "header.profile.lifeStage": string;
  "header.profile.viewProfile": string;
  "header.profile.opportunities": string;
  "header.profile.privacy": string;
  "header.profile.help": string;

  // Sidebar
  "sidebar.civicIntelligence": string;
  "sidebar.appearance": string;
  "sidebar.officialData": string;
  "sidebar.officialDataDesc": string;

  // Home page
  "home.greeting": string;
  "home.subtitle": string;
  "home.profileBadge": string;
  "home.quickActions": string;
  "home.exploreSchemes": string;
  "home.askAssistant": string;
  "home.viewTimeline": string;
  "home.recommended": string;
  "home.upcoming": string;
  "home.noProfile": string;

  // Explore
  "explore.title": string;
  "explore.description": string;
  "explore.search.placeholder": string;
  "explore.filter.all": string;
  "explore.filter.verified": string;
  "explore.filter.sortBy": string;
  "explore.filter.relevance": string;
  "explore.filter.newest": string;
  "explore.filter.az": string;
  "explore.recommended": string;
  "explore.allRecords": string;
  "explore.noResults": string;
  "explore.noResultsDesc": string;
  "explore.clearSearch": string;
  "explore.type.scheme": string;
  "explore.type.service": string;
  "explore.type.right": string;
  "explore.type.benefit": string;
  "explore.type.career": string;
  "explore.type.skill": string;
  "explore.category.education": string;
  "explore.category.finance": string;
  "explore.category.health": string;
  "explore.category.agriculture": string;
  "explore.category.services": string;
  "explore.category.rights": string;
  "explore.category.career": string;
  "explore.category.housing": string;
  "explore.category.pension": string;
  "explore.category.women": string;
  "explore.category.disability": string;

  // Knowledge card
  "card.whyShowing": string;
  "card.eligibility.likely": string;
  "card.eligibility.partial": string;
  "card.eligibility.unknown": string;
  "card.eligibility.notYet": string;
  "card.eligibility.notEligible": string;
  "card.verified": string;
  "card.requiresReview": string;
  "card.viewDetails": string;
  "card.officialSource": string;
  "card.matchScore": string;

  // Assistant
  "assistant.greeting": string;
  "assistant.subtitle": string;
  "assistant.suggestedLabel": string;
  "assistant.inputPlaceholder": string;
  "assistant.send": string;
  "assistant.clearChat": string;
  "assistant.toolStatus.checking": string;
  "assistant.toolStatus.evaluating": string;
  "assistant.toolStatus.default": string;
  "assistant.source": string;
  "assistant.verified": string;
  "assistant.opportunities": string;
  "assistant.voiceToggle": string;
  "assistant.voiceOn": string;
  "assistant.voiceOff": string;
  "assistant.startVoice": string;
  "assistant.stopVoice": string;
  "assistant.stopSpeaking": string;
  "assistant.voiceListening": string;
  "assistant.voiceProcessing": string;
  "assistant.voiceSpeaking": string;
  "assistant.voiceError": string;
  "assistant.voiceUnsupported": string;
  "assistant.context": string;
  "assistant.noProfile": string;
  "assistant.suggestedPrompts.0": string;
  "assistant.suggestedPrompts.1": string;
  "assistant.suggestedPrompts.2": string;
  "assistant.suggestedPrompts.3": string;
  "assistant.suggestedPrompts.4": string;
  "assistant.suggestedPrompts.5": string;
  "assistant.clarify": string;
  "assistant.exploreCategory": string;
  "assistant.openSource": string;
  "assistant.exploreAll": string;
  "assistant.disclaimer": string;

  // AI responses (templates)
  "ai.clarify": string;
  "ai.milestones": string;
  "ai.education": string;
  "ai.rights": string;
  "ai.unknown": string;
  "ai.default": string;
  "ai.eligibleFor": string;
  "ai.missingInfo": string;
  "ai.notEligible": string;

  // Verification
  "verification.verified": string;
  "verification.requiresReview": string;
  "verification.official": string;
  "verification.lastVerified": string;

  // Eligibility labels
  "eligibility.likely": string;
  "eligibility.partial": string;
  "eligibility.unknown": string;
  "eligibility.notYet": string;
  "eligibility.notEligible": string;

  // Milestone labels
  "milestone.upcoming": string;
  "milestone.active": string;
  "milestone.past": string;

  // Common
  "common.loading": string;
  "common.error": string;
  "common.retry": string;
  "common.close": string;
  "common.viewAll": string;
  "common.learnMore": string;
  "common.new": string;
}
