"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ModalScreen1Hook } from "./modal/ModalScreen1Hook";
import { ModalScreen2Contact } from "./modal/ModalScreen2Contact";
import { ModalScreen3Survey } from "./modal/ModalScreen3Survey";

const STORAGE_KEY = "rh_exit_modal_dismissed";
const SUPPRESS_DAYS = 7;

type Step = 1 | 2 | 3;

interface ContactData {
    name: string;
    email: string;
    phone: string;
    website: string;
}

export function ExitIntentModal() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<Step>(1);
    const [contact, setContact] = useState<ContactData>({ name: "", email: "", phone: "", website: "" });
    const hasTriggered = useRef(false);
    const scrollStarted = useRef(false);
    const lastScrollY = useRef(0);

    const shouldSuppress = () => {
        try {
            const val = localStorage.getItem(STORAGE_KEY);
            if (!val) return false;
            const ts = parseInt(val, 10);
            const daysDiff = (Date.now() - ts) / (1000 * 60 * 60 * 24);
            return daysDiff < SUPPRESS_DAYS;
        } catch {
            return false;
        }
    };

    const triggerModal = useCallback(() => {
        if (hasTriggered.current || shouldSuppress()) return;
        hasTriggered.current = true;
        setIsOpen(true);
    }, []);

    // ── Desktop: exit intent (mouse leaves top of viewport) ──
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) triggerModal();
        };
        document.addEventListener("mouseleave", handleMouseLeave);
        return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, [triggerModal]);

    // ── Mobile: scroll-back-up intent ──
    useEffect(() => {
        const handleScroll = () => {
            const current = window.scrollY;
            if (current > 300) scrollStarted.current = true;

            // Triggered when user has scrolled down and then rapidly scrolls back to top
            if (scrollStarted.current && current < 80 && lastScrollY.current > 300) {
                triggerModal();
            }
            lastScrollY.current = current;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [triggerModal]);

    const dismiss = () => {
        try {
            localStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch { }
        setIsOpen(false);
    };

    const handleContactContinue = (data: ContactData) => {
        setContact(data);
        // Redirect to full screen scorecard skipping intro/contact
        const params = new URLSearchParams({
            name: data.name,
            email: data.email,
            website: data.website || "",
            source: "Exit Intent"
        });
        window.location.href = `/scorecard?${params.toString()}`;
    };

    const handleSurveyComplete = (
        answers: Record<string, string>,
        chatTranscript?: string
    ) => {
        // Fire both in background — no await, don't block navigation
        Promise.allSettled([
            fetch("/api/lead-capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...contact,
                    answers,
                    mode: chatTranscript ? "chat" : "survey",
                    chatTranscript,
                }),
            }),
            fetch("/api/generate-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: contact.name,
                    email: contact.email,
                    website: contact.website,
                    answers,
                }),
            }),
        ]);
        // Mark converted so modal doesn't re-trigger for a year
        try {
            localStorage.setItem(STORAGE_KEY, String(Date.now() + 1000 * 60 * 60 * 24 * 365));
        } catch { }
        // Close modal and navigate to score page
        setIsOpen(false);
        router.push(`/score-thank-you?name=${encodeURIComponent(contact.name)}`);
    };

    // ── Keyboard: Esc to close ──
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) dismiss();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen]);

    // Decide overlay size based on step
    const isWide = step === 3;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={dismiss}
                >
                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`relative w-full rounded-2xl border border-white/10 bg-[#0F172A] shadow-2xl ${isWide ? "max-w-lg" : "max-w-sm"}`}
                        role="dialog"
                        aria-modal="true"
                        aria-label="AI Readiness Survey"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxHeight: "90vh", overflowY: "auto" }}
                    >
                        {/* Close button */}
                        <button
                            onClick={dismiss}
                            aria-label="Close"
                            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/10 hover:text-white transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Step indicator dots */}
                        <div className="flex justify-center gap-1.5 pt-5 pb-0">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all ${step === s ? "w-6 bg-brand-green" : "w-1.5 bg-white/20"}`}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        <div className="p-6 pt-4">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <ModalScreen1Hook
                                        key="s1"
                                        onContinue={() => setStep(2)}
                                        onDismiss={dismiss}
                                    />
                                )}
                                {step === 2 && (
                                    <ModalScreen2Contact
                                        key="s2"
                                        onContinue={handleContactContinue}
                                        onBack={() => setStep(1)}
                                    />
                                )}
                                {step === 3 && (
                                    <ModalScreen3Survey
                                        key="s3"
                                        name={contact.name}
                                        onComplete={handleSurveyComplete}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
