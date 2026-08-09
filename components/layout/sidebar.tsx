"use client";

/**
 * components/layout/sidebar.tsx
 *
 * Persistent Desktop Sidebar for Vayam Application Shell.
 * Now uses useLanguage() for all user-facing strings.
 */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { APP_CONFIG } from "@/config/app";
import { ThemeSwitcher } from "@/components/civic/theme-switcher";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Home,
  Compass,
  Clock,
  Bot,
  User,
  Sparkles,
  Shield,
} from "lucide-react";

export interface NavRoute {
  href: string;
  labelKey: string;
  descKey: string;
  icon: React.ReactNode;
  badge?: string;
}


export const NAV_ROUTES: NavRoute[] = [
  { href: "/",          labelKey: "nav.home",      descKey: "nav.home.desc",      icon: <Home size={18} /> },
  { href: "/explore",   labelKey: "nav.explore",   descKey: "nav.explore.desc",   icon: <Compass size={18} />, badge: "new" },
  { href: "/timeline",  labelKey: "nav.timeline",  descKey: "nav.timeline.desc",  icon: <Clock size={18} /> },
  { href: "/assistant", labelKey: "nav.assistant", descKey: "nav.assistant.desc", icon: <Bot size={18} /> },
  { href: "/profile",   labelKey: "nav.profile",   descKey: "nav.profile.desc",   icon: <User size={18} /> },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside
      aria-label="Sidebar Navigation"
      className={cn(
        "hidden lg:flex flex-col w-72 flex-shrink-0 min-h-screen border-r border-border-subtle bg-card/80 backdrop-blur-md sticky top-0 h-screen z-30 select-none",
        className
      )}
    >
      {/* ── Brand Header ── */}
      <div className="p-6 border-b border-border-subtle flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <img
            src="/assets/Vayam_Icon.png?v=2"
            alt="Vayam Icon Logo"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <img
              src="/assets/Vayam_Text.png?v=2"
              alt="Vayam"
              className="h-6 w-auto object-contain"
            />
            <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[170px] mt-0.5">
              {APP_CONFIG.tagline}
            </p>
          </div>
        </Link>
      </div>

      {/* ── Primary Navigation ── */}
      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
            {t("sidebar.civicIntelligence")}
          </p>
          <nav className="space-y-1.5" aria-label="Main navigation">
            {NAV_ROUTES.map((route) => {
              const isActive =
                route.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(route.href);

              return (
                <Link
                  key={route.href}
                  href={route.href as any}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-start gap-3.5 px-3.5 py-3 rounded-2xl text-body-sm font-medium transition-all duration-150 group border border-transparent",
                    isActive
                      ? "bg-accent-subtle/80 text-accent font-bold border-accent/20 shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-accent"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {route.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{t(route.labelKey as any)}</span>
                      {route.badge && (
                        <span className="badge badge-saffron text-[10px] py-0 px-1.5">
                          {t("common.new")}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-normal truncate mt-0.5 opacity-80">
                      {t(route.descKey as any)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Lower Area (Theme Switcher & Subtle Indian Identity) ── */}
      <div className="p-4 border-t border-border-subtle space-y-4 bg-surface-secondary/40">
        <div>
          <p className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
            {t("sidebar.appearance")}
          </p>
          <ThemeSwitcher className="w-full justify-between" />
        </div>

        {/* Official Data Provenance Link */}
        <Link href="/dev-sources" className="p-3 rounded-2xl bg-card border border-border-subtle hover:border-accent/40 transition-colors flex items-center gap-3 motif-bg group block">
          <Shield size={16} className="text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
          <div className="min-w-0 flex-1">
            <p className="text-caption font-bold text-foreground group-hover:text-accent transition-colors">{t("sidebar.officialData")}</p>
            <p className="text-[10px] text-muted-foreground truncate">{t("sidebar.officialDataDesc")}</p>
          </div>
        </Link>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono px-1">
          <span>{APP_CONFIG.name} v{APP_CONFIG.version}</span>
          <span className="font-devanagari font-bold text-accent">भारत</span>
        </div>
      </div>
    </aside>
  );
}
