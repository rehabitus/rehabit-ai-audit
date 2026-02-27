"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { scorecardQuestions } from "@/lib/scorecardQuestions";

interface Props {
    onComplete: (answers: Record<string, string>) => void;
}

export function ScorecardSurvey({ onComplete }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [selected, setSelected] = useState<string | null>(null);

    const question = scorecardQuestions[currentIndex];
    const progress = ((currentIndex + 1) / scorecardQuestions.length) * 100;
    const isLast = currentIndex === scorecardQuestions.length - 1;

    const handleNext = useCallback(() => {
        if (!selected) return;

        const newAnswers = { ...answers, [question.id]: selected };
        setAnswers(newAnswers);
        setSelected(null);

        if (isLast) {
            onComplete(newAnswers);
        } else {
            setCurrentIndex((i) => i + 1);
        }
    }, [selected, answers, question.id, isLast, onComplete]);

    const handleBack = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1);
            setSelected(answers[scorecardQuestions[currentIndex - 1].id] || null);
        }
    }, [currentIndex, answers]);

    // Keyboard support: Numbers for options, Enter for next
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && selected) {
                handleNext();
            } else if (["1", "2", "3", "4", "5"].includes(e.key)) {
                const idx = parseInt(e.key) - 1;
                if (question.options[idx]) {
                    setSelected(question.options[idx]);
                }
            } else if (e.key === "Backspace" && !selected) {
                handleBack();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selected, handleNext, handleBack, question.options]);

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case "Marketing": return "text-blue-400 border-blue-400/20 bg-blue-400/10";
            case "Sales": return "text-orange-400 border-orange-400/20 bg-orange-400/10";
            case "Delivery": return "text-brand-green border-brand-green/20 bg-brand-green/10";
            case "Operations": return "text-purple-400 border-purple-400/20 bg-purple-400/10";
            default: return "text-slate-400 border-slate-400/20 bg-slate-400/10";
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
            {/* Question Counter & Category */}
            <div className="flex flex-col items-center gap-4 mb-12">
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${getCategoryColor(question.category)}`}>
                    {question.category}
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <span>{currentIndex + 1}</span>
                    <div className="h-[1px] w-8 bg-slate-800" />
                    <span>{scorecardQuestions.length}</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full max-w-2xl text-center"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-12 leading-tight tracking-tight px-4">
                        {question.question}
                    </h2>

                    <div className="flex flex-col gap-3 px-4 max-w-lg mx-auto">
                        {question.options.map((option, idx) => {
                            const isActive = selected === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => setSelected(option)}
                                    className={`w-full group flex items-center transition-all duration-200 rounded-2xl border ${isActive
                                        ? "bg-brand-green border-brand-green text-brand-dark shadow-xl shadow-brand-green/20"
                                        : "bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/[0.06]"
                                        }`}
                                >
                                    <div className={`flex items-center justify-center w-12 h-14 border-r ${isActive ? "border-brand-dark/20 text-brand-dark" : "border-white/10 text-slate-500"}`}>
                                        <span className="text-xs font-black">{idx + 1}</span>
                                    </div>
                                    <span className="flex-1 px-6 py-4 text-left font-bold text-sm md:text-base tracking-tight">
                                        {option}
                                    </span>
                                    {isActive && (
                                        <div className="pr-4 transition-transform group-active:scale-90">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-x-6">
                        {currentIndex > 0 && (
                            <button
                                onClick={handleBack}
                                className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-all p-2"
                            >
                                ← Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!selected}
                            className={`flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${selected
                                ? "bg-white text-brand-dark hover:brightness-110 active:scale-95"
                                : "bg-white/5 text-slate-600 cursor-not-allowed"
                                }`}
                        >
                            {isLast ? "See My Results" : "Next Question"}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>

                    <p className="mt-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
                        Press <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-slate-500">Enter</span> to continue
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Progress Bar (Bottom) */}
            <div className="fixed bottom-0 left-0 w-full h-1.5 bg-white/5 overflow-hidden">
                <motion.div
                    className="h-full bg-brand-green shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
}
