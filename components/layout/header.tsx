"use client";

/**
 * components/layout/header.tsx
 *
 * Persistent Top Header component for Vayam Application Shell.
 * Composable Header layout: HeaderLeft, HeaderCenter, HeaderRight.
 * Integrates LanguageSelector, Notification Bell entry point, Supabase Auth Trigger, and Profile Menu Dropdown.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { LanguageSelector } from "@/components/civic/language-selector";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ProfileAvatar } from "@/components/civic/profile-avatar";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Sparkles,
  User,
  Shield,
  HelpCircle,
  LogOut,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { APP_CONFIG } from "@/config/app";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Header({ title, subtitle, className }: HeaderProps) {
  const { isAuthenticated, isDemo, user, dbProfile, userProfile, setAuthModalOpen, signOut } = useAuth();

  const displayName =
    dbProfile?.full_name ||
    userProfile?.name ||
    user?.email?.split("@")[0] ||
    "Citizen Profile";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border-subtle px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 select-none",
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
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/Vayam_Icon.png?v=2"
              alt="Vayam Icon Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105 dark:hidden"
            />
            <img
              src="/assets/Vayam_Text.png?v=2"
              alt="Vayam"
              className="h-6 w-auto object-contain dark:hidden"
            />
            <img
              src="/assets/Vayam_Dark_Icon.png?v=2"
              alt="Vayam Icon Logo Dark"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105 hidden dark:block"
            />
            <img
              src="/assets/Vayam_Dark_Text.png?v=2"
              alt="Vayam Dark"
              className="h-6 w-auto object-contain hidden dark:block"
            />
            </Link>
        )}
      </div>

        {/* Header Right: Controls */}
      <div className="flex items-center gap-6">
        {/* Multilingual Selector */}
        <LanguageSelector />

        {/* Notification Entry Point */}
        {isAuthenticated && <NotificationCenter />}

        {/* Theme Toggle */}
        <ThemeToggle className="relative h-[38px] w-[38px] flex items-center justify-center rounded-xl border border-border-subtle bg-transparent hover:bg-surface-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-none !p-0" />

        {/* Auth / Profile Area */}
        {isAuthenticated ? (
          <Dropdown
            align="right"
            trigger={
              <div className="flex items-center justify-center h-[38px] w-[38px] cursor-pointer p-1 rounded-xl hover:bg-surface-secondary transition-colors">
                <ProfileAvatar name={displayName} size="sm" />
              </div>
            }
          >
            <div className="p-2 border-b border-border-subtle mb-1">
              <p className="text-body-sm font-bold text-foreground">{displayName}</p>
            </div>

            <DropdownItem
              icon={<LogOut size={14} className="text-destructive" />}
              onClick={() => signOut()}
            >
              <span className="text-destructive font-semibold">Sign Out</span>
            </DropdownItem>
          </Dropdown>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="btn btn-primary font-bold gap-2 rounded-xl shadow-xs cursor-pointer h-[38px] px-4"
          >
            <UserCheck size={16} />
            <span className="pt-[2px]">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
