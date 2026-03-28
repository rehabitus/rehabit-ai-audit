"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/versions/twin/ui/Section";

import { fadeInUp, staggerContainer, scaleIn, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";

export function ProblemSection() {
  const { t, tArr } = useLanguage();


  return (
    <Section className="bg-slate-50 twin-problem-glow-bg" id="problem" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div className="grid gap-12 md:grid-cols-2 md:items-start">

          {/* ── Left: headline + bullets ── */}
          <div className="flex flex-col justify-center h-full">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-slate-950 md:text-5xl leading-tight">
              {t("fastProblem.headline")}
            </motion.h2>

            <motion.ul variants={staggerContainer} className="mt-8 space-y-6">
              {tArr("fastProblem.bullets").map((item: string, i: number) => (
                <motion.li key={i} variants={fadeInUp} className="flex items-center gap-4 group">
                  <motion.div
                    variants={scaleIn}
                    className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-brand-red/20 border border-brand-red/30 group-hover:bg-brand-red/30 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-brand-red shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  </motion.div>
                  <span className="text-xl text-slate-600 font-medium">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ── Right: Result Card / Testimonial ── */}
          <div className="flex items-center justify-center">
            <motion.div 
              variants={fadeInUp} 
              className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.09)] backdrop-blur-sm"
            >
              {/* Result Badge */}
              <div className="absolute -top-4 -right-4 bg-brand-green text-brand-dark px-4 py-1.5 rounded-full text-sm font-bold shadow-lg transform rotate-3">
                {t("fastProblem.testimonial.result")}
              </div>

              {/* Quote Icon */}
              <div className="text-brand-green/30 mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M11.1111 26.6667H14.4444L17.7778 20V10H7.77778V20H11.1111V26.6667ZM24.4444 26.6667H27.7778L31.1111 20V10H21.1111V20H24.4444V26.6667Z" />
                </svg>
              </div>

              <blockquote className="text-xl text-slate-950 font-medium leading-relaxed mb-6 italic">
                &ldquo;{t("fastProblem.testimonial.quote")}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 border-t border-slate-200 pt-6">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200/70 font-bold text-brand-green">
                  {t("fastProblem.testimonial.author")[0]}
                </div>
                <div>
                  <div className="text-slate-950 font-bold">{t("fastProblem.testimonial.author")}</div>
                  <div className="text-slate-500 text-sm">{t("fastProblem.testimonial.role")}</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </Section>
  );
}
