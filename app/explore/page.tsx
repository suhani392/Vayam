"use client";

/**
 * app/explore/page.tsx
 *
 * Vayam Phase 7: Explore, Search & Discovery Page.
 * Enables citizens to browse, search, filter, and discover normalized KnowledgeRecords
 * across Education, Services, Finance, Benefits, Rights, and Career.
 *
 * Integrates seamlessly with Phase 5 Civic Intelligence Core for explainable personalization,
 * and Phase 6B for source provenance badges. Zero AI dependencies.
 */

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { Card, CardContent } from "@/components/ui/card";
import { searchKnowledgeRecords, getPersonalizedKnowledge } from "@/lib/knowledge/search";
import { TEST_PROFILES } from "@/lib/core/data/test-profiles";
import type { UserProfile } from "@/lib/core/types";
import {
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  User,
  SlidersHorizontal,
  Compass,
  RotateCcw,
  BookOpen,
  Briefcase,
  Landmark,
  HeartHandshake,
  Shield,
  GraduationCap,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Categories", icon: Compass },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "services", label: "Services", icon: Landmark },
  { id: "finance", label: "Finance", icon: HeartHandshake },
  { id: "benefits", label: "Benefits", icon: Shield },
  { id: "rights", label: "Rights", icon: BookOpen },
  { id: "career", label: "Career", icon: Briefcase },
];

const TYPES = [
  { id: "all", label: "All Types" },
  { id: "SCHEME", label: "Schemes" },
  { id: "SERVICE", label: "Services" },
  { id: "SCHOLARSHIP", label: "Scholarships" },
  { id: "RIGHT", label: "Rights" },
  { id: "FINANCIAL_SUPPORT", label: "Financial Support" },
  { id: "CAREER", label: "Career" },
];

import { useLanguage } from "@/hooks/useLanguage";

export default function ExplorePage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"recommended" | "title">("recommended");

  // Profile toggle simulation (Profile B default, option to toggle off profile)
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(TEST_PROFILES.profileB);

  // Personalized Records via Phase 5 Core
  const personalizedItems = useMemo(() => {
    if (!activeProfile) return [];
    return getPersonalizedKnowledge(activeProfile);
  }, [activeProfile]);

  const personalizedMap = useMemo(() => {
    const map = new Map<string, any>();
    personalizedItems.forEach((item) => {
      map.set(item.record.id, item.recommendation);
    });
    return map;
  }, [personalizedItems]);

  // Filtered Search Results
  const searchResults = useMemo(() => {
    return searchKnowledgeRecords({
      query: searchQuery,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      type: selectedType === "all" ? undefined : (selectedType as any),
      verificationStatus: verifiedOnly ? "VERIFIED" : undefined,
      sortBy,
      profile: activeProfile,
    });
  }, [searchQuery, selectedCategory, selectedType, verifiedOnly, sortBy, activeProfile]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setVerifiedOnly(false);
  };

  return (
    <PageContainer width="wide">
      {/* ── Page Header ── */}
      <PageHeader
        badge={
          <span className="badge badge-primary gap-1">
            <Compass size={12} /> Discovery & Search
          </span>
        }
        title="Explore Vayam"
        description="Find services, opportunities, benefits and rights that matter to you."
      />

      {/* ── Profile Context Switcher Banner ── */}
      <div className="mb-6 p-4 rounded-2xl border border-border-subtle bg-surface-secondary/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
            <User size={18} />
          </div>
          <div>
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-wider block">
              Active Personalization Context:
            </span>
            <p className="text-body-sm font-semibold text-foreground">
              {activeProfile
                ? `${activeProfile.name} (Age 18 · Student · Maharashtra)`
                : "Exploring without profile personalization"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeProfile ? (
            <button
              onClick={() => setActiveProfile(null)}
              className="btn btn-outline btn-xs gap-1 font-semibold"
            >
              Browse Without Personalization
            </button>
          ) : (
            <button
              onClick={() => setActiveProfile(TEST_PROFILES.profileB)}
              className="btn btn-primary btn-xs gap-1 font-semibold"
            >
              <Sparkles size={12} /> Enable Profile Personalization
            </button>
          )}
        </div>
      </div>

      {/* ── Large Search & Filter Bar ── */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes, services, rights, education, finance, loans, driving licence..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-card text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-caption text-muted-foreground hover:text-foreground font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Category Filter Pills ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-body-sm font-semibold whitespace-nowrap transition-all duration-150 border",
                  isSelected
                    ? "bg-accent text-accent-foreground border-accent shadow-xs"
                    : "bg-card text-foreground border-border-subtle hover:border-accent/40"
                )}
              >
                <Icon size={15} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Secondary Controls: Type, Verification, Sorting ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-subtle text-caption">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter size={12} /> Type:
            </span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border-subtle bg-card text-foreground font-medium text-caption focus:outline-none"
            >
              {TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition-all",
                verifiedOnly
                  ? "bg-success/15 text-success border-success/40"
                  : "bg-card text-muted-foreground border-border-subtle hover:text-foreground"
              )}
            >
              <ShieldCheck size={13} />
              <span>Verified Only</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal size={12} /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-border-subtle bg-card text-foreground font-medium text-caption focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="title">A-Z Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Personalized "For You" Section ── */}
      {activeProfile && searchQuery === "" && selectedCategory === "all" && (
        <section className="mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h2 className="text-h3 font-bold text-foreground">Recommended for You</h2>
            </div>
            <span className="text-caption font-semibold text-muted-foreground">
              Evaluated by Civic Intelligence Core
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalizedItems.slice(0, 3).map((item) => (
              <KnowledgeCard
                key={item.record.id}
                record={item.record}
                personalized={item.recommendation}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Main Knowledge Results Grid ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-h3 font-bold text-foreground">
            {selectedCategory === "all" ? t("explore.allRecords") : `${selectedCategory.toUpperCase()}`}
            <span className="text-body-sm font-normal text-muted-foreground ml-2">
              ({searchResults.length})
            </span>
          </h2>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((record) => (
              <KnowledgeCard
                key={record.id}
                record={record}
                personalized={personalizedMap.get(record.id) || null}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <Card variant="default" className="p-8 text-center space-y-4">
            <CardContent className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-secondary text-muted-foreground flex items-center justify-center mx-auto">
                <Search size={24} />
              </div>
              <h3 className="text-h4 font-bold text-foreground">No results found</h3>
              <p className="text-body-sm text-muted-foreground max-w-md mx-auto">
                We couldn't find any knowledge records matching your current query or filter criteria.
              </p>

              <div className="pt-4 space-y-2">
                <span className="text-caption font-bold text-muted-foreground uppercase tracking-wider block">
                  Try broader search terms:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {["scholarship", "driving licence", "voter registration", "loan", "pension", "rights"].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="badge badge-accent hover:badge-primary cursor-pointer transition-all"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button onClick={handleResetFilters} className="btn btn-outline btn-sm gap-1 font-bold">
                  <RotateCcw size={14} /> Reset All Filters
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </PageContainer>
  );
}
