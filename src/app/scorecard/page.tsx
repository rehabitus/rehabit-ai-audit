"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScorecardSurvey } from "../../components/scorecard/ScorecardSurvey";
import { ScorecardChat } from "../../components/scorecard/ScorecardChat";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Mode = "survey" | "chat";

function ScorecardContent() {
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<Mode>("survey");
    const [step, setStep] = useState<"intro" | "contact" | "questions" | "calculating" | "results">("intro");
    const [contact, setContact] = useState({ name: "", email: "", website: "" });

    // Auto-populate from query params (e.g. from exit intent)
    useEffect(() => {
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const website = searchParams.get("website");

        if (name && email) {
            setContact({ name, email, website: website || "" });
            setStep("questions");
        }
    }, [searchParams]);

    const handleStart = () => setStep("contact");

    const handleContactSubmit = (data: { name: string; email: string; website: string }) => {
        setContact(data);
        setStep("questions");
    };

    const handleComplete = async (finalAnswers: Record<string, string>, transcript?: string) => {
        setStep("calculating");

        // Sync lead to GHL
        try {
            await fetch("/api/lead-capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: contact.name,
                    email: contact.email,
                    website: contact.website,
                    answers: finalAnswers,
                    mode: transcript ? "chat" : "survey",
                    chatTranscript: transcript,
                    source: "AI Opportunity Scorecard"
                }),
            });
        } catch (e) {
            console.error("GHL sync failed", e);
        }

        // Generate score
        try {
            const res = await fetch("/api/generate-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: contact.name,
                    email: contact.email,
                    website: contact.website,
                    answers: finalAnswers,
                    chatTranscript: transcript,
                }),
            });
            const data = await res.json();
            if (data.success) {
                // Redirect to results or show them here
                window.location.href = `/score-thank-you?name=${encodeURIComponent(contact.name)}&score=${data.score}`;
            }
        } catch (e) {
            console.error("Score generation failed", e);
            window.location.href = `/score-thank-you?name=${encodeURIComponent(contact.name)}`;
        }
    };

    return (
        <main className="min-h-screen bg-[#0F172A] text-white selection:bg-brand-green/30 relative overflow-hidden flex flex-col">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-green/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            {/* Header / Nav */}
            <header className="relative z-50 flex items-center justify-between px-6 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="font-logo text-xl text-brand-green group-hover:brightness-110 transition-all tracking-tight">rehabit<span className="text-white">.ai</span></span>
                </Link>

                {step === "questions" && (
                    <div className="flex bg-white/[0.05] p-1 rounded-lg border border-white/10 gap-1">
                        <button
                            onClick={() => setMode("survey")}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${mode === "survey" ? "bg-brand-green text-brand-dark shadow-lg shadow-brand-green/20" : "text-slate-500 hover:text-white"}`}
                        >
                            Survey
                        </button>
                        <button
                            onClick={() => setMode("chat")}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${mode === "chat" ? "bg-brand-green text-brand-dark shadow-lg shadow-brand-green/20" : "text-slate-500 hover:text-white"}`}
                        >
                            Chat AI
                        </button>
                    </div>
                )}

                <div className="w-[100px] flex justify-end">
                    <Link href="/" className="text-slate-500 hover:text-white text-xs font-semibold transition-all">
                        Exit
                    </Link>
                </div>
            </header>

            {/* Controller Container */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-12">
                <AnimatePresence mode="wait">
                    {step === "intro" && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl text-center"
                        >
                            <div className="inline-block px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                                The AI Opportunity Matrix
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                                How much could AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-300">save your business?</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto">
                                We&apos;ll analyze your Big 4 Departments — Marketing, Sales, Delivery, and Operations — to identify your highest-ROI automation opportunities.
                            </p>
                            <button
                                onClick={handleStart}
                                className="inline-flex items-center gap-2 bg-brand-green hover:bg-emerald-400 text-brand-dark px-10 py-5 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-brand-green/20 active:scale-[0.98]"
                            >
                                Start My Scorecard
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                            <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale pointer-events-none">
                                <span className="text-xs font-bold uppercase tracking-widest">Typeform Style Flow</span>
                                <span className="text-xs font-bold uppercase tracking-widest">GHL Integrated</span>
                                <span className="text-xs font-bold uppercase tracking-widest">AI Scored</span>
                            </div>
                        </motion.div>
                    )}

                    {step === "contact" && (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-md w-full"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Before we begin...</h2>
                                <p className="text-slate-400">Who should we send the detailed report to?</p>
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    handleContactSubmit({
                                        name: formData.get("name") as string,
                                        email: formData.get("email") as string,
                                        website: (formData.get("website") as string) || "",
                                    });
                                }}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        placeholder="Jane Doe"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:border-brand-green/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Work Email</label>
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        placeholder="jane@company.com"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:border-brand-green/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Company Website (Optional)</label>
                                    <input
                                        name="website"
                                        type="url"
                                        placeholder="https://yourbusiness.com"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:border-brand-green/50 outline-none transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-brand-green hover:bg-emerald-400 text-brand-dark py-4 rounded-xl font-bold transition-all mt-4 flex items-center justify-center gap-2 group"
                                >
                                    Continue to Scorecard
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === "questions" && (
                        <div key="questions" className="w-full max-w-4xl h-full flex items-center justify-center">
                            {mode === "survey" ? (
                                <ScorecardSurvey onComplete={handleComplete} />
                            ) : (
                                <ScorecardChat name={contact.name} onComplete={(transcript: string) => handleComplete({}, transcript)} />
                            )}
                        </div>
                    )}

                    {step === "calculating" && (
                        <motion.div
                            key="calculating"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                                <motion.div
                                    className="absolute inset-0 border-4 border-t-brand-green border-r-transparent border-b-transparent border-l-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-brand-green text-xl">
                                    AI
                                </div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Analyzing your Big 4 Engines...</h2>
                            <p className="text-slate-400">Our AI is scoring your operations and calculating your ROI matrix.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer progress for questions */}
            {step === "questions" && mode === "survey" && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs px-6">
                    {/* Progress tracking would be handled inside ScorecardSurvey for better control but we can show something here too */}
                </div>
            )}
        </main>
    );
}

export default function ScorecardPage() {
    return (
        <Suspense>
            <ScorecardContent />
        </Suspense>
    );
}
