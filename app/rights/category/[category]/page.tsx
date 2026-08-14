"use client";

/**
 * app/rights/category/[category]/page.tsx
 *
 * Dedicated Rights & Acts Category Detail Page for Vayam.
 * Displays governing Indian Legal Acts, Statutory Rights & Sections,
 * Common Situations, and Official Helplines for a specific category.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { RIGHTS_CATEGORIES } from "@/data/rights";
import { fetchDbLegalSituations, fetchDbLegalActs, fetchDbLegalRights } from "@/lib/db/fetchers";
import type { LegalSituation, RightsCategory, LegalAct, LegalRight } from "@/types/rights";
import { LegalSituationView } from "@/components/rights/legal-situation-view";
import {
  Scale,
  BookOpen,
  ShieldCheck,
  PhoneCall,
  ArrowLeft,
  ExternalLink,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function RightsCategoryDetailPage() {
  const params = useParams();
  const categorySlug = (params?.category as string) || "consumer_rights";

  const [categoryMeta, setCategoryMeta] = useState<any>(null);
  const [situations, setSituations] = useState<LegalSituation[]>([]);
  const [dbActs, setDbActs] = useState<LegalAct[]>([]);
  const [dbRights, setDbRights] = useState<LegalRight[]>([]);
  const [activeSituation, setActiveSituation] = useState<LegalSituation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDbLegalSituations(),
      fetchDbLegalActs(),
      fetchDbLegalRights(),
    ]).then(([allSituations, allActs, allRights]) => {
      // Find category meta
      const cat = RIGHTS_CATEGORIES.find(
        (c) => c.id === categorySlug || c.id.replace("_", "-") === categorySlug
      ) || {
        id: categorySlug as RightsCategory,
        title: categorySlug.replace(/_/g, " ").toUpperCase(),
        description: "Official Indian legal rights, governing acts, and statutory protections.",
        iconName: "Scale",
      };

      setCategoryMeta(cat);

      // Filter situations, acts, and rights belonging to this category
      const catSituations = (allSituations || []).filter(
        (s) => s.category === categorySlug || s.category === cat.id
      );

      const catActs = (allActs || []).filter(
        (a) => a.category ? (a.category === categorySlug || a.category === cat.id) : true
      );

      const catRights = (allRights || []).filter(
        (r) => r.category ? (r.category === categorySlug || r.category === cat.id) : true
      );

      setSituations(catSituations);
      setDbActs(catActs);
      setDbRights(catRights);
      setLoading(false);
    });
  }, [categorySlug]);

  const catTitle = categoryMeta?.title || categorySlug.replace(/_/g, " ");

  return (
    <PageContainer width="standard">
      <div className="space-y-8 pb-16">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/rights"
            className="btn btn-ghost btn-sm gap-2 font-bold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Rights Hub</span>
          </Link>
          <span className="badge badge-subtle font-mono text-[11px] flex items-center gap-1">
            <Clock size={12} /> Verified 2026
          </span>
        </div>

        {/* Page Header */}
        <PageHeader
          badge={
            <span className="badge badge-saffron font-bold text-caption uppercase tracking-wider inline-flex items-center gap-1.5 px-3 py-1">
              <Scale size={14} /> Legal Rights & Acts
            </span>
          }
          title={`${catTitle} Rights & Acts`}
          description={
            categoryMeta?.description ||
            `Explore all statutory rights, governing Indian legal acts, common situations, and helplines for ${catTitle}.`
          }
        />

        {/* Dynamic Detail View if a specific situation card is selected */}
        {activeSituation ? (
          <div className="space-y-4 pt-4 border-t border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">
                Selected Situation Roadmap
              </span>
              <button
                onClick={() => setActiveSituation(null)}
                className="btn btn-outline btn-xs rounded-xl font-bold cursor-pointer"
              >
                ← Back to Category Overview
              </button>
            </div>
            <LegalSituationView situation={activeSituation} />
          </div>
        ) : (
          <div className="space-y-12">
            {/* 1. SECTION: Governing Indian Legal Acts */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen size={22} className="text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-h2 font-black text-foreground tracking-tight">
                  1. Governing Legal Acts & Statutory Legislation
                </h2>
              </div>
              <p className="text-body-md text-muted-foreground">
                Primary Acts stored in database governing rights in this category:
              </p>

              {dbActs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dbActs.map((act) => (
                    <div
                      key={act.id}
                      className="p-6 rounded-3xl bg-card border border-border-subtle space-y-3 shadow-2xs hover:border-emerald-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="badge badge-subtle font-mono text-caption font-bold">
                          {act.actNumber || `Enacted ${act.enactmentYear}`}
                        </span>
                        <span className="text-caption text-muted-foreground font-semibold">
                          {act.jurisdiction || "Central"} Jurisdiction
                        </span>
                      </div>
                      <h3 className="text-h3 font-bold text-foreground">{act.title}</h3>
                      <p className="text-body-sm text-muted-foreground leading-relaxed">
                        {act.summary || `Statutory legislation passed by Parliament regulating rights, remedies, and compliance under ${act.title}.`}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-caption text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>{act.ministry || "Government of India"}</span>
                        <a
                          href="https://doj.gov.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          Official Gazette <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-surface-secondary/50 border border-border-subtle text-body-sm text-muted-foreground">
                  No statutory acts linked for this category yet.
                </div>
              )}
            </div>

            {/* 2. SECTION: Statutory Rights & Section Protections */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={22} className="text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-h2 font-black text-foreground tracking-tight">
                  2. Guaranteed Statutory Rights & Sections
                </h2>
              </div>
              <p className="text-body-md text-muted-foreground">
                Section-level statutory rights retrieved directly from the database:
              </p>

              {dbRights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dbRights.map((right) => (
                    <div
                      key={right.id}
                      className="p-5 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="badge badge-saffron text-caption font-bold">
                          {right.sectionNumber || "Statutory Right"}
                        </span>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                      <h4 className="text-body-md font-bold text-foreground">{right.rightTitle}</h4>
                      <p className="text-body-sm text-muted-foreground">
                        {right.plainLanguageExplanation || right.legalText}
                      </p>
                      {right.penaltyOrRemedy && (
                        <p className="text-caption text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                          <strong>Legal Remedy:</strong> {right.penaltyOrRemedy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-surface-secondary/50 border border-border-subtle text-body-sm text-muted-foreground">
                  No statutory rights registered for this category yet.
                </div>
              )}
            </div>

            {/* 3. SECTION: Common Situations & Resolutions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info size={22} className="text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-h2 font-black text-foreground tracking-tight">
                  3. Common Real-Life Situations in this Category
                </h2>
              </div>
              <p className="text-body-md text-muted-foreground">
                Click any real-life situation below to view the step-by-step legal roadmap, evidence checklist, and helplines:
              </p>

              {situations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {situations.map((sit) => (
                    <div
                      key={sit.id}
                      onClick={() => setActiveSituation(sit)}
                      className="p-6 rounded-3xl bg-card border border-border-subtle hover:border-emerald-500 text-left transition-all cursor-pointer space-y-3 shadow-2xs group"
                    >
                      <h4 className="text-body-md font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {sit.title}
                      </h4>
                      <p className="text-caption text-muted-foreground line-clamp-2">
                        {sit.summary}
                      </p>
                      <div className="flex items-center gap-1.5 text-caption font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                        <span>View Full Legal Roadmap</span>
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-surface-secondary/50 border border-border-subtle text-body-sm text-muted-foreground">
                  No specific scenario pre-loaded for this category yet. You can type your exact situation on the main Rights Hub page to get instant AI legal analysis!
                </div>
              )}
            </div>

            {/* 4. SECTION: Official Helplines & Grievance Portals */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-card to-card border border-emerald-500/20 space-y-4">
              <div className="flex items-center gap-2">
                <PhoneCall size={20} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-h3 font-bold text-foreground">Official Government Helplines & Portals</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-card border border-border-subtle space-y-1">
                  <span className="text-caption font-bold text-muted-foreground uppercase">National Consumer Helpline</span>
                  <div className="text-h3 font-black text-emerald-600 dark:text-emerald-400">1915</div>
                  <p className="text-caption text-muted-foreground">Toll-free consumer grievance helpline (All India)</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border-subtle space-y-1">
                  <span className="text-caption font-bold text-muted-foreground uppercase">National Legal Aid (NALSA)</span>
                  <div className="text-h3 font-black text-emerald-600 dark:text-emerald-400">15100</div>
                  <p className="text-caption text-muted-foreground">Free 24/7 legal aid & advice helpline</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
