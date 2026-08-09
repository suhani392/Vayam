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
    utterance.pitch = 1.0;

    // Try to find a matching voice for the locale
    const voices = window.speechSynthesis.getVoices();
    const locale = VOICE_LOCALE_MAP[lang];
    const matchingVoice = voices.find((v) => v.lang === locale)
      || voices.find((v) => v.lang.startsWith(lang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
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
