"use client";

/**
 * app/admin/review/[id]/page.tsx
 *
 * Evidence-First Proposal Review Page for Vayam Civic Intelligence Admin.
 * Displays source evidence, extracted text excerpts, Groq AI confidence,
 * side-by-side Old vs Proposed values, affected database fields, and action buttons.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { AdminLayout } from "@/components/admin/admin-layout";
import { supabase } from "@/lib/db/supabase";
import type { CivicUpdateFinding } from "@/types/admin";
import {
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  BookOpen,
  FileSearch,
  Check,
  Ban,
  HelpCircle,
} from "lucide-react";

export default function AdminReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const findingId = params?.id as string;

  const [finding, setFinding] = useState<CivicUpdateFinding | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!findingId) return;

    const fetchFinding = async () => {
      try {
        const { data, error } = await supabase
          .from("civic_update_findings")
          .select("*, source:monitored_sources(*)")
          .eq("id", findingId)
          .single();

        if (error || !data) {
          console.error("fetchFinding error:", error);
        } else {
          setFinding(data as CivicUpdateFinding);
        }
        setLoading(false);
        if (typeof window !== "undefined") {
          window.scrollTo(0, 0);
        }
      } catch (err) {
        console.error("fetchFinding exception:", err);
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    fetchFinding();
  }, [findingId]);

  const handleAction = async (action: "APPROVE" | "REJECT" | "INVESTIGATE") => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/findings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          findingId,
          action,
          reason: action === "REJECT" ? rejectionReason : undefined,
          userId: user?.id,
          email: user?.email || "admin@gmail.com",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToastMessage({
          text: action === "APPROVE"
            ? "Proposal Approved! Production database updated & audit log recorded."
            : action === "REJECT"
            ? "Proposal Rejected."
            : "Marked for Investigation.",
          type: "success",
        });
        setTimeout(() => {
          router.push("/admin" as any);
        }, 1200);
      } else {
        setToastMessage({
          text: `Action failed: ${data.error || data.message || "Unknown error"}`,
          type: "error",
        });
      }
    } catch (err: any) {
      setToastMessage({ text: `Error: ${err.message}`, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-12 text-center text-body-md font-bold text-muted-foreground">
          Loading proposal finding details...
        </div>
      </AdminLayout>
    );
  }

  if (!finding) {
    return (
      <AdminLayout>
        <div className="space-y-4 text-center py-12">
          <AlertTriangle size={36} className="text-destructive mx-auto" />
          <h2 className="text-h2 font-bold text-foreground">Finding Not Found</h2>
          <Link href={"/admin" as any} className="btn btn-primary btn-sm rounded-xl font-bold cursor-pointer">
            Return to Dashboard
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const prev = finding.previous_values || {};
  const proposed = finding.proposed_values || {};
  const evidenceList = finding.evidence || [];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-16">
        {toastMessage && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-body-sm font-bold animate-in fade-in slide-in-from-top-2 ${
              toastMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={"/admin" as any}
            className="btn btn-ghost btn-sm gap-2 font-bold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Pending Review</span>
          </Link>
          <span className="badge badge-subtle font-mono text-caption">
            Finding ID: {finding.id.slice(0, 8)}...
          </span>
        </div>

        {/* Proposal Overview Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-card to-card border border-emerald-500/30 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-saffron text-caption font-bold uppercase">
                {finding.domain}
              </span>
              <span className="badge badge-subtle font-mono text-caption font-bold">
                Type: {finding.finding_type}
              </span>
              <span className="badge badge-emerald text-caption font-bold">
                AI Confidence: {finding.confidence}%
              </span>
            </div>

            <span className="text-caption font-mono text-muted-foreground flex items-center gap-1">
              <Clock size={12} /> Detected: {new Date(finding.created_at).toLocaleString()}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-h1 font-black text-foreground tracking-tight">{finding.title}</h1>
            <p className="text-body-md text-muted-foreground">{finding.summary}</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-border-subtle text-body-sm space-y-1">
            <span className="text-caption font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Specific Policy Change Detected:
            </span>
            <p className="text-foreground font-medium">{finding.change_summary}</p>
          </div>
        </div>

        {/* 5-Layer Pipeline Flow Indicator */}
        <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-3 shadow-2xs">
          <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest block">
            5-Layer Intelligence Pipeline Verification Flow:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-caption font-semibold">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-0.5">
              <span className="block font-black text-[11px] uppercase">1. Sentinel</span>
              <span>Source Snapshot Crawled</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-0.5">
              <span className="block font-black text-[11px] uppercase">2. Analyst</span>
              <span>Extracted ({finding.confidence}%)</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-0.5">
              <span className="block font-black text-[11px] uppercase">3. Validator</span>
              <span>Level 4+ Verified</span>
            </div>
            <div className="p-3 rounded-2xl bg-saffron-500/15 border border-saffron-500/30 text-amber-700 dark:text-saffron-400 space-y-0.5 animate-pulse">
              <span className="block font-black text-[11px] uppercase">4. Human Review</span>
              <span>Awaiting Admin Action</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-secondary border border-border-subtle text-muted-foreground space-y-0.5">
              <span className="block font-black text-[11px] uppercase">5. Database Writer</span>
              <span>Pending Approval</span>
            </div>
          </div>
        </div>

        {/* Evidence & Source Attribution Section */}
        <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-4 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-h3 font-bold text-foreground">1. Source Evidence & Verification</h2>
            </div>
            <a
              href={finding.source_metadata?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-xs gap-1.5 rounded-xl font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer"
            >
              <span>Inspect Official Government Page</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-body-sm">
            <div className="p-3 rounded-2xl bg-surface-secondary/50 border border-border-subtle">
              <span className="text-caption font-bold text-muted-foreground block uppercase">Source Name</span>
              <span className="font-bold text-foreground">{finding.source_metadata?.name || "Official Portal"}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-secondary/50 border border-border-subtle">
              <span className="text-caption font-bold text-muted-foreground block uppercase">Authority</span>
              <span className="font-bold text-foreground">{finding.source_metadata?.authority || "Government Authority"}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-secondary/50 border border-border-subtle">
              <span className="text-caption font-bold text-muted-foreground block uppercase">Jurisdiction</span>
              <span className="font-bold text-foreground">{finding.jurisdiction}</span>
            </div>
          </div>

          {/* Evidence Excerpts */}
          <div className="space-y-2 pt-2">
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest block">
              Extracted Direct Excerpts ({evidenceList.length})
            </span>
            {evidenceList.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-surface-secondary border border-border-subtle space-y-1">
                <span className="text-caption font-bold text-emerald-600 dark:text-emerald-400">
                  Location: {item.location || `Section Excerpt #${idx + 1}`}
                </span>
                <p className="text-body-sm italic text-foreground font-serif leading-relaxed">
                  "{item.excerpt}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side Data Diff Section */}
        <div className="p-6 rounded-3xl bg-card border border-border-subtle space-y-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <FileSearch size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-h3 font-bold text-foreground">2. Side-by-Side Database Comparison (Diff)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Database Value */}
            <div className="p-6 rounded-3xl bg-destructive/5 border border-destructive/20 space-y-3">
              <span className="badge badge-subtle text-caption font-bold uppercase text-destructive">
                Current Database Values
              </span>
              <pre className="text-caption font-mono bg-card p-4 rounded-2xl border border-border-subtle overflow-x-auto text-muted-foreground leading-relaxed">
                {Object.keys(prev).length > 0
                  ? JSON.stringify(prev, null, 2)
                  : "No previous database record (New Entry)"}
              </pre>
            </div>

            {/* Proposed New Value */}
            <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/30 space-y-3">
              <span className="badge badge-emerald text-caption font-bold uppercase">
                Proposed Production Values
              </span>
              <pre className="text-caption font-mono bg-card p-4 rounded-2xl border border-border-subtle overflow-x-auto text-emerald-600 dark:text-emerald-400 leading-relaxed font-bold">
                {JSON.stringify(proposed, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Action Decision Bar */}
        <div className="p-8 rounded-3xl bg-card border border-border-subtle space-y-6 shadow-md">
          <div>
            <h3 className="text-h3 font-bold text-foreground">Administrator Decision Required</h3>
            <p className="text-body-sm text-muted-foreground">
              Confirming approval will transactionally apply the proposed updates to production database tables and generate an audit log entry.
            </p>
          </div>

          {showRejectForm ? (
            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/30 space-y-3">
              <label className="text-caption font-bold text-destructive block">
                Reason for Rejection (Optional):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Example: Unverified third-party link or duplicate proposal..."
                rows={2}
                className="w-full p-3 rounded-xl border border-border-subtle text-body-sm focus:outline-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="btn btn-ghost btn-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction("REJECT")}
                  disabled={submitting}
                  className="btn btn-primary btn-xs bg-destructive border-destructive font-bold cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => handleAction("APPROVE")}
                disabled={submitting}
                className="btn btn-primary px-8 py-3 rounded-2xl font-bold gap-2 text-body-md shadow-md cursor-pointer bg-emerald-600 border-emerald-600 hover:bg-emerald-700"
              >
                <Check size={20} />
                <span>{submitting ? "Applying..." : "APPROVE UPDATE"}</span>
              </button>

              <button
                onClick={() => setShowRejectForm(true)}
                disabled={submitting}
                className="btn btn-outline px-6 py-3 rounded-2xl font-bold gap-2 text-body-md text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Ban size={20} />
                <span>REJECT</span>
              </button>

              <button
                onClick={() => handleAction("INVESTIGATE")}
                disabled={submitting}
                className="btn btn-subtle px-6 py-3 rounded-2xl font-bold gap-2 text-body-md cursor-pointer"
              >
                <HelpCircle size={20} />
                <span>NEEDS INVESTIGATION</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
