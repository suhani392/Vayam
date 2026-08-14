/**
 * lib/voice/browser-stt.ts
 *
 * Browser Speech-to-Text provider using Web Speech API (SpeechRecognition).
 * Works in Chrome, Edge, and Safari. Graceful fallback if unavailable.
 * No external API keys required.
 */

import type { SpeechToTextProvider } from "./types";
import { VOICE_LOCALE_MAP } from "./types";
import type { LanguageCode } from "@/lib/i18n/types";

export class BrowserSpeechToText implements SpeechToTextProvider {
  readonly name = "Browser Web Speech API";
  private recognition: any = null;

  get isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  transcribe(lang: LanguageCode): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error("SpeechRecognition is not supported in this browser."));
        return;
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      this.recognition = new SpeechRecognition();
      // Optimal speech recognition locale: mr-IN for Marathi, hi-IN for Hindi/Indian dialects
      this.recognition.lang = lang === "mr" ? "mr-IN" : "hi-IN";
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.recognition.continuous = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || "";
        resolve(transcript.trim());
      };

      this.recognition.onerror = (event: any) => {
        const errorMsg =
          event.error === "not-allowed"
            ? "Microphone permission denied."
            : event.error === "no-speech"
            ? "No speech detected. Please try again."
            : `Speech recognition error: ${event.error}`;
        reject(new Error(errorMsg));
      };

      this.recognition.onnomatch = () => {
        reject(new Error("Speech not recognized. Please try again."));
      };

      this.recognition.onend = () => {
        // If resolved already, this is a no-op
      };

      try {
        this.recognition.start();
      } catch (err) {
        reject(new Error("Failed to start speech recognition."));
      }
    });
  }

  stop(): void {
    try {
      this.recognition?.stop();
    } catch {
      // ignore — may already be stopped
    }
    this.recognition = null;
  }
}
