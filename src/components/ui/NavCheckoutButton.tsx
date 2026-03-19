"use client";

import { useState } from "react";
import { trackCtaClick, trackBeginCheckout, navigateAfterTracking } from "@/lib/analytics";
import { getCurrentPricing } from "@/lib/pricing";
import { useLanguage } from "@/context/LanguageContext";

export function NavCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  async function handleClick() {
    trackCtaClick(t("nav.reserve"), "nav");
    trackBeginCheckout("nav", getCurrentPricing().priceUsd);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ origin: window.location.origin }),
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
      className="rounded-md bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-green-light disabled:opacity-70 disabled:cursor-wait min-h-[44px] min-w-[44px]"
    >
      {loading ? t("common.loading") : t("nav.reserve")}
    </button>
  );
}
