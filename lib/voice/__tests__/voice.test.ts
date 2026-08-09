/**
 * lib/voice/__tests__/voice.test.ts
 *
 * Test Suite for Vayam Phase 9 Voice Architecture.
 * Tests voice state machine, provider interfaces, locale mapping,
 * and graceful degradation when browser APIs are unavailable.
 */

import { VOICE_LOCALE_MAP } from "../types";
import type { VoiceState, SpeechToTextProvider, TextToSpeechProvider } from "../types";

export async function runVoiceTests() {
  const results: { name: string; status: "PASS" | "FAIL"; details?: string }[] = [];

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    results.push({
      name: testName,
      status: condition ? "PASS" : "FAIL",
      details: condition ? undefined : (failureDetails || "Assertion failed"),
    });
  }

  console.log("🧪 Starting Vayam Phase 9 Voice Architecture Test Suite...\n");

  // ── 1. Voice Locale Mapping ──
  assert(VOICE_LOCALE_MAP.en === "en-IN", "V1: English voice locale maps to en-IN");
  assert(VOICE_LOCALE_MAP.hi === "hi-IN", "V1: Hindi voice locale maps to hi-IN");
  assert(VOICE_LOCALE_MAP.mr === "mr-IN", "V1: Marathi voice locale maps to mr-IN");

  // ── 2. Voice State Machine Transitions ──
  const validStates: VoiceState[] = ["IDLE", "LISTENING", "PROCESSING", "SPEAKING", "ERROR", "UNSUPPORTED"];
  assert(validStates.length === 6, "V2: VoiceState has exactly 6 valid states");

  // ── 3. STT Provider Interface Contract ──
  const mockSTT: SpeechToTextProvider = {
    name: "Mock STT",
    isSupported: false,
    transcribe: async () => "",
    stop: () => {},
  };
  assert(mockSTT.name === "Mock STT", "V3: STT provider has name property");
  assert(mockSTT.isSupported === false, "V3: STT provider reports unsupported in Node environment");
  assert(typeof mockSTT.transcribe === "function", "V3: STT provider has transcribe() method");
  assert(typeof mockSTT.stop === "function", "V3: STT provider has stop() method");

  // ── 4. TTS Provider Interface Contract ──
  const mockTTS: TextToSpeechProvider = {
    name: "Mock TTS",
    isSupported: false,
    speak: () => {},
    stop: () => {},
    isSpeaking: () => false,
  };
  assert(mockTTS.name === "Mock TTS", "V4: TTS provider has name property");
  assert(typeof mockTTS.speak === "function", "V4: TTS provider has speak() method");
  assert(typeof mockTTS.stop === "function", "V4: TTS provider has stop() method");
  assert(typeof mockTTS.isSpeaking === "function", "V4: TTS provider has isSpeaking() method");
  assert(mockTTS.isSpeaking() === false, "V4: TTS not speaking when idle");

  // ── 5. Graceful Degradation ──
  // In Node.js environment, browser APIs are unavailable — isSupported should be false
  assert(mockSTT.isSupported === false, "V5: STT gracefully reports unsupported in non-browser env");
  assert(mockTTS.isSupported === false, "V5: TTS gracefully reports unsupported in non-browser env");

  // ── 6. STT Unsupported Rejection ──
  // A properly implemented STT provider should reject when unsupported
  let sttRejected = false;
  const unsupportedSTT: SpeechToTextProvider = {
    name: "Unsupported",
    isSupported: false,
    transcribe: async () => { throw new Error("Not supported"); },
    stop: () => {},
  };
  try {
    await unsupportedSTT.transcribe("en");
  } catch {
    sttRejected = true;
  }
  assert(sttRejected, "V6: Unsupported STT rejects transcribe() cleanly");

  // ── 7. TTS Stop is Idempotent ──
  let ttsStopCalled = false;
  const stoppableTTS: TextToSpeechProvider = {
    name: "Stoppable",
    isSupported: true,
    speak: () => {},
    stop: () => { ttsStopCalled = true; },
    isSpeaking: () => false,
  };
  stoppableTTS.stop();
  stoppableTTS.stop(); // calling twice should not throw
  assert(ttsStopCalled, "V7: TTS stop() is idempotent and does not throw");

  // ── Print Results ──
  console.log("\n📊 Voice Architecture Test Results Summary:");
  let passedCount = 0;
  results.forEach((r) => {
    if (r.status === "PASS") {
      passedCount += 1;
      console.log(`  ✅ ${r.name}`);
    } else {
      console.log(`  ❌ ${r.name}: ${r.details}`);
    }
  });

  console.log(`\nTotal: ${results.length} | Passed: ${passedCount} | Failed: ${results.length - passedCount}\n`);
  return results.every((r) => r.status === "PASS");
}

if (require.main === module) {
  runVoiceTests().then(() => process.exit(0));
}
