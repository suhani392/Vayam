"use client";

/**
 * components/layout/header.tsx
 *
 * Persistent Top Header component for Vayam Application Shell.
 * Composable Header layout: HeaderLeft, HeaderCenter, HeaderRight.
 * Integrates LanguageSelector, Notification Bell entry point, and Profile Menu Dropdown.
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { LanguageSelector } from "@/components/civic/language-selector";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { ProfileAvatar } from "@/components/civic/profile-avatar";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Bell, Sparkles, User, Settings, HelpCircle, Shield, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { APP_CONFIG } from "@/config/app";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Header({ title, subtitle, className }: HeaderProps) {
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border-subtle px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 select-none",
        className
      )}
    >
      {/* Header Left: Context / Title */}
      <div className="flex items-center gap-3">
        {title ? (
          <div>
            <h1 className="text-h3 font-bold text-foreground leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-caption text-muted-foreground hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-h3 font-extrabold text-foreground">{APP_CONFIG.name}</span>
            <span className="font-devanagari text-body-sm text-accent font-bold">वयम्</span>
            <span className="badge badge-saffron hidden sm:inline-flex">Civic Intelligence</span>
          </div>
        )}
      </div>

      {/* Header Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Multilingual Selector */}
        <LanguageSelector />

        {/* Notification Entry Point */}
        <NotificationCenter />

        {/* Profile Menu Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-surface-secondary transition-colors">
              <ProfileAvatar name="Suhani Sharma" size="sm" statusDot="active" />
              <span className="text-body-sm font-semibold text-foreground hidden sm:inline-block">
                Suhani
              </span>
            </div>
          }
        >
          <div className="p-2 border-b border-border-subtle mb-1">
            <p className="text-body-sm font-bold text-foreground">Suhani Sharma</p>
            <p className="text-caption text-muted-foreground">Age 18 · Young Adult</p>
          </div>

          <Link href="/profile">
            <DropdownItem icon={<User size={14} />}>View Profile & Life Stage</DropdownItem>
          </Link>
          <Link href="/explore">
            <DropdownItem icon={<Sparkles size={14} />}>Matched Opportunities</DropdownItem>
          </Link>
          <DropdownItem icon={<Shield size={14} />}>Privacy & Data Control</DropdownItem>
          <DropdownItem icon={<HelpCircle size={14} />}>Civic Help & Support</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
