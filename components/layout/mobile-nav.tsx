"use client";

/**
 * components/layout/mobile-nav.tsx
 *
 * Bottom Mobile Navigation for Vayam Application Shell.
 * Renders comfortable touch targets (44px+) for 5 primary destinations on mobile screens.
 */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { NAV_ROUTES } from "./sidebar";
import { useLanguage } from "@/hooks/useLanguage";

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div
      aria-label="Mobile Bottom Navigation"
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border-subtle px-2 py-1.5 shadow-lg select-none",
        className
      )}
    >
      <nav className="flex items-center justify-around">
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
                "flex flex-col items-center justify-center min-h-[48px] min-w-[56px] py-1 px-2 rounded-xl transition-all duration-150 relative",
                isActive
                  ? "text-accent font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-transform",
                  isActive && "bg-accent-subtle scale-110"
                )}
              >
                {route.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{t(route.labelKey as any)}</span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="h-1 w-1 rounded-full bg-accent absolute top-1" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

