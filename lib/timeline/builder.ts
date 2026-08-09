/**
 * lib/timeline/builder.ts
 *
 * Timeline event construction.
 *
 * The timeline engine converts scheme deadlines, application windows,
 * and life events into structured TimelineEvent objects sorted by date.
 *
 * Pure, deterministic — no AI involved.
 */

import type { GovernmentScheme } from "@/types/schemes";
import type { TimelineEvent } from "@/types/civic";

let _idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}-${++_idCounter}-${Date.now()}`;
}

/**
 * Extract upcoming TimelineEvents from a list of schemes.
 *
 * Only schemes with an applicationDeadline that hasn't passed are included.
 */
export function buildSchemeTimeline(
  schemes: GovernmentScheme[],
  referenceDate: Date = new Date()
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const scheme of schemes) {
    if (!scheme.applicationDeadline) continue;

    const deadline = new Date(scheme.applicationDeadline);
    if (deadline <= referenceDate) continue; // Already passed

    events.push({
      id: generateId("timeline-scheme"),
      title: `Apply: ${scheme.name}`,
      description: `Application deadline for ${scheme.name}. ${scheme.benefitSummary}`,
      category: "deadline",
      date: scheme.applicationDeadline,
      schemeId: scheme.id,
      isRecurring: false,
      requiresAction: true,
    });
  }

  // Sort ascending by date
  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Filter timeline events to those falling within a date range.
 */
export function filterTimelineByRange(
  events: TimelineEvent[],
  from: Date,
  to: Date
): TimelineEvent[] {
  return events.filter((e) => {
    const d = new Date(e.date);
    return d >= from && d <= to;
  });
}
