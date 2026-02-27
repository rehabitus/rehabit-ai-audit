"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { CTAButton } from "@/components/ui/CTAButton";
import { NavTrustBar } from "@/components/ui/NavTrustBar";
import { fadeInUp, slideInLeft, slideInRight, staggerContainer, viewportOnce } from "@/lib/animations";
import { WebGLBackground } from "@/components/backgrounds/WebGLBackground";
import { BookingQualificationModal } from "@/components/ui/BookingQualificationModal";
import type { PricingInfo } from "@/lib/pricing";

export function FinalCTASection() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [surveyOpen, setSurveyOpen] = useState(false);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d: PricingInfo) => setPricing(d))
      .catch(() => {});
  }, []);

  const priceUsd    = pricing?.priceUsd ?? 500;
  const slotsLeft   = pricing?.slotsRemaining ?? null;
  const nextPrice   = pricing?.nextPriceUsd ?? null;
  const reviewCount = pricing?.reviewCount ?? 0;
  const roi         = Math.round(20000 / priceUsd);

  const ctaLabel = slotsLeft && slotsLeft > 0
    ? `→ Reserve Your Slot — ${slotsLeft} Left at $${priceUsd.toLocaleString()}`
    : `→ Reserve Your Audit Slot`;

  const pricingMechanic = nextPrice
    ? `Price rises $500 every 5 verified client reviews. Currently $${priceUsd.toLocaleString()} — next tier $${nextPrice.toLocaleString()}.`
    : `Currently at full rate: $${priceUsd.toLocaleString()}.`;

  return (
    <Section
      className="relative overflow-hidden bg-gradient-to-b from-brand-navy to-brand-dark text-center"
      id="reserve"
      noAnimate
    >
      <WebGLBackground scene="aurora" />
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl">
          You have two choices.
        </motion.h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Option A — dimmed, status quo */}
          <motion.div
            variants={slideInLeft}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-left opacity-70"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-brand-red/80">Option A</p>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Keep doing things the way you&rsquo;re doing them. Keep copying data by hand. Keep
              losing clients between sessions. Keep hearing about AI and wondering if it applies to
              you. Keep guessing.
            </p>
          </motion.div>

          {/* Option B — elevated, the choice */}
          <motion.div
            variants={slideInRight}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-xl border-2 border-brand-green/50 bg-brand-green/10 p-8 text-left shadow-[0_0_40px_rgba(16,185,129,0.1)]"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-brand-green">Option B</p>
            <p className="mt-4 text-slate-200 leading-relaxed">
              Invest{" "}
              <span className="font-semibold text-white">${priceUsd.toLocaleString()}</span>{" "}
              and 1 hour of your time. In 5 days, know exactly where you&rsquo;re losing money,
              exactly how to fix it, and exactly what it&rsquo;ll save you. Walk away with a
              professional report, a clear roadmap, a working Digital Twin&nbsp;&mdash; and if you
              pay in full, your first Core AI System built and live at no extra cost.
            </p>
          </motion.div>
        </div>

        <motion.div variants={fadeInUp} className="mt-10">
          <p className="text-lg text-slate-300">
            The math is simple: if the audit reveals even{" "}
            <span className="font-semibold text-white">$20,000 in annual savings</span> (and it
            will), that&rsquo;s a{" "}
            <span className="font-bold text-brand-green">{roi}x return</span> on a{" "}
            <span className="font-semibold text-white">${priceUsd.toLocaleString()}</span> investment.
          </p>
          <p className="mt-2 text-lg text-slate-300">
            If it doesn&rsquo;t? You get your money back.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-10">
          <div className="hidden md:inline-block animate-breathe">
            <CTAButton>{ctaLabel}</CTAButton>
          </div>
          <div className="md:hidden">
            <CTAButton>{ctaLabel}</CTAButton>
          </div>
        </motion.div>

        {/* Trust bar */}
        <motion.div variants={fadeInUp} className="mt-6 flex justify-center">
          <NavTrustBar size="md" reviewCount={reviewCount} />
        </motion.div>

        <motion.p variants={fadeInUp} className="mt-4 text-sm text-slate-400">
          {pricingMechanic}
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-4 text-base text-slate-300">
          Questions?{" "}
          <button
            onClick={() => setSurveyOpen(true)}
            className="font-semibold text-brand-green underline underline-offset-2 hover:text-brand-green-light transition-colors"
          >
            Book a 15-minute call
          </button>{" "}
          or email{" "}
          <a
            href="mailto:mike@rehabit.ai"
            className="font-semibold text-brand-green underline underline-offset-2 hover:text-brand-green-light transition-colors"
          >
            mike@rehabit.ai
          </a>.
        </motion.p>
      </motion.div>

      <BookingQualificationModal
        isOpen={surveyOpen}
        onClose={() => setSurveyOpen(false)}
      />
    </Section>
  );
}
