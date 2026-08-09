"use client";

/**
 * components/civic/demo-bar.tsx
 *
 * Demo Profile Switcher Bar for Vayam Phase 11.
 * Allows judges & reviewers to switch profiles with a single click
 * and see all personalized state, timeline, recommendations, and AI assistant
 * update deterministically.
 */

import React from "react";
import { TEST_PROFILES } from "@/lib/core/data/test-profiles";
import type { UserProfile } from "@/lib/core/types";
import { User, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface DemoBarProps {
  activeProfileKey: keyof typeof TEST_PROFILES;
  onProfileSelect: (key: keyof typeof TEST_PROFILES, profile: UserProfile) => void;
  className?: string;
}

export function DemoBar({ activeProfileKey, onProfileSelect, className }: DemoBarProps) {
  const profileKeys = Object.keys(TEST_PROFILES) as (keyof typeof TEST_PROFILES)[];

  const getProfileBadgeLabel = (key: keyof typeof TEST_PROFILES): string => {
    switch (key) {
      case "profileA": return "17yo Student (Approaching 18)";
      case "profileB": return "18yo Student (Young Adult)";
      case "profileC": return "25yo Employed (Career & Finance)";
      case "profileD": return "65yo Senior (Senior Benefits)";
      default: return key;
    }
  };

  return (
    <div
      className={cn(
        "p-3 rounded-2xl bg-gradient-to-r from-accent/10 via-surface-secondary to-accent-subtle/20 border border-accent/30 shadow-xs flex flex-wrap items-center justify-between gap-3 select-none",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold">
          <Sparkles size={14} />
        </div>
        <div>
          <span className="text-body-sm font-extrabold text-foreground">Judge Demo Mode:</span>
          <span className="text-caption text-muted-foreground ml-1.5 hidden sm:inline">
            Switch citizen profiles to test deterministic intelligence
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {profileKeys.map((key) => {
          const profile = TEST_PROFILES[key];
          const isActive = activeProfileKey === key;
          return (
            <button
              key={key}
              onClick={() => onProfileSelect(key, profile)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-caption font-bold transition-all cursor-pointer border flex items-center gap-1.5",
                isActive
                  ? "bg-accent text-accent-foreground border-accent shadow-xs scale-105"
                  : "bg-card text-muted-foreground border-border-subtle hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && <Check size={12} className="text-accent-foreground" />}
              <span>{profile.name} — {getProfileBadgeLabel(key)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
