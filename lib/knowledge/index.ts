/**
 * lib/knowledge/index.ts
 *
 * Centralized Barrel Export for Vayam Phase 6A Knowledge Layer.
 * Exposes KnowledgeRecord types, KnowledgeSource schemas, KnowledgeRepository,
 * and canonical conversion adapters.
 */

export * from "./types";
export * from "./records";
export * from "./adapter";
export * from "./repository";
export * from "./source/types";
export * from "./source/validator";
export * from "./source/report";
export * from "./search";
