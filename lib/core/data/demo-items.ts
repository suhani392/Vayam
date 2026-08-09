/**
 * lib/core/data/demo-items.ts
 *
 * Vayam Phase 6A Decoupled Knowledge Feed.
 * Consumes canonical normalized records from KnowledgeRepository
 * and exposes them as Phase 5 CivicItems for backward-compatible engine evaluation.
 */

import type { CivicItem } from "../types";
import { getKnowledgeRecordsAsCivicItems } from "../../knowledge";

export const DEMO_CIVIC_ITEMS: CivicItem[] = getKnowledgeRecordsAsCivicItems();
