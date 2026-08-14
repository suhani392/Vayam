/**
 * lib/voice/browser-tts.ts
 *
 * Browser Text-to-Speech provider using Web Speech Synthesis API.
 * Works in Chrome, Edge, Safari, and Firefox.
 * Supports Indian language locales (en-IN, hi-IN, mr-IN).
 * No external API keys required.
 */

import type { TextToSpeechProvider } from "./types";
import { VOICE_LOCALE_MAP } from "./types";
import type { LanguageCode } from "@/lib/i18n/types";

export class BrowserTextToSpeech implements TextToSpeechProvider {
  readonly name = "Browser Web Speech Synthesis";

  get isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!window.speechSynthesis;
  }

  speak(text: string, lang: LanguageCode): void {
    if (!this.isSupported) return;

    // Stop any current speech before starting new
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = VOICE_LOCALE_MAP[lang] || "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.05; // Slightly clear and feminine pitch tuning

    // Prioritize female voices across OS and browser vendors
    const femaleKeywords = [
      "female", "heera", "zira", "samantha", "siri", "lekha", "veena",
      "swara", "ananya", "shruti", "aditi", "google hindi", "google english (india)",
      "microsoft heera", "microsoft zira", "natural female", "woman"
    ];

    const voices = window.speechSynthesis.getVoices();
    const locale = VOICE_LOCALE_MAP[lang] || "en-IN";

    // 1. Female voice in matching locale / language
    let selectedVoice = voices.find((v) =>
      (v.lang === locale || v.lang.startsWith(lang)) &&
      femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
    );

    // 2. Any Indian female voice (hi-IN, en-IN, mr-IN)
    if (!selectedVoice) {
      selectedVoice = voices.find((v) =>
        (v.lang.startsWith("en-IN") || v.lang.startsWith("hi") || v.lang.startsWith("mr")) &&
        femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
    }

    // 3. Any installed female voice on the system
    if (!selectedVoice) {
      selectedVoice = voices.find((v) =>
        femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
    }

    // 4. Fallback to locale matching voice
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang === locale) || voices.find((v) => v.lang.startsWith(lang));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    if (!this.isSupported) return;
    window.speechSynthesis.cancel();
  }

  isSpeaking(): boolean {
    if (!this.isSupported) return false;
    return window.speechSynthesis.speaking;
  }
}
