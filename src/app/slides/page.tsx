"use client";

import { NavCheckoutButton } from "@/components/versions/slides/ui/NavCheckoutButton";
import { NavTrustBar } from "@/components/versions/slides/ui/NavTrustBar";
import { LanguageSwitcher } from "@/components/versions/slides/ui/LanguageSwitcher";
import { TrustpilotWidget } from "@/components/versions/slides/ui/TrustpilotWidget";
import { TwinStorySections } from "@/components/versions/slides/sections/TwinStorySections";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useSectionView } from "@/hooks/useSectionView";
import { useConversionTracking } from "@/hooks/useConversionTracking";
import { useLanguage } from "@/context/LanguageContext";

const SECTION_IDS = [
  "story-hook",
  "story-problem",
  "story-shift",
  "story-method",
  "story-agency-agents",
  "story-what-is-an-agent",
  "story-not",
  "story-identity",
  "story-who-this-is-for",
  "story-digital-twin",
  "story-social-proof",
  "story-value-stack",
  "story-pricing-offer",
  "story-guarantee",
  "story-bigger-vision",
  "story-close",
];

export default function Slides() {
  useScrollDepth();
  useSectionView(SECTION_IDS);
  useConversionTracking();
  const { t } = useLanguage();

  return (
    <main className="overflow-x-hidden bg-slate-50 text-slate-950" id="main-content">
      <a
        href="#story-hook"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-brand-orange focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t("common.skip_to_content")}
      </a>

      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="font-logo text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            rehabit<span className="text-brand-green">.ai</span>
          </span>
          <div className="hidden md:flex items-center">
            <NavTrustBar />
          </div>
          <NavCheckoutButton />
        </div>
      </nav>

      <TwinStorySections />

      <TrustpilotWidget />

      <footer className="border-t border-slate-200/80 bg-white px-6 py-8 text-center text-sm text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <LanguageSwitcher />
          <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
        </div>
      </footer>
    </main>
  );
}
