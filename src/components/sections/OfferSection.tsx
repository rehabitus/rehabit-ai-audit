"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import {
  fadeInUp,
  staggerContainer,
  staggerContainerSlow,
  cardHover,
  viewportOnce,
} from "@/lib/animations";
import { offerCards, digitalTwinBenefits } from "@/lib/constants";
import { WebGLBackground } from "@/components/backgrounds/WebGLBackground";

export function OfferSection() {
  return (
    <Section className="relative overflow-hidden bg-brand-navy" id="offer" noAnimate>
      <WebGLBackground scene="network" />
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            The AI Transformation Audit &amp; Implementation Report
          </h2>
          <p className="mt-2 text-lg text-slate-400">Everything delivered in 5 business days.</p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-8 md:grid-cols-2"
        >
          {offerCards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={cardHover}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition-shadow hover:border-brand-green/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]"
            >
              <motion.span
                className={`font-mono text-sm font-bold ${card.color}`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                {card.icon}
              </motion.span>
              <h3 className="mt-2 text-xl font-bold text-white">{card.title}</h3>
              <p className="mt-3 text-slate-300 leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* BONUS card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-8 rounded-xl border-2 border-brand-green/40 bg-brand-green/5 p-8 animate-glow-pulse"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-green">
              Bonus
            </span>
            <h3 className="text-xl font-bold text-white">
              Your First Digital Twin — Activated
            </h3>
          </div>
          <p className="mt-4 text-slate-300 leading-relaxed">
            As part of your audit, we activate your AI Digital Twin — a conversational AI trained on
            your methodology, your voice, and your content.
          </p>
          <ul className="mt-4 space-y-2">
            {digitalTwinBenefits.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 text-brand-green">&#10003;</span>
                <span className="text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-brand-green">
            This alone is worth the investment. It&rsquo;s our proof that AI isn&rsquo;t theoretical
            for your business&nbsp;&mdash; it&rsquo;s working, right now, in your voice.
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}
