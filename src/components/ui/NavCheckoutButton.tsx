"use client";

import { useState } from "react";

export function NavCheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
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
      className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-green-light disabled:opacity-70 disabled:cursor-wait"
    >
      {loading ? "Loading\u2026" : "Reserve Your Slot"}
    </button>
  );
}
