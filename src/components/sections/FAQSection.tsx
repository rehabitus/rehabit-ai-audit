"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { FAQItem } from "@/components/ui/FAQItem";
import { fadeInUp, staggerContainerFast, viewportOnce } from "@/lib/animations";
import { faqs } from "@/lib/constants";

export function FAQSection() {
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
          Frequently Asked Questions
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
