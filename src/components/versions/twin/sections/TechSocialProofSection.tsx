"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const TECH_BRANDS = [
  { name: "OpenAI", logo: "/images/brand-assets/tech-logos/openai-white.png" },
  { name: "Microsoft", logo: "/images/brand-assets/tech-logos/microsoft-white.png" },
  { name: "Google Cloud", logo: "/images/brand-assets/tech-logos/google-cloud-white.png" },
  { name: "Anthropic", logo: "/images/brand-assets/tech-logos/anthropic-white.png" },
  { name: "Zapier", logo: "/images/brand-assets/tech-logos/zapier-white.png" },
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
          className="mt-6 rounded-2xl border border-white/25 bg-white/5 px-3 py-3 backdrop-blur-sm md:px-6 md:py-4"
        >
          <div className="flex flex-wrap justify-center gap-2.5 md:gap-3 lg:grid lg:grid-cols-5 lg:gap-x-5 lg:gap-y-4">
            {TECH_BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="flex min-w-[8.5rem] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.12)] lg:min-w-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none"
                aria-label={brand.name}
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={24}
                  height={24}
                  className="h-5 w-5 object-contain md:h-6 md:w-6"
                />
                <span className="text-[13px] font-semibold text-white md:text-sm lg:text-base">{brand.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
