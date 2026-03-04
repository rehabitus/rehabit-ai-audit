/**
 * Centralized analytics helpers — fires to both Vercel Analytics and GA4.
 * All events flow through here so naming stays consistent.
 */
import { track } from "@vercel/analytics";

/** Fire a custom event to GA4 via gtag (no-op if gtag not loaded). */
function ga(eventName: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: Function }).gtag === "function") {
      (window as unknown as { gtag: Function }).gtag("event", eventName, params ?? {});
    }
  } catch {
    // fail silently
  }
}

// ── CTA / Checkout ──────────────────────────────────────────────
export const trackCtaClick = (label: string, location: "nav" | "hero" | "pricing" | "final_cta" | "other" = "other") => {
  track("cta_click", { label, location });
  ga("cta_click", { label, location });
};

export const trackPurchase = (sessionId: string, priceUsd: number) => {
  track("purchase", { session_id: sessionId, value: priceUsd });
  ga("purchase", {
    transaction_id: sessionId,
    value: priceUsd,
    currency: "USD",
    items: [{ item_name: "AI Transformation Audit", price: priceUsd, quantity: 1 }],
  });
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
