"use client";

/**
 * components/rights/legal-situation-view.tsx
 *
 * Structured 9-Part Legal Information Component for Know Your Rights in Vayam.
 * Renders verified plain-language Indian law explanations, evidence checklists,
 * practical next steps, official helpline contacts, and trust disclaimers.
 */

import React from "react";
import type { LegalSituation } from "@/types/rights";
import {
  Scale,
  Shield,
  FileCheck,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
  AlertTriangle,
  BookOpen,
  Info,
  Clock,
  ShieldAlert,
} from "lucide-react";

interface LegalSituationViewProps {
  situation: LegalSituation;
  userQuery?: string;
}

export function LegalSituationView({ situation, userQuery }: LegalSituationViewProps) {
  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner & Safety Status */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500/15 via-card to-card border border-emerald-500/30 p-8 sm:p-10 space-y-4 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="badge badge-saffron font-bold text-caption uppercase tracking-wider inline-flex items-center gap-1.5 px-3 py-1">
            <Scale size={14} /> Legal Information
          </span>
          <span className="badge badge-subtle font-mono text-[11px] flex items-center gap-1">
            <Clock size={12} /> Last Verified: {situation.lastVerified}
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-h2 font-black text-foreground tracking-tight">
            {situation.title.replace(/:\s*".*?"$/, "").replace(/:\s*'.*?'$/, "")}
          </h2>
          {userQuery && (
            <div className="p-3 rounded-2xl bg-surface-secondary/60 border border-border-subtle text-body-sm text-muted-foreground italic">
              " {userQuery} "
            </div>
          )}
        </div>
      </div>

      {/* 2. What Your Situation May Involve */}
      <div className="rounded-3xl bg-card border border-border-subtle p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Info size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-h3 font-bold text-foreground">1. What Your Situation May Involve</h3>
        </div>
        <p className="text-body-md text-foreground leading-relaxed">
          {situation.summary}
        </p>

        {/* Legal Considerations */}
        <div className="pt-3 space-y-2">
          <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Key Legal Considerations</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {situation.legalConsiderations.map((consideration, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-surface-secondary/50 border border-border-subtle text-body-sm font-medium text-foreground flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{consideration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Relevant Legal Topic(s) & Applicable Acts */}
      <div className="rounded-3xl bg-card border border-border-subtle p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-h3 font-bold text-foreground">2. Relevant Legal Frameworks & Acts</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {situation.applicableActs.map((act, idx) => (
            <span key={idx} className="badge badge-emerald text-body-xs font-bold px-3.5 py-1.5">
              {act}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Rights & Protections That Apply */}
      <div className="rounded-3xl bg-card border border-border-subtle p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-h3 font-bold text-foreground">3. What Rights & Protections Apply</h3>
        </div>
        <div className="space-y-3">
          {situation.rightsGranted.map((right, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-body-sm font-semibold text-foreground flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{right}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. What Evidence / Documents to Preserve */}
      <div className="rounded-3xl bg-card border border-border-subtle p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <FileCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-h3 font-bold text-foreground">4. Evidence & Documents You Should Preserve</h3>
        </div>
        <p className="text-body-sm text-muted-foreground">
          Preserving digital, financial, and written records early builds strong proof for formal resolutions or legal remedies.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {situation.evidenceToPreserve.map((evidence, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle text-body-sm font-medium text-foreground flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
              <span>{evidence}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Practical Next Steps & Options */}
      <div className="rounded-3xl bg-card border border-border-subtle p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-h3 font-bold text-foreground">5. Practical Options & Next Steps</h3>
        </div>
        <div className="space-y-4">
          {situation.practicalSteps.map((step) => (
            <div key={step.stepNumber} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-body-sm shrink-0">
                {step.stepNumber}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-body-sm font-bold text-foreground">{step.title}</h4>
                  {step.suggestedTimeline && (
                    <span className="badge badge-subtle text-[10px] font-mono">
                      {step.suggestedTimeline}
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

      {/* 7. Where to Seek Official Help & Helplines */}
      <div className="rounded-3xl bg-card border border-border-subtle p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <PhoneCall size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-h3 font-bold text-foreground">6. Official Helplines & Legal Services</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {situation.officialHelplines.map((helpline, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-body-sm font-bold text-foreground">{helpline.name}</h4>
                {helpline.websiteUrl && (
                  <a
                    href={helpline.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 font-bold text-caption hover:underline flex items-center gap-1"
                  >
                    <span>Portal</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <p className="text-h3 font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {helpline.contactNumber}
              </p>
              <p className="text-caption text-muted-foreground">{helpline.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Official Sources & Verification */}
      <div className="rounded-3xl bg-card border border-border-subtle p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-body-md font-bold text-foreground flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-600 dark:text-emerald-400" />
            Official & Credible Legal Sources
          </h4>
          <span className="badge badge-emerald text-[10px]">Verified Gazette & Statutory Links</span>
        </div>
        <div className="space-y-2">
          {situation.officialSources.map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-surface-secondary/40 border border-border-subtle hover:border-emerald-500/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <h5 className="text-body-sm font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {source.title}
                </h5>
                <p className="text-caption text-muted-foreground">{source.authority}</p>
              </div>
              <ExternalLink size={16} className="text-muted-foreground group-hover:text-emerald-600 shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* 9. Important Disclaimer Banner */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-6 space-y-2 text-body-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
          <AlertTriangle size={18} />
          <span>Official Civic Disclaimer</span>
        </div>
        <p className="leading-relaxed">{situation.disclaimer}</p>
      </div>
    </div>
  );
}
