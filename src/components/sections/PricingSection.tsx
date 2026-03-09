"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
import { NavTrustBar } from "@/components/ui/NavTrustBar";
import { pricingIncludes } from "@/lib/constants";
import type { PricingInfo } from "@/lib/pricing";

const TIER_LABELS: Record<string, string> = {
  "Early Access": "You're in before anyone else. Lowest price this will ever be.",
  "Founding Member": "5 verified reviews. Proof is building. Price reflects it.",
  "Early Adopter": "10 verified reviews. The results are speaking for themselves.",
  "Standard": "15 verified reviews. Fully validated.",
  "Standard+": "20 verified reviews. Demand is real.",
  "Full Rate": "25+ verified reviews. Market rate. Fully earned.",
};

export function PricingSection() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((data: PricingInfo) => setPricing(data))
      .catch(() => {/* fail silently, fallback UI shows */ });
  }, []);

  const priceUsd = pricing?.priceUsd ?? 500;
  const label = pricing?.label ?? "Early Access";
  const reviewCount = pricing?.reviewCount ?? 0;
  const nextPrice = pricing?.nextPriceUsd ?? null;
  const slotsLeft = pricing?.slotsRemaining ?? null;
  const subtitle = TIER_LABELS[label] ?? "";

  return (
    <Section className="bg-brand-navy noise-vignette-bg" id="pricing" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        {/* Tier badge */}
        <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            {label} — Limited Window
          </span>
        </motion.div>

        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl text-balance">
          Everything You Need to Stop the Bleed&nbsp;&mdash; In 5&nbsp;Days.
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-1 text-lg text-slate-400">
          AI Transformation Audit — Complete Package
        </motion.p>

        <motion.div variants={fadeInUp} className="mt-6 overflow-hidden rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.1)] relative aspect-video">
          <Image
            src="/images/4c-audit.jpg"
            alt="The AI Opportunity Audit report"
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
          />
        </motion.div>

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

        {/* ── Live price block ── */}
        <motion.div variants={fadeInUp} className="mt-10">
          {/* Industry compare */}
          <p className="text-sm text-slate-500 mb-3">
            projected final rate{" "}
            <span className="line-through decoration-brand-red/60 decoration-2">
              $3,500
            </span>
          </p>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-3">
            <p className="text-7xl font-extrabold text-white tracking-tight">
              $<AnimatedCounter to={priceUsd} duration={1.2} />
            </p>
          </div>

          <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold/80">
            {label}
          </p>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500 italic">{subtitle}</p>
          )}

          {/* Slots remaining — scarcity callout */}
          {slotsLeft !== null && slotsLeft > 0 && (
            <motion.div
              variants={fadeInUp}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-5 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-sm font-bold text-brand-orange">
                {slotsLeft} {slotsLeft === 1 ? "slot" : "slots"} left at ${priceUsd.toLocaleString()}
              </span>
              {nextPrice && (
                <span className="text-sm text-slate-400">
                  — next price <span className="text-white font-semibold">${nextPrice.toLocaleString()}</span>
                </span>
              )}
            </motion.div>
          )}


          <motion.p variants={fadeInUp} className="mt-3 text-xs text-slate-500 italic">
            Every review is a verified client who found $20k+ in savings. That&rsquo;s what moves the price.
          </motion.p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-8">
          <CTAButton>&rarr; Reserve Your Audit Slot</CTAButton>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-6 flex justify-center">
          <NavTrustBar size="md" reviewCount={reviewCount} />
        </motion.div>
      </motion.div>

      {/* Guarantee */}
      <motion.div
        className="relative z-10 mx-auto mt-8 max-w-4xl rounded-xl border border-brand-green/30 bg-brand-green/5 p-8"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <h3 className="flex items-center gap-2 text-xl font-bold text-white">
          <svg className="h-6 w-6 flex-shrink-0 text-brand-green" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          The &ldquo;$20,000 Baseline&rdquo; Guarantee
        </h3>
        <p className="mt-4 text-slate-300 leading-relaxed text-balance">
          If the audit doesn&rsquo;t reveal at least{" "}
          <span className="font-semibold text-white">$20,000 in annual savings opportunities</span>,
          you get a full refund. No questions asked.
        </p>
        <p className="mt-4 text-sm font-semibold text-brand-green">
          We&rsquo;re that confident in what we&rsquo;ll find&nbsp;&mdash; because we&rsquo;ve
          never done an audit that didn&rsquo;t find it.
        </p>
      </motion.div>
    </Section>
  );
}
