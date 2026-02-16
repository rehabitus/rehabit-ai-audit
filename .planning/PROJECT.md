# Audit.Rehabit.biz

## What This Is

A high-converting landing page and sales funnel for rehabit.ai's "AI Transformation Audit" service. A single-page Next.js application designed to educate, convince, and convert visitors into paying customers for a $1,200 AI business audit. The page targets business owners (coaches, course creators, platform operators) losing revenue to broken workflows.

## Core Value

Drive qualified leads through a compelling sales page with transparent pricing, social proof, and a frictionless Stripe checkout — removing every objection between landing and purchase.

## Core Systems

### Sales Page Engine
11-section single-page design following a proven sales framework: Hero → Problem → Bridge → Offer → Outcomes → Process → Trust → Pricing → FAQ → Final CTA. All copy lives in `src/lib/constants.ts` for centralized management.

### Stripe Checkout Integration
Server-side checkout session creation via `/api/checkout`. Single product ($1,200 AI Transformation Audit). Supports promotion codes. Redirects to Stripe-hosted checkout with success/cancel callbacks.

### WebGL Visual Layer
Three custom Three.js scenes (Network Nodes, Particle Field, Aurora Orbs) providing premium depth to key sections. Performance-capped framerates, demand-based rendering, graceful CSS gradient fallbacks on mobile and unsupported devices.

### Animation System
Framer Motion scroll-triggered animations on all sections with staggered children. Custom CSS keyframes for gradient shifts, button shimmers, and breathing effects. Respects `prefers-reduced-motion`.

## Core Flow

1. **Land** — Visitor arrives, sees hero with clear value prop and urgency ("3 audits left")
2. **Educate** — Problem/Bridge sections establish pain and market context
3. **Present** — Offer/Outcomes/Process sections detail deliverables, before/after, and 5-day timeline
4. **Trust** — Founder credentials, Trustpilot reviews, guarantees
5. **Convert** — CTA triggers Stripe checkout → payment → success redirect

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript, React 18)
- **Styling:** Tailwind CSS 3.4 + custom CSS (gradients, keyframes)
- **Animation:** Framer Motion 12
- **3D:** Three.js + React Three Fiber + Drei
- **Payments:** Stripe (server-side checkout sessions)
- **Reviews:** Trustpilot widget embed
- **Fonts:** Geist Sans, Geist Mono, Comfortaa (logo)
- **Hosting:** Vercel

## Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata, Trustpilot script
│   ├── page.tsx                # Main page (nav + 11 sections + footer)
│   ├── globals.css             # Global styles, gradients, keyframes
│   └── api/checkout/route.ts   # Stripe checkout endpoint
├── components/
│   ├── sections/               # 10 page sections (Hero through FinalCTA)
│   ├── ui/                     # CTAButton, NavCheckoutButton, Section, AnimatedCounter, etc.
│   └── backgrounds/            # 3 WebGL scenes + wrapper with mobile fallback
├── lib/
│   ├── constants.ts            # All copy, FAQs, stats, pricing data
│   ├── animations.ts           # Framer Motion variants
│   └── stripe.ts               # Stripe client init
└── hooks/                      # useIsMobile, useWebGLSupported, useReducedMotion
```

## Design System

- **Palette:** Dark theme — brand-dark (#0F172A), brand-navy (#1E293B), brand-green (#10B981) primary accent, brand-orange (#F97316) secondary, brand-gold (#F59E0B) for premium highlights
- **Typography:** Geist Sans (body), Comfortaa (logo), system hierarchy from xs to 6xl
- **Responsive:** Mobile-first, WebGL disabled below 768px with CSS gradient fallbacks
- **Animations:** Scroll-triggered (whileInView, once: true), 0.6s duration, custom easing

## External Integrations

| Service | Purpose | Config |
|---------|---------|--------|
| Stripe | Payment processing | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_BASE_URL` |
| Trustpilot | Review widget embed | Hardcoded business unit ID |
| Vercel | Hosting & deployment | `.vercel/` project config |

## Target Audience

Coaches, therapists, authors, course creators, and platform operators losing $20K+/year to manual workflows that AI could automate. Business owners who know AI matters but don't know where to start.

## Product Offering

- **Price:** $1,200 (one-time)
- **Deliverables:** 5-day audit, ROI-projected opportunity matrix, implementation plan
- **Bonus:** Pay-in-full gets first Core AI System built free
- **Guarantee:** Reveals $20K+ in annual savings or full refund
