/**
 * lib/notifications/index.ts
 *
 * Lightweight Notification & Smart Reminder Engine for Vayam Phase 10.
 * Generates structured, deterministic in-app notifications from citizen profile,
 * life events, and eligibility missing fields.
 *
 * Zero background servers. Zero privacy leaks. Local storage preferences.
 */

import type { UserProfile } from "@/lib/core/types";
import { deriveLifeEvents } from "@/lib/timeline/events";
import { getPersonalizedCivicState } from "@/lib/core/civic-state";
import { t } from "@/lib/i18n";
import type { LanguageCode } from "@/lib/i18n/types";

export type NotificationPriority = "HIGH" | "MEDIUM" | "LOW";

export interface CivicNotification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  targetUrl: string;
  category: string;
}

export interface ReminderPreferences {
  enabled: boolean;
  mode: "important_only" | "all";
}

const STORAGE_PREFS_KEY = "vayam_reminders";
const DEFAULT_PREFS: ReminderPreferences = {
  enabled: true,
  mode: "important_only",
};

/**
 * Reads local reminder preferences from localStorage.
 */
export function getReminderPreferences(): ReminderPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_PREFS;
}

/**
 * Saves reminder preferences to localStorage.
 */
export function saveReminderPreferences(prefs: ReminderPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

/**
 * Generates proactive, deterministic notifications for a citizen profile.
 */
export function generateCivicNotifications(
  profile: UserProfile | null,
  language: LanguageCode = "en"
): CivicNotification[] {
  if (!profile) return [];

  const notifications: CivicNotification[] = [];
  const events = deriveLifeEvents(profile);
  const nowIso = new Date().toISOString();

  // 1. Time-sensitive Life Event Notifications (HIGH priority)
  events.forEach((evt) => {
    if (evt.isToday) {
      notifications.push({
        id: `notif-${evt.id}-today`,
        title: evt.title,
        message: evt.description,
        priority: "HIGH",
        timestamp: nowIso,
        read: false,
        targetUrl: evt.actionUrl || "/timeline",
        category: evt.category,
      });
    } else if (evt.status === "UPCOMING" && evt.daysUntil !== undefined && evt.daysUntil <= 30) {
      notifications.push({
        id: `notif-${evt.id}-upcoming`,
        title: evt.title,
        message: `${evt.title} is coming up in ${evt.daysUntil} days. Check what rights and services become available.`,
        priority: "HIGH",
        timestamp: nowIso,
        read: false,
        targetUrl: evt.actionUrl || "/timeline",
        category: evt.category,
      });
    }
  });

  // 2. Missing Profile Information Notifications (MEDIUM priority - privacy safe)
  if (profile.annualIncomeInr === undefined) {
    notifications.push({
      id: "notif-missing-income",
      title: language === "en" ? "Complete Profile Income" : language === "hi" ? "आय विवरण पूरा करें" : "उत्पन्न माहिती पूर्ण करा",
      message: language === "en"
        ? "Some scholarships and pension schemes require annual income verification to determine eligibility."
        : language === "hi"
        ? "पात्रता निर्धारित करने के लिए छात्रवृत्ति और पेंशन योजनाओं में वार्षिक आय सत्यापन आवश्यक है।"
        : "पात्रता ठरवण्यासाठी काही योजनांमध्ये वार्षिक उत्पन्न माहिती आवश्यक आहे.",
      priority: "MEDIUM",
      timestamp: nowIso,
      read: false,
      targetUrl: "/profile",
      category: "profile_verification",
    });
  }

  // 3. Current Recommended Opportunity (MEDIUM priority)
  const civicState = getPersonalizedCivicState(profile);
  if (civicState.recommendations.now.length > 0) {
    const topRec = civicState.recommendations.now[0];
    notifications.push({
      id: `notif-rec-${topRec.item.id}`,
      title: topRec.item.title,
      message: `${topRec.item.title} matches your profile (${Math.round(topRec.score * 100)}% match score).`,
      priority: "MEDIUM",
      timestamp: nowIso,
      read: false,
      targetUrl: `/explore/${topRec.item.id}`,
      category: topRec.item.category,
    });
  }

  return notifications;
}
