"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/versions/sprint/ui/Section";
import Image from "next/image";
import { fadeInUp, staggerContainer, scaleIn, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";

export function ProblemSection() {
  const { t, tArr } = useLanguage();
  const painPoints = tArr("problem.painPoints");

  return (
    <Section className="bg-brand-navy problem-glow-bg" id="problem" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div className="grid gap-12 md:grid-cols-2 md:items-start">

          {/* ── Left: headline + pain points ── */}
          <div>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl">
              {t("problem.headline")}
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-300 leading-relaxed">
              {t("problem.p1")}
            </motion.p>
            <motion.p variants={fadeInUp} className="mt-2 text-lg font-semibold text-white">
              {t("problem.callout")}
            </motion.p>

            <motion.ul variants={staggerContainer} className="mt-8 space-y-4">
              {painPoints.map((item, i) => (
                <motion.li key={i} variants={fadeInUp} className="flex items-start gap-3">
                  <motion.span
                    variants={scaleIn}
                    className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-red"
                  />
                  <span className="text-slate-300">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ── Right: image + closing copy ── */}
          <div className="flex flex-col gap-6">
            <motion.div variants={fadeInUp} className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.12)]">
              <Image
                src="/images/section-header-heros/4C-Audit-1a.jpg"
                alt="Chaotic workflows transformed into a calm, AI-powered business"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </motion.div>

            <motion.p variants={fadeInUp} className="text-lg text-slate-300 leading-relaxed">
              {t("problem.result_pre")}{" "}
              <span className="font-semibold text-white">{t("problem.result_highlight")}</span>
              {t("problem.result_post")}
            </motion.p>
            <motion.p variants={fadeInUp} className="text-lg font-semibold text-brand-orange">
              {t("problem.worst")}
            </motion.p>
            <motion.p variants={fadeInUp} className="text-xl font-bold text-white">
              {t("problem.reveal")}
            </motion.p>
          </div>

        </div>
      </motion.div>
    </Section>
  );
}
