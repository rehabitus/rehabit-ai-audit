"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import en from "@/locales/en.json";
import sk from "@/locales/sk.json";
import {
  buildLocalizedHref,
  buildLocalizedPathname,
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  isLocale,
  PARAM_KEY,
  type Locale,
} from "@/lib/locale";

export type { Locale } from "@/lib/locale";

// ─── Raw nested path accessor ───────────────────────────────────────────────
function getNestedRaw(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function getNestedString(obj: Record<string, unknown>, path: string): string {
  const val = getNestedRaw(obj, path);
  return typeof val === "string" ? val : path; // fall back to key if missing
}

// ─── Locale map ─────────────────────────────────────────────────────────────
const LOCALES: Record<Locale, Record<string, unknown>> = { en, sk };
const STORAGE_KEY = "rehabit-locale";

// ─── Context type ────────────────────────────────────────────────────────────
interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  localizeHref: (href: string) => string;
  /** Look up a single translated string, with optional {var} interpolation */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Look up an array of translated strings */
  tArr: (key: string) => string[];
  /** Look up an array of translated objects */
  tObjects: <T = Record<string, string>>(key: string) => T[];
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  localizeHref: (href) => href,
  t: (key) => key,
  tArr: () => [],
  tObjects: () => [],
});

// ─── Provider ────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const resolveLocale = () => {
      const prefixedLocale = pathname ? getLocaleFromPathname(pathname) : null;
      if (prefixedLocale) {
        setLocaleState(prefixedLocale);
        return;
      }

      try {
        const queryLocale = new URLSearchParams(window.location.search).get(PARAM_KEY);
        if (isLocale(queryLocale)) {
          setLocaleState(queryLocale);
          return;
        }
      } catch { /* ignore */ }

      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
        if (stored && stored in LOCALES) {
          setLocaleState(stored);
          return;
        }
      } catch { /* SSR / private-browsing guard */ }

      setLocaleState(DEFAULT_LOCALE);
    };

    resolveLocale();
    window.addEventListener("popstate", resolveLocale);
    return () => window.removeEventListener("popstate", resolveLocale);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch { /* ignore */ }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      const url = new URL(window.location.href);
      url.pathname = buildLocalizedPathname(url.pathname, next);
      url.searchParams.delete(PARAM_KEY);
      React.startTransition(() => {
        router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
      });
    } catch { /* ignore */ }
  }, [router]);

  const localizeHref = useCallback((href: string) => buildLocalizedHref(href, locale), [locale]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      let value = getNestedString(LOCALES[locale] as Record<string, unknown>, key);
      // Fall back to EN if key missing in target locale
      if (value === key && locale !== "en") {
        value = getNestedString(LOCALES.en as Record<string, unknown>, key);
      }
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    },
    [locale]
  );

  const tArr = useCallback(
    (key: string): string[] => {
      const val = getNestedRaw(LOCALES[locale] as Record<string, unknown>, key);
      if (Array.isArray(val)) return val as string[];
      // Fall back to EN
      if (locale !== "en") {
        const fallback = getNestedRaw(LOCALES.en as Record<string, unknown>, key);
        if (Array.isArray(fallback)) return fallback as string[];
      }
      return [];
    },
    [locale]
  );

  const tObjects = useCallback(
    <T = Record<string, string>>(key: string): T[] => {
      const val = getNestedRaw(LOCALES[locale] as Record<string, unknown>, key);
      if (Array.isArray(val)) return val as T[];
      if (locale !== "en") {
        const fallback = getNestedRaw(LOCALES.en as Record<string, unknown>, key);
        if (Array.isArray(fallback)) return fallback as T[];
      }
      return [];
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, localizeHref, t, tArr, tObjects }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
