# Technology Stack: Audit.Rehabit.biz

**Researched:** 2026-02-16
**Confidence:** HIGH (derived from actual codebase analysis)

## Framework & Runtime

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.35 | App Router, SSR, API routes |
| React | 18.x | UI rendering |
| TypeScript | 5.x | Type safety |
| Node.js | (runtime) | Server-side execution |

**Why Next.js 14:** App Router with React Server Components, built-in API routes for Stripe, Vercel-native deployment. Appropriate for a single-page marketing site with one API endpoint.

## Styling & Animation

| Technology | Version | Purpose |
|-----------|---------|---------|
| Tailwind CSS | 3.4.1 | Utility-first CSS |
| Framer Motion | 12.34.0 | Scroll-triggered animations, stagger effects |
| PostCSS | 8.x | CSS processing pipeline |

**Animation approach:** Framer Motion handles scroll-in animations (whileInView). Custom CSS keyframes handle continuous effects (gradient-shift, shimmer, breathe). This split keeps interactive animations declarative while offloading looping effects to GPU-accelerated CSS.

## 3D / WebGL

| Technology | Version | Purpose |
|-----------|---------|---------|
| Three.js | 0.182.0 | WebGL 3D engine |
| @react-three/fiber | 8.18.0 | React renderer for Three.js |
| @react-three/drei | 9.122.0 | Three.js helper components |

**Three scenes:**
1. **NetworkNodesBackground** — 18 drifting nodes with distance-based connections (Offer section)
2. **ParticleFieldBackground** — 100 ascending particles with sway (Process section)
3. **AuroraOrbsBackground** — 4 glowing orbs with custom shaders (Final CTA section)

**Performance strategy:** Demand frameloop (render on change only), capped FPS (20-30), low-power GPU preference, DPR [1, 1.5]. Mobile gets CSS gradient fallbacks instead.

## Payments

| Technology | Version | Purpose |
|-----------|---------|---------|
| Stripe (server) | 20.3.1 | Checkout session creation |
| @stripe/stripe-js | 8.7.0 | Client-side SDK (available but checkout is server-redirect) |

**Integration pattern:** Server-side only. CTA click → POST `/api/checkout` → Stripe creates session → redirect to Stripe-hosted checkout. No client-side Stripe Elements or embedded forms.

## Third-Party Widgets

| Service | Integration | Purpose |
|---------|------------|---------|
| Trustpilot | Script embed + widget div | Social proof / reviews |

## Fonts

| Font | Source | Usage |
|------|--------|-------|
| Geist Sans | Local (woff) | Body text |
| Geist Mono | Local (woff) | Monospace accents |
| Comfortaa | Google Fonts (next/font) | Logo / brand name |

## Development Tools

| Tool | Purpose |
|------|---------|
| ESLint 8 | Code linting (next config) |
| TypeScript strict | Type checking |
| next/font | Font optimization |

## Hosting & Deployment

| Service | Purpose |
|---------|---------|
| Vercel | Hosting, serverless API routes, edge CDN |

## Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `STRIPE_SECRET_KEY` | Server only | Stripe API authentication |
| `NEXT_PUBLIC_BASE_URL` | Public | Checkout success/cancel redirect URLs |
