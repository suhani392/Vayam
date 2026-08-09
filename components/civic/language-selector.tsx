"use client";

/**
 * components/civic/language-selector.tsx
 *
 * LanguageSelector component for Vayam.
 * Connects to LanguageContext — selection is persisted in localStorage.
 * Phase 9: Fully supports en, hi, mr. Other languages shown as "coming soon".
 */

import React from "react";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/types";
import { useLanguage } from "@/hooks/useLanguage";
import type { LanguageCode } from "@/lib/i18n/types";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Globe, ChevronDown, Check } from "lucide-react";

// All languages from app config — phase 9 only fully supports 3
const ALL_LANGUAGES = [
  { code: "en" as LanguageCode, label: "English",  native: "English",  supported: true },
  { code: "hi" as LanguageCode, label: "Hindi",    native: "हिन्दी",   supported: true },
  { code: "mr" as LanguageCode, label: "Marathi",  native: "मराठी",    supported: true },
  { code: "ta", label: "Tamil",   native: "தமிழ்",    supported: false },
  { code: "te", label: "Telugu",  native: "తెలుగు",   supported: false },
  { code: "bn", label: "Bengali", native: "বাংলা",    supported: false },
  { code: "gu", label: "Gujarati",native: "ગુજરાતી",  supported: false },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ",    supported: false },
  { code: "ml", label: "Malayalam",native: "മലയാളം",  supported: false },
];

export function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();

  const activeLang = ALL_LANGUAGES.find((l) => l.code === lang) ?? ALL_LANGUAGES[0];

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle bg-card hover:bg-muted text-body-sm font-medium text-foreground transition-colors cursor-pointer select-none">
          <Globe size={14} className="text-muted-foreground" />
          <span className={lang !== "en" ? "font-devanagari" : ""}>{activeLang.native}</span>
          <ChevronDown size={12} className="text-muted-foreground ml-0.5" />
        </div>
      }
      align="right"
    >
      <div className="py-1 min-w-[180px]">
        <p className="px-3 py-1.5 text-caption font-bold text-muted-foreground uppercase tracking-wider">
          {t("lang.select")}
        </p>

        {/* Fully supported languages */}
        <div className="border-b border-border-subtle pb-1 mb-1">
          {SUPPORTED_LANGUAGES.map((language) => (
            <DropdownItem
              key={language.code}
              selected={lang === language.code}
              onClick={() => setLang(language.code)}
            >
              <span className={`font-medium ${language.script === "devanagari" ? "font-devanagari" : ""}`}>
                {language.label}
              </span>
              {lang === language.code && (
                <Check size={12} className="text-accent ml-auto" />
              )}
            </DropdownItem>
          ))}
        </div>

        {/* Coming-soon languages */}
        <div className="opacity-50 pointer-events-none">
          {ALL_LANGUAGES.filter((l) => !l.supported).map((language) => (
            <DropdownItem key={language.code}>
              <span className="font-medium">{language.native}</span>
              <span className="text-[10px] text-muted-foreground ml-auto font-normal">{t("lang.comingSoon")}</span>
            </DropdownItem>
          ))}
        </div>
      </div>
    </Dropdown>
  );
}
