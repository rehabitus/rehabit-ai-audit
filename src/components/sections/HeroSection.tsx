"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/CTAButton";
import { NavTrustBar } from "@/components/ui/NavTrustBar";
import { heroStagger, heroChild } from "@/lib/animations";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import type { PricingInfo } from "@/lib/pricing";

export function HeroSection() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);

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
          For 6-7 Figure Coaches Running on Manual Workflows
        </motion.div>

        <motion.h1
          variants={heroChild}
          className="mx-auto max-w-4xl text-4xl font-extrabold leading-[0.95] text-white md:text-[58px] lg:text-[66px] uppercase"
        >
          Profitable, Scalable<br />AI Roadmap in&nbsp;5&nbsp;Days
        </motion.h1>

        <motion.p
          variants={heroChild}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed"
        >
          No more guessing, scaling chaos, or fearing being left&nbsp;behind.
        </motion.p>

        <VideoPlayer />

        <motion.p
          variants={heroChild}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed"
        >
          We audit your workflows, quantify the waste, match you with the right AI tools, and hand
          you a ready-to-execute implementation plan. No jargon. No six-figure consulting invoice.
          Just real numbers and a real roadmap.
        </motion.p>

        <motion.div variants={heroChild} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <CTAButton>&rarr; Reserve Your Audit Slot</CTAButton>
        </motion.div>

        <motion.p variants={heroChild} className="mt-5 text-base font-semibold text-white">
          Guaranteed to reveal $20K+ in savings &mdash; or your money back.
        </motion.p>
        <motion.p variants={heroChild} className="mt-1 text-sm text-slate-400">
          Starting at <span className="font-semibold text-white">${(pricing?.priceUsd ?? 1000).toLocaleString()}</span> &mdash; price rises with every verified client review.
        </motion.p>

        {/* Trust bar — hero size, centered, live review count */}
        <motion.div
          variants={heroChild}
          className="mt-8 flex justify-center"
        >
          <NavTrustBar size="md" reviewCount={pricing?.reviewCount ?? 0} />
        </motion.div>
      </motion.div>
    </section >
  );
}
