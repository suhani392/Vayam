"use client";

/**
 * components/notifications/notification-center.tsx
 *
 * Header Notification Center Dropdown for Vayam Phase 10.
 * Displays proactive, deterministic civic notifications with priority badges,
 * reminder preferences toggle, and privacy-safe message previews.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import {
  generateCivicNotifications,
  getReminderPreferences,
  saveReminderPreferences,
  type CivicNotification,
  type ReminderPreferences,
} from "@/lib/notifications";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { UserProfile } from "@/lib/core/types";
import { Dropdown } from "@/components/ui/dropdown";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function NotificationCenter() {
  const { lang, t } = useLanguage();
  const [notifications, setNotifications] = useState<CivicNotification[]>([]);
  const [prefs, setPrefs] = useState<ReminderPreferences>({ enabled: true, mode: "important_only" });
  const [showSettings, setShowSettings] = useState(false);

  const { profile, loaded } = useUserProfile();

  useEffect(() => {
    const activePrefs = getReminderPreferences();
    setPrefs(activePrefs);
    const notifs = generateCivicNotifications(loaded && profile ? (profile as UserProfile) : null, lang);

    // Filter by preference
    const filtered = notifs.filter((n) => {
      if (!activePrefs.enabled) return false;
      if (activePrefs.mode === "important_only") return n.priority === "HIGH" || n.priority === "MEDIUM";
      return true;
    });

    setNotifications(filtered);
  }, [lang, loaded, profile]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleEnabled = () => {
    const updated = { ...prefs, enabled: !prefs.enabled };
    setPrefs(updated);
    saveReminderPreferences(updated);
  };

  const handleToggleMode = (mode: "important_only" | "all") => {
    const updated = { ...prefs, mode };
    setPrefs(updated);
    saveReminderPreferences(updated);
  };

  return (
    <Dropdown
      align="right"
      trigger={
        <button
          type="button"
          aria-label={t("header.notifications")}
          className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-secondary border border-border-subtle transition-colors cursor-pointer"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background animate-pulse" />
          )}
        </button>
      }
    >
      <div className="w-80 sm:w-96 p-3 space-y-3">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-body-sm font-bold text-foreground">
              {lang === "en" ? "Civic Notifications" : lang === "hi" ? "नागरिक सूचनाएं" : "नागरीक सूचना"}
            </h4>
            {unreadCount > 0 && (
              <span className="badge badge-accent text-[10px]">{unreadCount} new</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-secondary cursor-pointer transition-colors"
              title="Reminder Preferences"
            >
              <SlidersHorizontal size={14} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-accent hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Reminder Settings Toggle Panel */}
        {showSettings && (
          <div className="p-2.5 rounded-xl bg-surface-secondary/70 border border-border-subtle space-y-2 text-caption">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Smart Reminders</span>
              <button
                onClick={handleToggleEnabled}
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase cursor-pointer transition-colors",
                  prefs.enabled ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {prefs.enabled ? "ON" : "OFF"}
              </button>
            </div>

            {prefs.enabled && (
              <div className="flex gap-2 pt-1 border-t border-border-subtle/50">
                <button
                  onClick={() => handleToggleMode("important_only")}
                  className={cn(
                    "flex-1 py-1 rounded-lg text-[10px] font-bold text-center border cursor-pointer transition-all",
                    prefs.mode === "important_only"
                      ? "bg-accent/15 border-accent text-accent"
                      : "border-border-subtle text-muted-foreground"
                  )}
                >
                  Important Only
                </button>
                <button
                  onClick={() => handleToggleMode("all")}
                  className={cn(
                    "flex-1 py-1 rounded-lg text-[10px] font-bold text-center border cursor-pointer transition-all",
                    prefs.mode === "all"
                      ? "bg-accent/15 border-accent text-accent"
                      : "border-border-subtle text-muted-foreground"
                  )}
                >
                  All Reminders
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-72 overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-caption">
              No new civic notifications.
            </div>
          ) : (
            notifications.map((notif) => (
              <Link
                key={notif.id}
                href={notif.targetUrl as any}
                className={cn(
                  "p-3 rounded-xl border flex items-start gap-3 transition-colors block text-left group",
                  notif.read ? "bg-card border-border-subtle opacity-70" : "bg-surface-secondary/80 border-accent/20 hover:border-accent/40"
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {notif.priority === "HIGH" ? (
                    <ShieldAlert size={16} className="text-accent" />
                  ) : notif.priority === "MEDIUM" ? (
                    <AlertTriangle size={16} className="text-warning" />
                  ) : (
                    <Info size={16} className="text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-body-sm font-bold text-foreground group-hover:text-accent truncate">
                      {notif.title}
                    </span>
                    <span className={cn(
                      "text-[9px] uppercase font-bold px-1.5 py-0.5 rounded",
                      notif.priority === "HIGH" ? "badge-saffron" : "badge-muted"
                    )}>
                      {notif.priority}
                    </span>
                  </div>
                  <p className="text-caption text-muted-foreground leading-snug line-clamp-2">
                    {notif.message}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Dropdown>
  );
}
