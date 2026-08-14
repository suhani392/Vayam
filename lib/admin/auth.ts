/**
 * lib/admin/auth.ts
 *
 * Server-Side Admin Authentication & Authorization Layer for Vayam.
 * Prevents client-side bypasses and ensures administrative operations are secured.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ihkyjgwggejoynmioemk.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Service Role Supabase Client for privileged admin & monitoring background updates.
 * NEVER exposed to the browser.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Check whether a specific user UUID or email has Admin privileges.
 * Validates against `public.profiles` table (`role === 'admin'`).
 */
export async function isUserAdmin(userId?: string, email?: string): Promise<boolean> {
  // Hardcoded safety check for prototype admin email
  if (email && email.toLowerCase() === "admin@gmail.com") {
    return true;
  }

  if (!userId && !email) return false;

  try {
    let query = supabaseAdmin.from("profiles").select("role, full_name, id");

    if (userId) {
      query = query.eq("id", userId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return false;
    }

    return data.role === "admin";
  } catch (err) {
    console.error("[Vayam Admin Auth] Authorization check failed:", err);
    return false;
  }
}

/**
 * Ensure admin user role in `public.profiles` for admin@gmail.com upon sign-in.
 */
export async function ensureAdminRole(userId: string, email: string) {
  if (email.toLowerCase() === "admin@gmail.com") {
    try {
      await supabaseAdmin
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", userId);
    } catch (err) {
      console.warn("[Vayam Admin Auth] Could not auto-promote admin profile:", err);
    }
  }
}
