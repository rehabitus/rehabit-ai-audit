"use client";

import { useState } from "react";
import { trackCtaClick, trackBeginCheckout, navigateAfterTracking } from "@/lib/analytics";
import { getCurrentPricing } from "@/lib/pricing";
import { getSavedUTMs } from "@/lib/utms";
import { useLanguage } from "@/context/LanguageContext";

export function NavCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const ctaText = "Get My Spot Now";

  async function handleClick() {
    trackCtaClick(ctaText, "nav");
    trackBeginCheckout("nav", getCurrentPricing().priceUsd);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ origin: window.location.origin, utms: getSavedUTMs() }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.url) {
        navigateAfterTracking(data.url);
      } else {
        document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
        setLoading(false);
      }
    } catch {
      document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="min-h-[44px] min-w-[44px] rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#ea6a12] hover:shadow-[0_12px_24px_rgba(249,115,22,0.22)] disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? t("common.loading") : ctaText}
    </button>
  );
}
