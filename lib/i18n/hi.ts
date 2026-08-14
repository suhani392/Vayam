/**
 * lib/i18n/hi.ts
 *
 * Hindi (hi) translations for Vayam.
 * Language style: natural, conversational Hindi. Not overly Sanskritized.
 * Government scheme names preserved in original form (not translated).
 */

import type { TranslationMap } from "./types";

export const hi: TranslationMap = {
  // Navigation
  "nav.home": "होम",
  "nav.explore": "योजनाएं एक्सप्लोर करें",
  "nav.education": "शिक्षा मार्ग",
  "nav.rights": "अपने अधिकार जानें",
  "nav.timeline": "सिविक टाइमलाइन",
  "nav.assistant": "वयम् सहायक",
  "nav.profile": "प्रोफ़ाइल",
  "nav.section": "सिविक इंटेलिजेंस",
  "nav.lifestyle": "लाइफस्टाइल प्लानर",
  "nav.lifestyle.desc": "संपत्ति सामर्थ्य और ऋण कैलकुलेटर",
  "common.upcoming": "आगामी",
  "nav.home.desc": "आपका पर्सनलाइज्ड डैशबोर्ड",
  "nav.explore.desc": "योजनाएं, सेवाएं और अधिकार",
  "nav.education.desc": "करियर पथ और शिक्षा मार्ग",
  "nav.rights.desc": "कानूनी अधिकार और स्थिति मार्गदर्शिका",
  "nav.timeline.desc": "मील के पत्थर और समयसीमाएं",
  "nav.assistant.desc": "AI इंटरेक्शन लेयर",
  "nav.profile.desc": "जीवन अवस्था और सेटिंग्स",

  // Language selector
  "lang.select": "भाषा चुनें (Language)",
  "lang.en": "English",
  "lang.hi": "हिन्दी",
  "lang.mr": "मराठी",
  "lang.comingSoon": "जल्द आएगा",

  // Header
  "header.badge": "सिविक इंटेलिजेंस",
  "header.notifications": "नोटिफिकेशन देखें",
  "header.profile.lifeStage": "युवा वयस्क",
  "header.profile.viewProfile": "प्रोफ़ाइल और जीवन अवस्था देखें",
  "header.profile.opportunities": "मैच्ड अवसर",
  "header.profile.privacy": "प्राइवेसी और डेटा",
  "header.profile.help": "सिविक हेल्प और सपोर्ट",

  // Sidebar
  "sidebar.civicIntelligence": "सिविक इंटेलिजेंस",
  "sidebar.appearance": "थीम",
  "sidebar.officialData": "ऑफिशियल डेटा स्रोत",
  "sidebar.officialDataDesc": "सरकारी गजट से सत्यापित",

  // Home
  "home.greeting": "नमस्ते",
  "home.subtitle": "आपका पर्सनलाइज्ड सिविक इंटेलिजेंस डैशबोर्ड",
  "home.profileBadge": "प्रोफ़ाइल सक्रिय",
  "home.quickActions": "त्वरित कार्रवाई",
  "home.exploreSchemes": "योजनाएं देखें",
  "home.askAssistant": "सहायक से पूछें",
  "home.viewTimeline": "टाइमलाइन देखें",
  "home.recommended": "आपके लिए सुझाई गई",
  "home.upcoming": "आगामी मील के पत्थर",
  "home.noProfile": "प्रोफ़ाइल नहीं है",

  // Explore
  "explore.title": "एक्सप्लोर",
  "explore.description": "सरकारी योजनाएं, सेवाएं और अधिकार खोजें",
  "explore.search.placeholder": "योजनाएं, सेवाएं, अधिकार खोजें...",
  "explore.filter.all": "सभी",
  "explore.filter.verified": "केवल सत्यापित",
  "explore.filter.sortBy": "क्रमबद्ध करें",
  "explore.filter.relevance": "प्रासंगिकता",
  "explore.filter.newest": "नवीनतम",
  "explore.filter.az": "A–Z",
  "explore.recommended": "आपके लिए सुझाई गई",
  "explore.allRecords": "सभी रिकॉर्ड",
  "explore.noResults": "कोई परिणाम नहीं मिला",
  "explore.noResultsDesc": "अपनी खोज या फ़िल्टर बदलकर देखें",
  "explore.clearSearch": "खोज साफ़ करें",
  "explore.type.scheme": "योजना",
  "explore.type.service": "सेवा",
  "explore.type.right": "अधिकार",
  "explore.type.benefit": "लाभ",
  "explore.type.career": "करियर",
  "explore.type.skill": "कौशल",
  "explore.category.education": "शिक्षा",
  "explore.category.finance": "वित्त",
  "explore.category.health": "स्वास्थ्य",
  "explore.category.agriculture": "कृषि",
  "explore.category.services": "सेवाएं",
  "explore.category.rights": "अधिकार",
  "explore.category.career": "करियर",
  "explore.category.housing": "आवास",
  "explore.category.pension": "पेंशन",
  "explore.category.women": "महिला",
  "explore.category.disability": "दिव्यांग",

  // Knowledge card
  "card.whyShowing": "आपको यह क्यों दिख रहा है",
  "card.eligibility.likely": "पात्र हैं",
  "card.eligibility.partial": "आंशिक मिलान",
  "card.eligibility.unknown": "पात्रता जांचें",
  "card.eligibility.notYet": "अभी पात्र नहीं",
  "card.eligibility.notEligible": "पात्र नहीं",
  "card.verified": "सत्यापित स्रोत",
  "card.requiresReview": "सत्यापन जरूरी",
  "card.viewDetails": "विवरण देखें",
  "card.officialSource": "आधिकारिक स्रोत",
  "card.matchScore": "मिलान",

  // Assistant
  "assistant.greeting": "नमस्ते। मैं वयम् हूं।",
  "assistant.subtitle": "मैं आपकी मदद कर सकता हूं — योजनाएं, अधिकार, सेवाएं और अवसर खोजने में।",
  "assistant.suggestedLabel": "कुछ सुझाव:",
  "assistant.inputPlaceholder": "वयम् से पूछें — छात्रवृत्ति, सेवाएं, 18 साल के बाद, अधिकार...",
  "assistant.send": "भेजें",
  "assistant.clearChat": "चैट साफ़ करें",
  "assistant.toolStatus.checking": "वयम् नॉलेज रिपॉज़िटरी जांच रहे हैं...",
  "assistant.toolStatus.evaluating": "सिविक इंटेलिजेंस कोर से जानकारी ले रहे हैं...",
  "assistant.toolStatus.default": "वयम् नॉलेज कोर से जानकारी ले रहे हैं...",
  "assistant.source": "स्रोत:",
  "assistant.verified": "सत्यापित",
  "assistant.opportunities": "सत्यापित अवसर",
  "assistant.voiceToggle": "आवाज़ से जवाब",
  "assistant.voiceOn": "आवाज़ चालू",
  "assistant.voiceOff": "आवाज़ बंद",
  "assistant.startVoice": "आवाज़ से पूछें",
  "assistant.stopVoice": "आवाज़ बंद करें",
  "assistant.stopSpeaking": "बोलना बंद करें",
  "assistant.voiceListening": "सुन रहे हैं...",
  "assistant.voiceProcessing": "समझ रहे हैं...",
  "assistant.voiceSpeaking": "बोल रहे हैं...",
  "assistant.voiceError": "आवाज़ इनपुट नहीं हुई। कृपया टाइप करें।",
  "assistant.voiceUnsupported": "इस ब्राउज़र में वॉयस इनपुट उपलब्ध नहीं है। आप टाइप करके पूछ सकते हैं।",
  "assistant.context": "संदर्भ:",
  "assistant.noProfile": "कोई प्रोफ़ाइल नहीं (यहां क्लिक करें)",
  "assistant.suggestedPrompts.0": "मेरे लिए कौन सी योजनाएं हैं?",
  "assistant.suggestedPrompts.1": "मैं जल्द 18 का हो जाऊंगा, मुझे क्या करना चाहिए?",
  "assistant.suggestedPrompts.2": "उच्च शिक्षा के लिए छात्रवृत्ति खोजें",
  "assistant.suggestedPrompts.3": "12वीं के बाद क्या करूं?",
  "assistant.suggestedPrompts.4": "मेरे क्या अधिकार हैं?",
  "assistant.suggestedPrompts.5": "क्या मुझे लोन मिल सकता है?",
  "assistant.clarify": "आप किस तरह की सहायता या योजना के बारे में जानना चाहते हैं? नीचे विकल्प चुनें:",
  "assistant.exploreCategory": "कैटेगरी देखें",
  "assistant.openSource": "आधिकारिक स्रोत खोलें",
  "assistant.exploreAll": "सभी रिकॉर्ड देखें",
  "assistant.disclaimer": "वयम् AI सत्यापित सरकारी स्रोतों और नियम-आधारित मूल्यांकन का उपयोग करता है।",

  // AI responses
  "ai.clarify": "आप किस तरह की सहायता या योजना ढूंढ रहे हैं? नीचे से चुनें:",
  "ai.milestones": "आपकी उम्र और जीवन अवस्था के अनुसार आगामी नागरिक मील के पत्थर:",
  "ai.education": "आपकी प्रोफ़ाइल के अनुसार ये शिक्षा योजनाएं और छात्रवृत्तियां उपलब्ध हैं:",
  "ai.rights": "आपके कानूनी अधिकारों और नागरिक सेवाओं की आधिकारिक जानकारी:",
  "ai.unknown": "वयम् में इस विषय पर सत्यापित जानकारी नहीं मिली। एक्सप्लोर में देखें या आधिकारिक सरकारी पोर्टल पर जाएं:",
  "ai.default": "वयम् के सत्यापित नॉलेज रिपॉज़िटरी और सिविक इंटेलिजेंस कोर के आधार पर:",
  "ai.eligibleFor": "आपकी प्रोफ़ाइल के अनुसार आप इसके लिए पात्र हो सकते हैं:",
  "ai.missingInfo": "पात्रता पक्की करने के लिए कुछ जानकारी नहीं है:",
  "ai.notEligible": "वर्तमान नियमों के अनुसार, आप अभी इसके लिए पात्र नहीं हैं:",

  // Verification
  "verification.verified": "सत्यापित स्रोत",
  "verification.requiresReview": "सत्यापन जरूरी",
  "verification.official": "आधिकारिक सरकारी स्रोत",
  "verification.lastVerified": "अंतिम सत्यापन",

  // Eligibility
  "eligibility.likely": "पात्र हैं",
  "eligibility.partial": "आंशिक मिलान",
  "eligibility.unknown": "पात्रता जांचें",
  "eligibility.notYet": "अभी पात्र नहीं",
  "eligibility.notEligible": "पात्र नहीं",

  // Milestones
  "milestone.upcoming": "आगामी",
  "milestone.active": "सक्रिय",
  "milestone.past": "पिछला",

  // Common
  "common.loading": "लोड हो रहा है...",
  "common.error": "कुछ गलत हुआ",
  "common.retry": "फिर कोशिश करें",
  "common.close": "बंद करें",
  "common.viewAll": "सब देखें",
  "common.learnMore": "और जानें",
  "common.new": "नया",
};
