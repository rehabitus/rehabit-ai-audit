"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/versions/fast/ui/Section";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { WebGLBackground } from "@/components/backgrounds/WebGLBackground";
import { useLanguage } from "@/context/LanguageContext";

type OfferCard = { title: string; body: string };

export function OfferSection() {
  const { t, tObjects } = useLanguage();
  const cards = tObjects<OfferCard>("fastOffer.cards");

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
        <motion.h2
          variants={fadeInUp}
          className="text-3xl font-bold text-white md:text-4xl text-center"
        >
          {t("fastOffer.headline")}
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-brand-green/30 transition-colors"
            >
              <h3 className="text-lg font-bold text-white">{card.title}</h3>
              <p className="mt-3 text-slate-400 leading-relaxed text-sm">{card.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}
