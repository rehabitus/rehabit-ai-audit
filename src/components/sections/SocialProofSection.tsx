"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const PEOPLE = [
    { name: "Eckhart Tolle", image: "/images/social-proof/eckhart-tolle.jpg" },
    { name: "Joe Dispenza", image: "/images/social-proof/joe-dispenza.jpg" },
    { name: "Shefali Tsabury", image: "/images/social-proof/shefali-tsabury.jpg" },
    { name: "Les Brown", image: "/images/social-proof/les-brown.jpg" },
    { name: "Don Miguel Ruiz Sr", image: "/images/social-proof/don-miguel-ruiz.jpg" },
    { name: "Lewis Howes", image: "/images/social-proof/lewis-howes.jpg" },
    { name: "John Assaraf", image: "/images/social-proof/john-assaraf.jpg" },
    { name: "Brian Tracy", image: "/images/social-proof/brian-tracy.jpg" },
    { name: "Bob Proctor", image: "/images/social-proof/bob-proctor.jpg" },
    { name: "Sonia Ricotti", image: "/images/social-proof/sonia-ricotti.jpg" },
];

export function SocialProofSection() {
    return (
        <Section className="bg-brand-dark overflow-hidden py-16" id="clients" noAnimate>
            <motion.div
                className="relative z-10 mx-auto max-w-6xl px-6 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainer}
            >
                <motion.p
                    variants={fadeInUp}
                    className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-400"
                >
                    Worked with or on Projects Featuring:
                </motion.p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-8">
                    {PEOPLE.map((person, idx) => (
                        <motion.div
                            key={person.name}
                            variants={fadeInUp}
                            className="group relative flex flex-col items-center"
                        >
                            <div className="relative mb-3 h-28 w-28 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-brand-green/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] md:h-32 md:w-32">
                                <Image
                                    src={person.image}
                                    alt={person.name}
                                    width={140}
                                    height={140}
                                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                            <p className="text-xs font-semibold text-slate-400 transition-colors duration-300 group-hover:text-white md:text-sm">
                                {person.name}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Results delivered summary */}
                <motion.div
                    variants={fadeInUp}
                    className="mt-20 mx-auto max-w-3xl rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm"
                >
                    <h3 className="text-xl font-bold text-white md:text-2xl mb-8">Results Delivered</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-brand-green mb-1">Generated</span>
                            <span className="text-lg text-slate-300 font-medium">$75,000 / mo</span>
                            <span className="text-xs text-slate-500 uppercase">in MRR for agency</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-brand-blue mb-1">Built</span>
                            <span className="text-lg text-slate-300 font-medium">250,000</span>
                            <span className="text-xs text-slate-500 uppercase">email list in 18 mo</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-brand-orange mb-1">Systems</span>
                            <span className="text-lg text-slate-300 font-medium">7-Figure</span>
                            <span className="text-xs text-slate-500 uppercase">Coaching Launch</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </Section>
    );
}
