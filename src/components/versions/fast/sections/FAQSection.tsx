"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/versions/fast/ui/Section";
import { FAQItem } from "@/components/versions/fast/ui/FAQItem";
import { fadeInUp, staggerContainerFast, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";

type FAQEntry = { q: string; a: string };

export function FAQSection() {
  const { t, tObjects } = useLanguage();
  const faqs = tObjects<FAQEntry>("faq.items");

  return (
    <Section className="bg-brand-dark faq-glow-bg" id="faq" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainerFast}
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl font-bold text-white md:text-4xl text-center mb-12"
        >
          {t("faq.headline")}
        </motion.h2>
        <div className="mx-auto max-w-2xl">
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <FAQItem q={faq.q} a={faq.a} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
