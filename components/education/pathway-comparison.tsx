"use client";

/**
 * components/education/pathway-comparison.tsx
 *
 * "What if I choose another path?" Interactive Pathway Comparison Component.
 * Enables normal citizens to compare multiple educational routes side-by-side:
 * Entry requirements, duration, entrance exams, degree qualification, major differences, and next steps.
 */

import React from "react";
import type { EducationPathway } from "@/types/education";
import { CheckCircle2, Clock, FileText, GraduationCap, AlertCircle, ArrowRight } from "lucide-react";

interface PathwayComparisonProps {
  pathways: EducationPathway[];
  selectedPathId?: string;
  onSelectPath?: (pathId: string) => void;
}

export function PathwayComparison({ pathways, selectedPathId, onSelectPath }: PathwayComparisonProps) {
  if (!pathways || pathways.length === 0) return null;

  return (
    <div className="space-y-6 bg-surface-secondary/40 border border-border-subtle rounded-3xl p-6 sm:p-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="badge badge-saffron text-[11px] font-bold">Interactive Compare</span>
          <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">
            "What if I choose another path?"
          </span>
        </div>
        <h3 className="text-h3 font-bold text-foreground">
          Compare Pathways Side-by-Side
        </h3>
        <p className="text-body-sm text-muted-foreground max-w-3xl">
          Different routes lead to the same destination. Compare entry requirements, entrance exam stress, overall duration, and career flexibility to find the best fit for your situation.
        </p>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="p-4 text-caption font-bold text-muted-foreground uppercase tracking-wider w-1/4">
                Comparison Feature
              </th>
              {pathways.map((path) => (
                <th
                  key={path.id}
                  className={`p-4 rounded-t-2xl border-t border-x border-border-subtle ${
                    selectedPathId === path.id ? "bg-accent-subtle/50 text-accent" : "bg-card text-foreground"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10">
                      {path.pathCode}
                    </span>
                    <h4 className="text-body-sm font-bold truncate">{path.title}</h4>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-body-sm">
            {/* Qualification */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground flex items-center gap-2">
                <GraduationCap size={16} className="text-accent" /> Degree / Qualification
              </td>
              {pathways.map((path) => (
                <td key={path.id} className="p-4 bg-card font-medium text-foreground">
                  {path.degreeQualification}
                </td>
              ))}
            </tr>

            {/* Duration */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground flex items-center gap-2">
                <Clock size={16} className="text-accent" /> Approximate Duration
              </td>
              {pathways.map((path) => (
                <td key={path.id} className="p-4 bg-card font-bold text-foreground">
                  {path.durationYears} Years
                </td>
              ))}
            </tr>

            {/* Stream Requirement */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground flex items-center gap-2">
                <FileText size={16} className="text-accent" /> Stream Requirement
              </td>
              {pathways.map((path) => (
                <td key={path.id} className="p-4 bg-card font-medium text-foreground capitalize">
                  {path.requiredStream === "any" ? "Any Stream (Science / Commerce / Arts)" : `${path.requiredStream} Stream`}
                </td>
              ))}
            </tr>

            {/* Entrance Exams */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground flex items-center gap-2">
                <AlertCircle size={16} className="text-accent" /> Entrance Exams
              </td>
              {pathways.map((path) => (
                <td key={path.id} className="p-4 bg-card text-foreground">
                  {path.entranceExams.length > 0 ? (
                    <div className="space-y-1">
                      {path.entranceExams.map((exam, idx) => (
                        <div key={idx} className="text-caption font-bold text-foreground flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          <span>{exam.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-caption italic">No Competitive Entrance Exam Required</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Key Skills */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent" /> Core Skills Focus
              </td>
              {pathways.map((path) => (
                <td key={path.id} className="p-4 bg-card text-foreground">
                  <div className="flex flex-wrap gap-1">
                    {path.keySkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="badge badge-subtle text-[10px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Action */}
            {onSelectPath && (
              <tr>
                <td className="p-4 font-semibold text-muted-foreground">Select Pathway</td>
                {pathways.map((path) => (
                  <td key={path.id} className="p-4 bg-card">
                    <button
                      onClick={() => onSelectPath(path.id)}
                      className={`w-full btn btn-xs rounded-xl font-bold gap-1 ${
                        selectedPathId === path.id
                          ? "btn-primary"
                          : "btn-outline hover:btn-primary"
                      }`}
                    >
                      <span>{selectedPathId === path.id ? "Viewing Path" : "View This Path"}</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
