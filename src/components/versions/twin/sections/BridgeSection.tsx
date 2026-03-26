"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/versions/twin/ui/Section";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

export function BridgeSection() {
  return (
    <Section className="bg-white twin-dot-grid-bg py-10 md:py-14" id="why-now" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-5xl text-left"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeInUp}
          className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl text-balance"
        >
          💡 Your Digital Twin Is Powerful Alone. With the Full Audit, It Becomes
          Unstoppable.
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="mt-10 text-3xl leading-relaxed text-slate-800 md:text-5xl text-balance"
        >
          The free Twin proves AI can replicate your genius.
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="mt-10 text-3xl leading-relaxed text-slate-800 md:text-5xl text-balance"
        >
          The <strong>AI Transformation Audit &amp; Implementation Report</strong>{" "}
          shows you <em>exactly</em> where to deploy it to stop the bleeding —
          and start compounding growth.
        </motion.p>
      </motion.div>
    </Section>
  );
}
