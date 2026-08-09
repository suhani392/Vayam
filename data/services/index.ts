/**
 * data/services/index.ts
 *
 * Data access layer for government services (Aadhaar, PAN, voter ID, etc.).
 * To be populated in future phases with data from official sources.
 */

import type { GovernmentService } from "@/types/schemes";

export function getAllServices(): GovernmentService[] {
  return SERVICE_REGISTRY;
}

export function getServiceById(id: string): GovernmentService | undefined {
  return SERVICE_REGISTRY.find((s) => s.id === id);
}

const SERVICE_REGISTRY: GovernmentService[] = [
  // Services will be added in future phases.
];
