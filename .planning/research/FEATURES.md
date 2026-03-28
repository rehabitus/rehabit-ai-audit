# Features: Audit.Rehabit.biz

**Researched:** 2026-02-16
**Confidence:** HIGH (derived from actual codebase analysis)

## Shipped Features

### Sales Page Sections

| Section | Component | Key Elements |
|---------|-----------|-------------|
| Hero | HeroSection.tsx | Main headline, subheading, CTA, urgency counter ("3 audits left") |
| Problem | ProblemSection.tsx | Bullet list of workflow pain points targeting coaches/creators |
| Bridge | BridgeSection.tsx | Market shift context ("tools now exist"), positioning statement |
| Offer | OfferSection.tsx | 6 deliverable cards + Digital Twin bonus highlight |
| Outcomes | OutcomesSection.tsx | 7-row before/after table, animated stat counters |
| Process | ProcessSection.tsx | 5-day timeline with scroll-driven progress animation |
| Trust | TrustSection.tsx | Founder credentials (Mike Olaski, Rehabit, 4C AI Coaching OS) |
| Pricing | PricingSection.tsx | $1,200 price, inclusions checklist, guarantees, pay-in-full bonus |
| FAQ | FAQSection.tsx | 7 expandable accordion items |
| Final CTA | FinalCTASection.tsx | Option A vs B decision framework, 16x ROI math |

### Stripe Checkout

- Server-side session creation at `/api/checkout`
- Single product: "AI Transformation Audit — Complete Package" ($1,200)
- Promotion codes enabled
- Success redirect with session ID parameter
- Cancel redirect back to landing page
- Graceful fallback (scroll to pricing) if Stripe is unconfigured

### WebGL Backgrounds

| Scene | Section | Details |
|-------|---------|---------|
| Network Nodes | Offer | 18 nodes, distance-based connections, green/blue palette |
| Particle Field | Process | 100 ascending particles with horizontal sway |
| Aurora Orbs | Final CTA | 4 glowing orbs with custom fragment shader, additive blending |

All scenes: demand frameloop, capped FPS, `aria-hidden="true"`, CSS gradient fallbacks on mobile.

### Animation System

**Scroll-triggered (Framer Motion):**
- fadeInUp, slideInLeft, slideInRight, scaleIn
- Stagger containers (0.08s, 0.1s, 0.15s variants)
- Hero uses mount-triggered animation (not scroll)
- Card hover: scale 1.02
- Viewport: `once: true, amount: 0.15`

**CSS Keyframes:**
- `gradient-shift` — Hero background drift (12s loop)
- `shimmer` — CTA button shine sweep
- `glow-pulse` — Bonus card one-shot pulse
- `breathe` — Final CTA button subtle scale (desktop only)
- `mesh-shift` — Outcomes gradient animation (20s loop)

### Responsive Design

- Mobile-first with 768px breakpoint
- WebGL disabled on mobile (CSS fallbacks)
- Text sizes scale (3xl → 5xl on desktop)
- Timeline progress animation hidden on mobile
- Breathing animation desktop-only

### Accessibility

- Semantic HTML (section, button, main, footer)
- `aria-hidden="true"` on decorative WebGL backgrounds
- `prefers-reduced-motion` disables all CSS animations
- Color contrast > 7:1 (green on dark)

### Third-Party

- Trustpilot widget embed with afterInteractive script loading
- Manual trigger via `window.Trustpilot.loadFromElement()`

## Not Yet Built

| Feature | Priority | Notes |
|---------|----------|-------|
| Analytics/tracking | High | No way to measure conversion rates |
| Stripe success page | High | Currently redirects back to landing with query param |
| Email lead capture | Medium | Visitors who don't buy are lost |
| Pre-qualification form | Medium | No screening before checkout |
| Open Graph meta tags | Medium | Poor social sharing previews |
| JSON-LD structured data | Low | Missing from search results |
| Sitemap/robots.txt | Low | Basic SEO hygiene |
| Error boundaries | Low | WebGL crash could white-screen |
| Web Vitals monitoring | Low | No performance tracking |
