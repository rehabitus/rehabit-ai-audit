"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { CTAButton } from "@/components/ui/CTAButton";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerContainerFast,
  viewportOnce,
} from "@/lib/animations";
import { pricingIncludes, payInFullBonus } from "@/lib/constants";

export function PricingSection() {
  return (
    <Section className="bg-brand-navy noise-vignette-bg" id="pricing" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl">
          AI Transformation Audit
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-1 text-lg text-slate-400">
          Complete Package
        </motion.p>

        <motion.ul
          variants={staggerContainerFast}
          className="mt-8 space-y-3 text-left text-slate-300"
        >
          {pricingIncludes.map((item, i) => (
            <motion.li key={i} variants={fadeInUp} className="flex items-start gap-2">
              <motion.span variants={scaleIn} className="mt-1 text-brand-green">
                &#10003;
              </motion.span>
              <span>{item}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Price */}
        <motion.div variants={fadeInUp} className="mt-10">
          <p className="text-6xl font-extrabold text-white">
            $<AnimatedCounter to={1200} duration={1.5} />
          </p>
          <motion.p
            variants={fadeInUp}
            className="mt-2 text-sm text-slate-400"
          >
            Only <span className="font-semibold text-brand-orange">3 audits left</span> at this
            price. Price increases by $100 every 10 audits.
          </motion.p>
          <motion.p
            variants={fadeInUp}
            className="mt-1 text-xs text-slate-500"
          >
            Final value: $5,000&ndash;$10,000 &mdash; still below the{" "}
            <span className="text-slate-400">industry standard of $5K&ndash;$15K</span> for an AI
            readiness assessment.
          </motion.p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-8">
          <CTAButton>&rarr; Reserve Your Audit Slot</CTAButton>
        </motion.div>
      </motion.div>

      {/* Pay in Full Bonus */}
      <motion.div
        className="relative z-10 mx-auto mt-10 max-w-xl rounded-xl border-2 border-brand-gold/40 bg-brand-gold/5 p-8"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
            Pay-in-Full Bonus
          </span>
        </div>
        <h3 className="mt-3 text-xl font-bold text-white">
          Your First Core AI System &mdash; Delivered FREE
        </h3>
        <p className="mt-3 text-slate-300 leading-relaxed">
          {payInFullBonus}
        </p>
        <p className="mt-3 text-sm font-semibold text-brand-gold">
          Same 5-day window. Audit + a live, working system. Zero extra cost.
        </p>
      </motion.div>

      {/* Guarantee */}
      <motion.div
        className="relative z-10 mx-auto mt-8 max-w-xl rounded-xl border border-brand-green/30 bg-brand-green/5 p-8"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <h3 className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="text-brand-green text-2xl">&#9432;</span>
          The &ldquo;It Has to Sound Like You&rdquo; Guarantee
        </h3>
        <p className="mt-4 text-slate-300 leading-relaxed">
          If your Digital Twin doesn&rsquo;t produce content that genuinely sounds like
          you&nbsp;&mdash; capturing your voice, your methodology, and your
          expertise&nbsp;&mdash; we&rsquo;ll rebuild it until it does. Or we&rsquo;ll refund your
          investment completely.
        </p>
        <p className="mt-4 text-slate-300 leading-relaxed">
          And if the audit doesn&rsquo;t reveal at least{" "}
          <span className="font-semibold text-white">$20,000 in annual savings opportunities</span>?
          Same deal. Full refund. No questions.
        </p>
        <p className="mt-4 text-sm font-semibold text-brand-green">
          We&rsquo;re that confident in what we&rsquo;ll find&nbsp;&mdash; because we&rsquo;ve
          never done an audit that didn&rsquo;t find it.
        </p>
      </motion.div>
    </Section>
  );
}
