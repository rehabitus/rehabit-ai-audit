"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/versions/sprint/ui/Section";
import { fadeInUp, slideInLeft, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";

export function BridgeSection() {
  const { t } = useLanguage();

  return (
    <Section className="bg-brand-dark dot-grid-bg" id="why-now" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="mb-10 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-brand-green/10">
          <Image
            src="/images/RHB-AI-Audit.jpg"
            alt="AI Audit Visualization"
            width={1200}
            height={600}
            className="w-full object-cover"
            priority
          />
        </motion.div>
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl">
          {t("bridge.headline")}
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-300 leading-relaxed">
          {t("bridge.p1_pre")} <span className="font-semibold text-white">{t("bridge.p1_50k")}</span>,{" "}
          {t("bridge.p1_mid")} <span className="font-semibold text-white">{t("bridge.p1_6mo")}</span>{" "}
          {t("bridge.p1_post")}{" "}
          <span className="font-semibold text-white">{t("bridge.p1_stat")}</span>{" "}
          {t("bridge.p1_end")}
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-300 leading-relaxed">
          {t("bridge.p2_pre")}{" "}
          <span className="font-semibold text-white">{t("bridge.p2_highlight")}</span>
          {t("bridge.p2_end")}
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-4 text-lg font-semibold text-white">
          {t("bridge.p3")}
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-2 text-lg text-brand-green font-bold">
          {t("bridge.tagline")}
        </motion.p>

        <motion.p variants={fadeInUp} className="mt-6 text-lg text-slate-300 leading-relaxed">
          {t("bridge.p4")}
        </motion.p>

        <motion.blockquote
          variants={slideInLeft}
          className="mt-10 rounded-lg border-l-4 border-brand-green bg-white/5 px-6 py-5"
        >
          <p className="text-lg italic text-slate-200">
            &ldquo;{t("bridge.quote")}&rdquo;
          </p>
        </motion.blockquote>
      </motion.div>
    </Section>
  );
}
