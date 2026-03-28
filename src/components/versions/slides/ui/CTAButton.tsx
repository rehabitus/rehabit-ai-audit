"use client";

import { useState } from "react";
import { trackCtaClick, trackBeginCheckout, navigateAfterTracking } from "@/lib/analytics";
import { getCurrentPricing } from "@/lib/pricing";
import { getSavedUTMs } from "@/lib/utms";
import { useLanguage } from "@/context/LanguageContext";

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
  location?: "nav" | "hero" | "pricing" | "final_cta" | "other";
}

export function CTAButton({ children, className = "", location = "other" }: CTAButtonProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  async function handleClick() {
    trackCtaClick(typeof children === "string" ? children : t("common.main_cta"), location);
    trackBeginCheckout(location, getCurrentPricing().priceUsd);
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
        // Fallback: scroll to pricing if Stripe isn't configured yet
        document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
        setLoading(false);
      }
    } catch {
      // Fallback: scroll to reserve section
      document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`group relative inline-block min-h-[52px] overflow-hidden rounded-full bg-brand-orange px-8 py-4 text-lg font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#ea6a12] hover:shadow-[0_20px_50px_rgba(249,115,22,0.28)] disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {/* Shimmer sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <span className="relative">{loading ? t("common.redirecting_checkout") : children}</span>
    </button>
  );
}
