"use client";

import { TwinHeroSection } from "@/components/versions/twin/sections/TwinHeroSection";
import { NavCheckoutButton } from "@/components/versions/twin/ui/NavCheckoutButton";
import { NavTrustBar } from "@/components/versions/twin/ui/NavTrustBar";
import { ProblemSection } from "@/components/versions/twin/sections/ProblemSection";
import { BridgeSection } from "@/components/versions/twin/sections/BridgeSection";
import { OfferSection } from "@/components/versions/twin/sections/OfferSection";
import { OutcomesSection } from "@/components/versions/twin/sections/OutcomesSection";
import { ProcessSection } from "@/components/versions/twin/sections/ProcessSection";
import { TrustSection } from "@/components/versions/twin/sections/TrustSection";
import { PricingSection } from "@/components/versions/twin/sections/PricingSection";
import { FAQSection } from "@/components/versions/twin/sections/FAQSection";
import { FinalCTASection } from "@/components/versions/twin/sections/FinalCTASection";
import { DeliverablesSection } from "@/components/versions/twin/sections/DeliverablesSection";
import { TrustpilotWidget } from "@/components/versions/twin/ui/TrustpilotWidget";
import { ExitIntentModal } from "@/components/versions/twin/ui/ExitIntentModal";
import { CTAButton } from "@/components/versions/twin/ui/CTAButton";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useSectionView } from "@/hooks/useSectionView";
import { useConversionTracking } from "@/hooks/useConversionTracking";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/versions/twin/ui/LanguageSwitcher";

const SECTION_IDS = ["hero", "problem", "why-now", "offer", "outcomes", "deliverables", "process", "trust", "pricing", "faq", "reserve"];

export default function Twin() {
  useScrollDepth();
  useSectionView(SECTION_IDS);
  useConversionTracking();
  const { t } = useLanguage();

  return (
    <main className="overflow-x-hidden" id="main-content">
      {/* ── SKIP TO CONTENT (accessibility) ── */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-brand-green focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-dark"
      >
        {t("common.skip_to_content")}
      </a>

      {/* ── STICKY NAV BAR ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-brand-dark/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="font-logo text-2xl font-bold tracking-tight text-white md:text-3xl">
            rehabit<span className="text-brand-green">.ai</span>
          </span>
          {/* Trust bar — hidden on mobile, centered on desktop */}
          <div className="hidden md:flex items-center">
            <NavTrustBar />
          </div>
          <NavCheckoutButton />
        </div>
      </nav>

      {/* ── SECTIONS ── */}
      <TwinHeroSection />
      <div className="section-divider-blue" />
      <ProblemSection />
      <div className="section-divider-blue" />
      <BridgeSection />
      <div className="section-divider-green" />
      <OfferSection />
      <div className="section-divider-blue" />
      <OutcomesSection />
      <div className="section-divider-green" />
      <DeliverablesSection />

      {/* ── MID-PAGE CTA ── high-intent visitors who don't need to read everything */}
      <section className="bg-brand-dark px-6 py-10 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-green">{t("midCta.eyebrow")}</p>
          <p className="mb-6 text-xl font-bold text-white text-balance">
            {t("midCta.body")}
          </p>
          <CTAButton>{t("midCta.cta")}</CTAButton>
        </div>
      </section>

      <div className="section-divider-blue" />
      <ProcessSection />
      <div className="section-divider-blue" />
      <TrustSection />
      <div className="section-divider-green" />
      <PricingSection />
      <div className="section-divider-blue" />
      <FAQSection />
      <div className="section-divider-green" />
      <FinalCTASection />

      {/* ── TRUSTPILOT ── */}
      <TrustpilotWidget />

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-brand-dark px-6 py-8 text-center text-sm text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <LanguageSwitcher />
          <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
        </div>
      </footer>

      {/* ── EXIT INTENT LEAD CAPTURE ── */}
      <ExitIntentModal />
    </main>
  );
}
