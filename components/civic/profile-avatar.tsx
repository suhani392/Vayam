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
    sm: "h-8 w-8 text-caption font-semibold",
    md: "h-10 w-10 text-body-sm font-semibold",
    lg: "h-12 w-12 text-body font-bold",
    xl: "h-16 w-16 text-h3 font-bold",
  }[size];

  const dotSizeClass = {
    sm: "h-2 w-2 border-1",
    md: "h-2.5 w-2.5 border-2",
    lg: "h-3 w-3 border-2",
    xl: "h-4 w-4 border-2",
  }[size];

  const dotColorClass = {
    active: "bg-success",
    idle: "bg-warning",
    busy: "bg-destructive",
    offline: "bg-muted-foreground",
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
        "relative inline-flex items-center justify-center rounded-full bg-primary-subtle text-primary border border-border-subtle flex-shrink-0 select-none overflow-hidden",
        sizeClasses,
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name || alt} className="h-full w-full object-cover" />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User size={size === "sm" ? 14 : size === "md" ? 18 : 22} />
      )}

      {statusDot && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-card",
            dotSizeClass,
            dotColorClass[statusDot]
          )}
          aria-label={`Status: ${statusDot}`}
        />
      )}
    </div>
  );
}
