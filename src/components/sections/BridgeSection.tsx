"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeInUp, slideInLeft, staggerContainer, viewportOnce } from "@/lib/animations";

export function BridgeSection() {
  return (
    <Section className="bg-brand-dark dot-grid-bg" id="why-now" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="mb-10 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-brand-green/10">
          <Image
            src="/images/audit-viz.jpg"
            alt="AI Audit Visualization"
            width={1200}
            height={600}
            className="w-full object-cover"
            priority
          />
        </motion.div>
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl">
          Here&rsquo;s what changed.
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-300 leading-relaxed">
          Two years ago, automating your workflows meant hiring a developer,
          spending <span className="font-semibold text-white">$50K+</span>, and
          waiting <span className="font-semibold text-white">6 months</span> for something that probably
          wouldn&rsquo;t work. <span className="font-semibold text-white">95% of complex AI
            projects failed</span> to deliver ROI.
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-300 leading-relaxed">
          Today? The tools exist. Zapier. Make. n8n. Voice AI agents. Custom GPTs. They&rsquo;re
          affordable, proven, and designed for <span className="font-semibold text-white">non-technical teams</span>.
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-4 text-lg font-semibold text-white">
          The problem isn&rsquo;t the tools. The problem is knowing which ones to use, where to use
          them, and in what order.
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-2 text-lg text-brand-green font-bold">
          That&rsquo;s what the audit gives you.
        </motion.p>

        <motion.p variants={fadeInUp} className="mt-6 text-lg text-slate-300 leading-relaxed">
          We don&rsquo;t sell software. We don&rsquo;t build custom code. We diagnose your business
          like a doctor&nbsp;&mdash; find where you&rsquo;re bleeding time, money, and
          clients&nbsp;&mdash; and prescribe the exact off-the-shelf tools that fix it.
        </motion.p>

        <motion.blockquote
          variants={slideInLeft}
          className="mt-10 rounded-lg border-l-4 border-brand-green bg-white/5 px-6 py-5"
        >
          <p className="text-lg italic text-slate-200">
            &ldquo;Think of it this way: you don&rsquo;t need a surgeon. You need someone who can
            read the X-ray and tell you which vitamin to take.&rdquo;
          </p>
        </motion.blockquote>
      </motion.div>
    </Section>
  );
}
