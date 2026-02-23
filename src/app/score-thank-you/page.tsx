"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function ScoreThankYouContent() {
    const params = useSearchParams();
    const rawName = params.get("name") ?? "";
    const firstName = rawName.split(" ")[0] || "there";

    return (
        <main className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4 py-16">
            {/* Subtle grid background */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #10b981 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative z-10 w-full max-w-lg text-center">

                {/* Animated checkmark */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
                    className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/15 ring-2 ring-brand-green/30"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-10 w-10 text-brand-green"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                >
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-green">
                        Survey Complete
                    </p>
                    <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
                        Your Score Is Being Calculated, {firstName}!
                    </h1>
                    <p className="mx-auto mb-10 max-w-sm text-base leading-relaxed text-slate-400">
                        Our AI is analyzing your answers right now. Your personalized AI Savings Report — with your score, savings estimate, and action plan — will land in your inbox within a few minutes.
                    </p>
                </motion.div>

                {/* What happens next */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left"
                >
                    <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        What Happens Next
                    </p>
                    <ul className="space-y-4">
                        {[
                            {
                                step: "1",
                                text: "Check your inbox — your AI Score email arrives in minutes, not hours.",
                                color: "text-brand-green",
                            },
                            {
                                step: "2",
                                text: "Reply to the email with your thoughts on the checklist and we'll send you a free bonus video showing exactly how to implement it.",
                                color: "text-brand-gold",
                            },
                            {
                                step: "3",
                                text: "If your savings potential is strong, we'll invite you to lock in an audit slot and build it in 5 days.",
                                color: "text-brand-green",
                            },
                        ].map(({ step, text, color }) => (
                            <li key={step} className="flex gap-4">
                                <span className={`mt-0.5 shrink-0 text-base font-extrabold ${color}`}>
                                    {step}.
                                </span>
                                <span className="text-sm leading-relaxed text-slate-300">{text}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Bonus callout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.55 }}
                    className="mb-8 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-5 text-left"
                >
                    <div className="flex items-start gap-3">
                        <span className="text-2xl leading-none">🎁</span>
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
                                Free Bonus
                            </p>
                            <p className="text-sm leading-relaxed text-slate-300">
                                <span className="font-semibold text-white">Reply to your score email</span> with your thoughts on the checklist and get a personalized video walkthrough — free.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Back to page */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-white/30 hover:text-white"
                    >
                        ← Back to the page
                    </Link>
                </motion.div>

            </div>
        </main>
    );
}

export default function ScoreThankYouPage() {
    return (
        <Suspense>
            <ScoreThankYouContent />
        </Suspense>
    );
}
