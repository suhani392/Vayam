"use client";

/**
 * app/admin/sources/page.tsx
 *
 * Monitored Source Registry Manager for Vayam Civic Intelligence.
 * Enables administrator to add, edit, toggle, and trigger scans for verified government sources.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { AdminLayout } from "@/components/admin/admin-layout";
import { supabase } from "@/lib/db/supabase";
import type { MonitoredSource, SourceCategory, SourceAuthorityType } from "@/types/admin";
import {
  Globe,
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function AdminSourcesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [sources, setSources] = useState<MonitoredSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);

  // Form State for new source
  const [newSource, setNewSource] = useState({
    name: "",
    organization: "",
    authority_type: "CENTRAL" as SourceAuthorityType,
    url: "",
    category: "Government Scheme" as SourceCategory,
    jurisdiction: "Central",
    state: "",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchSources = async () => {
    try {
      const res = await fetch("/api/admin/sources");
      const data = await res.json();
      if (res.ok) {
        setSources(data.sources || []);
      }
      setLoading(false);
    } catch (err) {
      console.error("fetchSources error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!newSource.name.trim() || !newSource.url.trim()) {
      setFormError("Source Name and URL are required.");
      return;
    }

    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email || "admin@gmail.com",
          source: newSource,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to add source.");
        return;
      }

      setFormSuccess("Source registered successfully!");
      setShowAddModal(false);
      setNewSource({
        name: "",
        organization: "",
        authority_type: "CENTRAL",
        url: "",
        category: "Government Scheme",
        jurisdiction: "Central",
        state: "",
      });
      fetchSources();
    } catch (err: any) {
      setFormError(err.message || "Failed to add source.");
    }
  };

  const handleToggleActive = async (sourceId: string, currentActive: boolean) => {
    try {
      await fetch("/api/admin/sources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email || "admin@gmail.com",
          sourceId,
          updates: { active: !currentActive },
        }),
      });
      fetchSources();
    } catch (err) {
      console.error("handleToggleActive error:", err);
    }
  };

  const handleScanSingle = async (sourceId: string) => {
    setScanningId(sourceId);
    try {
      const res = await fetch("/api/admin/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email || "admin@gmail.com",
          sourceId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormSuccess(
          data.findingCreated
            ? "Scan finished: New policy update detected & finding created!"
            : "Scan finished: Source scanned successfully."
        );
        fetchSources();
      } else {
        setFormError(`Scan failed: ${data.error}`);
      }
    } catch (err: any) {
      setFormError(`Error: ${err.message}`);
    } finally {
      setScanningId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-h2 font-black text-foreground tracking-tight">
              Monitored Sources Registry
            </h1>
            <p className="text-body-sm text-muted-foreground">
              Manage official Indian government websites, ministry portals, legislative feeds, and scheme notifications.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary px-5 py-2.5 rounded-2xl font-bold gap-2 cursor-pointer bg-emerald-600 border-emerald-600 hover:bg-emerald-700 shadow-sm"
          >
            <Plus size={18} />
            <span>Add Official Source</span>
          </button>
        </div>

        {/* Add Source Modal */}
        {showAddModal && (
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-emerald-500/40 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-h3 font-bold text-foreground">Register New Official Source</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-ghost btn-xs text-muted-foreground cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive text-caption font-semibold text-destructive">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSource} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-caption font-bold text-foreground">Source Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Scholarship Portal (NSP)"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border-subtle bg-surface-secondary text-body-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-caption font-bold text-foreground">Official URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://scholarships.gov.in/"
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border-subtle bg-surface-secondary text-body-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-caption font-bold text-foreground">Organization / Ministry</label>
                <input
                  type="text"
                  placeholder="Ministry of Education, GoI"
                  value={newSource.organization}
                  onChange={(e) => setNewSource({ ...newSource, organization: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border-subtle bg-surface-secondary text-body-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-caption font-bold text-foreground">Category</label>
                <select
                  value={newSource.category}
                  onChange={(e) => setNewSource({ ...newSource, category: e.target.value as any })}
                  className="w-full p-3 rounded-xl border border-border-subtle bg-surface-secondary text-body-sm focus:outline-none"
                >
                  <option value="Government Scheme">Government Scheme</option>
                  <option value="Ministry">Ministry</option>
                  <option value="Government Department">Government Department</option>
                  <option value="State Government">State Government</option>
                  <option value="Legal / Legislative">Legal / Legislative</option>
                  <option value="Education">Education</option>
                  <option value="Public Service">Public Service</option>
                  <option value="Official Notification">Official Notification</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-ghost btn-sm rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-6 rounded-xl font-bold cursor-pointer bg-emerald-600 border-emerald-600 hover:bg-emerald-700"
                >
                  Register Source
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sources List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-bold text-foreground">
              Registered Sources ({sources.length})
            </h2>
            <span className="text-caption text-muted-foreground font-mono">
              Only authoritative government portals monitored. Zero third-party blogs.
            </span>
          </div>

          {sources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="p-6 rounded-3xl bg-card border border-border-subtle space-y-4 shadow-2xs hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="badge badge-saffron text-caption font-bold uppercase">
                      {source.category}
                    </span>

                    <button
                      onClick={() => handleToggleActive(source.id, source.active)}
                      className={`btn btn-xs rounded-full font-bold gap-1 cursor-pointer ${
                        source.active
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : "bg-surface-secondary text-muted-foreground"
                      }`}
                    >
                      {source.active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{source.active ? "Active" : "Disabled"}</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="text-h3 font-bold text-foreground">{source.name}</h3>
                    <p className="text-caption text-muted-foreground mt-0.5">{source.organization}</p>
                  </div>

                  <div className="text-body-sm font-mono text-emerald-600 dark:text-emerald-400 break-all flex items-center gap-1.5">
                    <Globe size={14} className="shrink-0" />
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{source.url}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-caption text-muted-foreground border-t border-border-subtle">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock size={12} />
                      Last Scanned:{" "}
                      {source.last_scanned_at
                        ? new Date(source.last_scanned_at).toLocaleString()
                        : "Never"}
                    </span>

                    <button
                      onClick={() => handleScanSingle(source.id)}
                      disabled={scanningId === source.id}
                      className="btn btn-subtle btn-xs rounded-xl font-bold gap-1.5 cursor-pointer text-emerald-600 dark:text-emerald-400 hover:btn-primary"
                    >
                      <Play size={12} className={scanningId === source.id ? "animate-spin" : ""} />
                      <span>{scanningId === source.id ? "Scanning..." : "Scan Now"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-surface-secondary/50 border border-border-subtle text-center space-y-3">
              <Globe size={32} className="text-muted-foreground mx-auto" />
              <p className="text-body-md font-bold text-foreground">No monitored sources registered yet.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary btn-sm rounded-xl font-bold cursor-pointer bg-emerald-600 border-emerald-600"
              >
                + Register First Government Source
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
