"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/versions/sprint/ui/CTAButton";
import { NavTrustBar } from "@/components/versions/sprint/ui/NavTrustBar";
import { heroStagger, heroChild } from "@/lib/animations";
import { VideoPlayer } from "@/components/versions/sprint/ui/VideoPlayer";
import { useLanguage } from "@/context/LanguageContext";
import type { PricingInfo } from "@/lib/pricing";

export function FastHeroSection() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const { t } = useLanguage();
  const heroBody = t("fastHero.body");
  const heroPricing = t("fastHero.pricing", { price: (pricing?.priceUsd ?? 1000).toLocaleString() });

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d: PricingInfo) => setPricing(d))
      .catch(() => { });
  }, []);

  return (
    <section id="hero" className="hero-gradient bg-brand-dark px-6 pt-28 pb-10 md:pt-32 md:pb-14">
      <motion.div
        className="relative z-10 mx-auto max-w-5xl text-center"
        variants={heroStagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={heroChild}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-brand-orange/20 bg-brand-orange/5 px-6 py-2.5 text-lg font-bold uppercase tracking-widest text-brand-orange backdrop-blur-sm"
        >
          {t("fastHero.pill")}
        </motion.div>

        <motion.h1
          variants={heroChild}
          className="mx-auto max-w-4xl text-4xl font-extrabold leading-[0.95] text-white md:text-[58px] lg:text-[66px] uppercase"
        >
          {t("fastHero.headline_1")}<br />{t("fastHero.headline_2")}
        </motion.h1>

        <motion.p
          variants={heroChild}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed"
        >
          {t("fastHero.subheadline")}
        </motion.p>

        <VideoPlayer />

        {heroBody ? (
          <motion.p
            variants={heroChild}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed"
          >
            {heroBody}
          </motion.p>
        ) : null}

        <motion.div variants={heroChild} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <CTAButton>{t("fastHero.cta")}</CTAButton>
        </motion.div>

        <motion.p variants={heroChild} className="mt-5 text-base font-semibold text-white">
          {t("fastHero.guarantee")}
        </motion.p>
        {heroPricing ? (
          <motion.p variants={heroChild} className="mt-1 text-sm text-slate-400">
            {heroPricing}
          </motion.p>
        ) : null}

        <motion.div
          variants={heroChild}
          className="mt-8 flex justify-center"
        >
          <NavTrustBar size="md" reviewCount={pricing?.reviewCount ?? 0} />
        </motion.div>
      </motion.div>
    </section>
  );
}
