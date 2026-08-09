/**
 * hooks/useLifeStage.ts
 *
 * React hook that derives a user's LifeStageContext from their date of birth.
 *
 * This is a thin bridge between the React component tree and the
 * Civic Intelligence layer (lib/civic/).  The hook itself contains no logic —
 * it delegates entirely to buildLifeStageContext().
 */

"use client";

import { useMemo } from "react";
import { buildLifeStageContext } from "@/lib/civic";
import type { LifeStageContext } from "@/types/civic";

/**
 * Given a dateOfBirth (ISO 8601 "YYYY-MM-DD"), returns the user's
 * current LifeStageContext.  Memoised so it only recalculates when
 * the dateOfBirth changes.
 */
export function useLifeStage(dateOfBirth: string): LifeStageContext {
  return useMemo(() => buildLifeStageContext(dateOfBirth), [dateOfBirth]);
}
