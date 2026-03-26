"use client";

import { useEffect } from "react";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UTMData = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/**
 * Grabs UTM parameters from URL and saves them in sessionStorage.
 * This runs client-side only. We don't use useSearchParams to avoid Suspense de-opts.
 */
export function useUTMCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    let hasUTM = false;
    const currentUTMs: UTMData = {};

    UTM_KEYS.forEach((key) => {
      const val = params.get(key);
      if (val) {
        currentUTMs[key] = val;
        hasUTM = true;
      }
    });

    if (hasUTM) {
      sessionStorage.setItem("rhb_utms", JSON.stringify(currentUTMs));

      // Optional: keep URL clean for user sharing, replace state without UTMs:
      /*
      const cleanUrl = new URL(window.location.href);
      UTM_KEYS.forEach((key) => cleanUrl.searchParams.delete(key));
      window.history.replaceState({}, "", cleanUrl.toString());
      */
    }
  }, []);
}

/**
 * A tiny invisible component to drop into RootLayout to run the capture securely
 * sitewide without turning the whole layout into a client component.
 */
export function UTMCaptureComponent() {
  useUTMCapture();
  return null;
}

/**
 * Returns saved UTMs from sessionStorage.
 */
export function getSavedUTMs(): UTMData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem("rhb_utms");
    return raw ? (JSON.parse(raw) as UTMData) : {};
  } catch {
    return {};
  }
}
