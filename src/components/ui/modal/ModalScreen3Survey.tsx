"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SurveyMode } from "./SurveyMode";
import { ChatMode } from "./ChatMode";

type SurveyTab = "survey" | "chat";

interface Props {
    name: string;
    onComplete: (answers: Record<string, string>, chatTranscript?: string) => void;
}

export function ModalScreen3Survey({ name, onComplete }: Props) {
    const [tab, setTab] = useState<SurveyTab>("survey");

    const handleSurveyComplete = (answers: Record<string, string>) => {
        onComplete(answers);
    };

    const handleChatComplete = (transcript: string) => {
        onComplete({}, transcript);
    };

    return (
        <motion.div
            key="screen3"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="mb-5">
                <h2 className="text-lg font-extrabold text-white mb-1">
                    Your AI Readiness Survey
                </h2>
                <p className="text-slate-400 text-sm">
                    {name ? `Hi ${name.split(" ")[0]} — ` : ""}5 quick questions to calculate your savings potential.
                </p>
            </div>

            {/* Mode toggle */}
            <div className="flex mb-5 rounded-lg border border-white/10 bg-white/[0.03] p-1 gap-1">
                {(["survey", "chat"] as SurveyTab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${tab === t
                            ? "bg-brand-green/20 text-brand-green border border-brand-green/30"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        {t === "survey" ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                Survey Mode
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                </svg>
                                Chat + Voice
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Mode content */}
            {tab === "survey" ? (
                <SurveyMode onComplete={handleSurveyComplete} />
            ) : (
                <ChatMode name={name} onComplete={handleChatComplete} />
            )}
        </motion.div>
    );
}
