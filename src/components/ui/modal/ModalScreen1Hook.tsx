"use client";

import { motion } from "framer-motion";

interface Props {
    onContinue: () => void;
    onDismiss: () => void;
}

export function ModalScreen1Hook({ onContinue, onDismiss }: Props) {
    return (
        <motion.div
            key="screen1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center px-2"
        >
            {/* Icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-extrabold text-white md:text-3xl leading-tight mb-3">
                Before You Leave&nbsp;&mdash;<br />
                <span className="text-brand-green">Find Out Your AI Score</span>
            </h2>

            {/* Value prop */}
            <p className="text-slate-300 text-base leading-relaxed mb-2 max-w-sm">
                Answer 5 quick questions and we&rsquo;ll calculate exactly how many hours and dollars your business is leaving on the table every year.
            </p>
            <p className="text-slate-500 text-sm mb-8">
                Free. No credit card. Takes 90 seconds.
            </p>

            {/* CTA */}
            <button
                onClick={onContinue}
                className="w-full max-w-xs rounded-xl bg-brand-green px-8 py-4 text-base font-bold text-brand-dark transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-green/20"
            >
                &#8594;&ensp;Get My AI Score (Free)
            </button>

            {/* Dismiss */}
            <button
                onClick={onDismiss}
                className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
                No thanks, I don&rsquo;t want to know
            </button>
        </motion.div>
    );
}
