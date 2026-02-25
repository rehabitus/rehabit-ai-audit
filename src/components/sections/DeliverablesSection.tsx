"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const deliverables = [
    {
        title: "Quantified Waste Analysis",
        description: "We reveal exactly how many hours and dollars your team is losing to manual busywork, duplicate data entry, and broken workflows.",
        accent: "#10B981",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="h-16 w-16">
                <rect x="6" y="38" width="10" height="20" rx="3" fill="#10B981" opacity="0.9"/>
                <rect x="22" y="26" width="10" height="32" rx="3" fill="#10B981" opacity="0.7"/>
                <rect x="38" y="14" width="10" height="44" rx="3" fill="#10B981" opacity="0.5"/>
                <path d="M8 36 L24 24 L40 12 L56 6" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3"/>
                <circle cx="56" cy="6" r="4" fill="#EF4444"/>
                <path d="M4 58 H60" stroke="#334155" strokeWidth="1.5"/>
            </svg>
        ),
    },
    {
        title: "Precision Tool Selection",
        description: "No more guessing. We match your specific pain points to the exact AI tools and automations that will solve them for good.",
        accent: "#6366F1",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="h-16 w-16">
                <circle cx="32" cy="32" r="22" stroke="#6366F1" strokeWidth="2" opacity="0.3"/>
                <circle cx="32" cy="32" r="14" stroke="#6366F1" strokeWidth="2" opacity="0.6"/>
                <circle cx="32" cy="32" r="6" fill="#6366F1"/>
                <path d="M32 10 V4M32 60 V54M10 32 H4M60 32 H54" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                <path d="M18 18 L14 14M50 50 L46 46M46 18 L50 14M18 46 L14 50" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
            </svg>
        ),
    },
    {
        title: "Implementation Roadmap",
        description: "A step-by-step 90-day execution plan. We don't just tell you what to fix; we show you exactly how to Fix it, phase by phase.",
        accent: "#F97316",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="h-16 w-16">
                <circle cx="12" cy="52" r="5" fill="#F97316"/>
                <circle cx="32" cy="32" r="5" fill="#F97316" opacity="0.8"/>
                <circle cx="52" cy="12" r="5" fill="#F97316" opacity="0.6"/>
                <path d="M12 47 C12 38 22 38 32 32 C42 26 52 18 52 17" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                <rect x="7" y="47" width="10" height="10" rx="2" stroke="#F97316" strokeWidth="1.5" fill="none"/>
                <rect x="27" y="27" width="10" height="10" rx="2" stroke="#F97316" strokeWidth="1.5" fill="none"/>
                <rect x="47" y="7" width="10" height="10" rx="2" stroke="#F97316" strokeWidth="1.5" fill="none"/>
            </svg>
        ),
    },
];

export function DeliverablesSection() {
    return (
        <Section className="bg-brand-dark" id="deliverables">
            <motion.div
                className="relative z-10 mx-auto max-w-6xl"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp} className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        What You&rsquo;re Actually Getting
                    </h2>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        This isn&rsquo;t a vague PDF. It&rsquo;s a comprehensive ROI-driven transformation strategy designed to be executed immediately.
                    </p>
                </motion.div>

                {/* Full-width report mockup */}
                <motion.div variants={fadeInUp} className="mb-16 w-full overflow-hidden rounded-2xl shadow-[0_0_80px_rgba(16,185,129,0.1)]">
                    <img
                        src="/images/4C-Audit-2a.jpg"
                        alt="The AI Opportunity Audit — your deliverable"
                        className="w-full object-cover"
                    />
                </motion.div>

                <div className="grid gap-8 md:grid-cols-3">
                    {deliverables.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-white/10"
                        >
                            <div className="mb-6 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-brand-dark/50 transition-transform group-hover:scale-105 duration-500">
                                {item.svg}
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </Section>
    );
}
