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
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/Vayam_Icon.png?v=2"
              alt="Vayam Icon Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <img
              src="/assets/Vayam_Text.png?v=2"
              alt="Vayam"
              className="h-6 w-auto object-contain"
            />
            <span className="badge badge-saffron hidden sm:inline-flex ml-1">Civic Intelligence</span>
          </Link>
        )}
      </div>

      {/* Header Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Multilingual Selector */}
        <LanguageSelector />

        {/* Notification Entry Point */}
        <NotificationCenter />

        {/* Auth / Profile Area */}
        {isAuthenticated ? (
          <Dropdown
            align="right"
            trigger={
              <div className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-surface-secondary transition-colors">
                <ProfileAvatar name={displayName} size="sm" statusDot="active" />
                <span className="text-body-sm font-semibold text-foreground hidden sm:inline-block">
                  {displayName.split(" ")[0]}
                </span>
              </div>
            }
          >
            <div className="p-2 border-b border-border-subtle mb-1">
              <p className="text-body-sm font-bold text-foreground">{displayName}</p>
              <p className="text-caption text-muted-foreground">
                Supabase Account Verified
              </p>
            </div>

            <Link href="/profile">
              <DropdownItem icon={<User size={14} />}>View Profile & Settings</DropdownItem>
            </Link>
            <Link href="/explore">
              <DropdownItem icon={<Sparkles size={14} />}>Matched Opportunities</DropdownItem>
            </Link>
            <DropdownItem icon={<Shield size={14} />}>Privacy & Data Control</DropdownItem>
            <DropdownItem icon={<HelpCircle size={14} />}>Civic Help & Support</DropdownItem>

            <div className="border-t border-border-subtle mt-1 pt-1">
              <DropdownItem
                icon={<LogOut size={14} className="text-destructive" />}
                onClick={() => signOut()}
              >
                <span className="text-destructive font-semibold">Sign Out</span>
              </DropdownItem>
            </div>
          </Dropdown>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="btn btn-primary btn-sm font-bold gap-2 rounded-xl shadow-xs cursor-pointer"
          >
            <UserCheck size={16} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
