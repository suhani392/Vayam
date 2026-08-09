/**
 * lib/db/supabase.ts
 *
 * Supabase Database & Auth Client for Vayam.
 * Connects to Supabase PostgreSQL database using environment variables.
 * Provides typed database access for profiles, user_preferences, knowledge records, and notifications.
 */

import { createClient } from "@supabase/supabase-js";
import { PUBLIC_ENV } from "@/config/env";
import type { DbProfile, DbUserPreferences } from "@/types/db";

const supabaseUrl =
  PUBLIC_ENV.supabaseUrl || "https://ihkyjgwggejoynmioemk.supabase.co";
const supabaseAnonKey =
  PUBLIC_ENV.supabaseAnonKey ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa3lqZ3dnZ2Vqb3lubWlvZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDUyNTUsImV4cCI6MjEwMTgyMTI1NX0.WT9kbjQYwZbUi_97J6ViGysUX1F0pT5eXW2L8cuk-_A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Test Supabase Database connection.
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  try {
    const { data, error } = await supabase.from("categories").select("id").limit(1);
    if (error) {
      return {
        connected: false,
        message: `Database reachable, table check: ${error.message}`,
      };
    }
    return {
      connected: true,
      message: `Successfully connected to Supabase PostgreSQL (${data?.length || 0} categories retrieved)`,
    };
  } catch (err: any) {
    return { connected: false, message: `Connection error: ${err.message}` };
  }
}

/**
 * Fetch profile for a given user UUID from `profiles` table.
 */
export async function fetchDbProfile(userId: string): Promise<DbProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.warn("fetchDbProfile error or not found:", error.message);
      return null;
    }
    return data as DbProfile;
  } catch (err) {
    console.error("fetchDbProfile exception:", err);
    return null;
  }
}

/**
 * Upsert profile in `profiles` table.
 */
export async function upsertDbProfile(
  profileData: Partial<DbProfile> & { id: string }
): Promise<{ success: boolean; data?: DbProfile; error?: string }> {
  try {
    const payload = {
      ...profileData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select("*")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: data as DbProfile };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile" };
  }
}

/**
 * Fetch user preferences from `user_preferences` table.
 */
export async function fetchDbUserPreferences(
  userId: string
): Promise<DbUserPreferences | null> {
  try {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      return null;
    }
    return data as DbUserPreferences;
  } catch (err) {
    return null;
  }
}
