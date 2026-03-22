"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";
import { getCurrentPricing } from "@/lib/pricing";

const DEDUP_KEY = "rhb_purchase_tracked";

/**
 * Detects a successful Stripe checkout return (?status=success&session_id=cs_...)
 * and fires the GA4 purchase + LinkedIn conversion event exactly once.
 *
 * Deduplication: sessionStorage prevents double-firing on refresh.
 * URL cleanup: history.replaceState removes the params so back-nav looks clean.
 */
export function useConversionTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const sessionId = params.get("session_id");

    if (status !== "success" || !sessionId) return;

    // Dedupe — only fire once per browser session
    const alreadyTracked = sessionStorage.getItem(DEDUP_KEY);
    if (alreadyTracked === sessionId) return;

    sessionStorage.setItem(DEDUP_KEY, sessionId);
    trackPurchase(sessionId, getCurrentPricing().priceUsd);

    // Clean the URL — remove tracking params without triggering a navigation
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);
  }, []);
}
