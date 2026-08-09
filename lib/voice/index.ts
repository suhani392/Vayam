/**
 * lib/voice/index.ts
 *
 * Voice provider factory for Vayam Phase 9.
 * Returns browser-based STT/TTS providers as default.
 * Future phases can swap in external providers (Deepgram, Google Cloud Speech, etc.)
 */

import { BrowserSpeechToText } from "./browser-stt";
import { BrowserTextToSpeech } from "./browser-tts";
import type { SpeechToTextProvider, TextToSpeechProvider } from "./types";

export type { SpeechToTextProvider, TextToSpeechProvider, VoiceState } from "./types";
export { VOICE_LOCALE_MAP } from "./types";

let sttInstance: SpeechToTextProvider | null = null;
let ttsInstance: TextToSpeechProvider | null = null;

export function getSTTProvider(): SpeechToTextProvider {
  if (!sttInstance) {
    sttInstance = new BrowserSpeechToText();
  }
  return sttInstance;
}

export function getTTSProvider(): TextToSpeechProvider {
  if (!ttsInstance) {
    ttsInstance = new BrowserTextToSpeech();
  }
  return ttsInstance;
}
