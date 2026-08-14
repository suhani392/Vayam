"use client";

/**
 * components/civic/profile-avatar.tsx
 *
 * Reusable user ProfileAvatar component for Vayam.
 * Supports image, initials fallback, status dot indicator, and multiple sizes.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { User } from "lucide-react";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface ProfileAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: AvatarSize;
  statusDot?: "active" | "idle" | "busy" | "offline";
  alt?: string;
}

export function ProfileAvatar({
  src,
  name,
  size = "md",
  statusDot,
  alt = "User profile avatar",
  className,
  ...props
}: ProfileAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-[11px] font-black",
    md: "h-10 w-10 text-body-sm font-black",
    lg: "h-12 w-12 text-body font-black",
    xl: "h-16 w-16 text-h3 font-black",
  }[size];

  const dotSizeClass = {
    sm: "h-2.5 w-2.5 border-[1.5px]",
    md: "h-3 w-3 border-2",
    lg: "h-3.5 w-3.5 border-2",
    xl: "h-4.5 w-4.5 border-2",
  }[size];

  const dotColorClass = {
    active: "bg-emerald-500 ring-2 ring-emerald-400/50",
    idle: "bg-amber-400 ring-2 ring-amber-300/50",
    busy: "bg-rose-500 ring-2 ring-rose-400/50",
    offline: "bg-slate-400",
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-500/30 hover:ring-amber-500/60 transition-all duration-200 shrink-0 select-none overflow-hidden",
        sizeClasses,
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name || alt} className="h-full w-full object-cover" />
      ) : initials ? (
        <span className="tracking-wider drop-shadow-xs font-mono font-extrabold text-white">{initials}</span>
      ) : (
        <User size={size === "sm" ? 14 : size === "md" ? 18 : 22} className="text-white" />
      )}

      {statusDot && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-background shadow-xs",
            dotSizeClass,
            dotColorClass[statusDot]
          )}
          aria-label={`Status: ${statusDot}`}
        />
      )}
    </div>
  );
}
