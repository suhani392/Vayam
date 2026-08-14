"use client";

/**
 * app/education/page.tsx
 *
 * Education Pathfinder Landing Page for Vayam.
 * Enables citizens to explore realistic educational and career pathways.
 */

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getAllEducationProfessions, searchEducationProfessions, getSuggestedCareersForProfile, CAREER_CATEGORIES, matchCareerCategory } from "@/lib/education/engine";
import { fetchDbEducationPathways } from "@/lib/db/fetchers";
import type { EducationProfession } from "@/types/education";
import { ErrorState } from "@/components/feedback/feedback";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Code,
  Stethoscope,
  Scale,
  Calculator,
  Palette,
  Building2,
  Landmark,
  Rocket,
  Compass,
  AlertTriangle,
} from "lucide-react";
import { EducationPathwayView } from "@/components/education/education-pathway-view";

const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code size={20} />,
  Stethoscope: <Stethoscope size={20} />,
  Scale: <Scale size={20} />,
  Calculator: <Calculator size={20} />,
  Palette: <Palette size={20} />,
  Building2: <Building2 size={20} />,
  GraduationCap: <GraduationCap size={20} />,
  Landmark: <Landmark size={20} />,
  Rocket: <Rocket size={20} />,
};

export default function EducationPage() {
  const { t } = useLanguage();
  const { profile } = useUserProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeProfession, setActiveProfession] = useState<EducationProfession | null>(null);
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    fetchDbEducationPathways().then(() => {
      setDbLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeProfession]);

  const allProfessions = getAllEducationProfessions();
  const suggestedProfessions = getSuggestedCareersForProfile(profile as any);

  const toggleCategory = (catId: string) => {
    if (catId === "all") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const filteredProfessions = searchEducationProfessions(searchQuery).filter(
    (p) =>
      selectedCategories.length === 0 ||
      selectedCategories.some((catId) => matchCareerCategory(p.category, catId))
  );

  if (activeProfession) {
    return (
      <PageContainer width="standard">
        <div className="mb-6">
          <button
            onClick={() => setActiveProfession(null)}
            className="btn btn-outline btn-xs rounded-xl gap-2 font-bold cursor-pointer"
          >
            ← Back to All Careers
          </button>
        </div>
        <EducationPathwayView profession={activeProfession} />
      </PageContainer>
    );
  }

  // 1. Database empty or error state
  if (dbLoaded && allProfessions.length === 0) {
    return (
      <PageContainer width="standard">
        <div className="space-y-8 pb-16">
          <PageHeader
            badge={
              <span className="badge badge-saffron font-bold text-caption uppercase tracking-wider inline-flex items-center gap-1.5 px-3 py-1">
                <GraduationCap size={14} /> Education Pathfinder
              </span>
            }
            title="Where do you want to go?"
            description="Tell Vayam what you want to become. We'll help you understand the possible pathways from where you are today."
          />
          <div className="py-12">
            <ErrorState
              title="Oops! Something went wrong"
              message="No education career pathways or records were found in the database. Please verify your database connection."
              onRetry={() => {
                setDbLoaded(false);
                fetchDbEducationPathways().then(() => setDbLoaded(true));
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
              <GraduationCap size={14} /> Education Pathfinder
            </span>
          }
          title="Where do you want to go?"
          description="Tell Vayam what you want to become. We'll help you understand the possible pathways from where you are today."
        />

        {/* Profile-Aware Suggested Careers */}
        {suggestedProfessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h3 className="text-h3 font-bold text-foreground">Suggested for Your Profile Stage</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedProfessions.map((prof) => (
                <div
                  key={prof.id}
                  onClick={() => setActiveProfession(prof)}
                  className="group p-6 rounded-3xl bg-card border border-border-subtle hover:border-accent/40 transition-all cursor-pointer space-y-4 shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-accent-subtle/80 text-accent flex items-center justify-center font-bold">
                      {ICON_MAP[prof.iconName] || <GraduationCap size={20} />}
                    </div>
                    <span className="badge badge-subtle text-[10px]">{prof.demandLevel} Demand</span>
                  </div>

                  <div>
                    <h4 className="text-body-md font-bold text-foreground group-hover:text-accent transition-colors">
                      {prof.title}
                    </h4>
                    <p className="text-caption text-muted-foreground line-clamp-2 mt-1">
                      {prof.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-caption font-bold text-accent">
                    <span>{prof.pathways.length} Pathways Available</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-h3 font-bold text-foreground">Browse Career Categories</h3>
            {selectedCategories.length > 0 && (
              <span className="text-caption font-bold text-accent font-mono">
                {selectedCategories.length} category filter{selectedCategories.length > 1 ? "s" : ""} active
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleCategory("all")}
              className={`btn btn-xs rounded-xl font-bold transition-all ${
                selectedCategories.length === 0 ? "btn-primary" : "btn-outline hover:btn-primary"
              }`}
            >
              All Categories
            </button>
            {CAREER_CATEGORIES.map((cat: { id: string; label: string }) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`btn btn-xs rounded-xl font-bold transition-all ${
                    isSelected ? "btn-primary shadow-xs" : "btn-outline hover:btn-primary"
                  }`}
                >
                  {isSelected ? "✓ " : ""}{cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* All Filtered Professions */}
        <div className="space-y-4">
          {filteredProfessions.length === 0 ? (
            <div className="py-12 text-center p-8 rounded-3xl bg-card border border-border-subtle space-y-4 max-w-md mx-auto my-6 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-surface-secondary text-muted-foreground flex items-center justify-center mx-auto">
                <GraduationCap size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-h4 font-bold text-foreground">No careers found</h4>
                <p className="text-body-sm text-muted-foreground">
                  No career pathways matched your selected category filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                }}
                className="btn btn-outline btn-sm font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessions.map((prof) => (
                <div
                  key={prof.id}
                  onClick={() => setActiveProfession(prof)}
                  className="group p-6 rounded-3xl bg-card border border-border-subtle hover:border-accent/40 transition-all cursor-pointer space-y-4 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-accent-subtle/80 text-accent flex items-center justify-center font-bold">
                        {ICON_MAP[prof.iconName] || <GraduationCap size={20} />}
                      </div>
                      <span className="badge badge-subtle text-[10px]">{prof.demandLevel}</span>
                    </div>

                    <div>
                      <h4 className="text-body-md font-bold text-foreground group-hover:text-accent transition-colors">
                        {prof.title}
                      </h4>
                      <p className="text-caption text-muted-foreground line-clamp-2 mt-1">
                        {prof.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-caption font-bold text-accent font-mono">Explore Pathways</span>
                    <button className="btn btn-primary btn-xs rounded-xl font-bold gap-1">
                      <span>View</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
