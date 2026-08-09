/**
 * Environment variable access for Vayam.
 *
 * Rules:
 * 1. Variables prefixed with NEXT_PUBLIC_ are accessible in the browser.
 *    Never put secrets there.
 * 2. Server-only secrets (API keys, service-role keys) are accessed
 *    from this module and must NEVER be imported into client components.
 * 3. All accesses are validated at startup; missing required variables
 *    throw clearly-worded errors.
 */

// ---------------------------------------------------------------------------
// Server-only (never exposed to the browser)
// ---------------------------------------------------------------------------

/**
 * Access a required server-side environment variable.
 * Throws at runtime if the variable is missing so that misconfigured
 * deploys fail loudly rather than silently.
 */
function requireServerEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[Vayam] Missing required server environment variable: ${key}. ` +
        `Check your .env.local file or deployment environment.`
    );
  }
  return value;
}

function optionalServerEnv(key: string): string | undefined {
  return process.env[key] || undefined;
}

/**
 * Supabase configuration (server-side only).
 * The service-role key must NEVER be sent to the browser.
 */
export function getSupabaseServerConfig() {
  return {
    url: requireServerEnv("SUPABASE_URL"),
    serviceRoleKey: requireServerEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

/**
 * AI provider configuration (server-side only).
 * API keys must never be exposed client-side.
 */
export function getAIServerConfig() {
  return {
    sarvamApiKey: optionalServerEnv("SARVAM_API_KEY"),
    groqApiKey: optionalServerEnv("GROQ_API_KEY"),
  };
}

// ---------------------------------------------------------------------------
// Public (safe to use in client and server components)
// ---------------------------------------------------------------------------

export const PUBLIC_ENV = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV ?? "development") as
    | "development"
    | "staging"
    | "production",
} as const;
