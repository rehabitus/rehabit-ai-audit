"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/versions/sprint/ui/CTAButton";
import { NavTrustBar } from "@/components/versions/sprint/ui/NavTrustBar";
import { heroStagger, heroChild } from "@/lib/animations";
import { VideoPlayer } from "@/components/versions/sprint/ui/VideoPlayer";
import type { PricingInfo } from "@/lib/pricing";
import { useLanguage } from "@/context/LanguageContext";

// Frozen hero for /apply — retains original headline + copy independent of homepage changes
export function ApplyHeroSection() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const { t } = useLanguage();

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
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange backdrop-blur-sm"
        >
          {t("applyHero.pill")}
        </motion.div>

        <motion.h1
          variants={heroChild}
          className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight text-white md:text-5xl lg:text-[54px] text-balance"
        >
          {t("applyHero.headline")}
        </motion.h1>

        <VideoPlayer />

        <motion.p
          variants={heroChild}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed"
        >
          {t("applyHero.body")}
        </motion.p>

        <motion.div variants={heroChild} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <CTAButton>{t("applyHero.cta")}</CTAButton>
        </motion.div>

        <motion.p variants={heroChild} className="mt-5 text-base font-semibold text-white">
          {t("applyHero.guarantee")}
        </motion.p>
        <motion.p variants={heroChild} className="mt-1 text-sm text-slate-400">
          {t("applyHero.pricing_pre")} <span className="font-semibold text-white">${(pricing?.priceUsd ?? 1000).toLocaleString()}</span> {t("applyHero.pricing_post")}
        </motion.p>

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
