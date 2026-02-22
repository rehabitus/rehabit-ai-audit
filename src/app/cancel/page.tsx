"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function CancelPage() {
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
                    className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-brand-orange/20 text-brand-orange"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-12 w-12"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    className="text-4xl font-extrabold text-white md:text-5xl"
                >
                    Checkout Cancelled
                </motion.h1>

                <motion.p
                    variants={fadeInUp}
                    className="mt-6 text-xl text-slate-300"
                >
                    No problem. Timing is everything in business. If you have questions before you're ready to commit, we're here to help.
                </motion.p>

                <motion.div
                    variants={fadeInUp}
                    className="mt-12 grid gap-6 md:grid-cols-2"
                >
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-left">
                        <h3 className="font-bold text-white mb-2">Have Questions?</h3>
                        <p className="text-sm text-slate-400 mb-4">Not sure if the audit is right for your specific stack? Let's chat.</p>
                        <a
                            href="https://calendly.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-green font-semibold hover:underline"
                        >
                            Book 15-min call &rarr;
                        </a>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-left">
                        <h3 className="font-bold text-white mb-2">Need More Info?</h3>
                        <p className="text-sm text-slate-400 mb-4">Check out our FAQs or download or latest case studies.</p>
                        <Link
                            href="/#faq"
                            className="text-brand-green font-semibold hover:underline"
                        >
                            View FAQs &rarr;
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="mt-12">
                    <Link
                        href="/"
                        className="inline-block rounded-lg border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
                    >
                        Return to Homepage
                    </Link>
                </motion.div>
            </motion.div>
        </main>
    );
}
