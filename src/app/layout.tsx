import type { Metadata } from "next";
import localFont from "next/font/local";
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
    images: [
      {
        url: "/images/RHB-AI-Audit.png",
        width: 1766,
        height: 714,
        alt: "AI Transformation Audit — rehabit.ai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Transformation Audit | rehabit.ai",
    description:
      "We audit your workflows, quantify the waste, and hand you a ready-to-execute AI implementation plan — in 5 days.",
    site: "@rehabitai",
    images: ["/images/4c-audit-vsl-thumbnail.png"],
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
import { LanguageProvider } from "@/context/LanguageContext";

const GA_ID = "G-TMPSPTL3Y6";
const LINKEDIN_PARTNER_ID = "9703625";
const CLARITY_ID = "vsinfwt5xe";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <head>
        {/* Comfortaa — loaded via CDN to avoid build-time font fetch failures */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: true });
          `}
        </Script>
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
                "@type": "AggregateOffer",
                lowPrice: "500",
                highPrice: "3000",
                priceCurrency: "USD",
                availability: "https://schema.org/LimitedAvailability",
                url: "https://audit.rehabit.ai",
                description: "Price rises with each verified client review. Early Access starts at $500.",
              },
              areaServed: {
                "@type": "Place",
                name: "Worldwide",
              },
            }),
          }}
        />
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1610373232991966');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1610373232991966&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* LinkedIn Insight Tag */}
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
        {/* Microsoft Clarity */}
        {CLARITY_ID && (
          <Script
            id="ms-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `,
            }}
          />
        )}
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
