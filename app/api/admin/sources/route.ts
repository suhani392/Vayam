import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isUserAdmin } from "@/lib/admin/auth";
import type { MonitoredSource } from "@/types/admin";

export async function GET() {
  try {
    const list: MonitoredSource[] = [];
    const seenUrls = new Set<string>();

    // 1. Query existing knowledge_sources table directly from database
    const { data: ksData } = await supabaseAdmin
      .from("knowledge_sources")
      .select("*")
      .order("created_at", { ascending: false });

    if (ksData && ksData.length > 0) {
      ksData.forEach((ks) => {
        if (!seenUrls.has(ks.url)) {
          seenUrls.add(ks.url);
          list.push({
            id: ks.id,
            name: ks.name,
            organization: ks.name,
            authority_type: (ks.authority_level || "CENTRAL") as any,
            url: ks.url,
            source_type: ks.source_type || "OFFICIAL_MINISTRY",
            jurisdiction: ks.authority_level || "Central",
            category: "Government Scheme",
            active: ks.verification_status !== "UNVERIFIED",
            scan_frequency: "daily",
            last_scanned_at: ks.last_verified || ks.updated_at || ks.created_at,
            reliability_level: ks.trust_score && ks.trust_score >= 95 ? "HIGH" : "VERIFIED",
            created_at: ks.created_at || new Date().toISOString(),
          });
        }
      });
    }

    // 2. Query monitored_sources table directly from database
    const { data: msData } = await supabaseAdmin
      .from("monitored_sources")
      .select("*")
      .order("created_at", { ascending: false });

    if (msData && msData.length > 0) {
      msData.forEach((ms) => {
        if (!seenUrls.has(ms.url)) {
          seenUrls.add(ms.url);
          list.push(ms as MonitoredSource);
        }
      });
    }

    return NextResponse.json({ sources: list });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, source } = body;

    const isAdmin = await isUserAdmin(userId, email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required to add sources." },
        { status: 403 }
      );
    }

    if (!source || !source.name || !source.url) {
      return NextResponse.json(
        { error: "Source name and URL are required." },
        { status: 400 }
      );
    }

    // Insert new source into both knowledge_sources and monitored_sources tables in DB
    await supabaseAdmin.from("knowledge_sources").insert({
      name: source.name,
      url: source.url,
      source_type: "OFFICIAL_MINISTRY",
      authority_level: source.authority_type || "CENTRAL",
      verification_status: "VERIFIED",
      trust_score: 95.0,
      risk_level: "LOW",
    });

    const { data, error } = await supabaseAdmin
      .from("monitored_sources")
      .insert({
        name: source.name,
        organization: source.organization || "Government Authority",
        authority_type: source.authority_type || "CENTRAL",
        url: source.url,
        source_type: source.source_type || "MINISTRY_SITE",
        jurisdiction: source.jurisdiction || "Central",
        state: source.state || null,
        category: source.category || "Government Scheme",
        active: source.active !== undefined ? source.active : true,
        scan_frequency: source.scan_frequency || "daily",
        reliability_level: source.reliability_level || "HIGH",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, source: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, sourceId, updates } = body;

    const isAdmin = await isUserAdmin(userId, email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required to modify sources." },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("monitored_sources")
      .update(updates)
      .eq("id", sourceId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, source: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
