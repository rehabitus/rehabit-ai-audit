"use client";

import { useState } from "react";
import { trackCtaClick } from "@/lib/analytics";

export function NavCheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    trackCtaClick("Reserve Your Slot", "nav");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ origin: window.location.origin }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
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
      {loading ? "Loading\u2026" : "Reserve Your Slot"}
    </button>
  );
}
