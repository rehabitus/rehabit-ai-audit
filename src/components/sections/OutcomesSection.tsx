"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  fadeInUp,
  staggerContainer,
  staggerContainerFast,
  viewportOnce,
} from "@/lib/animations";
import { beforeAfter, stats } from "@/lib/constants";

export function OutcomesSection() {
  return (
    <Section className="bg-brand-dark mesh-gradient-bg" id="outcomes" noAnimate>
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
          After your audit, you&rsquo;ll have:
        </motion.h2>

        {/* Before / After table */}
        <motion.div variants={fadeInUp} className="mt-12 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-4 pr-6 text-sm font-semibold uppercase tracking-wider text-brand-red">
                  Before
                </th>
                <th className="pb-4 text-sm font-semibold uppercase tracking-wider text-brand-green">
                  After
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="text-slate-300"
              variants={staggerContainerFast}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {beforeAfter.map(([before, after], i) => (
                <motion.tr key={i} variants={fadeInUp} className="border-b border-white/5">
                  <td className="py-4 pr-6 text-slate-400 italic">{before}</td>
                  <td className="py-4 font-medium text-white">{after}</td>
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
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center">
              <p className="text-3xl font-extrabold text-brand-green md:text-4xl">
                <AnimatedCounter
                  to={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={2}
                />
              </p>
              <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}
