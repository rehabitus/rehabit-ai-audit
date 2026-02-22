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

const BASE_URL = "https://audit.rehabit.ai";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "AI Transformation Audit | rehabit.ai",
  description:
    "We audit your workflows, quantify the waste, and hand you a ready-to-execute AI implementation plan — in 5 days. Guaranteed to reveal $20K+ in annual savings.",
  openGraph: {
    title: "AI Transformation Audit — Find Exactly Where Your Business Is Bleeding Money",
    description:
      "We audit your workflows, quantify the waste, and hand you a ready-to-execute AI implementation plan — in 5 days. Guaranteed to reveal $20K+ in annual savings.",
    url: BASE_URL,
    siteName: "rehabit.ai",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Transformation Audit | rehabit.ai",
    description:
      "We audit your workflows, quantify the waste, and hand you a ready-to-execute AI implementation plan — in 5 days.",
    site: "@rehabitai",
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: "AI Transformation Audit",
              description:
                "A 5-day business workflow audit that quantifies waste, matches workflows to specific AI tools, and delivers a ready-to-execute implementation plan with ROI projections.",
              url: "https://audit.rehabit.ai",
              provider: {
                "@type": "Organization",
                name: "rehabit.ai",
                url: "https://rehabit.ai",
              },
              offers: {
                "@type": "Offer",
                price: "1200",
                priceCurrency: "USD",
                availability: "https://schema.org/LimitedAvailability",
                url: "https://audit.rehabit.ai",
              },
              areaServed: {
                "@type": "Place",
                name: "Worldwide",
              },
            }),
          }}
        />
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
