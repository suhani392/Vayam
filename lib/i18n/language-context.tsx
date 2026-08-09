"use client";

/**
 * lib/i18n/language-context.tsx
 *
 * React Context for Vayam language state.
 * Persists selected language in localStorage under "vayam_language".
 * Restores on mount. No login required.
 * Falls back to "en" for unrecognized codes.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { LanguageCode } from "./types";
import { SUPPORTED_LANGUAGES } from "./types";
import { t, createTranslator } from "./index";
import type { TranslationMap } from "./types";

const STORAGE_KEY = "vayam_language";
const DEFAULT_LANG: LanguageCode = "en";

function isValidLanguageCode(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGES.some((l) => l.code === code);
}

export interface LanguageContextValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: keyof TranslationMap) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => key as string,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(DEFAULT_LANG);
  const [mounted, setMounted] = useState(false);

  // Restore from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isValidLanguageCode(stored)) {
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable — use default
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: LanguageCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  const translator = useCallback(
    (key: keyof TranslationMap) => t(key, lang),
    [lang]
  );

  // Avoid hydration mismatch: render with default lang on server
  const value: LanguageContextValue = {
    lang: mounted ? lang : DEFAULT_LANG,
    setLang,
    t: translator,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextValue {
  return useContext(LanguageContext);
}
