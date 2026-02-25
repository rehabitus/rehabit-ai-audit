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
      .catch(() => {});
  }, []);

  return (
    <section id="hero" className="hero-gradient bg-brand-dark px-6 pt-32 pb-20 md:pt-40 md:pb-28">
      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        variants={heroStagger}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={heroChild}
          className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-orange"
        >
          For Coaches, Course Creators &amp; Platform Operators
        </motion.p>

        <motion.h1
          variants={heroChild}
          className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl text-balance"
        >
          Find Exactly Where Your Business Is Bleeding Money&nbsp;&mdash; And Get a Plan to Fix It in 5&nbsp;Days.
        </motion.h1>

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
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-base font-semibold text-slate-200 transition-all hover:border-brand-green/40 hover:text-white hover:bg-white/5"
          >
            Book a Free 15-Min Call
          </a>
        </motion.div>

        <motion.p variants={heroChild} className="mt-5 text-base text-slate-300">
          Starting at <span className="font-semibold text-white">$500</span> &mdash; price rises with every verified client review.{" "}
          Pay in full and get your first Core AI System delivered FREE in the same 5-day window.
        </motion.p>

        {/* Trust bar — hero size, centered, live review count */}
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
