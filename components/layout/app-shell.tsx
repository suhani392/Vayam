"use client";

/**
 * components/layout/app-shell.tsx
 *
 * Primary Application Shell for Vayam.
 * Assembles persistent Desktop Sidebar, Mobile Bottom Navigation, Top Header,
 * and responsive Main Content container.
 */

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Header } from "./header";
import { cn } from "@/lib/utils/cn";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // If viewing the design-system preview route, bypass the app shell
  const isDesignSystem = pathname === "/design-system";

  if (isDesignSystem) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased font-sans">
      {/* Persistent Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Container */}
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}
