"use client";

/**
 * components/admin/admin-layout.tsx
 *
 * Vayam Civic Intelligence Admin Layout Shell.
 * Provides Vayam's Indian-inspired visual identity, system status banner, header navigation,
 * and background scan controls for the Administrator.
 */

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import {
  ShieldCheck,
  RefreshCw,
  Play,
  Settings,
  LogOut,
  Globe,
  FileSearch,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Database,
  History,
} from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, dbProfile, signOut } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const adminEmail = user?.email || "admin@gmail.com";

  const handleRunScan = async () => {
    setScanning(true);
    setScanMessage("Scanning official government sources & detecting changes...");

    try {
      const res = await fetch("/api/admin/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, email: adminEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setScanMessage(
          `Scan completed! Scanned: ${data.summary?.scanned || 0}, Findings: ${data.summary?.findings || 0}`
        );
        setTimeout(() => {
          setScanMessage(null);
          window.location.reload();
        }, 2000);
      } else {
        setScanMessage(`Scan error: ${data.error || "Failed to scan"}`);
        setTimeout(() => setScanMessage(null), 4000);
      }
    } catch (err: any) {
      setScanMessage(`Error: ${err.message}`);
      setTimeout(() => setScanMessage(null), 4000);
    } finally {
      setScanning(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Single Sleek Sub-Header Control Bar */}
      <div className="sticky top-[64px] z-40 bg-saffron-500/10 dark:bg-saffron-500/15 backdrop-blur-md border-b border-saffron-500/20 px-4 sm:px-8 py-2.5 select-none transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href={"/admin" as any}
              className={`px-3.5 py-1.5 rounded-xl text-body-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                pathname === "/admin"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </Link>

            <Link
              href={"/admin/sources" as any}
              className={`px-3.5 py-1.5 rounded-xl text-body-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                pathname === "/admin/sources"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe size={15} />
              <span>Source Registry</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl text-body-sm font-bold flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Database size={15} />
              <span>Live Portal ↗</span>
            </Link>
          </nav>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-caption font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Monitoring Active</span>
            </div>

            {scanMessage ? (
              <div className="text-caption font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 size={13} />
                <span>{scanMessage}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-ghost btn-xs gap-1 rounded-xl font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Refresh State"
                >
                  <RefreshCw size={13} />
                  <span className="hidden md:inline">Refresh</span>
                </button>

                <button
                  onClick={handleRunScan}
                  disabled={scanning}
                  className="btn btn-primary btn-xs gap-1.5 px-3 py-1 rounded-xl font-bold shadow-xs cursor-pointer bg-emerald-600 border-emerald-600 hover:bg-emerald-700"
                >
                  <Play size={13} className={scanning ? "animate-spin" : ""} />
                  <span>{scanning ? "Scanning..." : "Run Scan"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 lg:p-12 space-y-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border-subtle py-6 px-4 text-center text-caption text-muted-foreground">
        Vayam Civic Intelligence System — Official Government Source Verification & Human-in-the-Loop Pipeline
      </footer>
    </div>
  );
}
