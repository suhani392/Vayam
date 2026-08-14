"use client";

/**
 * app/dev-sources/page.tsx
 *
 * Development-only Knowledge Source & Quality Test Panel.
 * Displays Knowledge Quality Report metrics (Verified, Unverified, Demo, Review Required)
 * and an interactive table of source provenance metadata.
 */

import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SourceBadge } from "@/components/ui/badge";
import { generateKnowledgeQualityReport } from "@/lib/knowledge";
import { ShieldCheck, AlertTriangle, Database, CheckCircle2, Clock, Globe } from "lucide-react";

export default function DevSourcesPage() {
  const report = generateKnowledgeQualityReport();

  return (
    <PageContainer width="wide">
      <PageHeader
        badge={<span className="badge badge-saffron">Information Sources & Knowledge Panel</span>}
        title="Knowledge Source & Quality Control Panel"
        description="Inspect source provenance metadata, verification integrity, freshness review policies, and data quality metrics across all KnowledgeRecords."
      />

      {/* ── Summary Quality Metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card variant="default">
          <CardContent className="p-4 text-center space-y-1">
            <span className="text-caption font-bold text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Database size={14} /> Total Records
            </span>
            <p className="text-h2 font-extrabold text-foreground">{report.totalRecords}</p>
          </CardContent>
        </Card>

        <Card variant="default" className="border-success/30 bg-success/5">
          <CardContent className="p-4 text-center space-y-1">
            <span className="text-caption font-bold text-success uppercase flex items-center justify-center gap-1">
              <CheckCircle2 size={14} /> Verified
            </span>
            <p className="text-h2 font-extrabold text-success">{report.verifiedRecords}</p>
          </CardContent>
        </Card>

        <Card variant="default" className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 text-center space-y-1">
            <span className="text-caption font-bold text-warning uppercase flex items-center justify-center gap-1">
              <AlertTriangle size={14} /> Demo Records
            </span>
            <p className="text-h2 font-extrabold text-warning">{report.demoRecords}</p>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 text-center space-y-1">
            <span className="text-caption font-bold text-accent uppercase flex items-center justify-center gap-1">
              <Clock size={14} /> Review Due
            </span>
            <p className="text-h2 font-extrabold text-accent">{report.recordsRequiringReview}</p>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 text-center space-y-1">
            <span className="text-caption font-bold text-muted-foreground uppercase flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Invalid Metadata
            </span>
            <p className="text-h2 font-extrabold text-foreground">{report.invalidMetadataCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Table Layout ── */}
      <div className="space-y-6">
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe size={18} className="text-accent" />
              Knowledge Records Source Table ({report.recordsSummary.length})
            </CardTitle>
            <CardDescription>All verified knowledge source metadata, authorities, and last verification dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-caption text-muted-foreground uppercase">
                    <th className="py-2.5 px-3">Record Title</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Source Status</th>
                    <th className="py-2.5 px-3">Last Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {report.recordsSummary.map((r) => {
                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-surface-secondary/60 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <span className="text-foreground block font-bold leading-snug truncate max-w-[400px]">
                            {r.title}
                          </span>
                          <span className="text-caption font-mono text-muted-foreground">{r.id}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="badge badge-muted text-[10px] uppercase">{r.type}</span>
                        </td>
                        <td className="py-3 px-3">
                          <SourceBadge
                            verificationStatus={r.verificationStatus}
                            sourceName={r.verificationStatus}
                          />
                        </td>
                        <td className="py-3 px-3 font-mono text-caption text-foreground">
                          {r.lastVerified}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
