"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { surveyQuestions } from "@/lib/survey";

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    onend: (() => void) | null;
}
declare global {
    interface Window {
        SpeechRecognition?: new () => SpeechRecognition;
        webkitSpeechRecognition?: new () => SpeechRecognition;
    }
}

const OTHER_OPTION = "Other / Add Detail";

interface Props {
    onComplete: (answers: Record<string, string>) => void;
}

export function SurveyMode({ onComplete }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [selected, setSelected] = useState<string | null>(null);
    const [otherText, setOtherText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const question = surveyQuestions[currentIndex];
    const progress = (currentIndex / surveyQuestions.length) * 100;
    const isLast = currentIndex === surveyQuestions.length - 1;
    const isOtherSelected = selected === OTHER_OPTION;
    const isNextEnabled = selected !== null && (selected !== OTHER_OPTION || otherText.trim().length > 0);

    const handleSelect = (option: string) => {
        setSelected(option);
        if (option !== OTHER_OPTION) {
            setOtherText("");
            stopListening();
        }
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
    };

    const toggleVoice = () => {
        const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechAPI) {
            alert("Voice input isn't supported in this browser. Try Chrome.");
            return;
        }

        if (isListening) {
            stopListening();
            return;
        }

        const recognition = new SpeechAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognitionRef.current = recognition;

        recognition.onresult = (e: SpeechRecognitionEvent) => {
            const transcript = e.results[0][0].transcript;
            setOtherText((prev) => (prev ? prev + " " + transcript : transcript));
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
        setIsListening(true);
    };

    const handleNext = () => {
        if (!selected) return;
        const value = isOtherSelected ? `Other: ${otherText.trim()}` : selected;
        const newAnswers = { ...answers, [question.id]: value };
        setAnswers(newAnswers);
        setSelected(null);
        setOtherText("");
        stopListening();

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
                        {question.options.map((option) => {
                            const isOther = option === OTHER_OPTION;
                            const isActive = selected === option;

                            return (
                                <div key={option}>
                                    <button
                                        onClick={() => handleSelect(option)}
                                        className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-all flex items-center gap-2 ${isActive
                                                ? "border-brand-green bg-brand-green/10 text-white"
                                                : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                                            }`}
                                    >
                                        {isActive && (
                                            <span className="text-brand-green shrink-0">✓</span>
                                        )}
                                        <span className="flex-1">{option}</span>
                                        {isOther && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke={isActive ? "currentColor" : "#64748b"}
                                                className="h-4 w-4 shrink-0"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Expandable "Other" input */}
                                    <AnimatePresence>
                                        {isOther && isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex gap-2 items-start rounded-lg border border-brand-green/30 bg-brand-green/5 p-3">
                                                    <textarea
                                                        value={otherText}
                                                        onChange={(e) => setOtherText(e.target.value)}
                                                        placeholder="Describe your business or situation..."
                                                        rows={2}
                                                        className="flex-1 resize-none bg-transparent text-sm text-white placeholder-slate-500 outline-none leading-relaxed"
                                                    />
                                                    {/* Mic button */}
                                                    <button
                                                        onClick={toggleVoice}
                                                        title={isListening ? "Stop recording" : "Speak to fill"}
                                                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all ${isListening
                                                                ? "border-brand-red bg-brand-red/20 text-brand-red animate-pulse"
                                                                : "border-white/10 text-slate-400 hover:border-brand-green/40 hover:text-brand-green"
                                                            }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {isListening && (
                                                    <p className="mt-1.5 text-xs text-brand-red font-medium flex items-center gap-1">
                                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-red animate-ping" />
                                                        Listening — speak now...
                                                    </p>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <button
                onClick={handleNext}
                disabled={!isNextEnabled}
                className="mt-6 w-full rounded-xl bg-brand-green px-8 py-3 text-sm font-bold text-brand-dark transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                {isLast ? "See My Results →" : "Next →"}
            </button>
        </div>
    );
}
