/**
 * Centralized type exports for Vayam.
 *
 * Import all public types from this barrel file so the rest of the
 * codebase never needs to know which sub-module a type lives in.
 *
 * Architectural rule: types describe the data shape — they must NOT
 * contain business logic.  Logic belongs in lib/civic/* or lib/eligibility/*.
 */

export * from "./civic";
export * from "./schemes";
export * from "./user";
export * from "./ai";
