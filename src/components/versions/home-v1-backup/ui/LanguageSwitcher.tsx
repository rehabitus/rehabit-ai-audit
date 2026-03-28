"use client";

import { useLanguage, type Locale } from "@/context/LanguageContext";

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "sk", label: "SK", flag: "🇸🇰" },
];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="flex items-center gap-1" aria-label={t("language_switcher.label")}>
      {LANGUAGES.map(({ code, label, flag }, i) => (
        <span key={code} className="flex items-center gap-1">
          <button
            onClick={() => setLocale(code)}
            aria-pressed={locale === code}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors ${
              locale === code
                ? "bg-white/10 text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <span aria-hidden="true">{flag}</span>
            {label}
          </button>
          {i < LANGUAGES.length - 1 && (
            <span className="text-slate-700 select-none">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
