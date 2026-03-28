"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/versions/twin/ui/Section";
import { CTAButton } from "@/components/versions/twin/ui/CTAButton";
import { NavTrustBar } from "@/components/versions/twin/ui/NavTrustBar";
import { fadeInUp, slideInLeft, slideInRight, staggerContainer, viewportOnce } from "@/lib/animations";
import { WebGLBackground } from "@/components/backgrounds/WebGLBackground";
import { BookingQualificationModal } from "@/components/versions/twin/ui/BookingQualificationModal";
import type { PricingInfo } from "@/lib/pricing";
import { useLanguage } from "@/context/LanguageContext";

export function FinalCTASection() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d: PricingInfo) => setPricing(d))
      .catch(() => { });
  }, []);

  const priceUsd = pricing?.priceUsd ?? 500;
  const slotsLeft = pricing?.slotsRemaining ?? null;
  const nextPrice = pricing?.nextPriceUsd ?? null;
  const reviewCount = pricing?.reviewCount ?? 0;
  const roi = Math.round(20000 / priceUsd);

  const ctaLabel = slotsLeft && slotsLeft > 0
    ? t("finalCTA.cta_with_slots", { count: slotsLeft, price: priceUsd.toLocaleString() })
    : t("finalCTA.cta_default");

  const pricingMechanic = nextPrice
    ? t("finalCTA.pricing_mechanic_next", { price: priceUsd.toLocaleString(), nextPrice: nextPrice.toLocaleString() })
    : t("finalCTA.pricing_mechanic_full", { price: priceUsd.toLocaleString() });

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
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl text-balance">
          {t("finalCTA.headline")}
        </motion.h2>

        {/* Two-choice cards with OR divider */}
        <div className="relative mt-10 grid items-start gap-6 md:grid-cols-2">
          {/* OR pill — visible only on desktop between the two cards */}
          <div className="absolute inset-y-0 left-1/2 z-10 hidden -translate-x-1/2 items-center md:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-brand-dark text-xs font-bold tracking-widest text-slate-400">
              OR
            </span>
          </div>

          {/* Option A — dead end */}
          <motion.div
            variants={slideInLeft}
            className="rounded-xl border border-white/8 bg-white/3 p-8 text-left grayscale"
            style={{ filter: 'grayscale(0.4) brightness(0.75)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-red-400/70">{t("finalCTA.optionA_label")}</p>
            <p className="mt-4 text-slate-500 leading-relaxed text-balance">
              {t("finalCTA.optionA_body")}
            </p>
          </motion.div>

          {/* Option B — elevated, the clear winner */}
          <motion.div
            variants={slideInRight}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-xl border-2 border-brand-green/60 bg-brand-green/10 p-8 text-left shadow-[0_0_60px_rgba(16,185,129,0.15)] ring-1 ring-brand-green/20"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-brand-green">{t("finalCTA.optionB_label")}</p>
            <p className="mt-4 text-slate-300 leading-relaxed text-balance">
              {t("finalCTA.optionB_pre")}{" "}
              <span className="font-bold text-white">${priceUsd.toLocaleString()}</span>{" "}
              {t("finalCTA.optionB_post")}
            </p>
          </motion.div>
        </div>

        {/* ROI math */}
        <motion.div variants={fadeInUp} className="mt-10">
          <p className="text-lg text-slate-400">
            {t("finalCTA.math_pre")}{" "}
            <span className="relative inline-flex items-center gap-1 font-semibold text-white">
              {t("finalCTA.math_savings")}
              <button
                onClick={() => setInfoOpen(true)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[10px] text-slate-400 transition-colors hover:bg-white/20 hover:text-white"
                title={t("finalCTA.roi_modal_title")}
              >
                ?
              </button>
            </span>{" "}
            {t("finalCTA.math_post")} <br className="hidden md:block" /> {t("finalCTA.math_return_pre")}{" "}
            <span className="font-bold text-brand-green">{t("finalCTA.math_return_highlight", { roi })}</span> {t("finalCTA.math_return_post")}{" "}
            <span className="font-semibold text-white">{t("finalCTA.math_investment", { price: priceUsd.toLocaleString() })}</span>
          </p>
          <p className="mt-2 text-lg text-slate-400">
            {t("finalCTA.guarantee")}
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

        <motion.p variants={fadeInUp} className="mt-4 text-sm text-slate-500">
          {pricingMechanic}
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-4 text-base text-slate-400">
          {t("finalCTA.questions")}{" "}
          <button
            onClick={() => setSurveyOpen(true)}
            className="font-semibold text-brand-green underline underline-offset-2 hover:text-brand-green-light transition-colors"
          >
            {t("finalCTA.book_call")}
          </button>{" "}
          {t("finalCTA.or_email")}{" "}
          <a
            href="mailto:support@rehabit.ai"
            className="text-brand-green underline transition-colors hover:text-brand-green/80"
          >
            support@rehabit.ai
          </a>.
        </motion.p>
      </motion.div>

      {/* ROI Info Modal */}
      <AnimatePresence>
        {infoOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-950">{t("finalCTA.roi_modal_title")}</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                {t("finalCTA.roi_modal_p1")}
              </p>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                {t("finalCTA.roi_modal_p2")} <span className="text-brand-green font-semibold">{t("finalCTA.roi_modal_pct")}</span> {t("finalCTA.roi_modal_p2_end")} <span className="text-slate-950 font-medium">{t("finalCTA.roi_modal_result")}</span>
              </p>
              <button
                onClick={() => setInfoOpen(false)}
                className="mt-6 w-full rounded-lg bg-brand-green/20 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/30"
              >
                {t("finalCTA.roi_modal_cta")}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BookingQualificationModal
        isOpen={surveyOpen}
        onClose={() => setSurveyOpen(false)}
      />
    </Section>
  );
}
