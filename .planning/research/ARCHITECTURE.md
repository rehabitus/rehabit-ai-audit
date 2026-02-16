# Architecture: Audit.Rehabit.biz

**Researched:** 2026-02-16
**Confidence:** HIGH (derived from actual codebase analysis)

## Overview

Single-page marketing site with one API endpoint. No database, no auth, no user state. The architecture is intentionally simple — a static-ish page with a single server-side Stripe integration.

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata, Trustpilot script)
│   ├── page.tsx                  # Main page (nav + sections + footer)
│   ├── globals.css               # Global styles (263 lines)
│   ├── api/
│   │   └── checkout/
│   │       └── route.ts          # POST handler → Stripe session
│   └── fonts/
│       ├── GeistVF.woff
│       └── GeistMonoVF.woff
│
├── components/
│   ├── sections/                 # Page sections (each ~50-130 lines)
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── BridgeSection.tsx
│   │   ├── OfferSection.tsx
│   │   ├── OutcomesSection.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── TrustSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── FAQSection.tsx
│   │   └── FinalCTASection.tsx
│   │
│   ├── ui/                       # Reusable components
│   │   ├── CTAButton.tsx         # Primary checkout trigger
│   │   ├── NavCheckoutButton.tsx # Sticky nav CTA
│   │   ├── Section.tsx           # Wrapper with animation support
│   │   ├── AnimatedCounter.tsx   # Number animation (stats)
│   │   ├── AnimatedText.tsx      # Stagger + fade-in helpers
│   │   ├── FAQItem.tsx           # Accordion component
│   │   └── TrustpilotWidget.tsx  # Trustpilot embed
│   │
│   └── backgrounds/              # WebGL scenes
│       ├── WebGLBackground.tsx           # Router (picks scene, handles mobile fallback)
│       ├── NetworkNodesBackground.tsx    # 18 connected nodes
│       ├── ParticleFieldBackground.tsx   # 100 ascending particles
│       └── AuroraOrbsBackground.tsx      # 4 glowing orbs (custom shader)
│
├── lib/
│   ├── constants.ts              # All copy, FAQs, stats, pricing (165 lines)
│   ├── animations.ts             # Framer Motion variants (110 lines)
│   └── stripe.ts                 # Stripe client init (12 lines)
│
└── hooks/
    ├── useIsMobile.ts            # Media query < 768px
    ├── useWebGLSupported.ts      # WebGL detection
    └── useReducedMotion.ts       # prefers-reduced-motion
```

## Data Flow

```
Visitor → page.tsx
            │
            ├── Renders 11 sections (all read from constants.ts)
            ├── Sections use Framer Motion for scroll animations
            ├── 3 sections include WebGL backgrounds (or CSS fallbacks)
            │
            └── User clicks CTA
                    │
                    ├── CTAButton / NavCheckoutButton
                    │   POST /api/checkout
                    │       │
                    │       ├── stripe.checkout.sessions.create()
                    │       │   - product: $1,200 AI Audit
                    │       │   - allow_promotion_codes: true
                    │       │   - success/cancel URLs
                    │       │
                    │       └── Returns { url: stripe_checkout_url }
                    │
                    └── window.location.href = url
                            │
                            └── Stripe Hosted Checkout → Success/Cancel redirect
```

## Component Hierarchy

```
<RootLayout>                         # fonts, metadata, Trustpilot script
  <main>
    <nav>                            # sticky, z-50
      "rehabit.ai" logo
      <NavCheckoutButton/>

    <HeroSection/>                   # hero-gradient background
    <ProblemSection/>                # problem-glow-bg
    <BridgeSection/>                 # dot-grid-bg
    <OfferSection/>                  # noise-vignette + WebGL network
    <OutcomesSection/>               # mesh-gradient-bg
    <ProcessSection/>                # brand-navy + WebGL particles
    <TrustSection/>                  # trust-glow-bg
    <PricingSection/>                # noise-vignette-bg
    <FAQSection/>                    # faq-glow-bg
    <FinalCTASection/>               # gradient + WebGL aurora
    <TrustpilotWidget/>
    <footer/>
```

## Key Design Decisions

1. **All copy in constants.ts** — Single source of truth for marketing content, easy to update without touching components
2. **Server-side Stripe only** — No client-side Stripe Elements; redirect to hosted checkout for PCI simplicity
3. **WebGL with fallbacks** — Premium feel on desktop, graceful CSS gradients on mobile
4. **No database** — Landing page doesn't need user state; Stripe handles all transaction data
5. **Demand frameloop** — WebGL only renders on change, not continuous 60fps
6. **Section dividers** — CSS gradient lines between every section for visual flow

## Performance Considerations

- WebGL disabled on mobile (< 768px) — CSS fallbacks instead
- Three.js scenes use `powerPreference: "low-power"`, capped DPR
- Framer Motion uses `once: true` — animations play once per visit
- Local fonts (no external font requests)
- Single API route (minimal serverless cold starts)
