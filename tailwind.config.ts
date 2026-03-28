import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0F172A",
          navy: "#1E293B",
          slate: "#334155",
          green: "#10B981",
          "green-light": "#34D399",
          "green-dark": "#059669",
          orange: "#F97316",
          "orange-light": "#FB923C",
          red: "#EF4444",
          gold: "#F59E0B",
          blue: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        logo: ["var(--font-comfortaa)", "system-ui", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 1.5s ease-out",
        breathe: "breathe 3s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        "glow-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.3)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(16, 185, 129, 0.15)" },
          "100%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.015)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
