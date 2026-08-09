/**
 * lib/db/supabase.ts
 *
 * Supabase Database Client for Vayam.
 * Connects to Supabase PostgreSQL database using environment variables.
 * Provides typed database access for profiles, knowledge records, and notifications.
 */

import { createClient } from "@supabase/supabase-js";
import { PUBLIC_ENV } from "@/config/env";

const supabaseUrl = PUBLIC_ENV.supabaseUrl || "https://ihkyjgwggejoynmioemk.supabase.co";
const supabaseAnonKey = PUBLIC_ENV.supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa3lqZ3dnZ2Vqb3lubWlvZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDUyNTUsImV4cCI6MjEwMTgyMTI1NX0.WT9kbjQYwZbUi_97J6ViGysUX1F0pT5eXW2L8cuk-_A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Test Supabase Database connection.
 */
export async function checkDatabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from("knowledge_records").select("id").limit(1);
    if (error) {
      // Table might not exist yet before SQL schema run
      return { connected: false, message: `Database reachable, table pending: ${error.message}` };
    }
    return { connected: true, message: `Successfully connected to Supabase PostgreSQL (${data?.length || 0} records retrieved)` };
  } catch (err: any) {
    return { connected: false, message: `Connection error: ${err.message}` };
  }
}
