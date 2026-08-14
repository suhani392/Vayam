"use client";

/**
 * app/lifestyle/page.tsx
 *
 * Lifestyle Planner & Smart Asset Affordability Suite (Coming Soon).
 * Displays a back button, upcoming feature badges, and a preview of upcoming capabilities.
 */

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import {
  ArrowLeft,
  Coins,
  Wallet,
  Building2,
  Car,
  Landmark,
  Bot,
  ShieldCheck,
  Percent,
  TrendingUp,
  Clock,
  HeartHandshake,
} from "lucide-react";

export default function LifestylePlannerPage() {
  const router = useRouter();

  return (
    <PageContainer width="wide">
      <div className="space-y-12 pb-24 pt-4">
        {/* ── Top Bar with Back Button ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="btn btn-outline btn-sm rounded-xl gap-2 font-bold hover:btn-primary cursor-pointer transition-all shadow-xs"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1.5 shadow-2xs">
            <Clock size={12} /> Upcoming Feature
          </span>
        </div>

        {/* ── Main Hero Card: Coming Soon Banner ── */}
        <section className="relative overflow-hidden p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-accent/20 via-card to-accent-subtle/40 border border-accent/40 shadow-xl space-y-8 backdrop-blur-md">
          {/* Background Decorative Glow Circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-subtle border border-accent/30 text-accent font-bold text-caption uppercase tracking-widest shadow-2xs">
              <Coins size={14} /> Smart Asset & Loan Optimizer
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
              Lifestyle Planner <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-500 to-accent font-extrabold">
                Coming Soon!
              </span>
            </h1>

            <p className="text-body-lg sm:text-h4 font-medium text-muted-foreground leading-relaxed pt-2">
              We are building an intelligent tool to help citizens master their asset investments. Know how much house or car you can safely afford based on your income, play smart with bank loans, and unlock government subsidies—all tailored to your lifestyle.
            </p>
          </div>

          {/* Quick Teaser Stats / Badges */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border-subtle/80">
            <div className="p-4 rounded-2xl bg-surface-secondary/60 border border-border-subtle space-y-1">
              <div className="text-caption font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={14} className="text-accent" /> Housing Cap
              </div>
              <p className="text-body-sm font-bold text-foreground">28/36 Safe Debt Rule</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-secondary/60 border border-border-subtle space-y-1">
              <div className="text-caption font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Car size={14} className="text-accent" /> Vehicle Budget
              </div>
              <p className="text-body-sm font-bold text-foreground">20/4/10 Auto Rule</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-secondary/60 border border-border-subtle space-y-1">
              <div className="text-caption font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Landmark size={14} className="text-accent" /> Bank Hacks
              </div>
              <p className="text-body-sm font-bold text-foreground">1 Extra EMI Saver</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-secondary/60 border border-border-subtle space-y-1">
              <div className="text-caption font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Bot size={14} className="text-accent" /> AI Advisor
              </div>
              <p className="text-body-sm font-bold text-foreground">Personalized AI Tips</p>
            </div>
          </div>
        </section>

        {/* ── Teaser Feature Grid ── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-h2 font-extrabold text-foreground">What to Expect in Vayam Lifestyle Planner</h2>
            <p className="text-body-sm text-muted-foreground">
              Here is a sneak peek at the powerful capabilities coming straight to your dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Safe Affordability Caps */}
            <div className="p-6 rounded-3xl bg-card border border-border-subtle hover:border-accent/40 shadow-xs transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-subtle text-accent flex items-center justify-center font-bold">
                <Wallet size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-h3 font-bold text-foreground">Income-Based Budget Caps</h3>
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  Calculates exact maximum house and car purchase caps tailored to your net monthly income so you never become house-poor.
                </p>
              </div>
            </div>

            {/* Card 2: Smart Banking Loan Playbook */}
            <div className="p-6 rounded-3xl bg-card border border-border-subtle hover:border-accent/40 shadow-xs transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                <TrendingUp size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-h3 font-bold text-foreground">Smart Loan & Bank Playbook</h3>
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  Simulate paying 1 extra EMI per year to shave years off a 20-year mortgage and save lakhs in bank interest.
                </p>
              </div>
            </div>

            {/* Card 3: Government Schemes & Subsidies */}
            <div className="p-6 rounded-3xl bg-card border border-border-subtle hover:border-accent/40 shadow-xs transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-h3 font-bold text-foreground">Vayam Scheme Integration</h3>
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  Matches your asset goals with PMAY home subsidies, EV purchase incentives, women stamp duty discounts, and Section 24b tax relief.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Notification Callout Card ── */}
        <section className="p-8 rounded-3xl bg-surface-secondary/80 border border-border-subtle text-center max-w-2xl mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto">
            <HeartHandshake size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-h3 font-bold text-foreground">Stay Tuned!</h3>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              We are fine-tuning the financial models and scheme integration. The Lifestyle Planner will be available soon in your Vayam workspace.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/" className="btn btn-primary btn-sm rounded-xl font-bold px-6">
              Return to Home Dashboard
            </Link>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
