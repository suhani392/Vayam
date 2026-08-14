"use client";

/**
 * app/admin/page.tsx
 *
 * Admin Civic Intelligence Dashboard for Vayam.
 * Displays real-time database metrics, pending AI findings for review,
 * recent audit log activity, and source scan controls.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { AdminLayout } from "@/components/admin/admin-layout";
import { supabase } from "@/lib/db/supabase";
import type { CivicUpdateFinding, AdminDashboardMetrics, AdminActivityItem } from "@/types/admin";
import {
  Globe,
  Database,
  FileSearch,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  XCircle,
  ExternalLink,
  Eye,
  AlertCircle,
  Play,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [metrics, setMetrics] = useState<AdminDashboardMetrics>({
    sourcesMonitored: 0,
    totalKnowledgeRecords: 0,
    newFindings: 0,
    pendingReview: 0,
    approvedUpdates: 0,
    rejectedUpdates: 0,
    lastSuccessfulScan: null,
  });

  const [pendingFindings, setPendingFindings] = useState<CivicUpdateFinding[]>([]);
  const [investigationFindings, setInvestigationFindings] = useState<CivicUpdateFinding[]>([]);
  const [activityLogs, setActivityLogs] = useState<AdminActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [dbSchemes, setDbSchemes] = useState<any[]>([]);
  const [dbActs, setDbActs] = useState<any[]>([]);
  const [dbRights, setDbRights] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"schemes" | "acts" | "rights">("schemes");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      router.push("/" as any);
      return;
    }

    const checkAdminAndLoadData = async () => {
      const adminEmail = user.email || "";

      // Server Authorization Check
      try {
        const authRes = await fetch("/api/admin/auth/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id, email: adminEmail }),
        });

        const authData = await authRes.json();

        if (!authRes.ok || !authData.authorized) {
          console.warn("[Vayam Admin] Unauthorized access attempt, redirecting to home.");
          router.push("/");
          return;
        }

        setAuthorized(true);

        // Fetch Real Database Metrics & Production Records
        const [
          { count: sourcesCount },
          { count: knowledgeCount },
          { count: pendingCount },
          { count: approvedCount },
          { count: rejectedCount },
          { data: findingsData },
          { data: sourcesData },
          { data: auditLogsData },
          { data: schemesData },
          { data: actsData },
          { data: rightsData },
        ] = await Promise.all([
          supabase.from("monitored_sources").select("*", { count: "exact", head: true }),
          supabase.from("knowledge_items").select("*", { count: "exact", head: true }),
          supabase.from("civic_update_findings").select("*", { count: "exact", head: true }).eq("status", "PENDING_REVIEW"),
          supabase.from("civic_update_findings").select("*", { count: "exact", head: true }).eq("status", "APPROVED"),
          supabase.from("civic_update_findings").select("*", { count: "exact", head: true }).eq("status", "REJECTED"),
          supabase.from("civic_update_findings").select("*, source:monitored_sources(*)").order("created_at", { ascending: false }).limit(20),
          supabase.from("monitored_sources").select("last_scanned_at").order("last_scanned_at", { ascending: false }).limit(1),
          supabase.from("civic_audit_logs").select("*").order("created_at", { ascending: false }).limit(10),
          supabase.from("knowledge_items").select("*").order("created_at", { ascending: false }).limit(50),
          supabase.from("legal_acts").select("*").order("created_at", { ascending: false }).limit(50),
          supabase.from("legal_rights").select("*").order("created_at", { ascending: false }).limit(50),
        ]);

        setMetrics({
          sourcesMonitored: sourcesCount || 0,
          totalKnowledgeRecords: (knowledgeCount || 0) + (actsData?.length || 0) + (rightsData?.length || 0),
          newFindings: findingsData?.length || 0,
          pendingReview: pendingCount || 0,
          approvedUpdates: approvedCount || 0,
          rejectedUpdates: rejectedCount || 0,
          lastSuccessfulScan: sourcesData?.[0]?.last_scanned_at || null,
        });

        setDbSchemes(schemesData || []);
        setDbActs(actsData || []);
        setDbRights(rightsData || []);

        setPendingFindings(
          (findingsData || []).filter((f) => f.status === "PENDING_REVIEW")
        );
        setInvestigationFindings(
          (findingsData || []).filter((f) => f.status === "NEEDS_INVESTIGATION")
        );

        // Synthesize Activity Timeline
        const activities: AdminActivityItem[] = (auditLogsData || []).map((log) => ({
          id: log.id,
          timestamp: log.created_at,
          type: log.action === "APPROVED" ? "ADMIN_APPROVED" : "ADMIN_REJECTED",
          title: log.action === "APPROVED" ? `Approved Civic Finding Update` : `Rejected Civic Finding Update`,
          details: `Target Table: ${log.target_table}`,
        }));

        setActivityLogs(activities);
        setLoading(false);
      } catch (err) {
        console.error("[Vayam Admin Load Error]:", err);
        setLoading(false);
      }
    };

    checkAdminAndLoadData();
  }, [user, isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-600 animate-spin mx-auto" />
          <p className="text-body-md font-bold text-foreground">Verifying Civic Intelligence Credentials...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect via router.push('/')
  }

  return (
    <AdminLayout>
      <div className="space-y-14 sm:space-y-16 pb-12">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/15 via-card to-card border border-emerald-500/30 p-6 sm:p-8 flex items-center justify-between flex-wrap gap-4 shadow-xs">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="badge badge-saffron text-caption font-bold uppercase tracking-wider px-3 py-1 font-mono">
                Last Scan: {metrics.lastSuccessfulScan ? new Date(metrics.lastSuccessfulScan).toLocaleTimeString() : "Never"}
              </span>
            </div>
            <h1 className="text-h2 font-black text-foreground tracking-tight">
              Civic Intelligence Pipeline
            </h1>
            <p className="text-body-md text-muted-foreground max-w-2xl">
              Monitors official Indian government portals, detects policy changes with AI analysis, and applies evidence-backed updates to the database after administrator approval.
            </p>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-3xl bg-card border border-border-subtle space-y-1 shadow-2xs">
            <span className="text-caption font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Globe size={14} /> Sources
            </span>
            <div className="text-h2 font-black text-foreground">{metrics.sourcesMonitored}</div>
            <p className="text-caption text-muted-foreground">Registered Portals</p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-3xl bg-card border border-border-subtle space-y-1 shadow-2xs">
            <span className="text-caption font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Database size={14} /> Records
            </span>
            <div className="text-h2 font-black text-foreground">{metrics.totalKnowledgeRecords}</div>
            <p className="text-caption text-muted-foreground">Production Items</p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-3xl bg-card border border-border-subtle space-y-1 shadow-2xs">
            <span className="text-caption font-bold text-muted-foreground uppercase flex items-center gap-1">
              <FileSearch size={14} /> Findings
            </span>
            <div className="text-h2 font-black text-emerald-600 dark:text-emerald-400">{metrics.newFindings}</div>
            <p className="text-caption text-muted-foreground">Detected Updates</p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-3xl bg-card border border-emerald-500/40 bg-emerald-500/5 space-y-1 shadow-2xs">
            <span className="text-caption font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
              <AlertTriangle size={14} /> Pending Review
            </span>
            <div className="text-h2 font-black text-emerald-600 dark:text-emerald-400">{metrics.pendingReview}</div>
            <p className="text-caption text-muted-foreground">Requires Approval</p>
          </div>

          {/* Card 5 */}
          <div className="p-5 rounded-3xl bg-card border border-border-subtle space-y-1 shadow-2xs">
            <span className="text-caption font-bold text-muted-foreground uppercase flex items-center gap-1">
              <CheckCircle2 size={14} /> Approved
            </span>
            <div className="text-h2 font-black text-emerald-600 dark:text-emerald-400">{metrics.approvedUpdates}</div>
            <p className="text-caption text-muted-foreground">Applied to DB</p>
          </div>

          {/* Card 6 */}
          <div className="p-5 rounded-3xl bg-card border border-border-subtle space-y-1 shadow-2xs">
            <span className="text-caption font-bold text-muted-foreground uppercase flex items-center gap-1">
              <XCircle size={14} /> Rejected
            </span>
            <div className="text-h2 font-black text-muted-foreground">{metrics.rejectedUpdates}</div>
            <p className="text-caption text-muted-foreground">Discarded Proposals</p>
          </div>
        </div>

        {/* Pending Review Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h2 font-black text-foreground tracking-tight flex items-center gap-2">
                <span>Proposed Updates Pending Review</span>
                <span className="badge badge-saffron rounded-full px-2.5 py-0.5 text-caption font-bold">
                  {pendingFindings.length}
                </span>
              </h2>
              <p className="text-body-sm text-muted-foreground">
                Review AI analysis & extracted evidence before applying updates to the production database.
              </p>
            </div>
            <Link
              href={"/admin/sources" as any}
              className="btn btn-outline btn-xs rounded-xl font-bold gap-1 cursor-pointer"
            >
              <span>Manage Sources</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {pendingFindings.length > 0 ? (
            <div className="space-y-4">
              {pendingFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-6 rounded-3xl bg-card border border-border-subtle hover:border-emerald-500/40 transition-all space-y-4 shadow-2xs"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge badge-saffron text-caption font-bold uppercase">
                        {finding.domain}
                      </span>
                      <span className="badge badge-subtle text-caption font-mono">
                        Type: {finding.finding_type}
                      </span>
                      <span className="badge badge-emerald text-caption font-bold">
                        Confidence: {finding.confidence}%
                      </span>
                      <span className="text-caption text-muted-foreground font-semibold">
                        Jurisdiction: {finding.jurisdiction}
                      </span>
                    </div>

                    <span className="text-caption font-mono text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(finding.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-h3 font-bold text-foreground">{finding.title}</h3>
                    <p className="text-body-sm text-muted-foreground mt-1">{finding.summary}</p>
                  </div>

                  {/* Evidence Excerpt Preview */}
                  {finding.evidence && finding.evidence.length > 0 && (
                    <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-border-subtle space-y-1">
                      <span className="text-caption font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Extracted Source Evidence:
                      </span>
                      <p className="text-body-sm italic text-foreground font-serif">
                        "{finding.evidence[0].excerpt.slice(0, 250)}..."
                      </p>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-border-subtle">
                    <div className="text-caption text-muted-foreground flex items-center gap-1.5 font-medium">
                      <span>Source: <strong>{finding.source_metadata?.name || "Official Portal"}</strong></span>
                      {finding.source_metadata?.url && (
                        <a
                          href={finding.source_metadata.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/admin/review/${finding.id}` as any}
                      className="btn btn-primary btn-sm rounded-xl font-bold gap-2 cursor-pointer bg-emerald-600 border-emerald-600 hover:bg-emerald-700 shadow-xs"
                    >
                      <Eye size={16} />
                      <span>Review & Approve Update</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-surface-secondary/50 border border-border-subtle text-center space-y-3">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-body-md font-bold text-foreground">No Pending Proposals</h4>
                <p className="text-body-sm text-muted-foreground max-w-md mx-auto">
                  All detected government updates have been reviewed. Click "Run Scan" above to check registered sources for new policy changes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Updates Flagged for Investigation Section */}
        {investigationFindings.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-h2 font-black text-foreground tracking-tight flex items-center gap-2">
                  <AlertCircle size={22} className="text-amber-500" />
                  <span>Updates Flagged for Investigation</span>
                  <span className="badge badge-saffron rounded-full px-2.5 py-0.5 text-caption font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {investigationFindings.length}
                  </span>
                </h2>
                <p className="text-body-sm text-muted-foreground">
                  Proposals marked by the administrator requiring further government source verification before applying updates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investigationFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-6 rounded-3xl bg-card border border-amber-500/30 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="badge text-caption font-bold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        Investigation Required
                      </span>
                      <span className="badge badge-subtle text-caption font-bold uppercase">
                        {finding.domain}
                      </span>
                    </div>

                    <span className="text-caption font-mono text-muted-foreground">
                      {new Date(finding.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-h3 font-bold text-foreground line-clamp-1">
                      {finding.title}
                    </h3>
                    <p className="text-body-sm text-muted-foreground line-clamp-2">
                      {finding.summary}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface-secondary text-caption font-medium text-foreground flex items-center justify-between gap-2">
                    <span className="truncate">Source: {finding.source_metadata?.name || "Official Authority"}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">Under Review</span>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <Link
                      href={`/admin/review/${finding.id}` as any}
                      className="btn btn-primary btn-sm gap-2 rounded-xl font-bold bg-amber-600 border-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                    >
                      <Eye size={16} />
                      <span>Re-examine & Review Update</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Production Database Records Viewer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-h3 font-bold text-foreground flex items-center gap-2">
                <Database size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>Live Production Database Records</span>
              </h3>
              <p className="text-body-sm text-muted-foreground">
                All currently active civic schemes, governing acts, and statutory rights stored in the database powering Vayam recommendations.
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-surface-secondary border border-border-subtle text-caption font-bold">
              <button
                onClick={() => setActiveTab("schemes")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "schemes"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Schemes ({dbSchemes.length})
              </button>
              <button
                onClick={() => setActiveTab("acts")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "acts"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Governing Acts ({dbActs.length})
              </button>
              <button
                onClick={() => setActiveTab("rights")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "rights"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Statutory Rights ({dbRights.length})
              </button>
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="p-6 rounded-3xl bg-card border border-border-subtle shadow-2xs">
            {activeTab === "schemes" && (
              <div className="space-y-3">
                {dbSchemes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dbSchemes.map((scheme: any) => (
                      <div key={scheme.id} className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="badge badge-saffron text-[10px] font-bold uppercase">{scheme.verification_status || "VERIFIED"}</span>
                          <span className="text-caption font-mono text-muted-foreground">{scheme.slug}</span>
                        </div>
                        <h4 className="text-body-md font-bold text-foreground">{scheme.title}</h4>
                        <p className="text-caption text-muted-foreground line-clamp-2">{scheme.short_description || scheme.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-caption text-muted-foreground text-center py-4">No active schemes found in knowledge_items table.</p>
                )}
              </div>
            )}

            {activeTab === "acts" && (
              <div className="space-y-3">
                {dbActs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dbActs.map((act: any) => (
                      <div key={act.id} className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="badge badge-emerald text-[10px] font-bold">{act.act_number || "Central Act"}</span>
                          <span className="text-caption font-mono text-muted-foreground">{act.enactment_year}</span>
                        </div>
                        <h4 className="text-body-md font-bold text-foreground">{act.title}</h4>
                        <p className="text-caption text-muted-foreground line-clamp-2">{act.summary || act.ministry}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-caption text-muted-foreground text-center py-4">No legal acts found in legal_acts table.</p>
                )}
              </div>
            )}

            {activeTab === "rights" && (
              <div className="space-y-3">
                {dbRights.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dbRights.map((right: any) => (
                      <div key={right.id} className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-subtle space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="badge badge-saffron text-[10px] font-bold">{right.section_number || "Section Right"}</span>
                          <span className="text-caption font-mono text-muted-foreground">{right.category || "General"}</span>
                        </div>
                        <h4 className="text-body-md font-bold text-foreground">{right.right_title}</h4>
                        <p className="text-caption text-muted-foreground line-clamp-2">{right.plain_language_explanation || right.legal_text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-caption text-muted-foreground text-center py-4">No statutory rights found in legal_rights table.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="space-y-4">
          <h3 className="text-h3 font-bold text-foreground">Recent Audit & Activity Log</h3>
          {activityLogs.length > 0 ? (
            <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-3 shadow-2xs divide-y divide-border-subtle">
              {activityLogs.map((log) => (
                <div key={log.id} className="pt-3 first:pt-0 flex items-center justify-between flex-wrap gap-2 text-body-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-foreground">{log.title}</span>
                    <span className="text-muted-foreground font-mono">({log.details})</span>
                  </div>
                  <span className="text-caption font-mono text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-card border border-border-subtle text-caption text-muted-foreground text-center">
              No recent audit activity recorded yet.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
