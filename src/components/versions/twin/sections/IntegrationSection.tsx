"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { TWIN_LOCKED_COPY } from "@/components/versions/twin/constants";

const STACK_LOGOS = [
  { name: "OpenAI", src: "/images/brand-assets/tech-logos/openai-white.png" },
  { name: "Google Cloud", src: "/images/brand-assets/tech-logos/google-cloud-white.png" },
  { name: "Zapier", src: "/images/brand-assets/tech-logos/zapier-white.png" },
  { name: "Anthropic", src: "/images/brand-assets/tech-logos/anthropic-white.png" },
  { name: "Microsoft", src: "/images/brand-assets/tech-logos/microsoft-white.png" },
  { name: "CRM", text: "CRM" },
  { name: "Email", text: "Email" },
  { name: "CMS", text: "CMS" },
  { name: "Webhook", text: "Webhook" },
] as const;

export function IntegrationSection() {
  const section = TWIN_LOCKED_COPY.integrationSection;

  return (
    <section id={section.id} className="bg-white px-6 py-16 md:py-20">
      <motion.div
        className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.24),rgba(15,23,42,0.85))]" />
          <div className="relative rounded-[2rem] border border-slate-200/60 bg-slate-900 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
            <div className="grid grid-cols-3 gap-3">
              {STACK_LOGOS.map((logo) => (
                <div
                  key={logo.name}
                  className="flex h-16 items-center justify-center rounded-xl border border-slate-200/15 bg-white/10 text-xs font-semibold text-white"
                >
                  {"src" in logo ? (
                    <Image
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                  ) : (
                    logo.text
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h3 className="text-3xl font-bold leading-tight text-slate-950 md:text-4xl text-balance">
            {section.title}
          </h3>
          <p className="mt-4 text-xl leading-relaxed text-slate-600 text-balance">
            {section.sub}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {section.features.map((item) => (
              <div key={item.title}>
                <h4 className="text-2xl font-bold text-brand-green text-balance">{item.title}</h4>
                <p className="mt-2 text-lg leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
