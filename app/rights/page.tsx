"use client";

/**
 * app/rights/page.tsx
 *
 * Know Your Rights Page for Vayam.
 * Enables ordinary citizens to describe real-life situations in natural language
 * and understand relevant legal protections, evidence to preserve, practical options,
 * and official helplines without needing complex legal terminology.
 */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { RIGHTS_CATEGORIES, getAllLegalSituations, searchLegalSituations } from "@/lib/rights/engine";
import { analyzeLegalSituation } from "@/lib/rights/engine";
import { fetchDbLegalSituations } from "@/lib/db/fetchers";
import type { LegalSituation, RightsCategory } from "@/types/rights";
import { LegalSituationView } from "@/components/rights/legal-situation-view";
import { ErrorState } from "@/components/feedback/feedback";
import { cn } from "@/lib/utils/cn";
import {
  Scale,
  Search,
  ArrowRight,
  Shield,
  IndianRupee,
  ShoppingBag,
  Briefcase,
  Home,
  ShieldAlert,
  Users,
  FileText,
  Building,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  IndianRupee: <IndianRupee size={20} />,
  ShoppingBag: <ShoppingBag size={20} />,
  Briefcase: <Briefcase size={20} />,
  Home: <Home size={20} />,
  ShieldAlert: <ShieldAlert size={20} />,
  Users: <Users size={20} />,
  Shield: <Shield size={20} />,
  FileText: <FileText size={20} />,
  Building: <Building size={20} />,
};

export default function RightsPage() {
  const { t } = useLanguage();
  const analysisRef = useRef<HTMLDivElement>(null);

  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RightsCategory | null>(null);
  const [activeSituation, setActiveSituation] = useState<LegalSituation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [legalSituations, setLegalSituations] = useState<LegalSituation[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    fetchDbLegalSituations().then((situations) => {
      setLegalSituations(situations || []);
      const filtered = (RIGHTS_CATEGORIES || []).filter(
        (c) => (c.id as string) !== "rights" && c.title.toLowerCase() !== "rights"
      );
      setCategoriesList(filtered);
      setDbLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (activeSituation && analysisRef.current) {
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [activeSituation]);

  // Derive dynamic sample queries directly from database rows
  const sampleQueries = legalSituations.length > 0
    ? legalSituations.map((s) => s.situationPatterns[0] || s.title).slice(0, 5)
    : [];

  const [showBrowseCategories, setShowBrowseCategories] = useState(true);

  const handleAnalyze = (queryText?: string) => {
    const textToAnalyze = queryText !== undefined ? queryText : naturalLanguageInput;
    if (!textToAnalyze.trim()) {
      setError("Please enter a situation first");
      setActiveSituation(null);
      return;
    }
    setError(null);
    const result = analyzeLegalSituation(
      textToAnalyze.trim(),
      selectedCategory || undefined
    );
    setActiveSituation(result.situation);
    setShowBrowseCategories(false);
  };

  const handleCategorySelect = (catId: RightsCategory, catTitle?: string) => {
    setSelectedCategory(catId);
    setError(null);
    const textToAnalyze = naturalLanguageInput.trim() || catTitle || "";
    const result = analyzeLegalSituation(textToAnalyze, catId);
    setActiveSituation(result.situation);
    setShowBrowseCategories(false);
  };

  // Database Empty Error State
  if (dbLoaded && legalSituations.length === 0) {
    return (
      <PageContainer width="standard">
        <div className="space-y-8 pb-16">
          <PageHeader
            badge={
              <span className="badge badge-saffron font-bold text-caption uppercase tracking-wider inline-flex items-center gap-1.5 px-3 py-1">
                <Scale size={14} /> Know Your Rights
              </span>
            }
            title="Know Your Rights"
            description="Understand the law in simple language. Describe your situation — you don't need to know the legal terminology."
          />
          <div className="py-12">
            <ErrorState
              title="Oops! Something went wrong"
              message="No legal situations or rights data were found in the database. Please verify your database connection and try again."
              onRetry={() => {
                setDbLoaded(false);
                fetchDbLegalSituations().then((situations) => {
                  setLegalSituations(situations || []);
                  setCategoriesList(RIGHTS_CATEGORIES || []);
                  setDbLoaded(true);
                });
              }}
            />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer width="standard">
      <div className="space-y-12 pb-16">
        {/* Header Banner */}
        <PageHeader
          badge={
            <span className="badge badge-saffron font-bold text-caption uppercase tracking-wider inline-flex items-center gap-1.5 px-3 py-1">
              <Scale size={14} /> Know Your Rights
            </span>
          }
          title="Know Your Rights"
          description="Understand the law in simple language. Describe your situation — you don't need to know the legal terminology."
        />

        {/* Natural Language Situation Input Box */}
        <div className="rounded-3xl bg-card border border-border-subtle p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-body-md font-bold text-foreground block">
              What happened? Describe your situation in plain language:
            </label>
            <div className="relative">
              <textarea
                value={naturalLanguageInput}
                onChange={(e) => {
                  setNaturalLanguageInput(e.target.value);
                  if (error) setError(null);
                  if (activeSituation) {
                    setActiveSituation(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAnalyze();
                  }
                }}
                rows={4}
                placeholder="Example: My friend borrowed ₹20,000 from me and has not returned it..."
                className={cn(
                  "w-full p-4 rounded-2xl border text-body-md font-medium focus:outline-none resize-y transition-colors",
                  error
                    ? "border-destructive bg-destructive/5 focus:border-destructive"
                    : "border-border-subtle bg-surface-secondary focus:border-emerald-500"
                )}
              />
            </div>
            {error && (
              <p className="text-body-sm font-semibold text-destructive flex items-center gap-1.5 mt-1.5" role="alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Quick Sample Queries */}
            <div className="space-y-1 flex-1">
              <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest">
                Try a Sample Situation:
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setNaturalLanguageInput(sample);
                      handleAnalyze(sample);
                    }}
                    className="btn btn-subtle btn-xs rounded-xl text-caption font-medium hover:btn-primary cursor-pointer"
                  >
                    "{sample.slice(0, 35)}..."
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleAnalyze()}
              className="btn btn-primary px-6 py-3 rounded-xl font-bold gap-2 shadow-sm cursor-pointer hover:bg-emerald-600 bg-emerald-600 border-emerald-600"
            >
              <Sparkles size={18} />
              <span>Understand Rights & Options</span>
            </button>
          </div>
        </div>

        {/* Common Situation Categories */}
        {categoriesList.length > 0 && (
          showBrowseCategories ? (
            <div className="space-y-4">
              <h3 className="text-h3 font-bold text-foreground">Or Browse Common Rights Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriesList.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      href={`/rights/category/${cat.id}` as any}
                      className={`p-6 rounded-3xl border text-left transition-all cursor-pointer space-y-3 shadow-2xs block ${
                        isSelected
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "bg-card border-border-subtle hover:border-emerald-500/40 text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                          {CATEGORY_ICON_MAP[cat.iconName] || <Scale size={20} />}
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="text-body-md font-bold">{cat.title}</h4>
                        <p className="text-caption text-muted-foreground line-clamp-2 mt-1">
                          {cat.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowBrowseCategories(true)}
                className="btn btn-outline btn-sm rounded-xl font-bold gap-2 cursor-pointer hover:btn-primary"
              >
                <Scale size={16} />
                <span>Browse All Categories</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )
        )}

        {/* Structured Legal Output View (Only shown after clicking Understand Rights & Options) */}
        {activeSituation && (
          <div ref={analysisRef} className="pt-6 border-t border-border-subtle space-y-4 scroll-mt-6">
            <div className="flex items-center justify-between">
              <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">
                Analysis Results
              </span>
              <button
                onClick={() => setActiveSituation(null)}
                className="btn btn-outline btn-xs rounded-xl font-bold cursor-pointer"
              >
                ← Clear / Check Another Situation
              </button>
            </div>
            <LegalSituationView situation={activeSituation} userQuery={naturalLanguageInput} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
