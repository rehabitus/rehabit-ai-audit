# rehabit.ai — AI Transformation Audit

## What This Is
High-converting sales page + Stripe checkout for rehabit.ai's "AI Transformation Audit" ($1,000 Founding Rate). Single Next.js page targeting coaches, course creators, and platform operators losing revenue to broken workflows.

**Live:** https://rehabit-ai-audit.vercel.app
**Repo:** https://github.com/rehabitus/rehabit-ai-audit
**Local:** `/Users/mikeolaski/Workspaces/Audit.Rehabit.biz/`

## Start of Every Session
```bash
git pull origin main   # AntiGravity also pushes here
```

## Tech Stack
- Next.js 14 (App Router, TypeScript, React 18)
- Tailwind CSS 3.4 + custom CSS gradients/keyframes
- Framer Motion 12 (scroll-triggered animations)
- Three.js + React Three Fiber (WebGL backgrounds — 3 scenes)
- Stripe (server-side checkout sessions via `/api/checkout`)
- Trustpilot widget embed
- Fonts: Geist Sans (body), Geist Mono, Comfortaa (logo via `font-logo`)
- Vercel (auto-deploys from `main`)

## Key Files
| File | Purpose |
|------|---------|
| `src/lib/constants.ts` | ALL copy — FAQs, pain points, stats, pricing, cards |
| `src/app/page.tsx` | Nav + 11 sections + Trustpilot + footer |
| `src/app/globals.css` | All custom CSS — gradients, keyframes, section backgrounds |
| `src/app/layout.tsx` | Root layout, fonts (Geist + Comfortaa), Trustpilot script |
| `src/app/api/checkout/route.ts` | Stripe checkout endpoint (dynamic price from `pricing.ts`) |
| `src/lib/stripe.ts` | Stripe client — uses `getStripe()` factory (lazy, not build-time) |
| `tailwind.config.ts` | Brand colors + `font-logo` (Comfortaa) |
| `src/components/sections/` | 10 page sections (Hero → FinalCTA) |
| `src/components/ui/CTAButton.tsx` | Green shimmer button → triggers Stripe checkout |
| `src/components/ui/NavCheckoutButton.tsx` | Nav version of checkout button |
| `src/components/backgrounds/WebGLBackground.tsx` | WebGL dispatcher + CSS fallbacks |

## Design System
- **brand-dark** `#0F172A` — primary background
- **brand-navy** `#1E293B` — alternating sections
- **brand-green** `#10B981` — primary accent, CTAs
- **brand-orange** `#F97316` — urgency, highlights
- **brand-gold** `#F59E0B` — premium (pay-in-full bonus)
- **brand-red** `#EF4444` — pain points
- Dark theme only — no light mode
- Mobile: WebGL disabled, CSS gradient fallbacks render instead

## Section Background Classes (globals.css)
| Class | Used On |
|-------|---------|
| `.hero-gradient` | Hero |
| `.dot-grid-bg` | Bridge |
| `.mesh-gradient-bg` | Outcomes |
| `.noise-vignette-bg` | Pricing |
| `.problem-glow-bg` | Problem |
| `.trust-glow-bg` | Trust |
| `.faq-glow-bg` | FAQ |
| `.webgl-fallback-{network\|particles\|aurora}` | Mobile fallbacks |
| `.section-divider-{green\|blue}` | Between sections |

## Pricing Model
- Current price: **$1,000** (Founding / Early Access rate)
- Escalation: steps up $500 every 5 Trustpilot reviews → $1,500 → $2,000 → $2,500 → $3,000 → $3,500
- To raise the price: increment `REVIEW_COUNT` in `src/lib/pricing.ts`, commit + push
- Framing: founding offer, new brand — price rises as social proof builds

## Environment Variables
| Var | Where |
|-----|-------|
| `STRIPE_SECRET_KEY` | `.env.local` + Vercel (all envs) |
| `NEXT_PUBLIC_BASE_URL` | `.env.local` + Vercel |

## Stripe Notes
- Uses `getStripe()` factory in `src/lib/stripe.ts` — lazy init, not build-time
- Product: "AI Transformation Audit — Complete Package" — price is dynamic via `getCurrentPricing()` in `src/lib/pricing.ts`
- Promotion codes enabled
- Success URL: `/?session_id={CHECKOUT_SESSION_ID}&status=success`
- API version: `2026-01-28.clover`

## Design & Copy Rules
- **No Orphans/Widows**: Marketing copy must NEVER have a single word on its own line. Use `text-balance` (CSS `text-wrap: balance`) or `&nbsp;` between the last two words to prevent this.
- **Micro-Copy Styling**: Use boxed callouts with `brand-gold/20` borders for premiums and `brand-orange/20` for ICP/segments.

## Workflow
- `main` branch auto-deploys to Vercel on push
- Both Claude Code and AntiGravity work on this repo
- Commit + push before switching tools
- `.planning/` directory has full project roadmap (maintained by AntiGravity)

## Phase Status (from .planning/STATE.md)
- **Phase 1:** Landing Page & Checkout — ✅ Complete
- **Phase 2:** Analytics & Conversion Tracking — 🔲 Pending
- **Phase 3:** Lead Capture & Qualification — 🔲 Pending
- **Phase 4:** SEO & Discoverability — 🔲 Pending
- **Phase 5:** Quality & Monitoring — 🔲 Pending
