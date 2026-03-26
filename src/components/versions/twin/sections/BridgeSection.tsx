"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/versions/twin/ui/Section";
import { TWIN_LOCKED_COPY } from "@/components/versions/twin/constants";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

export function BridgeSection() {
  return (
    <Section className="bg-white twin-dot-grid-bg py-10 md:py-14" id="why-now" noAnimate>
      <motion.div
        className="relative z-10 w-full px-4 text-left sm:px-6 md:px-10 lg:px-14"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeInUp}
          className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl text-balance"
        >
          {TWIN_LOCKED_COPY.bridge.title}
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="mt-8 text-xl leading-relaxed text-slate-800 md:text-2xl text-balance"
        >
          {TWIN_LOCKED_COPY.bridge.line1}
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="mt-8 text-xl leading-relaxed text-slate-800 md:text-2xl text-balance"
        >
          {TWIN_LOCKED_COPY.bridge.line2Prefix}
          <strong>{TWIN_LOCKED_COPY.bridge.line2Bold}</strong>
          {TWIN_LOCKED_COPY.bridge.line2Middle}
          <em>{TWIN_LOCKED_COPY.bridge.line2Italic}</em>
          {TWIN_LOCKED_COPY.bridge.line2Suffix}
        </motion.p>
      </motion.div>
    </Section>
  );
}
