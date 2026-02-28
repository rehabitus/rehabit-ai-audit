"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import Image from "next/image";
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
        <div className="grid gap-12 md:grid-cols-2 md:items-start">

          {/* ── Left: headline + pain points ── */}
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
          </div>

          {/* ── Right: image + closing copy ── */}
          <div className="flex flex-col gap-6">
            <motion.div variants={fadeInUp} className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.12)]">
              <Image
                src="/images/4C-Audit-1a.jpg"
                alt="Chaotic workflows transformed into a calm, AI-powered business"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </motion.div>

            <motion.p variants={fadeInUp} className="text-lg text-slate-300 leading-relaxed">
              The result? You&rsquo;re{" "}
              <span className="font-semibold text-white">working harder than ever</span>,
              growing slower than you should, and watching competitors who figured out automation pull ahead.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-lg font-semibold text-brand-orange">
              The worst part: You don&rsquo;t know what you don&rsquo;t know. You can&rsquo;t fix what
              you can&rsquo;t see.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-xl font-bold text-white">
              That&rsquo;s exactly what this audit reveals.
            </motion.p>
          </div>

        </div>
      </motion.div>
    </Section>
  );
}
