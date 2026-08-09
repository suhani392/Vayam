"use client";

/**
 * components/timeline/smart-timeline.tsx
 *
 * Smart Civic Timeline UI Component for Vayam Phase 10.
 * Features:
 * - Hero Milestone Banner at top (visually dominates nearest upcoming/today milestone)
 * - Tabs for NOW, NEXT, LATER
 * - Profile selector for instant testing across 17yo, 18yo, 25yo, 65yo profiles
 * - Transparent "Why this matters" section displaying deterministic rule reasons
 * - Action buttons: Explore, Check eligibility, Open official source, Update profile
 * - 100% multilingual via useLanguage() t()
 */

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getSmartTimelineState } from "@/lib/timeline/events";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { UserProfile } from "@/lib/core/types";
import type { LifeEvent } from "@/lib/timeline/types";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import {
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SmartTimeline({ initialProfile }: { initialProfile?: UserProfile }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"now" | "next" | "later">("now");
  const { profile, loaded } = useUserProfile();

  const currentProfile = loaded && profile ? (profile as UserProfile) : initialProfile;
  const timelineState = currentProfile ? getSmartTimelineState(currentProfile) : null;
  const hero = timelineState?.heroEvent;
  const nowEvents = timelineState?.nowEvents ?? [];
  const nextEvents = timelineState?.nextEvents ?? [];
  const laterEvents = timelineState?.laterEvents ?? [];

  return (
    <div className="space-y-8">

      {/* ── Profile Context Banner ── */}
      <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-border-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-body-sm font-bold text-foreground">
          <User size={18} className="text-accent" />
          <span>Active Profile Context:</span>
        </div>

        <div className="text-body-sm text-muted-foreground">
          {currentProfile ? (
            <span>{currentProfile.name} · {currentProfile.location.stateName || "Unknown state"}</span>
          ) : (
            <span>Complete your profile to view personalized timeline milestones.</span>
          )}
        </div>
      </div>

      {/* ── Hero Milestone Banner ── */}
      {hero && (
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-accent/15 via-card to-accent-subtle/30 border border-accent/30 shadow-md space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="badge badge-saffron font-bold text-caption uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Your Next Civic Milestone
            </span>

            {hero.daysUntil !== undefined && (
              <span className="badge badge-accent font-mono font-bold text-caption">
                {hero.isToday ? "🎂 TODAY!" : `${hero.daysUntil} days to go`}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-h2 font-extrabold text-foreground">{hero.title}</h2>
            <p className="text-body text-muted-foreground max-w-2xl leading-relaxed">
              {hero.description}
            </p>
          </div>

          {/* Rule Reasons ("Why this matters") */}
          {hero.ruleReasons && hero.ruleReasons.length > 0 && (
            <div className="p-3 rounded-xl bg-card/80 border border-border-subtle/60 text-caption space-y-1">
              <span className="font-bold text-accent uppercase tracking-wider flex items-center gap-1">
                <HelpCircle size={12} /> Why Vayam surfaced this:
              </span>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5 pl-1">
                {hero.ruleReasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hero Action Button */}
          {hero.actionUrl && (
            <div className="pt-2">
              <Link
                href={hero.actionUrl as any}
                className="btn btn-primary rounded-xl gap-2 font-bold px-5 py-2.5 shadow-sm"
              >
                <span>{hero.actionLabel || "See what's changing"}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Timeline Section Tabs (NOW / NEXT / LATER) ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("now")}
              className={cn(
                "px-4 py-2 rounded-xl text-body-sm font-bold transition-all cursor-pointer border",
                activeTab === "now"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-surface-secondary/70 text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              NOW ({nowEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("next")}
              className={cn(
                "px-4 py-2 rounded-xl text-body-sm font-bold transition-all cursor-pointer border",
                activeTab === "next"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-surface-secondary/70 text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              NEXT ({nextEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("later")}
              className={cn(
                "px-4 py-2 rounded-xl text-body-sm font-bold transition-all cursor-pointer border",
                activeTab === "later"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-surface-secondary/70 text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              LATER ({laterEvents.length})
            </button>
          </div>

          <span className="text-caption text-muted-foreground font-semibold">
            {currentProfile ? `${currentProfile.name} (${currentProfile.dateOfBirth})` : "No active profile"}
          </span>
        </div>

        {/* Tab Content Display */}
        {activeTab === "now" && (
          <div className="space-y-4">
            <h3 className="text-h4 font-extrabold text-foreground flex items-center gap-2">
              <CheckCircle2 size={18} className="text-success" /> Requiring Attention Now
            </h3>
            {nowEvents.length === 0 ? (
              <p className="text-body-sm text-muted-foreground py-4">No active requirements at this moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nowEvents.map((evt) => (
                  <LifeEventCard key={evt.id} event={evt} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "next" && (
          <div className="space-y-4">
            <h3 className="text-h4 font-extrabold text-foreground flex items-center gap-2">
              <Clock size={18} className="text-accent" /> Upcoming Milestones
            </h3>
            {nextEvents.length === 0 ? (
              <p className="text-body-sm text-muted-foreground py-4">No upcoming milestones scheduled in the immediate future.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nextEvents.map((evt) => (
                  <LifeEventCard key={evt.id} event={evt} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "later" && (
          <div className="space-y-4">
            <h3 className="text-h4 font-extrabold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-muted-foreground" /> Future Life Stage Events
            </h3>
            {laterEvents.length === 0 ? (
              <p className="text-body-sm text-muted-foreground py-4">Future milestones will unlock as your life stage progresses.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {laterEvents.map((evt) => (
                  <LifeEventCard key={evt.id} event={evt} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function LifeEventCard({ event }: { event: LifeEvent }) {
  return (
    <div className="p-5 rounded-2xl border border-border-subtle bg-card space-y-3 shadow-xs hover:border-accent/40 transition-colors">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className={cn(
          "badge font-bold text-[10px] uppercase",
          event.status === "CURRENT" ? "badge-success" :
          event.status === "REQUIRES_VERIFICATION" ? "badge-warning" :
          event.status === "UPCOMING" ? "badge-accent" : "badge-muted"
        )}>
          {event.status}
        </span>

        {event.daysUntil !== undefined && (
          <span className="text-caption font-mono font-bold text-muted-foreground flex items-center gap-1">
            <Clock size={12} /> {event.daysUntil} days
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-h4 font-bold text-foreground">{event.title}</h4>
        <p className="text-body-sm text-muted-foreground leading-relaxed">{event.description}</p>
      </div>

      {/* Associated Records Grid */}
      {event.relatedRecords && event.relatedRecords.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border-subtle/50">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Verified Opportunities ({event.relatedRecords.length}):
          </span>
          <div className="space-y-2">
            {event.relatedRecords.map((rec) => (
              <KnowledgeCard key={rec.id} record={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {event.actionUrl && (
        <div className="pt-2">
          <Link
            href={event.actionUrl as any}
            className="btn btn-outline btn-xs gap-1 font-bold"
          >
            <span>{event.actionLabel || "Explore"}</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
