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
import { offerCards } from "@/lib/constants";
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

      </motion.div>
    </Section>
  );
}
