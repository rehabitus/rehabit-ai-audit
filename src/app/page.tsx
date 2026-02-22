"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { NavCheckoutButton } from "@/components/ui/NavCheckoutButton";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { BridgeSection } from "@/components/sections/BridgeSection";
import { OfferSection } from "@/components/sections/OfferSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { DeliverablesSection } from "@/components/sections/DeliverablesSection";
import { TrustpilotWidget } from "@/components/ui/TrustpilotWidget";

export default function Home() {
  return (
    <main className="overflow-x-hidden" id="main-content">
      {/* ── SKIP TO CONTENT (accessibility) ── */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-brand-green focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-dark"
      >
        Skip to content
      </a>

      {/* ── STICKY NAV BAR ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-brand-dark/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-logo text-2xl font-bold tracking-tight text-white md:text-3xl">
            rehabit<span className="text-brand-green">.ai</span>
          </span>
          <NavCheckoutButton />
        </div>
      </nav>

      {/* ── SECTIONS ── */}
      <HeroSection />
      <div className="section-divider-green" />
      <ProblemSection />
      <div className="section-divider-blue" />
      <BridgeSection />
      <div className="section-divider-green" />
      <OfferSection />
      <div className="section-divider-blue" />
      <OutcomesSection />
      <div className="section-divider-green" />
      <DeliverablesSection />
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
        &copy; {new Date().getFullYear()} rehabit.ai &mdash; All rights reserved.
      </footer>
    </main>
  );
}
