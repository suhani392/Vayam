"use client";

/**
 * components/layout/app-shell.tsx
 *
 * Primary Application Shell for Vayam.
 * Assembles persistent Desktop Sidebar, Mobile Bottom Navigation, Top Header,
 * and responsive Main Content container.
 * Hides navigation bars (Sidebar & MobileNav) when user is unauthenticated.
 */

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Header } from "./header";
import { useAuth } from "@/components/auth/AuthContext";
import { AboutVayamLanding } from "@/components/landing/about-vayam-landing";
import { PageContainer } from "@/components/layout/page-container";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  // Bypass shell for design-system preview route
  const isDesignSystem = pathname === "/design-system";

  if (isDesignSystem) {
    return <main id="main-content">{children}</main>;
  }

  // Unauthenticated Flow: Hide Sidebar and MobileNav completely!
  if (!isAuthenticated && !loading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground antialiased font-sans">
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main id="main-content" className="flex-1">
            {pathname === "/" ? (
              children
            ) : (
              <PageContainer width="wide">
                <AboutVayamLanding />
              </PageContainer>
            )}
          </main>
        </div>
      </div>
    );
  }

  // Authenticated Flow: Render Full Desktop Sidebar & Mobile Bottom Navigation
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
