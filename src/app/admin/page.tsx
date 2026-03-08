"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { FunnelData, FunnelStep } from "@/app/api/admin/funnel/route";

const SOURCE_LABELS: Record<FunnelStep["source"], string> = {
    stripe: "Stripe",
    ga4: "GA4",
    linkedin: "LinkedIn",
    manual: "Manual",
    calendly: "Calendly",
};

const SOURCE_COLORS: Record<FunnelStep["source"], string> = {
    stripe: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    ga4: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    linkedin: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    manual: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    calendly: "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

const STEP_ICONS: Record<string, string> = {
    ad_spend: "💰",
    ad_clicks: "👆",
    pageviews: "👁",
    scorecard_starts: "📋",
    scorecard_completions: "✅",
    checkout_starts: "🛒",
    purchases: "💳",
    discovery_clicks: "📞",
    discovery_booked: "📅",
};

function conversionRate(from: number | null, to: number | null): string | null {
    if (from == null || to == null || from === 0) return null;
    return `${((to / from) * 100).toFixed(1)}%`;
}

function StepCard({ step, prevValue }: { step: FunnelStep; prevValue: number | null }) {
    const rate = conversionRate(prevValue, step.value);

    return (
        <div className={`relative rounded-2xl border p-5 transition-all ${
            step.connected
                ? "bg-white/[0.04] border-white/10 hover:border-white/20"
                : "bg-white/[0.02] border-white/5"
        }`}>
            <div className="flex items-start justify-between gap-4">
                {/* Left: icon + labels */}
                <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl mt-0.5 shrink-0">{STEP_ICONS[step.id]}</span>
                    <div className="min-w-0">
                        <div className="font-semibold text-white text-sm leading-tight">{step.label}</div>
                        {step.sublabel && (
                            <div className="text-slate-500 text-xs mt-0.5">{step.sublabel}</div>
                        )}
                        {step.detail && (
                            <div className="text-brand-green text-xs font-medium mt-1">{step.detail}</div>
                        )}
                        {step.note && !step.connected && (
                            <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                                <span>→</span>
                                {step.source === "ga4" || step.source === "calendly" || step.source === "linkedin" ? (
                                    <Link href="/admin/integrations" className="underline underline-offset-2 hover:text-slate-300 transition-colors">
                                        {step.note}
                                    </Link>
                                ) : (
                                    <span>{step.note}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: value + badges */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`text-2xl font-bold tabular-nums ${step.connected ? "text-white" : "text-slate-600"}`}>
                        {step.formatted ?? "—"}
                    </div>
                    <div className="flex items-center gap-2">
                        {rate && (
                            <span className="text-xs text-brand-green font-medium bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-full">
                                {rate} conv.
                            </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SOURCE_COLORS[step.source]}`}>
                            {SOURCE_LABELS[step.source]}
                            {!step.connected && " ·  not connected"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Connector({ from, to }: { from: FunnelStep; to: FunnelStep }) {
    const rate = conversionRate(from.value, to.value);
    return (
        <div className="flex items-center justify-center gap-2 py-0.5">
            <div className="w-px h-5 bg-white/10" />
            {rate && (
                <span className="text-xs text-slate-500 absolute">{rate}</span>
            )}
        </div>
    );
}

export default function AdminDashboard() {
    const [days, setDays] = useState(30);
    const [data, setData] = useState<FunnelData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);

    const load = useCallback(() => {
        setLoading(true);
        fetch(`/api/admin/funnel?days=${days}`)
            .then((r) => r.json())
            .then((d: FunnelData) => {
                setData(d);
                setUpdatedAt(new Date().toLocaleTimeString());
            })
            .finally(() => setLoading(false));
    }, [days]);

    useEffect(() => { load(); }, [load]);

    const connectedCount = data?.steps.filter((s) => s.connected).length ?? 0;
    const totalCount = data?.steps.length ?? 0;

    // Summary stats from Stripe
    const purchases = data?.steps.find((s) => s.id === "purchases");
    const checkouts = data?.steps.find((s) => s.id === "checkout_starts");
    const adSpend = data?.steps.find((s) => s.id === "ad_spend");

    const checkoutConv = conversionRate(checkouts?.value ?? null, purchases?.value ?? null);
    const revenueVal = purchases?.detail; // "$X,XXX revenue"

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Business Health Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {updatedAt ? `Updated ${updatedAt}` : "Loading…"} ·{" "}
                        <span className={connectedCount < totalCount ? "text-brand-orange" : "text-brand-green"}>
                            {connectedCount}/{totalCount} sources connected
                        </span>
                        {connectedCount < totalCount && (
                            <Link href="/admin/integrations" className="text-brand-green ml-2 underline underline-offset-2 text-xs">
                                Connect →
                            </Link>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {[7, 30, 90].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                days === d
                                    ? "bg-brand-green text-brand-dark"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {d}d
                        </button>
                    ))}
                    <button
                        onClick={load}
                        className="ml-2 px-3 py-1.5 rounded-lg text-sm bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                        ↻
                    </button>
                </div>
            </div>

            {/* Summary row */}
            {data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Revenue", value: revenueVal?.replace(" revenue", "") ?? "—", sub: `Last ${days}d` },
                        { label: "Purchases", value: purchases?.formatted ?? "—", sub: "Stripe paid" },
                        { label: "Checkout Conv.", value: checkoutConv ?? "—", sub: "Checkout → Purchase" },
                        { label: "Ad Spend", value: adSpend?.formatted ?? "—", sub: `Last ${days}d` },
                    ].map((s) => (
                        <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                            <div className="text-slate-500 text-xs mb-1">{s.label}</div>
                            <div className="text-white text-2xl font-bold">{s.value}</div>
                            <div className="text-slate-600 text-xs mt-0.5">{s.sub}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Funnel */}
            <div>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Conversion Funnel</h2>
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-20 rounded-2xl bg-white/[0.03] animate-pulse" />
                        ))}
                    </div>
                ) : data ? (
                    <div className="space-y-1">
                        {data.steps.map((step, i) => (
                            <div key={step.id}>
                                {i > 0 && <Connector from={data.steps[i - 1]} to={step} />}
                                <StepCard step={step} prevValue={i > 0 ? data.steps[i - 1].value : null} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm">Failed to load funnel data.</p>
                )}
            </div>
        </div>
    );
}
