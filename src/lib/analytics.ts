/**
 * Centralized analytics helpers — fires to both Vercel Analytics and GA4.
 * All events flow through here so naming stays consistent.
 */
import { track } from "@vercel/analytics";

/** Fire a custom event to GA4 via gtag (no-op if gtag not loaded). */
function ga(eventName: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === "function") {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", eventName, params ?? {});
    }
  } catch {
    // fail silently
  }
}

// LinkedIn conversion helper — set conversion_id in Campaign Manager → Conversions
const LINKEDIN_PURCHASE_CONVERSION_ID = 0; // TODO: replace with your LinkedIn conversion ID

function linkedInTrack(conversionId: number) {
  try {
    if (conversionId && typeof window !== "undefined" && typeof (window as unknown as { lintrk?: (a: string, b: object) => void }).lintrk === "function") {
      (window as unknown as { lintrk: (a: string, b: object) => void }).lintrk("track", { conversion_id: conversionId });
    }
  } catch {
    // fail silently
  }
}

/**
 * Navigate to a URL only after GA4 has flushed the current event queue.
 * Falls back to immediate navigation after 300ms if gtag doesn't callback.
 */
export function navigateAfterTracking(url: string) {
  const go = () => { window.location.href = url; };
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") {
      const timer = setTimeout(go, 300);
      w.gtag("event", "begin_checkout_flush", {
        event_callback: () => { clearTimeout(timer); go(); },
      });
      return;
    }
  } catch { /* fall through */ }
  go();
}

// ── CTA / Checkout ──────────────────────────────────────────────
export const trackCtaClick = (label: string, location: "nav" | "hero" | "pricing" | "final_cta" | "other" = "other") => {
  track("cta_click", { label, location });
  ga("cta_click", { label, location });
};

export const trackBeginCheckout = (location: "nav" | "hero" | "pricing" | "final_cta" | "other" = "other", priceUsd = 500) => {
  track("begin_checkout", { location });
  ga("begin_checkout", {
    currency: "USD",
    value: priceUsd,
    items: [{ item_name: "AI Transformation Audit", price: priceUsd, quantity: 1 }],
    location,
  });
};

export const trackPurchase = (sessionId: string, priceUsd: number) => {
  track("purchase", { session_id: sessionId, value: priceUsd });
  ga("purchase", {
    transaction_id: sessionId,
    value: priceUsd,
    currency: "USD",
    items: [{ item_name: "AI Transformation Audit", price: priceUsd, quantity: 1 }],
  });
  linkedInTrack(LINKEDIN_PURCHASE_CONVERSION_ID);
};

// ── Lead capture flows ──────────────────────────────────────────
export const trackExitIntentShown = () => {
  track("exit_intent_shown");
  ga("exit_intent_shown");
};
export const trackExitIntentDismissed = () => {
  track("exit_intent_dismissed");
  ga("exit_intent_dismissed");
};
export const trackExitIntentConverted = () => {
  track("exit_intent_converted");
  ga("exit_intent_converted");
};

export const trackBookingModalOpen = (source: string) => {
  track("booking_modal_open", { source });
  ga("booking_modal_open", { source });
};
export const trackBookingModalCompleted = () => {
  track("booking_modal_completed");
  ga("booking_modal_completed");
};

export const trackScorecardLinkClick = () => {
  track("scorecard_link_click");
  ga("scorecard_link_click");
};

// ── Video ────────────────────────────────────────────────────────
export const trackVideoPlay = () => {
  track("video_play");
  ga("video_play");
};

export const trackVideoProgress = (depth: 25 | 50 | 75 | 100) => {
  track("video_progress", { depth });
  ga("video_progress", { depth, non_interaction: true });
};

// ── Scroll depth ────────────────────────────────────────────────
export const trackScrollDepth = (depth: 25 | 50 | 75 | 100) => {
  track("scroll_depth", { depth });
  ga("scroll_depth", { depth, non_interaction: true });
};

// ── Section views ───────────────────────────────────────────────
export const trackSectionView = (section: string) => {
  track("section_view", { section });
  ga("section_view", { section, non_interaction: true });
};
