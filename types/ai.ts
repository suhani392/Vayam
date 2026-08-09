/**
 * Types for the Vayam AI abstraction layer.
 *
 * These types define the interface between Vayam and any underlying
 * AI provider (Sarvam, Groq, or future providers).
 *
 * Architectural constraint: AI types must NOT bleed into civic or
 * data layer types.  The AI layer receives inputs and produces
 * natural-language outputs — it never mutates UserProfile or computes
 * eligibility.
 */

import type { UserProfileSnapshot } from "./user";

// ---------------------------------------------------------------------------
// Provider abstraction
// ---------------------------------------------------------------------------

export type AIProvider = "sarvam" | "groq" | "mock";

export interface AIProviderConfig {
  provider: AIProvider;
  /** Model identifier specific to the provider */
  model: string;
  /** Provider API base URL (loaded from environment, never hardcoded) */
  baseUrl: string;
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Assistant request / response
// ---------------------------------------------------------------------------

/**
 * What the Vayam assistant receives when answering a user question.
 * Context is assembled by the Civic Intelligence layer — the AI layer
 * only handles the natural-language surface.
 */
export interface AssistantRequest {
  messages: ChatMessage[];
  /** Contextual information the assistant may use to ground its response */
  context?: AssistantContext;
}

/**
 * Structured context passed to the AI assistant.
 * This is a read-only window into the user's civic situation.
 */
export interface AssistantContext {
  userSnapshot: UserProfileSnapshot;
  /** IDs of schemes currently shown to the user */
  activeSchemeIds?: string[];
  /** Any specific scheme or topic the user is asking about */
  focusSchemeId?: string;
  /** Current UI language */
  language: string;
}

export interface AssistantResponse {
  message: ChatMessage;
  /** Whether the response was streamed */
  isStreamed: boolean;
}

// ---------------------------------------------------------------------------
// Translation
// ---------------------------------------------------------------------------

export interface TranslationRequest {
  text: string;
  sourceLang: string; // BCP-47
  targetLang: string; // BCP-47
}

export interface TranslationResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

// ---------------------------------------------------------------------------
// Voice (future)
// ---------------------------------------------------------------------------

export interface VoiceInputResult {
  transcript: string;
  confidence: number;
  language: string;
}

export interface VoiceOutputRequest {
  text: string;
  language: string;
  voiceId?: string;
}
