/**
 * data/schemes/index.ts
 *
 * Data access layer for government schemes.
 *
 * In Phase 01, this returns an empty array — the registry will be
 * populated in a future phase with real scheme data derived from
 * official Indian government sources.
 *
 * Architectural note: all scheme data MUST carry SourceProvenance.
 * Do not add schemes without verifiable official sources.
 */

import type { GovernmentScheme } from "@/types/schemes";

/**
 * Returns all registered government schemes.
 *
 * In production this will query Supabase.  For now it returns
 * the in-memory registry, which starts empty.
 */
export function getAllSchemes(): GovernmentScheme[] {
  return SCHEME_REGISTRY;
}

/**
 * Find a scheme by its unique ID.
 */
export function getSchemeById(id: string): GovernmentScheme | undefined {
  return SCHEME_REGISTRY.find((s) => s.id === id);
}

/**
 * Central scheme registry.
 * Will be populated phase-by-phase with data from official sources.
 *
 * When adding schemes:
 * 1. Each scheme must have a populated `provenance` field.
 * 2. Verify the official URL before adding.
 * 3. Set `updatedAt` to the date you verified the data.
 */
const SCHEME_REGISTRY: GovernmentScheme[] = [
  // Schemes will be added in Phase 02 and beyond.
];
