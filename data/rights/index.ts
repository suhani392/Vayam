/**
 * data/rights/index.ts
 *
 * Data access layer for fundamental rights and legal entitlements.
 * (e.g. Right to Education, Right to Information)
 */

import type { Right } from "@/types/schemes";

export function getAllRights(): Right[] {
  return RIGHTS_REGISTRY;
}

export function getRightById(id: string): Right | undefined {
  return RIGHTS_REGISTRY.find((r) => r.id === id);
}

const RIGHTS_REGISTRY: Right[] = [
  // Rights will be added in future phases.
];
