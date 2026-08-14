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

import React, { useState, useEffect, useCallback } from "react";
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

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [lastFetchedKey, setLastFetchedKey] = useState<string>("");

  const currentProfile = loaded && profile ? (profile as UserProfile) : initialProfile;
  const timelineState = currentProfile ? getSmartTimelineState(currentProfile) : null;
  const hero = timelineState?.heroEvent;

  const nowEvents = timelineState?.nowEvents ?? [];
  const nextEvents = timelineState?.nextEvents ?? [];
  const laterEvents = timelineState?.laterEvents ?? [];

  const profileKey = currentProfile
    ? `${currentProfile.gender}-${currentProfile.dateOfBirth}-${currentProfile.location?.stateCode}-${currentProfile.educationLevel}-${currentProfile.employmentStatus}`
    : "";

  const handleFetchAiTimeline = useCallback(async () => {
    if (!currentProfile || !currentProfile.dateOfBirth) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: currentProfile }),
      });
      const data = await res.json();
      if (data.success && data.timeline) {
        setAiResult(data.timeline);
      }
    } catch (e) {
      console.error("AI Timeline fetch error", e);
    } finally {
      setAiLoading(false);
    }
  }, [currentProfile]);

  // Auto-run AI timeline analysis when profile is loaded or when profile details change
  useEffect(() => {
    if (loaded && currentProfile?.dateOfBirth && profileKey !== lastFetchedKey && !aiLoading) {
      setLastFetchedKey(profileKey);
      handleFetchAiTimeline();
    }
  }, [loaded, currentProfile, profileKey, lastFetchedKey, aiLoading, handleFetchAiTimeline]);

  return (
    <div className="space-y-8">
      {/* ── Auto-AI Status Banner ── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-accent/15 via-card to-emerald-500/10 border border-accent/30 flex items-center justify-between flex-wrap gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-body font-bold text-foreground">Official Identity & Civic Timeline</h4>
            <p className="text-caption text-muted-foreground">
              {aiLoading
                ? "Analyzing official voter, driving licence, passport, and electoral milestones..."
                : aiResult?.aiSummary || "Deterministic civic document & identity roadmap for your profile."}
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchAiTimeline}
          disabled={aiLoading}
          className="btn btn-outline btn-xs rounded-xl gap-1.5 font-bold hover:btn-primary cursor-pointer"
        >
          {aiLoading ? (
            <div className="h-3 w-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles size={12} />
          )}
          <span>{aiLoading ? "Analyzing..." : "Refresh"}</span>
        </button>
      </div>


      {/* ── Hero Milestone Banner ── */}
      {hero && (
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-accent/15 via-card to-accent-subtle/30 border border-accent/30 shadow-md space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {hero.daysUntil !== undefined && (
              <span className="badge badge-accent font-mono font-bold text-caption ml-auto">
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
              {hero.actionUrl.startsWith("http://") || hero.actionUrl.startsWith("https://") ? (
                <a
                  href={hero.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary rounded-xl gap-2 font-bold px-5 py-2.5 shadow-sm inline-flex items-center"
                >
                  <span>{hero.actionLabel || "Apply on Official Government Portal"}</span>
                  <ExternalLink size={16} />
                </a>
              ) : (
                <Link
                  href={hero.actionUrl as any}
                  className="btn btn-primary rounded-xl gap-2 font-bold px-5 py-2.5 shadow-sm inline-flex items-center"
                >
                  <span>{hero.actionLabel || "See details"}</span>
                  <ArrowRight size={16} />
                </Link>
              )}
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
              NOW ({aiResult?.now ? aiResult.now.length : nowEvents.length})
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
              NEXT ({aiResult?.next ? aiResult.next.length : nextEvents.length})
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
              LATER ({aiResult?.later ? aiResult.later.length : laterEvents.length})
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === "now" && (
          <div className="space-y-4">
            <h3 className="text-h4 font-extrabold text-foreground flex items-center gap-2">
              <CheckCircle2 size={18} className="text-success" /> Requiring Attention Now
            </h3>
            {aiResult?.now ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiResult.now.map((item: any, i: number) => (
                  <AiEventCard key={`ai-now-${i}`} item={item} status="NOW" />
                ))}
              </div>
            ) : nowEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nowEvents.map((evt) => (
                  <LifeEventCard key={evt.id} event={evt} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-muted-foreground py-4">No active requirements at this moment.</p>
            )}
          </div>
        )}

        {activeTab === "next" && (
          <div className="space-y-4">
            <h3 className="text-h4 font-extrabold text-foreground flex items-center gap-2">
              <Clock size={18} className="text-accent" /> Upcoming Milestones (1–3 Years)
            </h3>
            {aiResult?.next ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiResult.next.map((item: any, i: number) => (
                  <AiEventCard key={`ai-next-${i}`} item={item} status="UPCOMING" />
                ))}
              </div>
            ) : nextEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nextEvents.map((evt) => (
                  <LifeEventCard key={evt.id} event={evt} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-muted-foreground py-4">No upcoming milestones scheduled in the near future.</p>
            )}
          </div>
        )}

        {activeTab === "later" && (
          <div className="space-y-4">
            <h3 className="text-h4 font-extrabold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-muted-foreground" /> Future Life Stage Events (3+ Years)
            </h3>
            {aiResult?.later ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiResult.later.map((item: any, i: number) => (
                  <AiEventCard key={`ai-later-${i}`} item={item} status="LATER" />
                ))}
              </div>
            ) : laterEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {laterEvents.map((evt) => (
                  <LifeEventCard key={evt.id} event={evt} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-muted-foreground py-4">Future milestones will unlock as your life stage progresses.</p>
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
          {event.actionUrl.startsWith("http://") || event.actionUrl.startsWith("https://") ? (
            <a
              href={event.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-xs gap-1.5 font-bold hover:btn-primary inline-flex items-center"
            >
              <span>{event.actionLabel || "Apply on Official Government Portal"}</span>
              <ExternalLink size={12} />
            </a>
          ) : (
            <Link
              href={event.actionUrl as any}
              className="btn btn-outline btn-xs gap-1 font-bold inline-flex items-center"
            >
              <span>{event.actionLabel || "Explore"}</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function AiEventCard({ item, status }: { item: any; status: string }) {
  const url = item.actionUrl || "";
  const isExternal = url.startsWith("http://") || url.startsWith("https://");

  return (
    <div className="p-5 rounded-2xl border border-accent/40 bg-accent-subtle/20 space-y-3 shadow-xs relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="badge badge-accent font-bold text-[10px] uppercase flex items-center gap-1">
          <Sparkles size={10} /> {status} (AI MATCH)
        </span>
        <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
          {item.category || "AI Insight"}
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-h4 font-bold text-foreground">{item.title}</h4>
        <p className="text-body-sm text-muted-foreground leading-relaxed">{item.description}</p>
      </div>

      {url && (
        <div className="pt-2">
          {isExternal ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-xs gap-1.5 font-bold border-accent/40 hover:btn-primary inline-flex items-center"
            >
              <span>{item.actionLabel || "Apply on Official Government Portal"}</span>
              <ExternalLink size={12} />
            </a>
          ) : (
            <Link
              href={url as any}
              className="btn btn-outline btn-xs gap-1 font-bold border-accent/40 hover:btn-primary inline-flex items-center"
            >
              <span>{item.actionLabel || "Explore Opportunity"}</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
