import { NextRequest, NextResponse } from "next/server";
import { isUserAdmin } from "@/lib/admin/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email } = body;

    const isAdmin = await isUserAdmin(userId, email);

    if (!isAdmin) {
      return NextResponse.json(
        { authorized: false, message: "Unauthorized: Admin privileges required." },
        { status: 403 }
      );
    }

    return NextResponse.json({ authorized: true, email: email || "admin@gmail.com" });
  } catch (err: any) {
    return NextResponse.json(
      { authorized: false, error: err.message },
      { status: 500 }
    );
  }
}
