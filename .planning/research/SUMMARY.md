# Research Summary: Audit.Rehabit.biz

**Researched:** 2026-02-16

## What This Project Is

A high-converting landing page for rehabit.ai's $1,200 "AI Transformation Audit" service. Built with Next.js 14, Tailwind CSS, Framer Motion, and Three.js. Deployed on Vercel with Stripe checkout integration.

## Current State

**Phase 1 complete (76% of total requirements).** The landing page is live with:
- 11 sales sections following a problem → solution → proof → urgency framework
- Stripe checkout ($1,200 one-time payment, promotion codes enabled)
- 3 WebGL background scenes with mobile CSS fallbacks
- Scroll-triggered animations and responsive design
- Trustpilot review widget

## Key Strengths

1. **Clean architecture** — No unnecessary complexity. Single page, one API route, no database.
2. **Premium visual quality** — WebGL scenes, gradient backgrounds, and Framer Motion give a polished, credible feel.
3. **Performance-conscious** — Mobile gets CSS fallbacks instead of WebGL. Demand frameloop caps GPU usage.
4. **Centralized content** — All copy in `constants.ts` makes updates straightforward.
5. **Appropriate stack** — Next.js + Vercel is ideal for a marketing page with one API endpoint.

## Key Gaps

1. **No analytics** — Can't measure conversion funnel performance (HIGH priority)
2. **No lead capture** — $1,200 is a big ask; visitors who aren't ready are lost (HIGH priority)
3. **No success page** — Post-purchase experience is weak (MEDIUM priority)
4. **No SEO/social tags** — Missing Open Graph, JSON-LD, sitemap (MEDIUM priority)
5. **No error boundaries** — WebGL failures could crash the page (LOW priority)

## Remaining Roadmap

| Phase | Focus | Requirements |
|-------|-------|-------------|
| 2 | Analytics & Conversion Tracking | 3 |
| 3 | Lead Capture & Qualification | 2 |
| 4 | SEO & Discoverability | 3 |
| 5 | Quality & Monitoring | 2 |

## Technical Notes

- **Stripe integration is server-side only** — POST to `/api/checkout` creates a session and redirects. No client-side Elements.
- **Three.js scenes** use custom geometries and shaders (Aurora Orbs has a fragment shader). Not trivially replaceable.
- **All animations use `once: true`** — They fire once per page visit, not on every scroll pass.
- **`useIsMobile` hook** gates WebGL rendering at 768px breakpoint.
- **Copy is in `src/lib/constants.ts`** — structured as arrays of objects (FAQ items, offer cards, process steps, etc.)
