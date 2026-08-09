/**
 * config/index.ts — barrel export for all Vayam configuration.
 */
export * from "./app";
export * from "./flags";
// env.ts is intentionally NOT re-exported here because some of its
// exports (getSupabaseServerConfig, getAIServerConfig) are server-only.
// Import those directly from config/env.ts in server components / API routes.
