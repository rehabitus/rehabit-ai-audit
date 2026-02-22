"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const deliverables = [
    {
        title: "Quantified Waste Analysis",
        description: "We reveal exactly how many hours and dollars your team is losing to manual busywork, duplicate data entry, and broken workflows.",
        icon: "/images/icon-waste.png",
    },
    {
        title: "Precision Tool Selection",
        description: "No more guessing. We match your specific pain points to the exact AI tools and automations that will solve them for good.",
        icon: "/images/icon-tools.png",
    },
    {
        title: "Implementation Roadmap",
        description: "A step-by-step 90-day execution plan. We don't just tell you what to fix; we show you exactly how to Fix it, phase by phase.",
        icon: "/images/icon-roadmap.png",
    }
];

export function DeliverablesSection() {
    return (
        <Section className="bg-brand-navy" id="deliverables">
            <motion.div
                className="relative z-10 mx-auto max-w-6xl"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp} className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        What You&rsquo;re Actually Getting
                    </h2>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        This isn&rsquo;t a vague PDF. It&rsquo;s a comprehensive ROI-driven transformation strategy designed to be executed immediately.
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-3">
                    {deliverables.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-white/10"
                        >
                            <div className="mb-6 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-brand-dark/50">
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="h-28 w-28 object-contain transition-transform group-hover:scale-110 duration-500"
                                />
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
