/**
 * Centralized analytics helpers — wraps @vercel/analytics track()
 * All events flow through here so naming stays consistent.
 */
import { track } from "@vercel/analytics";

// ── CTA / Checkout ──────────────────────────────────────────────
export const trackCtaClick = (label: string, location: "nav" | "hero" | "pricing" | "final_cta" | "other" = "other") =>
  track("cta_click", { label, location });

export const trackPurchase = (sessionId: string) =>
  track("purchase", { session_id: sessionId, value: 500 });

// ── Lead capture flows ──────────────────────────────────────────
export const trackExitIntentShown = () => track("exit_intent_shown");
export const trackExitIntentDismissed = () => track("exit_intent_dismissed");
export const trackExitIntentConverted = () => track("exit_intent_converted");

export const trackBookingModalOpen = (source: string) => track("booking_modal_open", { source });
export const trackBookingModalCompleted = () => track("booking_modal_completed");

export const trackScorecardLinkClick = () => track("scorecard_link_click");

// ── Scroll depth ────────────────────────────────────────────────
export const trackScrollDepth = (depth: 25 | 50 | 75 | 100) =>
  track("scroll_depth", { depth });

// ── Section views ───────────────────────────────────────────────
export const trackSectionView = (section: string) =>
  track("section_view", { section });
