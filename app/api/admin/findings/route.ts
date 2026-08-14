import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isUserAdmin } from "@/lib/admin/auth";
import { approveCivicFinding, rejectCivicFinding, markFindingInvestigation } from "@/lib/admin/approval";
import { writeApprovedUpdateToDatabase } from "@/lib/admin/db-writer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = supabaseAdmin
      .from("civic_update_findings")
      .select("*, source:monitored_sources(*)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: findings, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ findings: findings || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { findingId, action, reason, userId, email } = body;

    const isAdmin = await isUserAdmin(userId, email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required to review findings." },
        { status: 403 }
      );
    }

    if (!findingId || !action) {
      return NextResponse.json(
        { error: "Missing required parameters: findingId and action." },
        { status: 400 }
      );
    }

    if (action === "APPROVE") {
      const result = await writeApprovedUpdateToDatabase(findingId, userId);
      return NextResponse.json(result);
    }

    if (action === "REJECT") {
      const result = await rejectCivicFinding(findingId, userId, reason);
      return NextResponse.json(result);
    }

    if (action === "INVESTIGATE") {
      const result = await markFindingInvestigation(findingId, userId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action type." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
