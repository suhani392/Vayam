/**
 * lib/voice/types.ts
 *
 * Voice provider abstractions and state machine types for Vayam Phase 9.
 * Allows future replacement of browser APIs with external providers (e.g. Deepgram).
 */

import type { LanguageCode } from "@/lib/i18n/types";

/** Voice state machine */
export type VoiceState = "IDLE" | "LISTENING" | "PROCESSING" | "SPEAKING" | "ERROR" | "UNSUPPORTED";

/** Speech-to-text provider interface */
export interface SpeechToTextProvider {
  readonly name: string;
  readonly isSupported: boolean;
  /** Starts listening and returns a transcript promise */
  transcribe(lang: LanguageCode): Promise<string>;
  /** Stops any active recognition session */
  stop(): void;
}

/** Text-to-speech provider interface */
export interface TextToSpeechProvider {
  readonly name: string;
  readonly isSupported: boolean;
  /** Speak the given text in the given language */
  speak(text: string, lang: LanguageCode): void;
  /** Stop any active speech immediately */
  stop(): void;
  /** Returns true if TTS is currently speaking */
  isSpeaking(): boolean;
}

/** Locale mapping from LanguageCode to BCP-47 voice locale */
export const VOICE_LOCALE_MAP: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};
