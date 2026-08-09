"use client";

/**
 * components/orbit/orbit.tsx
 *
 * YOUR VAYAM — Life Ribbon Component Architecture
 * Subtitle: "A little ahead in your journey."
 *
 * Core Concept:
 * A person's civic journey through life visualized as a flowing vertical ribbon.
 * Features:
 * - Central "YOU" current position milestone anchor (Age 18 · Young Adult).
 * - Smooth vertical SVG Bézier S-curve ribbon path.
 * - Alternating left/right floating journey cards for desktop.
 * - Single-column vertical path layout for mobile viewports.
 * - Relevance indicators, category pastel themes, and interactive selection.
 * - 100% WAI-ARIA accessible, reduced-motion aware, dark mode native.
 * - Backwards-compatible Orbit, Constellation, and VayamConstellation barrel exports.
 */

import React, { useState, useId } from "react";
import { cn } from "@/lib/utils/cn";
import { ProfileAvatar } from "@/components/civic/profile-avatar";
import {
  Sparkles,
  GraduationCap,
  Landmark,
  FileText,
  CheckCircle2,
  Briefcase,
  Coins,
  ArrowRight,
  Clock,
  CheckCircle,
  MapPin,
  ChevronRight,
} from "lucide-react";

/* --------------------------------------------------------------------------
   Current Position Milestone (CurrentPosition / ConstellationCenter / OrbitCenter)
   -------------------------------------------------------------------------- */
export interface CurrentPositionProps {
  name: string;
  avatarSrc?: string;
  age?: number;
  lifeStage?: string;
  onClick?: () => void;
  className?: string;
}

export function CurrentPosition({
  name,
  avatarSrc,
  age = 18,
  lifeStage = "Young Adult",
  onClick,
  className,
}: CurrentPositionProps) {
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Current Position Milestone: ${name}, Age ${age}, ${lifeStage}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "relative flex items-center gap-3.5 px-5 py-3.5 rounded-full bg-card border-2 border-accent shadow-xl z-20 cursor-pointer hover:scale-105 transition-all duration-300 select-none group min-w-[240px]",
        className
      )}
    >
      {/* Restrained pulsing saffron halo */}
      <div className="absolute -inset-1.5 rounded-full bg-accent/20 animate-pulse -z-10 opacity-70 pointer-events-none" />
      <div className="absolute -inset-3.5 rounded-full border border-dashed border-accent/40 -z-20 pointer-events-none" />

      <ProfileAvatar src={avatarSrc} name={name} size="md" statusDot="active" />

      <div className="text-left space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-caption font-bold text-accent uppercase tracking-wider">
            Current Milestone
          </span>
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        </div>
        <p className="text-body-sm font-extrabold text-foreground tracking-tight group-hover:text-accent transition-colors">
          {name}
        </p>
        <span className="badge badge-saffron text-[10px] font-bold py-0.2 px-2 shadow-2xs">
          YOU · Age {age} · {lifeStage}
        </span>
      </div>
    </div>
  );
}

// Backwards compatibility aliases
export const ConstellationCenter = CurrentPosition;
export const OrbitCenter = CurrentPosition;
export type ConstellationCenterProps = CurrentPositionProps;
export type OrbitCenterProps = CurrentPositionProps;

/* --------------------------------------------------------------------------
   Journey Card Component (JourneyCard / ConstellationNode / OrbitNode)
   -------------------------------------------------------------------------- */
export interface JourneyItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  relevance?: number; // 0 to 100
  status?: "high" | "medium" | "low";
  count?: number;
  isUpcoming?: boolean;
}

export interface JourneyCardProps extends JourneyItem {
  side?: "left" | "right";
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function JourneyCard({
  title,
  category,
  description,
  subtitle,
  icon,
  relevance = 80,
  status,
  count,
  isUpcoming = false,
  side = "left",
  active = false,
  onClick,
  className,
}: JourneyCardProps) {
  const getCategoryStyles = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "education":
      case "scholarships":
        return {
          bg: "bg-category-education-bg",
          text: "text-category-education-text",
          border: "border-category-education-border",
        };
      case "rights":
      case "civic_rights":
        return {
          bg: "bg-accent-purple-subtle",
          text: "text-accent-purple",
          border: "border-accent-purple/30",
        };
      case "services":
      case "documents":
        return {
          bg: "bg-category-service-bg",
          text: "text-category-service-text",
          border: "border-category-service-border",
        };
      case "benefits":
      case "health":
        return {
          bg: "bg-accent-green-subtle",
          text: "text-accent-green",
          border: "border-accent-green/30",
        };
      case "finance":
      case "agriculture":
        return {
          bg: "bg-category-scholarship-bg",
          text: "text-category-scholarship-text",
          border: "border-category-scholarship-border",
        };
      case "career":
      case "employment":
      default:
        return {
          bg: "bg-accent-subtle",
          text: "text-accent",
          border: "border-accent/30",
        };
    }
  };

  const theme = getCategoryStyles(category);

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`${title}, Category: ${category}, ${description || ""}${
        relevance ? `, ${relevance}% match` : ""
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "group relative flex flex-col p-4 md:p-5 rounded-2xl bg-card border shadow-sm transition-all duration-300 cursor-pointer select-none max-w-md w-full",
        active
          ? "border-accent ring-2 ring-accent/40 bg-accent-subtle/40 shadow-md scale-102"
          : "border-border-subtle hover:border-accent/50 hover:shadow-md hover:scale-101",
        isUpcoming && "opacity-90 bg-card/80 border-dashed",
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "p-2 rounded-xl flex-shrink-0 flex items-center justify-center border transition-transform duration-200 group-hover:scale-110",
              theme.bg,
              theme.text,
              theme.border
            )}
          >
            {icon || <Sparkles size={16} />}
          </div>
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {category}
            </span>
            {isUpcoming && (
              <span className="badge badge-muted text-[10px] py-0 px-1.5 mt-0.5">
                Upcoming Milestone
              </span>
            )}
          </div>
        </div>

        {relevance && (
          <span
            className={cn(
              "badge font-mono text-[10px] py-0.5 px-2",
              relevance >= 80
                ? "badge-saffron"
                : relevance >= 60
                ? "badge-green"
                : "badge-muted"
            )}
          >
            {relevance}% Match
          </span>
        )}
      </div>

      {/* Main Title */}
      <h3 className="text-body-sm font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
        {title}
      </h3>

      {/* Description / Subtitle */}
      {(description || subtitle) && (
        <p className="text-caption text-muted-foreground mt-1 line-clamp-2">
          {description || subtitle}
        </p>
      )}

      {/* Footer Row */}
      <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-border-subtle text-[11px]">
        {count !== undefined ? (
          <span className="font-semibold text-foreground">
            {count} {count === 1 ? "opportunity" : "opportunities"}
          </span>
        ) : (
          <span className="text-muted-foreground">Action required</span>
        )}

        <span className="font-bold text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Explore <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}

// Backwards compatibility aliases
export const ConstellationNode = JourneyCard;
export const OrbitNode = JourneyCard;
export type ConstellationNodeProps = JourneyCardProps;
export type OrbitNodeProps = JourneyCardProps;

/* --------------------------------------------------------------------------
   YOUR VAYAM — Main Life Ribbon Component Architecture
   -------------------------------------------------------------------------- */
export interface VayamJourneyProps {
  currentPosition: CurrentPositionProps;
  items: JourneyItem[];
  selectedItemId?: string;
  onItemSelect?: (id: string) => void;
  className?: string;
}

export function VayamJourney({
  currentPosition,
  items,
  selectedItemId,
  onItemSelect,
  className,
}: VayamJourneyProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(
    selectedItemId || items[0]?.id
  );

  const activeId = selectedItemId !== undefined ? selectedItemId : internalSelectedId;
  const svgId = useId();

  const handleSelect = (id: string) => {
    setInternalSelectedId(id);
    onItemSelect?.(id);
  };

  // Split items around the current position anchor for natural flow
  const midIndex = Math.ceil(items.length / 2);
  const topItems = items.slice(0, midIndex);
  const bottomItems = items.slice(midIndex);

  return (
    <div
      role="region"
      aria-label="YOUR VAYAM — Life Ribbon Journey"
      className={cn(
        "relative w-full rounded-3xl bg-surface-secondary/30 border border-border-subtle motif-bg p-6 md:p-12 overflow-hidden select-none",
        className
      )}
    >
      {/* ── Header Title & Subtitle ── */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="badge badge-saffron text-xs font-bold uppercase tracking-widest px-3 py-1">
            Personal Life Ribbon
          </span>
        </div>
        <h2 className="text-h2 font-extrabold text-foreground tracking-tight">
          YOUR VAYAM
        </h2>
        <p className="text-body-sm text-muted-foreground font-medium">
          A little ahead in your journey.
        </p>
      </div>

      {/* ── Desktop Alternating Flowing Journey ── */}
      <div className="relative max-w-5xl mx-auto">
        {/* SVG Flowing S-Curve Ribbon Path (Center Line on Desktop) */}
        <div className="absolute inset-0 flex justify-center pointer-events-none z-0 hidden md:flex">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id={`${svgId}-ribbon-gradient`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Central Vertical Flow Line with Soft Gradient */}
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke={`url(#${svgId}-ribbon-gradient)`}
              strokeWidth="2.5"
              strokeDasharray="6 6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Mobile Vertical Path Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-accent/40 md:hidden pointer-events-none" />

        {/* ── Journey Items Stack ── */}
        <div className="space-y-10 md:space-y-14 relative z-10">

          {/* Top Half Journey Items */}
          {topItems.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            const isSelected = activeId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center w-full relative",
                  "md:grid md:grid-cols-2 md:gap-12",
                  "pl-12 md:pl-0"
                )}
              >
                {/* Mobile Path Dot */}
                <div className="absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full bg-card border-2 border-accent z-20 md:hidden" />

                {/* Left Side Slot (Desktop) */}
                <div className={cn("flex justify-end", !isLeft && "md:col-start-2 md:justify-start")}>
                  <JourneyCard
                    {...item}
                    side={isLeft ? "left" : "right"}
                    active={isSelected}
                    onClick={() => handleSelect(item.id)}
                  />
                </div>
              </div>
            );
          })}

          {/* ── CENTRAL USER MILESTONE ANCHOR ("YOU") ── */}
          <div className="flex justify-center items-center py-4 relative z-20">
            <CurrentPosition {...currentPosition} />
          </div>

          {/* Bottom Half Journey Items */}
          {bottomItems.map((item, idx) => {
            const isLeft = (topItems.length + idx) % 2 === 0;
            const isSelected = activeId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center w-full relative",
                  "md:grid md:grid-cols-2 md:gap-12",
                  "pl-12 md:pl-0"
                )}
              >
                {/* Mobile Path Dot */}
                <div className="absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full bg-card border-2 border-accent z-20 md:hidden" />

                {/* Alternating Slot */}
                <div className={cn("flex justify-end", !isLeft && "md:col-start-2 md:justify-start")}>
                  <JourneyCard
                    {...item}
                    side={isLeft ? "left" : "right"}
                    active={isSelected}
                    onClick={() => handleSelect(item.id)}
                  />
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

// Backwards compatibility aliases for full application compatibility
export const VayamConstellation = VayamJourney;
export const Orbit = VayamJourney;
export type VayamConstellationProps = VayamJourneyProps;
export type OrbitProps = VayamJourneyProps;

/* --------------------------------------------------------------------------
   Accessible List Fallback Component (JourneyListFallback / ConstellationListFallback / OrbitListFallback)
   -------------------------------------------------------------------------- */
export interface JourneyListFallbackProps {
  items: JourneyItem[];
  selectedItemId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export function JourneyListFallback({
  items,
  selectedItemId,
  onItemClick,
  className,
}: JourneyListFallbackProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <p className="text-label text-muted-foreground uppercase tracking-wider font-bold">
          Civic Life Journey ({items.length})
        </p>
        <span className="text-caption text-accent font-semibold flex items-center gap-1">
          <Sparkles size={12} /> YOUR VAYAM
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <JourneyCard
            key={item.id}
            {...item}
            active={selectedItemId === item.id}
            onClick={() => onItemClick?.(item.id)}
            className="max-w-none w-full"
          />
        ))}
      </div>
    </div>
  );
}

// Backwards compatibility aliases
export const ConstellationListFallback = JourneyListFallback;
export const OrbitListFallback = JourneyListFallback;
