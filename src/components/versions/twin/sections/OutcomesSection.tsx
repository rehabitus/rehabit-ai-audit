"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/versions/twin/ui/Section";
import { AnimatedCounter } from "@/components/versions/twin/ui/AnimatedCounter";
import {
  fadeInUp,
  staggerContainer,
  staggerContainerFast,
  viewportOnce,
} from "@/lib/animations";
import { stats } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

type BeforeAfterRow = [string, string];
type StatTranslation = { label: string };

export function OutcomesSection() {
  const { t, tObjects } = useLanguage();
  const beforeAfterRows = tObjects<BeforeAfterRow>("outcomes.beforeAfter");
  const statTranslations = tObjects<StatTranslation>("outcomes.stats");

  // Merge numeric values from constants with translated labels from JSON
  const translatedStats = stats.map((stat, i) => ({
    ...stat,
    label: statTranslations[i]?.label ?? stat.label,
  }));

  return (
    <Section className="bg-white twin-mesh-gradient-bg" id="outcomes" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl font-bold text-slate-950 md:text-4xl text-center"
        >
          {t("outcomes.headline")}
        </motion.h2>

        {/* Before / After table */}
        <motion.div variants={fadeInUp} className="mt-12 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-4 pr-6 text-sm font-semibold uppercase tracking-wider text-brand-red">
                  {t("outcomes.before_label")}
                </th>
                <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-brand-green">
                  {t("outcomes.after_label")}
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="text-slate-600"
              variants={staggerContainerFast}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {beforeAfterRows.map((row, i) => (
                <motion.tr key={i} variants={fadeInUp} className="border-b border-slate-200/70">
                  <td className="py-4 pr-6 text-slate-500 italic">{row[0]}</td>
                  <td className="py-4 font-medium text-slate-950">{row[1]}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>

        {/* Stats grid with animated counters */}
        <motion.div
          className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {translatedStats.map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center">
              <p className="text-3xl font-extrabold text-brand-green md:text-4xl">
                <AnimatedCounter
                  to={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={2}
                />
              </p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}
