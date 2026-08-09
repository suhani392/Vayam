/**
 * lib/i18n/mr.ts
 *
 * Marathi (mr) translations for Vayam.
 * Language style: natural, modern Marathi — not overly formal government-style Marathi.
 * Government scheme names preserved in original form (not translated).
 */

import type { TranslationMap } from "./types";

export const mr: TranslationMap = {
  // Navigation
  "nav.home": "होम",
  "nav.explore": "एक्सप्लोर",
  "nav.timeline": "टाइमलाइन",
  "nav.assistant": "सहाय्यक",
  "nav.profile": "प्रोफाइल",
  "nav.section": "सिव्हिक इंटेलिजन्स",
  "nav.home.desc": "तुमचा वैयक्तिक डॅशबोर्ड",
  "nav.explore.desc": "योजना, सेवा आणि हक्क",
  "nav.timeline.desc": "मैलाचे दगड आणि मुदती",
  "nav.assistant.desc": "AI संवाद स्तर",
  "nav.profile.desc": "जीवन अवस्था आणि सेटिंग्ज",

  // Language selector
  "lang.select": "भाषा निवडा (Language)",
  "lang.en": "English",
  "lang.hi": "हिन्दी",
  "lang.mr": "मराठी",
  "lang.comingSoon": "लवकरच येणार",

  // Header
  "header.badge": "सिव्हिक इंटेलिजन्स",
  "header.notifications": "सूचना पहा",
  "header.profile.lifeStage": "तरुण प्रौढ",
  "header.profile.viewProfile": "प्रोफाइल आणि जीवन अवस्था पहा",
  "header.profile.opportunities": "मॅच झालेल्या संधी",
  "header.profile.privacy": "गोपनीयता आणि डेटा",
  "header.profile.help": "सिव्हिक मदत आणि सपोर्ट",

  // Sidebar
  "sidebar.civicIntelligence": "सिव्हिक इंटेलिजन्स",
  "sidebar.appearance": "थीम",
  "sidebar.officialData": "अधिकृत डेटा स्रोत",
  "sidebar.officialDataDesc": "शासकीय गॅझेटमधून सत्यापित",

  // Home
  "home.greeting": "नमस्ते",
  "home.subtitle": "तुमचा वैयक्तिक सिव्हिक इंटेलिजन्स डॅशबोर्ड",
  "home.profileBadge": "प्रोफाइल सक्रिय",
  "home.quickActions": "जलद क्रिया",
  "home.exploreSchemes": "योजना पहा",
  "home.askAssistant": "सहाय्यकाला विचारा",
  "home.viewTimeline": "टाइमलाइन पहा",
  "home.recommended": "तुमच्यासाठी सुचवलेले",
  "home.upcoming": "आगामी मैलाचे दगड",
  "home.noProfile": "प्रोफाइल नाही",

  // Explore
  "explore.title": "एक्सप्लोर",
  "explore.description": "सत्यापित सरकारी योजना, सेवा आणि हक्क शोधा",
  "explore.search.placeholder": "योजना, सेवा, हक्क शोधा...",
  "explore.filter.all": "सर्व",
  "explore.filter.verified": "फक्त सत्यापित",
  "explore.filter.sortBy": "क्रम लावा",
  "explore.filter.relevance": "प्रासंगिकता",
  "explore.filter.newest": "नवीनतम",
  "explore.filter.az": "A–Z",
  "explore.recommended": "तुमच्यासाठी सुचवलेले",
  "explore.allRecords": "सर्व रेकॉर्ड",
  "explore.noResults": "काहीही आढळले नाही",
  "explore.noResultsDesc": "शोध किंवा फिल्टर बदलून पहा",
  "explore.clearSearch": "शोध साफ करा",
  "explore.type.scheme": "योजना",
  "explore.type.service": "सेवा",
  "explore.type.right": "हक्क",
  "explore.type.benefit": "लाभ",
  "explore.type.career": "करिअर",
  "explore.type.skill": "कौशल्य",
  "explore.category.education": "शिक्षण",
  "explore.category.finance": "वित्त",
  "explore.category.health": "आरोग्य",
  "explore.category.agriculture": "शेती",
  "explore.category.services": "सेवा",
  "explore.category.rights": "हक्क",
  "explore.category.career": "करिअर",
  "explore.category.housing": "निवास",
  "explore.category.pension": "निवृत्तीवेतन",
  "explore.category.women": "महिला",
  "explore.category.disability": "दिव्यांग",

  // Knowledge card
  "card.whyShowing": "हे का दाखवत आहोत",
  "card.eligibility.likely": "पात्र आहात",
  "card.eligibility.partial": "आंशिक जुळणी",
  "card.eligibility.unknown": "पात्रता तपासा",
  "card.eligibility.notYet": "अजून पात्र नाही",
  "card.eligibility.notEligible": "पात्र नाही",
  "card.verified": "सत्यापित स्रोत",
  "card.requiresReview": "सत्यापन आवश्यक",
  "card.viewDetails": "तपशील पहा",
  "card.officialSource": "अधिकृत स्रोत",
  "card.matchScore": "जुळणी",

  // Assistant
  "assistant.greeting": "नमस्ते। मी वयम् आहे।",
  "assistant.subtitle": "मी तुम्हाला योजना, हक्क, सेवा आणि संधी शोधण्यास मदत करू शकतो.",
  "assistant.suggestedLabel": "काही सुचवण्या:",
  "assistant.inputPlaceholder": "वयम्ला विचारा — शिष्यवृत्ती, सेवा, 18 नंतर काय, हक्क...",
  "assistant.send": "पाठवा",
  "assistant.clearChat": "चॅट साफ करा",
  "assistant.toolStatus.checking": "वयम् नॉलेज रिपॉझिटरी तपासत आहे...",
  "assistant.toolStatus.evaluating": "सिव्हिक इंटेलिजन्स कोरमधून माहिती घेत आहे...",
  "assistant.toolStatus.default": "वयम् नॉलेज कोरमधून माहिती घेत आहे...",
  "assistant.source": "स्रोत:",
  "assistant.verified": "सत्यापित",
  "assistant.opportunities": "सत्यापित संधी",
  "assistant.voiceToggle": "आवाजात उत्तर",
  "assistant.voiceOn": "आवाज चालू",
  "assistant.voiceOff": "आवाज बंद",
  "assistant.startVoice": "आवाजाने विचारा",
  "assistant.stopVoice": "आवाज थांबवा",
  "assistant.stopSpeaking": "बोलणे थांबवा",
  "assistant.voiceListening": "ऐकत आहे...",
  "assistant.voiceProcessing": "समजत आहे...",
  "assistant.voiceSpeaking": "बोलत आहे...",
  "assistant.voiceError": "आवाज इनपुट झाला नाही. कृपया टाइप करा.",
  "assistant.voiceUnsupported": "या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही. तुम्ही टाइप करून विचारू शकता.",
  "assistant.context": "संदर्भ:",
  "assistant.noProfile": "प्रोफाइल नाही (येथे क्लिक करा)",
  "assistant.suggestedPrompts.0": "माझ्यासाठी कोणत्या योजना आहेत?",
  "assistant.suggestedPrompts.1": "मी लवकरच 18 वर्षांचा होणार, मला काय करायला हवं?",
  "assistant.suggestedPrompts.2": "उच्च शिक्षणासाठी शिष्यवृत्ती शोधा",
  "assistant.suggestedPrompts.3": "12वी नंतर काय करावे?",
  "assistant.suggestedPrompts.4": "माझे नागरिक हक्क काय आहेत?",
  "assistant.suggestedPrompts.5": "मला कर्ज मिळू शकते का?",
  "assistant.clarify": "तुम्हाला कोणत्या प्रकारची मदत किंवा योजना हवी आहे? खाली पर्याय निवडा:",
  "assistant.exploreCategory": "कॅटेगरी पहा",
  "assistant.openSource": "अधिकृत स्रोत उघडा",
  "assistant.exploreAll": "सर्व रेकॉर्ड पहा",
  "assistant.disclaimer": "वयम् AI सत्यापित सरकारी स्रोत आणि नियम-आधारित मूल्यमापन वापरतो.",

  // AI responses
  "ai.clarify": "तुम्हाला कोणत्या प्रकारची मदत किंवा योजना हवी आहे? खाली निवडा:",
  "ai.milestones": "तुमच्या वयानुसार आगामी नागरिक मैलाचे दगड:",
  "ai.education": "तुमच्या प्रोफाइलनुसार या शिक्षण योजना आणि शिष्यवृत्ती उपलब्ध आहेत:",
  "ai.rights": "तुमच्या कायदेशीर हक्क आणि नागरिक सेवांची अधिकृत माहिती:",
  "ai.unknown": "वयम्मध्ये या विषयाची सत्यापित माहिती आढळली नाही. एक्सप्लोरमध्ये पहा किंवा अधिकृत सरकारी पोर्टलवर जा:",
  "ai.default": "वयम्च्या सत्यापित नॉलेज रिपॉझिटरी आणि सिव्हिक इंटेलिजन्स कोरनुसार:",
  "ai.eligibleFor": "तुमच्या प्रोफाइलनुसार तुम्ही यासाठी पात्र असू शकता:",
  "ai.missingInfo": "पात्रता निश्चित करण्यासाठी काही माहिती नाही:",
  "ai.notEligible": "सध्याच्या नियमांनुसार, तुम्ही अजून यासाठी पात्र नाही:",

  // Verification
  "verification.verified": "सत्यापित स्रोत",
  "verification.requiresReview": "सत्यापन आवश्यक",
  "verification.official": "अधिकृत सरकारी स्रोत",
  "verification.lastVerified": "शेवटचे सत्यापन",

  // Eligibility
  "eligibility.likely": "पात्र आहात",
  "eligibility.partial": "आंशिक जुळणी",
  "eligibility.unknown": "पात्रता तपासा",
  "eligibility.notYet": "अजून पात्र नाही",
  "eligibility.notEligible": "पात्र नाही",

  // Milestones
  "milestone.upcoming": "आगामी",
  "milestone.active": "सक्रिय",
  "milestone.past": "मागील",

  // Common
  "common.loading": "लोड होत आहे...",
  "common.error": "काहीतरी चूक झाली",
  "common.retry": "पुन्हा प्रयत्न करा",
  "common.close": "बंद करा",
  "common.viewAll": "सर्व पहा",
  "common.learnMore": "अधिक जाणून घ्या",
  "common.new": "नवीन",
};
