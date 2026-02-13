"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "@/lib/animations";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Disable the whileInView entrance animation (e.g. for hero) */
  noAnimate?: boolean;
}

export function Section({ children, className = "", id, noAnimate }: SectionProps) {
  if (noAnimate) {
    return (
      <section id={id} className={`px-6 py-20 md:py-28 ${className}`}>
        <div className="mx-auto max-w-4xl">{children}</div>
      </section>
    );
  }

  return (
    <section id={id} className={`px-6 py-20 md:py-28 ${className}`}>
      <motion.div
        className="mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        {children}
      </motion.div>
    </section>
  );
}
