"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const TECH_BRANDS = [
  { name: "Anthropic", mark: "A" },
  { name: "OpenAI", mark: "O" },
  { name: "Gemini", mark: "G" },
  { name: "Zapier", mark: "Z" },
  { name: "Google", mark: "G" },
] as const;

export function TechSocialProofSection() {
  return (
    <section
      id="tech-proof"
      className="bg-[radial-gradient(circle_at_20%_20%,#1d3d35_0%,#0f172a_55%,#0b1220_100%)] px-6 py-12 md:py-16"
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h3
          variants={fadeInUp}
          className="text-center text-2xl font-bold leading-tight text-white md:text-3xl text-balance"
        >
          Our tech is powered by the giants of industry
        </motion.h3>

        <motion.div
          variants={fadeInUp}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
        >
          {TECH_BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-3 backdrop-blur-sm"
              aria-label={brand.name}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/80 text-sm font-bold text-white">
                {brand.mark}
              </span>
              <span className="text-sm font-semibold tracking-wide text-white md:text-base">
                {brand.name}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
