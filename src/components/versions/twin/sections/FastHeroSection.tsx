"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/versions/twin/ui/CTAButton";
import { NavTrustBar } from "@/components/versions/twin/ui/NavTrustBar";
import { heroStagger, heroChild } from "@/lib/animations";
import { VideoPlayer } from "@/components/versions/twin/ui/VideoPlayer";
import { useLanguage } from "@/context/LanguageContext";
import type { PricingInfo } from "@/lib/pricing";
import { TWIN_LOCKED_COPY } from "@/components/versions/twin/constants";

export function FastHeroSection() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d: PricingInfo) => setPricing(d))
      .catch(() => { });
  }, []);

  useEffect(() => {
    const { queryParam } = TWIN_LOCKED_COPY.hero.splitTest;
    const total = TWIN_LOCKED_COPY.hero.headlines.length;
    const rawQuery = new URLSearchParams(window.location.search).get(queryParam);
    const parsedQuery = rawQuery ? Number.parseInt(rawQuery, 10) : NaN;

    // Query param uses 1-based indexing for easier manual QA: ?hh=1 ... ?hh=10
    if (Number.isFinite(parsedQuery) && parsedQuery >= 1 && parsedQuery <= total) {
      const forcedIndex = parsedQuery - 1;
      setHeadlineIndex(forcedIndex);
      return;
    }

    // Temporary behavior for testing: randomize on each page load/refresh.
    const assignedIndex = Math.floor(Math.random() * total);
    setHeadlineIndex(assignedIndex);
  }, []);

  return (
    <section id="hero" className="twin-hero-gradient bg-white px-6 pt-28 pb-10 md:pt-32 md:pb-14">
      <motion.div
        className="relative z-10 mx-auto max-w-7xl text-center"
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
          className="mx-auto max-w-[1200px] text-[27px] font-extrabold leading-[0.95] text-slate-950 md:text-[39px] lg:text-[44px] text-balance"
        >
          {TWIN_LOCKED_COPY.hero.headlines[headlineIndex]}
        </motion.h1>

        <motion.p
          variants={heroChild}
          className="mx-auto mt-6 max-w-4xl text-lg text-slate-600 md:text-xl leading-relaxed text-balance"
        >
          {TWIN_LOCKED_COPY.hero.subheadline}
        </motion.p>

        <VideoPlayer />

        <motion.div variants={heroChild} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <CTAButton>{TWIN_LOCKED_COPY.hero.primaryCta}</CTAButton>
        </motion.div>

        <motion.p variants={heroChild} className="mt-5 text-base font-semibold text-slate-950">
          {t("fastHero.guarantee")}
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
