"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/versions/twin/ui/Section";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";

export function BridgeSection() {
  const { t, tObjects } = useLanguage();
  const bullets = tObjects<string>("fastBridge.bullets");

  return (
    <Section className="bg-white twin-dot-grid-bg py-10 md:py-14" id="why-now" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-2xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeInUp}
          className="text-2xl font-bold text-slate-950 md:text-3xl"
        >
          {t("fastBridge.headline")}
        </motion.h2>

        <motion.ul variants={fadeInUp} className="mt-6 space-y-3 text-left inline-block">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-600 text-base md:text-lg">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-green flex-shrink-0" />
              {bullet}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </Section>
  );
}
