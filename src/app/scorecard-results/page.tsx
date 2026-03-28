"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { ScoreResult } from "@/app/api/generate-score/route";
import { useLanguage } from "@/context/LanguageContext";

// Decode base64url token (no DB needed — result is embedded in the URL)
function decodeToken(token: string): ScoreResult | null {
    try {
        const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(base64);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

// Animated number counter
function AnimatedNumber({ target, duration = 1800 }: { target: number; duration?: number }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        const start = performance.now();
        const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, target, duration]);

    return <span ref={ref}>{display}</span>;
}

// Animated bar
function DeptBar({ score, color, delay }: { score: number; color: string; delay: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });
    return (
        <div ref={ref} className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${score}%` } : { width: 0 }}
                transition={{ duration: 0.9, delay, ease: "easeOut" }}
            />
        </div>
    );
}

const DEPT_CONFIG = [
    { key: "marketing" as const, label: "Marketing", color: "#10B981", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
    { key: "sales" as const, label: "Sales", color: "#3B82F6", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
    { key: "delivery" as const, label: "Delivery", color: "#8B5CF6", bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400" },
    { key: "operations" as const, label: "Operations", color: "#F97316", bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
];

function gradeColor(grade: string): string {
    if (grade === "A") return "#10B981";
    if (grade === "B+" || grade === "B") return "#F59E0B";
    return "#EF4444";
}

function ScorecardResultsContent() {
    const params = useSearchParams();
    const { localizeHref } = useLanguage();
    const token = params.get("token");
    const result = token ? decodeToken(token) : null;

    const [priceUsd, setPriceUsd] = useState<number>(1000);
    useEffect(() => {
        fetch("/api/pricing").then(r => r.json()).then(d => { if (d.priceUsd) setPriceUsd(d.priceUsd); }).catch(() => {});
    }, []);

    if (!result) {
        return (
            <main className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">🔗</div>
                    <h1 className="text-2xl font-bold text-white mb-3">Scorecard Link Expired or Invalid</h1>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        This scorecard link is no longer valid. Take the scorecard again to get a fresh results link.
                    </p>
                    <Link
                        href={localizeHref("/scorecard")}
                        className="inline-flex items-center gap-2 bg-brand-green text-brand-dark px-8 py-4 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all"
                    >
                        Retake My Scorecard
                    </Link>
                </div>
            </main>
        );
    }

    const depts = result.department_scores ?? { marketing: 0, sales: 0, delivery: 0, operations: 0 };
    const minScore = Math.min(...Object.values(depts));
    const weakestDept = DEPT_CONFIG.find((d) => depts[d.key] === minScore);
    const gc = gradeColor(result.grade);
    const baseUrl = localizeHref("/");

    return (
        <main className="min-h-screen bg-[#0F172A] text-white">
            {/* Subtle grid bg */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #10b981 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Nav */}
            <header className="relative z-50 flex items-center justify-between px-6 py-5 border-b border-white/5 bg-black/30 backdrop-blur-md">
                <Link href={localizeHref("/")} className="font-logo text-xl text-brand-green tracking-tight">
                    rehabit<span className="text-white">.ai</span>
                </Link>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest">AI Readiness Scorecard</div>
                <Link href={localizeHref("/scorecard")} className="text-xs text-slate-500 hover:text-white transition-all font-semibold">
                    Retake
                </Link>
            </header>

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 pb-32">

                {/* ── HERO: Score + Grade ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                        Your AI Readiness Score
                    </div>

                    {/* Grade circle */}
                    <div className="relative w-36 h-36 mx-auto mb-6">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" strokeWidth="8" />
                            <motion.circle
                                cx="60" cy="60" r="52"
                                fill="none"
                                stroke={gc}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 52}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - result.score / 100) }}
                                transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black" style={{ color: gc }}>
                                <AnimatedNumber target={result.score} />
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">/ 100</span>
                        </div>
                    </div>

                    {/* Grade badge */}
                    <div
                        className="inline-block text-5xl font-black mb-3 px-5 py-1 rounded-2xl"
                        style={{ color: gc, background: `${gc}15`, border: `1px solid ${gc}30` }}
                    >
                        {result.grade}
                    </div>

                    {/* Savings */}
                    <div className="mt-4 text-3xl font-extrabold text-brand-green">
                        ${Math.round(result.savings_min / 1000)}K–${Math.round(result.savings_max / 1000)}K
                    </div>
                    <div className="text-slate-500 text-sm mt-1">Estimated annual savings potential</div>

                    {/* Key finding */}
                    <div className="mt-6 mx-auto max-w-lg bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5">
                        <p className="text-slate-300 text-sm leading-relaxed">{result.key_finding}</p>
                    </div>
                </motion.div>

                {/* ── BIG 4 DEPARTMENT SCORES ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mb-8 bg-[#1e293b] border border-white/10 rounded-2xl p-6"
                >
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-5">
                        Big 4 Department Breakdown
                    </div>
                    <div className="space-y-5">
                        {DEPT_CONFIG.map((dept, i) => {
                            const score = depts[dept.key];
                            const isWeakest = dept.key === weakestDept?.key;
                            return (
                                <div key={dept.key}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-semibold ${dept.text}`}>{dept.label}</span>
                                            {isWeakest && (
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                                                    Biggest Gap
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-white">{score}<span className="text-slate-600 font-normal text-xs">/100</span></span>
                                    </div>
                                    <DeptBar score={score} color={dept.color} delay={0.3 + i * 0.1} />
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ── TOP 3 OPPORTUNITIES ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="mb-8 bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-white/5">
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                            Your Top 3 AI Opportunities
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {result.opportunities.map((op, i) => (
                            <div key={i} className="px-6 py-5 flex items-start gap-4">
                                <div className="shrink-0 w-7 h-7 rounded-lg bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green font-bold text-xs mt-0.5">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-white text-sm mb-1">{op.title}</div>
                                    <div className="text-slate-400 text-xs leading-relaxed">{op.description}</div>
                                    <div className="text-brand-green text-xs font-semibold mt-2">
                                        ~{op.hrs_saved_per_year.toLocaleString()} hrs/year saved
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── QUICK WIN — 1 FREE CHECKLIST ITEM ── */}
                {result.checklist.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Your #1 Quick Win</div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-full">Free Preview</span>
                        </div>
                        <div className="bg-[#1e293b] border border-brand-green/20 rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-6 h-6 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#10B981" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-white text-sm mb-1">{result.checklist[0].action}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${result.checklist[0].impact === "high" ? "text-brand-green bg-brand-green/10 border border-brand-green/20" : "text-brand-gold bg-brand-gold/10 border border-brand-gold/20"}`}>
                                            {result.checklist[0].impact} impact
                                        </span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                                            {result.checklist[0].category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-400">
                                {result.checklist.length - 1} more prioritized actions are inside your full audit — each mapped to specific tools and integration costs.
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── ROI SNAPSHOT ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.32 }}
                    className="mb-8 bg-[#1e293b] border border-white/10 rounded-2xl p-6"
                >
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-5">Your ROI Snapshot</div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-black text-brand-green">${Math.round(result.savings_min / 1000)}K+</div>
                            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Estimated Year 1 Savings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-brand-gold">{Math.round(result.savings_min / priceUsd)}x</div>
                            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Minimum ROI</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-white">{result.opportunities.reduce((sum, o) => sum + o.hrs_saved_per_year, 0).toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Hrs/Year Freed</div>
                        </div>
                    </div>
                </motion.div>

                {/* ── IMPLEMENTATION ROADMAP — LOCKED ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="mb-10 relative"
                >
                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                Your 5-Step Implementation Roadmap
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Locked</span>
                            </div>
                        </div>

                        {/* Blurred checklist preview */}
                        <div className="relative">
                            <div className="divide-y divide-white/5 select-none pointer-events-none" style={{ filter: "blur(4px)", opacity: 0.4 }}>
                                {result.checklist.slice(0, 3).map((item, i) => (
                                    <div key={i} className="px-6 py-4 flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-brand-green/20 shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-3 bg-white/10 rounded w-4/5" />
                                            <div className="h-2.5 bg-white/5 rounded w-3/5" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Lock overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#1e293b] via-[#1e293b]/80 to-transparent px-6 py-8">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="text-white font-bold text-base mb-2 text-center">
                                    Your Roadmap is Inside the Audit
                                </div>
                                <div className="text-slate-400 text-xs leading-relaxed text-center max-w-xs mb-5">
                                    The 5-step implementation plan — including specific tools, integration costs, and exact ROI projections — is delivered in your 5-day AI Transformation Audit.
                                </div>
                                <a
                                    href={baseUrl}
                                    className="inline-flex items-center gap-2 bg-brand-green text-brand-dark font-bold text-sm px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-brand-green/20"
                                >
                                    Unlock with AI Audit (${`${priceUsd.toLocaleString()}`})
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* ── STICKY CTA BAR ── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-t border-white/10 px-4 py-3">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden sm:block">
                        <div className="text-white text-sm font-bold leading-tight">
                            {result.grade} — ${Math.round(result.savings_min / 1000)}K–${Math.round(result.savings_max / 1000)}K/yr opportunity
                        </div>
                        <div className="text-slate-500 text-xs">Weakest dept: {weakestDept?.label}</div>
                    </div>
                    <a
                        href={baseUrl}
                        className="flex-shrink-0 inline-flex items-center gap-2 bg-brand-green text-brand-dark font-bold text-sm px-5 py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-brand-green/20 w-full sm:w-auto justify-center"
                    >
                        Book My AI Audit — ${`${priceUsd.toLocaleString()}`}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </main>
    );
}

export default function ScorecardResultsPage() {
    return (
        <Suspense>
            <ScorecardResultsContent />
        </Suspense>
    );
}
