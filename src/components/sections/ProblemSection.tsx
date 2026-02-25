"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeInUp, staggerContainer, scaleIn, viewportOnce } from "@/lib/animations";
import { painPoints } from "@/lib/constants";

export function ProblemSection() {
  return (
    <Section className="bg-brand-navy problem-glow-bg" id="problem" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          {/* ── Left: text ── */}
          <div>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl">
              You already know something is&nbsp;off.
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-300 leading-relaxed">
              You&rsquo;ve built a real business. Clients. Revenue. A team (even if it&rsquo;s small).
              Programs that get results.
            </motion.p>
            <motion.p variants={fadeInUp} className="mt-2 text-lg font-semibold text-white">
              But behind the scenes?
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

            <motion.p variants={fadeInUp} className="mt-10 text-lg text-slate-300 leading-relaxed">
              The result? You&rsquo;re{" "}
              <span className="font-semibold text-white">working harder than ever</span>,
              growing slower than you should, and watching competitors who figured out automation pull ahead.
            </motion.p>
            <motion.p variants={fadeInUp} className="mt-4 text-lg font-semibold text-brand-orange">
              The worst part: You don&rsquo;t know what you don&rsquo;t know. You can&rsquo;t fix what
              you can&rsquo;t see.
            </motion.p>
            <motion.p variants={fadeInUp} className="mt-4 text-xl font-bold text-white">
              That&rsquo;s exactly what this audit reveals.
            </motion.p>
          </div>

          {/* ── Right: visual ── */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center md:justify-end"
          >
            <img
              src="/images/4caudit-1.jpg"
              alt="Tangled workflows transformed into a clean, healthy signal"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_0_60px_rgba(16,185,129,0.12)]"
            />
          </motion.div>

        </div>
      </motion.div>
    </Section>
  );
}
