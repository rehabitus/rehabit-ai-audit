"use client";

import { useState } from "react";

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function CTAButton({ children, className = "" }: CTAButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
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
      className={`group relative inline-block overflow-hidden rounded-lg bg-brand-green px-8 py-4 text-lg font-bold text-brand-dark transition-all hover:bg-brand-green-light hover:shadow-[0_0_25px_4px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait ${className}`}
    >
      {/* Shimmer sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <span className="relative">{loading ? "Redirecting to checkout\u2026" : children}</span>
    </button>
  );
}
