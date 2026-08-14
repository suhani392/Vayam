"use client";

/**
 * components/education/education-pathway-view.tsx
 *
 * Visual Career Pathway Experience Component for Vayam.
 * Displays step-by-step career path visualization, starting point prefill from citizen profile,
 * multi-pathway selection, entrance exam details, skill requirements, government scheme linkages,
 * and "What if?" comparison.
 */



import React, { useState, useEffect, useRef } from "react";
import type { EducationProfession, EducationPathway, StreamRequirement } from "@/types/education";
import { deriveEducationStateFromProfile, getPathwayLinkedSchemes } from "@/lib/education/engine";
import { useUserProfile } from "@/hooks/useUserProfile";
import { PathwayComparison } from "./pathway-comparison";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ExternalLink,
  Edit3,
  ShieldCheck,
  Building2,
  Code,
  Scale,
  Stethoscope,
  Calculator,
  Palette,
  Landmark,
  Rocket,
  ChevronDown,
  Layers,
  Check,
  Target,
  Briefcase,
  TrendingUp,
  Brain,
  Zap,
} from "lucide-react";

interface EducationPathwayViewProps {
  profession: EducationProfession;
}

export function EducationPathwayView({ profession }: EducationPathwayViewProps) {
  const roadmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [profession]);

  const { profile } = useUserProfile();
  const derivedState = deriveEducationStateFromProfile(profile as any);

  // User starting position state (prefilled from profile)
  const [currentLevel, setCurrentLevel] = useState<string>(derivedState.educationLevel || "higher_secondary");
  const [currentStream, setCurrentStream] = useState<StreamRequirement>(derivedState.stream || "science");
  const [isEditingStartingPoint, setIsEditingStartingPoint] = useState<boolean>(false);

  // Filtered pathways based on user's starting point check
  const [hasCheckedPathways, setHasCheckedPathways] = useState<boolean>(false);

  const filteredPathways = React.useMemo(() => {
    if (!hasCheckedPathways) {
      return profession.pathways;
    }
    const matches = profession.pathways.filter((p) => {
      const levelMatch = !p.startingEducationLevel || p.startingEducationLevel === currentLevel;
      const streamMatch = !p.requiredStream || p.requiredStream === "any" || p.requiredStream === currentStream || currentStream === "any";
      return levelMatch && streamMatch;
    });
    return matches;
  }, [profession.pathways, currentLevel, currentStream, hasCheckedPathways]);

  // Active pathway selection
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>(
    profession.pathways[0]?.id || ""
  );

  const activePathway: EducationPathway | undefined =
    filteredPathways.find((p) => p.id === selectedPathwayId) || filteredPathways[0];

  const linkedSchemes = activePathway ? getPathwayLinkedSchemes(activePathway, profile as any) : [];

  const handleCheckPathways = () => {
    setHasCheckedPathways(true);
    setIsEditingStartingPoint(false);

    const matches = profession.pathways.filter((p) => {
      const levelMatch = !p.startingEducationLevel || p.startingEducationLevel === currentLevel;
      const streamMatch = !p.requiredStream || p.requiredStream === "any" || p.requiredStream === currentStream || currentStream === "any";
      return levelMatch && streamMatch;
    });

    if (matches.length > 0) {
      setSelectedPathwayId(matches[0].id);
    }
    roadmapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectRouteCard = (pathId: string) => {
    setSelectedPathwayId(pathId);
    roadmapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-card to-card border border-accent/30 p-8 sm:p-10 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="badge badge-saffron text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap size={14} /> Career Pathway
          </span>
          <span className="text-caption font-mono font-bold text-accent">
            Demand: {profession.demandLevel}
          </span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h1 className="text-h1 font-black text-foreground tracking-tight">
            {profession.title}
          </h1>
          <p className="text-body-lg text-muted-foreground leading-relaxed">
            {profession.shortDescription}
          </p>
          {profession.avgStartingSalaryInr && (
            <p className="text-caption font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              Average Starting Package: {profession.avgStartingSalaryInr}
            </p>
          )}
        </div>
      </div>

      {/* Starting Position Prefilled Bar */}
      <div className="rounded-2xl bg-card border border-border-subtle p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-subtle/80 text-accent flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest">
                Your Starting Position (Prefilled from Vayam Profile)
              </p>
              <h4 className="text-body-md font-bold text-foreground capitalize">
                {currentLevel.replace(/_/g, " ")} • {currentStream} Stream
              </h4>
            </div>
          </div>

          <button
            onClick={() => setIsEditingStartingPoint(!isEditingStartingPoint)}
            className="btn btn-outline btn-xs gap-1.5 font-bold cursor-pointer"
          >
            <Edit3 size={14} />
            <span>{isEditingStartingPoint ? "Close Options" : "Edit Starting Point"}</span>
          </button>
        </div>

        {/* Override Form */}
        {isEditingStartingPoint && (
          <div className="pt-4 border-t border-border-subtle space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-caption font-bold text-muted-foreground block mb-1">
                  Current Education Level
                </label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border-subtle bg-surface-secondary text-body-sm font-medium focus:outline-none focus:border-accent"
                >
                  <option value="secondary">Class 10 / Secondary</option>
                  <option value="higher_secondary">Class 12 / Higher Secondary</option>
                  <option value="diploma">Polytechnic Diploma</option>
                  <option value="undergraduate">Undergraduate Student / Degree</option>
                  <option value="postgraduate">Postgraduate / Working Professional</option>
                </select>
              </div>

              <div>
                <label className="text-caption font-bold text-muted-foreground block mb-1">
                  Stream / Background
                </label>
                <select
                  value={currentStream}
                  onChange={(e) => setCurrentStream(e.target.value as StreamRequirement)}
                  className="w-full p-2.5 rounded-xl border border-border-subtle bg-surface-secondary text-body-sm font-medium focus:outline-none focus:border-accent"
                >
                  <option value="science">Science (PCM / PCB)</option>
                  <option value="commerce">Commerce</option>
                  <option value="arts">Arts / Humanities</option>
                  <option value="any">Any Stream</option>
                </select>
              </div>
            </div>

            {/* Check Pathways Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCheckPathways}
                className="btn btn-primary rounded-xl font-bold gap-2 px-6 py-2.5 shadow-sm hover:scale-102 transition-transform cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Check Pathways</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pathway Selection Tabs (Multiple Routes) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-h3 font-bold text-foreground">Possible Educational Routes</h3>
            <p className="text-body-sm text-muted-foreground">
              Click any route card below to view its specific step-by-step roadmap and entrance exam requirements.
            </p>
          </div>
        </div>

        {filteredPathways.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPathways.map((path) => {
              const isSelected = activePathway && path.id === activePathway.id;
              return (
                <div
                  key={path.id}
                  onClick={() => handleSelectRouteCard(path.id)}
                  className={`p-6 rounded-3xl border text-left transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "bg-accent-subtle/30 border-accent shadow-md ring-2 ring-accent/30"
                      : "bg-card border-border-subtle hover:border-accent/40 text-foreground hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent">
                      {path.pathCode}
                    </span>
                    <span className="text-caption font-bold text-muted-foreground flex items-center gap-1">
                      <Clock size={13} /> {path.durationYears} Years
                    </span>
                  </div>
                  <div>
                    <h4 className="text-body-md font-bold mb-1 flex items-center justify-between">
                      <span>{path.title}</span>
                      {isSelected && <Check size={16} className="text-accent shrink-0" />}
                    </h4>
                    <p className="text-caption text-muted-foreground line-clamp-2">
                      {path.degreeQualification}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between text-caption font-bold text-accent">
                    <span>{isSelected ? "Active Roadmap Displayed ↓" : "Click to view roadmap"}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-card border border-border-subtle text-center space-y-4 shadow-2xs my-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto font-bold">
              <GraduationCap size={24} />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h4 className="text-h4 font-bold text-foreground">No pathway available</h4>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                No educational pathway matches your chosen starting level (<span className="font-bold text-foreground capitalize">{currentLevel.replace(/_/g, " ")}</span>) and <span className="font-bold text-foreground capitalize">{currentStream}</span> stream for {profession.title}.
              </p>
              <p className="text-caption font-bold text-accent">
                Please try selecting a different starting point.
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentLevel(derivedState.educationLevel || "higher_secondary");
                setCurrentStream(derivedState.stream || "science");
                setHasCheckedPathways(false);
              }}
              className="btn btn-outline btn-sm font-bold rounded-xl cursor-pointer"
            >
              Reset Starting Point
            </button>
          </div>
        )}
      </div>

      {/* Visual Step-by-Step Pathway Node Diagram */}
      {activePathway && (
        <div ref={roadmapRef} className="rounded-3xl bg-card border border-border-subtle p-6 sm:p-8 space-y-8 shadow-xs scroll-mt-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 flex-wrap gap-2">
            <div>
              <span className="text-caption font-bold text-accent font-mono uppercase tracking-widest">
                Visual Roadmap • {activePathway.pathCode}
              </span>
              <h3 className="text-h3 font-bold text-foreground">{activePathway.title}</h3>
            </div>
            <span className="badge badge-accent font-mono text-caption px-3 py-1 font-bold">
              {activePathway.steps.length} Milestones ({activePathway.durationYears} Years)
            </span>
          </div>

          {/* Step Nodes Journey */}
          <div className="relative space-y-8 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border-subtle sm:before:left-6">
            {activePathway.steps.map((step) => (
              <div key={step.stepNumber} className="relative flex items-start gap-4 sm:gap-6 pl-2">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-bold text-body-sm shadow-sm shrink-0 z-10">
                  {step.stepNumber}
                </div>
                <div className="flex-1 rounded-2xl bg-surface-secondary/50 border border-border-subtle p-5 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-body-md font-bold text-foreground">{step.stageName}</h4>
                    {step.recommendedDuration && (
                      <span className="badge badge-subtle text-[11px] font-mono font-bold">
                        <Clock size={12} className="inline mr-1" />
                        {step.recommendedDuration}
                      </span>
                    )}
                  </div>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Pathway Details Grid */}
      {activePathway && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Entrance Exams */}
            <div className="rounded-3xl bg-card border border-border-subtle p-8 space-y-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border-subtle">
                  <div className="w-10 h-10 rounded-xl bg-accent-subtle/80 text-accent flex items-center justify-center font-bold">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="text-h4 font-bold text-foreground">Entrance Examinations</h4>
                    <p className="text-caption text-muted-foreground">Required national & state entrance tests</p>
                  </div>
                </div>

                {activePathway.entranceExams.length > 0 ? (
                  <div className="space-y-4 pt-1">
                    {activePathway.entranceExams.map((exam, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-surface-secondary/60 border border-border-subtle space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="text-body-md font-bold text-foreground">{exam.name}</h5>
                            <p className="text-caption text-muted-foreground font-medium">{exam.fullName}</p>
                          </div>
                          {exam.websiteUrl && (
                            <a
                              href={exam.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline btn-xs rounded-lg text-accent hover:underline flex items-center gap-1 text-caption font-bold shrink-0"
                            >
                              <span>Official Portal</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <p className="text-body-sm text-muted-foreground leading-relaxed">{exam.description}</p>
                        <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between text-caption font-bold text-accent">
                          <span>Eligibility: {exam.eligibility}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-surface-secondary/40 border border-border-subtle text-center text-body-sm text-muted-foreground italic">
                    No competitive national entrance exam is required for this route. Admissions are based on merit / qualifying marks.
                  </div>
                )}
              </div>
            </div>

            {/* Core Skills & Outcomes Block */}
            <div className="rounded-3xl bg-card border border-border-subtle p-8 space-y-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border-subtle">
                  <div className="w-10 h-10 rounded-xl bg-accent-subtle/80 text-accent flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="text-h4 font-bold text-foreground">Important Skills & Outcomes</h4>
                    <p className="text-caption text-muted-foreground">Core competencies, degree award & career mobility</p>
                  </div>
                </div>

                {/* Target Qualification Badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-card border border-accent/20 space-y-1">
                  <span className="text-[11px] font-bold text-accent uppercase tracking-wider block flex items-center gap-1">
                    <Target size={12} /> Target Degree & Qualification
                  </span>
                  <p className="text-body-md font-extrabold text-foreground">
                    {activePathway.degreeQualification}
                  </p>
                </div>

                {/* Required Core Skills */}
                <div className="space-y-3">
                  <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest block flex items-center gap-1.5">
                    <Brain size={14} className="text-accent" /> Essential Competencies & Skill Focus
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activePathway.keySkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-surface-secondary/70 border border-border-subtle flex items-center gap-2 text-body-sm font-bold text-foreground"
                      >
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alternative Career Mobility Routes */}
                {activePathway.alternativeRoutes.length > 0 && (
                  <div className="pt-4 border-t border-border-subtle space-y-3">
                    <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest block flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-accent" /> Alternative Career Mobility & Specializations
                    </span>
                    <div className="space-y-2">
                      {activePathway.alternativeRoutes.map((alt, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-card border border-border-subtle/80 flex items-start gap-2.5 text-body-sm text-muted-foreground leading-relaxed">
                          <Zap size={14} className="text-accent shrink-0 mt-0.5" />
                          <span className="font-medium text-foreground">{alt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* "What If?" Comparison Component */}
          <PathwayComparison
            pathways={profession.pathways}
            selectedPathId={activePathway.id}
            onSelectPath={(id) => handleSelectRouteCard(id)}
          />
        </>
      )}

      {/* Government Opportunities & Schemes Integration */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-card to-card border border-emerald-500/30 p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-h3 font-bold text-foreground">Government Opportunities You May Explore</h3>
          </div>
          <p className="text-body-sm text-muted-foreground max-w-2xl">
            Vayam connects education pathfinding directly with verified government scholarships and education loan interest subsidy schemes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {linkedSchemes.map(({ scheme, isEligible, reason }) => (
            <div key={scheme.id} className="p-5 rounded-2xl bg-card border border-border-subtle space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="badge badge-emerald text-[10px]">Scholarship & Loan</span>
                <h4 className="text-body-sm font-bold text-foreground">{scheme.title}</h4>
                <p className="text-caption text-muted-foreground line-clamp-2">{scheme.shortDescription}</p>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {isEligible ? "✓ Likely Eligible" : "Check Rules"}
                </span>
                <Link
                  href={`/explore?query=${encodeURIComponent(scheme.title)}`}
                  className="btn btn-outline btn-xs rounded-xl font-bold gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
