"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { surveyQuestions } from "@/lib/survey";

interface Props {
    onComplete: (answers: Record<string, string>) => void;
}

export function SurveyMode({ onComplete }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [selected, setSelected] = useState<string | null>(null);

    const question = surveyQuestions[currentIndex];
    const progress = ((currentIndex) / surveyQuestions.length) * 100;
    const isLast = currentIndex === surveyQuestions.length - 1;

    const handleSelect = (option: string) => {
        setSelected(option);
    };

    const handleNext = () => {
        if (!selected) return;
        const newAnswers = { ...answers, [question.id]: selected };
        setAnswers(newAnswers);
        setSelected(null);

        if (isLast) {
            onComplete(newAnswers);
        } else {
            setCurrentIndex((i) => i + 1);
        }
    };

    return (
        <div className="w-full">
            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Question {currentIndex + 1} of {surveyQuestions.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10">
                    <motion.div
                        className="h-1.5 rounded-full bg-brand-green"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                >
                    <p className="text-base font-semibold text-white mb-4 leading-snug">
                        {question.question}
                    </p>

                    <div className="space-y-2">
                        {question.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-all ${selected === option
                                    ? "border-brand-green bg-brand-green/10 text-white"
                                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                                    }`}
                            >
                                {selected === option && (
                                    <span className="mr-2 text-brand-green">✓</span>
                                )}
                                {option}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            <button
                onClick={handleNext}
                disabled={!selected}
                className="mt-6 w-full rounded-xl bg-brand-green px-8 py-3 text-sm font-bold text-brand-dark transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                {isLast ? "See My Results →" : "Next →"}
            </button>
        </div>
    );
}
