"use client";

import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/CTAButton";
import { heroStagger, heroChild } from "@/lib/animations";

export function HeroSection() {
  return (
    <section className="hero-gradient bg-brand-dark px-6 pt-32 pb-20 md:pt-40 md:pb-28">
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
          For Coaches, Course Creators &amp; Platform Operators Losing Revenue to Broken Workflows
        </motion.p>

        <motion.h1
          variants={heroChild}
          className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl text-balance"
        >
          We&rsquo;ll Audit Your Entire Business, Show You Exactly Where You&rsquo;re Bleeding Time
          and Money, and Hand You a Ready-to-Execute AI Implementation Plan&nbsp;&mdash; In 5 Days.
        </motion.h1>

        <motion.p
          variants={heroChild}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed"
        >
          No jargon. No 90-day &ldquo;discovery phase.&rdquo; No six-figure consulting invoice.
          Just a clear report with real numbers, real tools, and a real plan&nbsp;&mdash; so you stop
          guessing and start saving 20+ hours a week.
        </motion.p>

        <motion.div variants={heroChild} className="mt-10">
          <CTAButton>&rarr; Reserve Your Audit Slot</CTAButton>
        </motion.div>

        <motion.p variants={heroChild} className="mt-5 text-sm text-slate-400">
          Only <span className="font-semibold text-brand-orange">3 audits left</span> at the current
          price&nbsp;&mdash; it goes up $100 every 10 audits. Pay in full and get your first Core AI
          System delivered FREE in the same 5-day window.
        </motion.p>
      </motion.div>
    </section>
  );
}
