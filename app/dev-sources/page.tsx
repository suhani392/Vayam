"use client";

/**
 * app/dev-sources/page.tsx
 *
 * Development-only Knowledge Source & Quality Test Panel.
 * Displays Knowledge Quality Report metrics (Verified, Unverified, Demo, Review Required)
 * and an interactive table of source provenance metadata.
 */

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatusBadge, SourceBadge } from "@/components/ui/badge";
import { SourceDetails } from "@/components/knowledge/source-details";
import { generateKnowledgeQualityReport, getAllKnowledgeRecords } from "@/lib/knowledge";
import { ShieldCheck, AlertTriangle, Database, CheckCircle2, Clock, Globe, HelpCircle, Layers } from "lucide-react";

export default function DevSourcesPage() {
  const report = generateKnowledgeQualityReport();
  const allRecords = getAllKnowledgeRecords();
  const [selectedRecordId, setSelectedRecordId] = useState<string>(allRecords[0]?.id || "");

  const selectedRecord = allRecords.find((r) => r.id === selectedRecordId) || allRecords[0];

  return (
    <PageContainer width="wide">
      <PageHeader
        badge={<span className="badge badge-saffron">Development Only · Phase 6B Test Panel</span>}
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

      {/* ── Table & Inspection Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1 & 2: Records Provenance Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={18} className="text-accent" />
                Knowledge Records Source Table ({report.recordsSummary.length})
              </CardTitle>
              <CardDescription>Click a record row to inspect full provenance & verification metadata</CardDescription>
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
                      const isSelected = selectedRecordId === r.id;
                      return (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedRecordId(r.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-accent-subtle/50 font-bold"
                              : "hover:bg-surface-secondary/60"
                          }`}
                        >
                          <td className="py-3 px-3">
                            <span className="text-foreground block font-bold leading-snug truncate max-w-[240px]">
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

        {/* Column 3: Source Provenance Inspector Card */}
        <div className="space-y-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-accent" />
                Source Provenance Inspector
              </CardTitle>
              <CardDescription>{selectedRecord.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SourceDetails record={selectedRecord} />

              <div className="p-4 rounded-xl bg-card border border-border-subtle space-y-2 text-caption">
                <span className="font-bold text-foreground uppercase tracking-wider block">
                  Raw Source JSON:
                </span>
                <pre className="p-3 rounded-lg bg-surface-secondary text-[11px] font-mono text-foreground overflow-x-auto">
                  {JSON.stringify(selectedRecord.source, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </PageContainer>
  );
}
