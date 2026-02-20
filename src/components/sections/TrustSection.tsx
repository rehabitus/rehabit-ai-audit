"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeInUp, staggerContainer, scaleIn, viewportOnce } from "@/lib/animations";
import { credentials } from "@/lib/constants";

export function TrustSection() {
  return (
    <Section className="bg-brand-dark trust-glow-bg" id="trust" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl">
          Built by someone who&rsquo;s done this before.
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Mike Olaski</span>&nbsp;&mdash;
          founder of Rehabit and the 4C AI Coaching OS. Not a consultant who read a book about AI.
          Someone who builds and deploys these systems every day.
        </motion.p>
        <motion.ul variants={staggerContainer} className="mt-8 space-y-4">
          {credentials.map((item, i) => (
            <motion.li key={i} variants={fadeInUp} className="flex items-start gap-3">
              <motion.span
                variants={scaleIn}
                className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-green"
              />
              <span className="text-slate-300">{item}</span>
            </motion.li>
          ))}
        </motion.ul>
        <motion.p variants={fadeInUp} className="mt-8 text-lg text-slate-300 leading-relaxed">
          We&rsquo;ve seen what works, what fails, and what wastes money. Our job is to make sure
          you only invest in what works.
        </motion.p>
      </motion.div>
    </Section>
  );
}
