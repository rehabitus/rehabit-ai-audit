"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/versions/twin/ui/CTAButton";
import { NavTrustBar } from "@/components/versions/twin/ui/NavTrustBar";
import { heroStagger, heroChild } from "@/lib/animations";
import { VideoPlayer } from "@/components/versions/twin/ui/VideoPlayer";
import { useLanguage } from "@/context/LanguageContext";
import type { PricingInfo } from "@/lib/pricing";

export function FastHeroSection() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d: PricingInfo) => setPricing(d))
      .catch(() => { });
  }, []);

  return (
    <section id="hero" className="twin-hero-gradient bg-white px-6 pt-28 pb-10 md:pt-32 md:pb-14">
      <motion.div
        className="relative z-10 mx-auto max-w-6xl text-center"
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
          className="mx-auto max-w-6xl text-4xl font-extrabold leading-[0.95] text-slate-950 md:text-[54px] lg:text-[62px] text-balance"
        >
          We Built an AI Clone of You. It Found $20,000 You Were Leaving on{" "}
          {"the\u00A0Table."}
        </motion.h1>

        <motion.p
          variants={heroChild}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl leading-relaxed text-balance"
        >
          {t("fastHero.subheadline")}
        </motion.p>

        <VideoPlayer />

        <motion.div variants={heroChild} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <CTAButton>{t("fastHero.cta")}</CTAButton>
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
