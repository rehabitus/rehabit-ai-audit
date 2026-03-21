"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/versions/fast/ui/Section";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";

export function BridgeSection() {
  const { t, tObjects } = useLanguage();

  return (
    <Section className="bg-brand-dark dot-grid-bg py-16" id="why-now" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div className="text-center mb-12">
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-5xl">
            {t("fastBridge.headline")}
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-xl text-slate-300 max-w-3xl mx-auto text-balance">
            {t("fastBridge.subhead")}
          </motion.p>
        </div>

        <motion.div variants={staggerContainer} className="grid gap-6 md:grid-cols-3">
          {tObjects<{ title: string; points: string[] }>("fastBridge.cards").map((card, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-green/30 transition-colors group"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green text-sm font-mono border border-brand-green/20">
                  {i + 1}
                </span>
                {card.title}
              </h3>
              <ul className="space-y-4">
                {card.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-3 text-slate-400 leading-snug">
                    <svg
                      className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-brand-green/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm md:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}
