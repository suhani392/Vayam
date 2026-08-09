"use client";

/**
 * components/ui/inline-script.tsx
 *
 * A wrapper for inline <script> tags in Next.js App Router.
 *
 * Use this when you need a script to run synchronously during HTML parsing
 * — before React hydrates and before the browser paints.  This is the
 * correct approach for setting DOM state (theme, locale preferences, etc.)
 * without a flash.
 *
 * Usage:
 *   <InlineScript html={`document.documentElement.setAttribute("data-x", "y")`} />
 *
 * Security note: only pass static strings to `html`.
 * Never interpolate untrusted user data into inline scripts.
 *
 * Reference: Next.js 16 docs — "Preventing Flash Before Hydration"
 */

interface InlineScriptProps {
  html: string;
}

export function InlineScript({ html }: InlineScriptProps) {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: html }} />;
}
