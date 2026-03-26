# Roadmap: Audit.Rehabit.ai (Code-Validated)

**Last Updated:** 2026-03-10
**Basis:** direct inspection of current code, not planning docs

## Executive Summary

The current codebase does not match the original phase plan exactly.

- Phase 1: complete
- Phase 2: complete
- Phase 3: partial, with overlapping lead-capture flows already live
- Phase 4: complete
- Phase 5: partial

The next meaningful work is not "start Phase 3." It is to consolidate and finish the lead-capture system that already exists in pieces.

---

## Phase Status

| Phase | Status | Reality in Code | Primary Evidence |
|-------|--------|-----------------|------------------|
| 1. Landing Page & Checkout | Complete | Main page, pricing, Stripe checkout, success/cancel routes are implemented | `src/app/page.tsx`, `src/app/api/checkout/route.ts`, `src/app/success/page.tsx`, `src/app/cancel/page.tsx` |
| 2. Analytics & Conversion Tracking | Complete | GA4, Vercel Analytics, Speed Insights, CTA/purchase/scroll/section tracking are implemented | `src/app/layout.tsx`, `src/lib/analytics.ts`, `src/hooks/useScrollDepth.ts`, `src/hooks/useSectionView.ts` |
| 3. Lead Capture & Qualification | Partial | Scorecard flow, exit-intent modal, qualification modal, lead capture API, and CRM sync exist, but the flows are fragmented | `src/app/scorecard/page.tsx`, `src/components/ui/ExitIntentModal.tsx`, `src/components/ui/BookingQualificationModal.tsx`, `src/app/api/lead-capture/route.ts`, `src/app/api/qualify-booking/route.ts` |
| 4. SEO & Discoverability | Complete | Metadata, Open Graph, Twitter, JSON-LD, sitemap, robots are implemented | `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts` |
| 5. Quality & Monitoring | Partial | WebGL error boundary exists; Vercel monitoring exists; broader resilience and explicit vitals alerting are still incomplete | `src/components/backgrounds/WebGLBackground.tsx`, `src/components/ui/ErrorBoundary.tsx`, `src/app/layout.tsx` |

---

## What Is Actually Implemented

### 1. Landing Page & Checkout

Implemented:
- Main marketing page and section assembly in `src/app/page.tsx`
- Stripe checkout session creation in `src/app/api/checkout/route.ts`
- Dedicated success page in `src/app/success/page.tsx`
- Dedicated cancel page in `src/app/cancel/page.tsx`

Notes:
- Checkout now redirects to `/success?session_id=...`, not back to homepage.

### 2. Analytics & Conversion Tracking

Implemented:
- GA4 script injection in `src/app/layout.tsx`
- Vercel Analytics and Speed Insights in `src/app/layout.tsx`
- Central event helpers in `src/lib/analytics.ts`
- Scroll depth tracking on homepage
- Section visibility tracking on homepage
- CTA, booking, scorecard, and purchase events

Notes:
- Legacy homepage purchase-return logic still exists in `src/hooks/useConversionTracking.ts`
- That hook appears stale now that checkout success goes to `/success`

### 3. Lead Capture & Qualification

Implemented:
- Full scorecard lead capture path at `/scorecard`
- Contact capture before scorecard
- Survey/chat completion events
- Lead capture API with GHL sync
- Internal lead notification email via Resend
- Qualification modal for booking a call
- LLM-based qualification endpoint
- Exit-intent modal that routes users into the scorecard flow

Important mismatch:
- `ExitIntentModal` still contains a third survey step and completion handler, but the contact step currently redirects to `/scorecard` before that step is used

Missing or incomplete:
- No clear single primary non-buyer funnel
- No explicit drip sequence orchestration in code
- No lightweight lead magnet opt-in as described in the original roadmap

### 4. SEO & Discoverability

Implemented:
- Metadata title/description
- Open Graph tags
- Twitter card tags
- Canonical URL
- JSON-LD service schema
- `sitemap.xml`
- `robots.txt`

Notes:
- Phase 4 should be treated as complete unless content/keyword work is reopened

### 5. Quality & Monitoring

Implemented:
- Error boundary class exists
- WebGL rendering is wrapped in an error boundary
- Vercel Analytics and Speed Insights are installed

Missing or incomplete:
- No evidence of explicit Web Vitals forwarding, thresholds, or alerting
- Error boundary coverage is narrow and mainly protects WebGL scenes
- No obvious production alert path for checkout failures beyond logs

---

## Current Gaps

### Gap A: Lead Capture Is Split Across Multiple Flows

Current entry points:
- Exit-intent modal
- `/scorecard`
- Booking qualification modal
- Cancel page strategy-call path

Problem:
- These capture intent at different stages, but the ownership of each flow is unclear
- Some logic is duplicated
- The exit-intent modal is internally inconsistent with its current redirect behavior

### Gap B: Phase Docs Understate What Already Exists

Problem:
- The original roadmap says Phase 3 is pending and Phase 5 is mostly pending
- The code shows both are already partially implemented

### Gap C: Monitoring Story Is Not Finished

Problem:
- Instrumentation exists
- Observability strategy is still incomplete
- There is no clear alerting contract for degraded purchase flow or vitals regressions

---

## Recommended Next Work

## Priority 1: Consolidate Lead Capture

Goal:
- Define one canonical non-buyer funnel and make the others feed it cleanly

Tasks:
- Decide whether `/scorecard` is the primary lead capture destination
- Remove dead step logic from `ExitIntentModal` or restore the intended in-modal flow
- Standardize payloads sent to `/api/lead-capture`
- Align qualification-modal outcomes with CRM tags and follow-up expectations

Definition of done:
- One clear funnel architecture
- No dead lead-capture branches
- No duplicate or contradictory UX paths

## Priority 2: Add Actual Nurture/Follow-Up Logic

Goal:
- Finish the missing part of Phase 3

Tasks:
- Define lifecycle tags/states for scorecard lead, qualified lead, booked call, and purchaser
- Add explicit follow-up automation trigger points
- Implement or document drip-sequence handoff

Definition of done:
- Every captured lead enters a known follow-up state
- Email/CRM lifecycle is explicit instead of implied

## Priority 3: Clean Up Analytics Drift

Goal:
- Remove outdated tracking assumptions

Tasks:
- Remove or repurpose `useConversionTracking`
- Verify purchase tracking only fires in the current checkout return path
- Audit event names against actual funnel reporting needs

Definition of done:
- No stale purchase-return code
- Tracking map matches real user journeys

## Priority 4: Finish Quality & Monitoring

Goal:
- Close the remaining operational risk

Tasks:
- Expand error-boundary coverage where failures would blank key user flows
- Add explicit vitals/reporting strategy
- Add checkout-failure alerting or at minimum structured server-side reporting

Definition of done:
- Critical flows degrade safely
- Performance and checkout failures are observable

---

## Proposed Updated Order of Work

1. Lead-capture consolidation
2. Nurture/drip implementation
3. Analytics cleanup
4. Quality and monitoring completion

This order matches the actual codebase better than the original phase sequence.
