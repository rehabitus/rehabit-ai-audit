# Pitfalls & Risks: Audit.Rehabit.biz

**Researched:** 2026-02-16
**Confidence:** HIGH (derived from actual codebase analysis)

## Current Risks

### 1. No Conversion Tracking
**Severity:** HIGH
**Impact:** Cannot measure ROI on traffic, don't know where visitors drop off
**Status:** Not addressed
**Mitigation:** Add analytics (Phase 2) — GA4 or Vercel Analytics with event tracking on CTA clicks, scroll depth, and section views

### 2. No Lead Capture
**Severity:** HIGH
**Impact:** Visitors who aren't ready to buy ($1,200 is a significant decision) leave with no way to follow up
**Status:** Not addressed
**Mitigation:** Add email capture component with a lead magnet (Phase 3)

### 3. WebGL Crash Potential
**Severity:** MEDIUM
**Impact:** Three.js error on unsupported device could white-screen the entire page
**Status:** Partially mitigated (mobile fallback exists, but desktop WebGL errors are unhandled)
**Mitigation:** Add React error boundaries around WebGL components (Phase 5)

### 4. Hardcoded Copy
**Severity:** LOW
**Impact:** All marketing copy lives in `constants.ts` — changes require code deployment
**Status:** Acceptable for now (developer can update easily)
**Mitigation:** Consider headless CMS if non-technical stakeholders need to edit copy

### 5. No Social Sharing Previews
**Severity:** MEDIUM
**Impact:** Links shared on LinkedIn, Twitter, etc. show generic preview instead of branded card
**Status:** Not addressed
**Mitigation:** Add Open Graph and Twitter Card meta tags (Phase 4)

### 6. Single Point of Failure — Stripe
**Severity:** LOW
**Impact:** If Stripe is misconfigured or down, CTA fails silently (falls back to scroll-to-pricing)
**Status:** Partially mitigated (fallback exists)
**Mitigation:** Add error monitoring and alerting on checkout failures

### 7. No Success Page Experience
**Severity:** MEDIUM
**Impact:** After paying $1,200, user is redirected to the same landing page with a query param — no confirmation, no next steps, no receipt summary
**Status:** Not addressed
**Mitigation:** Build dedicated success page with confirmation, next steps, and calendar booking link

## Architectural Considerations

### What's Working Well
- **Simple architecture** — No database, no auth, no state management. Hard to break.
- **Performance-conscious WebGL** — Demand frameloop, capped FPS, mobile fallbacks
- **Centralized copy** — `constants.ts` makes content updates predictable
- **Server-side Stripe** — No PCI scope concerns, no client-side token handling

### What to Watch
- **Three.js bundle size** — Three.js + R3F + Drei adds significant JS weight. Monitor Core Web Vitals if adding more scenes.
- **Framer Motion bundle** — Large library for scroll animations. Consider lighter alternatives if performance becomes an issue.
- **Font loading** — Three fonts (Geist Sans, Geist Mono, Comfortaa). Local loading helps but monitor FOUT/FOIT.
