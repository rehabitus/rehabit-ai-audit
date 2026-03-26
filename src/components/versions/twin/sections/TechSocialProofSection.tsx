"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const TECH_BRANDS = [
  { name: "OpenAI", logo: "/images/brand-assets/tech-logos/openai-wordmark-white.png" },
  { name: "Microsoft", logo: "/images/brand-assets/tech-logos/microsoft-wordmark-white.png" },
  { name: "Google Cloud", logo: "/images/brand-assets/tech-logos/google-cloud-wordmark-white.png" },
  { name: "Anthropic", logo: "/images/brand-assets/tech-logos/anthropic-wordmark-white.png" },
  { name: "Zapier", logo: "/images/brand-assets/tech-logos/zapier-wordmark-white.png" },
] as const;

export function TechSocialProofSection() {
  return (
    <section
      id="tech-proof"
      className="px-6 py-10 md:py-12 bg-[linear-gradient(120deg,#001a40_0%,#006b5b_55%,#26fedc_140%)]"
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
          className="text-center text-xl font-bold leading-tight text-white md:text-2xl text-balance"
        >
          Our tech is powered by the giants of industry
        </motion.h3>

        <motion.div
          variants={fadeInUp}
          className="mt-6 rounded-2xl border border-white/25 bg-white/5 px-4 py-4 backdrop-blur-sm md:px-6"
        >
          <div className="grid grid-cols-1 items-center gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
            {TECH_BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center"
                aria-label={brand.name}
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={220}
                  height={52}
                  className="h-10 w-auto object-contain md:h-11"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
