"use client";

import { motion } from "framer-motion";

interface Props {
    name: string;
    onClose: () => void;
}

export function ModalScreen4ThankYou({ name, onClose }: Props) {
    const firstName = name.split(" ")[0] || "there";

    return (
        <motion.div
            key="screen4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="text-center py-4"
        >
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-3">
                Your Score Is Being Calculated, {firstName}!
            </h2>
            <p className="text-slate-300 text-base mb-6 max-w-sm mx-auto leading-relaxed">
                We&rsquo;ll email your personalized AI Savings Report within 24 hours — showing exactly where your business is leaking money and what to do about it.
            </p>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left mb-6 max-w-sm mx-auto">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">What Happens Next</p>
                <ul className="space-y-2.5 text-sm text-slate-300">
                    <li className="flex gap-2.5">
                        <span className="text-brand-green font-bold shrink-0">1.</span>
                        <span>Check your inbox — your score summary will arrive shortly.</span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="text-brand-green font-bold shrink-0">2.</span>
                        <span>We&rsquo;ll follow up within 24 hrs with a full savings breakdown.</span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="text-brand-green font-bold shrink-0">3.</span>
                        <span>If the numbers look good, we&rsquo;ll invite you to lock in an audit slot.</span>
                    </li>
                </ul>
            </div>

            <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-all"
            >
                Back to the page
            </button>
        </motion.div>
    );
}
