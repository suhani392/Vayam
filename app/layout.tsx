import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Devanagari, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/config/app";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { THEME_SCRIPT } from "@/lib/theme";
import { LanguageProvider } from "@/lib/i18n/language-context";

/* --------------------------------------------------------------------------
   Vayam Font System
   - Plus Jakarta Sans: Primary humanist/geometric Latin font (warm, rounded, modern)
   - Noto Sans Devanagari: High-fidelity Hindi & Marathi Devanagari script support
   - Geist Mono: Monospaced numeric & code text

   Local Font Architecture:
   If font files exist in /public/fonts/, the @font-face rules in globals.css
   will automatically take precedence over Google fonts.
   -------------------------------------------------------------------------- */

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-vayam-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-vayam-devanagari",
  subsets: ["devanagari"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-vayam-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/* --------------------------------------------------------------------------
   Metadata
   -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s — ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    "government schemes India",
    "civic intelligence",
    "Indian welfare schemes",
    "eligibility checker",
    "सरकारी योजनाएं",
    "Vayam",
    "वयम्",
  ],
  authors: [{ name: "Vayam" }],
  openGraph: {
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
  },
};

/* --------------------------------------------------------------------------
   Root Layout
   -------------------------------------------------------------------------- */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${notoSansDevanagari.variable} ${geistMono.variable} h-full`}
    >
      <head>
        {/* Synchronous anti-flash script */}
        {/* eslint-disable-next-line react/no-danger */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
      >
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ThemeProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
