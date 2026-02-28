# Requirements: Audit.Rehabit.biz

**Version:** v1.1
**Last Updated:** 2026-02-28

## Completed (Shipped)

### Landing Page Core
- [x] REQ-01: Single-page layout with 11 scroll sections following sales framework
- [x] REQ-02: Sticky navigation bar with logo and CTA button
- [x] REQ-03: Hero section with value prop headline, subheading, and primary CTA
- [x] REQ-04: Problem section articulating target audience pain points
- [x] REQ-05: Bridge section positioning market shift and credibility
- [x] REQ-06: Offer section with 6 deliverable cards and Digital Twin bonus
- [x] REQ-07: Outcomes section with before/after table and animated stat counters
- [x] REQ-08: Process section with 5-day timeline and scroll-driven progress line
- [x] REQ-09: Trust section with founder credentials
- [x] REQ-10: Pricing section with inclusions checklist, guarantees, pay-in-full bonus
- [x] REQ-11: FAQ section with 7 expandable accordion items
- [x] REQ-12: Final CTA section with Option A vs B decision framework and 16x ROI math

### Stripe Integration
- [x] REQ-13: Server-side Stripe checkout session creation (`/api/checkout`)
- [x] REQ-14: $1,200 single product with description
- [x] REQ-15: Support for promotion/coupon codes (`allow_promotion_codes: true`)
- [x] REQ-16: Success/cancel redirect URLs with session ID
- [x] REQ-17: Fallback behavior (scroll to pricing) when Stripe is unconfigured

### Visual & Animation
- [x] REQ-18: Framer Motion scroll-triggered animations on all sections
- [x] REQ-19: Staggered children animations with configurable timing
- [x] REQ-20: WebGL Network Nodes background (Offer section)
- [x] REQ-21: WebGL Particle Field background (Process section)
- [x] REQ-22: WebGL Aurora Orbs background (Final CTA section)
- [x] REQ-23: CSS gradient fallbacks for mobile/no-WebGL devices
- [x] REQ-24: CSS keyframe animations (gradient-shift, shimmer, glow-pulse, breathe)
- [x] REQ-25: `prefers-reduced-motion` support

### Design & Responsiveness
- [x] REQ-26: Dark theme with brand color system
- [x] REQ-27: Mobile-first responsive layout (breakpoint: 768px)
- [x] REQ-28: Custom fonts (Geist Sans, Geist Mono, Comfortaa)
- [x] REQ-29: Section divider gradients between all sections
- [x] REQ-30: Tailwind CSS utility-first styling with custom config

### Third-Party
- [x] REQ-31: Trustpilot review widget embed with script loader

## Not Yet Implemented

### Analytics & Tracking
- [x] REQ-32: Conversion tracking — Vercel Analytics + SpeedInsights in layout *(shipped 2026-02-28)*
- [x] REQ-33: Event tracking on CTA clicks, scroll depth, section views *(shipped 2026-02-28)*
- [x] REQ-34: Stripe success page fires purchase conversion event on session_id *(shipped 2026-02-28)*

### Lead Capture
- [ ] REQ-35: Email opt-in / lead magnet before checkout
- [ ] REQ-36: Pre-qualification questionnaire

### SEO
- [x] REQ-37: Open Graph meta tags for social sharing *(shipped 2026-02-28)*
- [x] REQ-38: Structured data (JSON-LD) for service offering *(updated to AggregateOffer $500–$3,000, 2026-02-28)*
- [x] REQ-39: Sitemap and robots.txt *(already shipped via src/app/sitemap.ts + robots.ts)*

### Quality
- [x] REQ-42: Security headers (X-Frame-Options, XSS, Referrer-Policy, Permissions-Policy) *(shipped 2026-02-28)*
- [ ] REQ-40: React error boundaries for graceful degradation
- [ ] REQ-41: Core Web Vitals monitoring (Vercel Analytics)

---

**Shipped:** 39/42 (93%)
**Remaining:** 3 requirements — lead capture (REQ-35, REQ-36) and quality (REQ-40, REQ-41)
