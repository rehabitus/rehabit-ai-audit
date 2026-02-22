import type { Metadata } from "next";
import localFont from "next/font/local";
import { Comfortaa } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Transformation Audit | rehabit.ai",
  description:
    "We'll audit your entire business, show you where you're bleeding time and money, and hand you a ready-to-execute AI implementation plan — in 5 days.",
};

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} antialiased font-sans`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
        <Script
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
