"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function SuccessPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-brand-dark px-6 text-center">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-2xl"
            >
                <motion.div
                    variants={fadeInUp}
                    className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-brand-green/20 text-brand-green"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-12 w-12"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    className="text-4xl font-extrabold text-white md:text-5xl"
                >
                    Audit Reserved!
                </motion.h1>

                <motion.p
                    variants={fadeInUp}
                    className="mt-6 text-xl text-slate-300"
                >
                    You&rsquo;ve just taken the first step toward reclaiming your time and plugging the leaks in your business.
                </motion.p>

                <motion.div
                    variants={fadeInUp}
                    className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-8 text-left"
                >
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4">What Happens Next:</h2>
                    <ul className="space-y-4 text-slate-400">
                        <li className="flex gap-3">
                            <span className="text-brand-green font-bold">1.</span>
                            <span>Check your inbox for a confirmation email and your next steps.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-brand-green font-bold">2.</span>
                            <span>We&rsquo;ll reach out within 24 hours to schedule your 1:1 kickoff call.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-brand-green font-bold">3.</span>
                            <span>Start gathering your current workflow documentation (standard ops, tech stack).</span>
                        </li>
                    </ul>
                </motion.div>

                <motion.div variants={fadeInUp} className="mt-12">
                    <Link
                        href="/"
                        className="inline-block rounded-lg border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
                    >
                        Back to Homepage
                    </Link>
                </motion.div>
            </motion.div>
        </main>
    );
}
