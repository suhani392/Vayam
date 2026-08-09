/**
 * lib/core/index.ts
 *
 * Centralized Barrel Export for Vayam Core Civic Intelligence Layer.
 * Exposes age calculations, life-stage determination, milestone generation, rule engine,
 * eligibility engine, relevance scoring, and recommendation ranking.
 * Zero AI dependencies.
 */

export * from "./types";
export * from "./profile/normalization";
export * from "./age";
export * from "./lifestage";
export * from "./milestones";
export * from "./rules/evaluator";
export * from "./eligibility";
export * from "./relevance";
export * from "./recommendations";
export * from "./civic-state";
export * from "./data/demo-items";
export * from "./data/test-profiles";
