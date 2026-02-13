"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { CTAButton } from "@/components/ui/CTAButton";
import { fadeInUp, slideInLeft, slideInRight, staggerContainer, viewportOnce } from "@/lib/animations";
import { WebGLBackground } from "@/components/backgrounds/WebGLBackground";

export function FinalCTASection() {
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
          {/* Option A */}
          <motion.div
            variants={slideInLeft}
            className="rounded-xl border border-white/10 bg-white/5 p-8 text-left opacity-90"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-brand-red">Option A</p>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Keep doing things the way you&rsquo;re doing them. Keep copying data by hand. Keep
              losing clients between sessions. Keep hearing about AI and wondering if it applies to
              you. Keep guessing.
            </p>
          </motion.div>

          {/* Option B */}
          <motion.div
            variants={slideInRight}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-xl border-2 border-brand-green/40 bg-brand-green/5 p-8 text-left"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-brand-green">Option B</p>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Invest $1,200 and 1 hour of your time. In 5 days, know exactly where you&rsquo;re
              losing money, exactly how to fix it, and exactly what it&rsquo;ll save you. Walk away
              with a professional report, a clear roadmap, a working Digital Twin&nbsp;&mdash; and if
              you pay in full, your first Core AI System built and live at no extra cost.
            </p>
          </motion.div>
        </div>

        <motion.div variants={fadeInUp} className="mt-10">
          <p className="text-lg text-slate-300">
            The math is simple: if the audit reveals even{" "}
            <span className="font-semibold text-white">$20,000 in annual savings</span> (and it
            will), that&rsquo;s a{" "}
            <span className="font-bold text-brand-green">16x return</span> on a $1,200 investment.
          </p>
          <p className="mt-2 text-lg text-slate-400">
            If it doesn&rsquo;t? You get your money back.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-10">
          <div className="hidden md:inline-block animate-breathe">
            <CTAButton>
              &rarr; Reserve Your Audit Slot &mdash; Only 3 Left at $1,200
            </CTAButton>
          </div>
          {/* Mobile: no breathing animation */}
          <div className="md:hidden">
            <CTAButton>
              &rarr; Reserve Your Audit Slot &mdash; Only 3 Left at $1,200
            </CTAButton>
          </div>
        </motion.div>

        <motion.p variants={fadeInUp} className="mt-4 text-xs text-slate-500">
          Price increases by $100 every 10 audits. Current: $1,200. Final value: $5,000&ndash;$10,000.
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-4 text-sm text-slate-400">
          Questions? Book a 15-minute call or reply to this page.
        </motion.p>
      </motion.div>
    </Section>
  );
}
