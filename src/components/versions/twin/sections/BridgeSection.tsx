"use client";

import { motion } from "framer-motion";
import { TWIN_LOCKED_COPY } from "@/components/versions/twin/constants";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

export function BridgeSection() {
  return (
    <section
      id="why-now"
      className="bg-white twin-dot-grid-bg px-6 py-10 md:px-10 md:py-14 lg:px-16"
    >
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeInUp}
          className="mx-auto max-w-5xl text-2xl font-bold leading-tight text-slate-900 md:text-3xl text-balance"
        >
          {TWIN_LOCKED_COPY.bridge.title}
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-8 max-w-4xl text-xl leading-relaxed text-slate-800 md:text-2xl text-balance"
        >
          {TWIN_LOCKED_COPY.bridge.line1}
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-8 max-w-5xl text-xl leading-relaxed text-slate-800 md:text-2xl text-balance"
        >
          {TWIN_LOCKED_COPY.bridge.line2Prefix}
          <strong>{TWIN_LOCKED_COPY.bridge.line2Bold}</strong>
          {TWIN_LOCKED_COPY.bridge.line2Middle}
          <em>{TWIN_LOCKED_COPY.bridge.line2Italic}</em>
          {TWIN_LOCKED_COPY.bridge.line2Suffix}
        </motion.p>
      </motion.div>
    </section>
  );
}
