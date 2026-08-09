/**
 * lib/ai/mock.ts
 *
 * Mock AI provider shim for backward compatibility.
 * The canonical provider abstraction is now in lib/ai/provider.ts.
 *
 * This file exists to satisfy any early imports; do not add new logic here.
 */

export { LocalDeterministicAIProvider as MockAIProvider } from "./provider";
