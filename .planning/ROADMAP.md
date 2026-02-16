# Roadmap: Audit.Rehabit.biz

**Last Updated:** 2026-02-16

## Phase Overview

| Phase | Name | Requirements | Status |
|-------|------|-------------|--------|
| 1 | Landing Page & Checkout | REQ-01 through REQ-31 | Complete |
| 2 | Analytics & Conversion Tracking | REQ-32 through REQ-34 | Pending |
| 3 | Lead Capture & Qualification | REQ-35, REQ-36 | Pending |
| 4 | SEO & Discoverability | REQ-37 through REQ-39 | Pending |
| 5 | Quality & Monitoring | REQ-40, REQ-41 | Pending |

---

## Phase 1: Landing Page & Checkout (Complete)

**Goal:** Ship a production-ready sales page that drives Stripe conversions.

**Delivered:**
- 11-section sales page with full copy and responsive layout
- Stripe checkout integration ($1,200 AI Transformation Audit)
- 3 WebGL background scenes with mobile CSS fallbacks
- Framer Motion scroll animations across all sections
- Trustpilot review widget
- Dark theme design system with brand colors
- Deployed to Vercel

---

## Phase 2: Analytics & Conversion Tracking

**Goal:** Understand visitor behavior and measure conversion funnel performance.

**Requirements:** REQ-32, REQ-33, REQ-34

**Scope:**
- Add analytics provider (Google Analytics 4 or Vercel Analytics)
- Track CTA clicks, scroll depth, section visibility, and time on page
- Build a Stripe success page with conversion confirmation and next steps
- Set up conversion goals and funnel visualization

**Success Criteria:** Can answer "what % of visitors click CTA?" and "where do visitors drop off?"

---

## Phase 3: Lead Capture & Qualification

**Goal:** Capture leads who aren't ready to buy immediately and qualify serious prospects.

**Requirements:** REQ-35, REQ-36

**Scope:**
- Email capture component (e.g., "Get the free AI Readiness Checklist")
- Pre-checkout qualification form (business type, revenue range, pain points)
- Integration with email service (SendGrid, Resend, or similar)
- Drip sequence for captured leads

**Success Criteria:** Visitors who don't buy can still enter the funnel via email capture.

---

## Phase 4: SEO & Discoverability

**Goal:** Improve organic search visibility and social sharing.

**Requirements:** REQ-37, REQ-38, REQ-39

**Scope:**
- Open Graph and Twitter Card meta tags
- JSON-LD structured data for the audit service
- Generate sitemap.xml and robots.txt
- Review page title, description, and heading hierarchy for SEO

**Success Criteria:** Page renders rich previews on social platforms and appears in relevant search results.

---

## Phase 5: Quality & Monitoring

**Goal:** Ensure resilience and track performance in production.

**Requirements:** REQ-40, REQ-41

**Scope:**
- React error boundaries wrapping key sections and WebGL components
- Vercel Analytics or Web Vitals reporting
- Monitor LCP, FID, CLS scores
- Alert on checkout API errors

**Success Criteria:** No white-screen crashes; Core Web Vitals in "Good" range.
