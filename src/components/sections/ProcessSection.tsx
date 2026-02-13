"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { timelineSteps } from "@/lib/constants";
import { WebGLBackground } from "@/components/backgrounds/WebGLBackground";

export function ProcessSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.8", "end 0.4"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.3], [0.1, 0.4]);

  return (
    <Section className="relative overflow-hidden bg-brand-navy" id="process" noAnimate>
      <WebGLBackground scene="particles" />
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
          Simple. Fast. No disruption to your business.
        </motion.h2>

        <div className="relative mt-14" ref={timelineRef}>
          {/* Timeline line (desktop) — scroll-driven draw */}
          <div className="absolute left-[23px] top-0 hidden h-full w-px bg-white/5 md:block" />
          <motion.div
            className="absolute left-[23px] top-0 hidden h-full w-px origin-top bg-brand-green/30 md:block"
            style={{ scaleY: lineScaleY, opacity: lineOpacity }}
          />

          <motion.div className="space-y-10" variants={staggerContainer}>
            {timelineSteps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex items-start gap-6"
              >
                {/* Dot */}
                <motion.div
                  className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-sm font-bold text-brand-green ring-2 ring-brand-green/30"
                  initial={{ opacity: 0.3, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: i * 0.1,
                  }}
                >
                  {i + 1}
                </motion.div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
                    {step.day}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={fadeInUp}
          className="mt-12 rounded-lg bg-brand-green/10 px-6 py-4 text-center"
        >
          <p className="text-lg font-semibold text-brand-green">
            Total time investment from you: About 1 hour. We do the rest.
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}
