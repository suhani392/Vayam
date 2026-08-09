import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Strict mode catches common React mistakes during development.
   * Keep enabled — it will surface issues before production.
   */
  reactStrictMode: true,

  /**
   * typedRoutes: Generates TypeScript types for all Next.js routes.
   * Used in app/layout.tsx with LayoutProps<"/">.
   */
  typedRoutes: true,
};

export default nextConfig;
