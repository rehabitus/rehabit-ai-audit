# Twin Page Plan

## Purpose

This document is the working plan for `/twin`, the isolated clone of `/fast`.

Primary goal:
- keep `/twin` fully decoupled from `/fast`, `/`, and the other cloned pages

Secondary goal:
- use `/twin` as the future light-style variant where design and copy can diverge aggressively without affecting the original version

Current content goal:
- make `/twin` longer and more narrative-driven
- keep the existing sections in place for now
- add new storytelling sections below the current structure
- later decide which older sections should be hidden or removed

## Current Route

- Route: `/twin`
- Entry file: `src/app/twin/page.tsx`
- Versioned components: `src/components/versions/twin/`

## Section Inventory

This is the current page structure, organized by content/concept rather than only by component name.

1. Header / Sticky Nav
- Brand mark
- Trust strip in nav
- Primary nav CTA

2. Hero
- Main headline
- Supporting subheadline
- Video / visual proof
- Primary CTA
- Guarantee line
- Trust bar

3. Problem
- Pain framing
- Revenue leak / friction bullets
- Testimonial-style proof card

4. Why Now / Bridge
- Urgency bridge
- Why this matters now
- Context-setting bullets

5. Offer
- What the audit includes
- Offer framing cards
- Scope / audit areas

6. Outcomes
- Before/after framing
- Expected outcomes
- Metrics / stats / performance proof

7. Deliverables
- What the buyer receives
- Audit outputs
- Deliverable cards / assets

8. Mid-Page CTA
- Short conversion block
- Restated value
- CTA for high-intent visitors

9. Process
- How the engagement works
- Sequence / steps
- What happens after purchase

10. Trust / Social Proof
- Credibility narrative
- Featured people / brands
- Results snapshots
- Testimonials

11. Pricing
- Offer price
- Founding / limited-window framing
- Included items
- Scarcity / review count / next-price logic
- Guarantee
- CTA

12. FAQ
- Objection handling
- Practical buying questions
- Risk-reduction answers

13. Final CTA
- Closing conversion block
- Urgency + guarantee reinforcement
- Final purchase action

14. Trustpilot Block
- External review widget

15. Footer
- Language switcher
- Copyright / footer info

16. Exit Intent Modal
- Lead capture / interruption recovery
- Alternative conversion path

## Future Storytelling Sections

These are the planned long-form narrative sections to add below the existing `/twin` structure before we decide what from the old structure gets hidden or removed.

1. The Hook
- Headline
- Callout
- Pattern interrupt

2. The Problem
- The Industrial Age Lie
- The burnout trap

3. The Shift
- Welcome to the Intelligence Age

4. The Rehabit Method
- Three Habits of Transformation

5. Agency & Agents
- Reclaiming your power through AI

6. What an Agent Actually Is
- Anatomy of an AI agent

7. What This Is NOT
- Clearing misconceptions

8. The Identity Shift
- From consumer to conscious creator

9. Who This Is For
- The 4C Coach

10. The Digital Twin
- The heart of every system

11. Social Proof
- Mike's story
- Credentials
- Results

12. The Value Stack
- What you get with this offer

13. Prime Pricing & The Offer
- Launch pricing
- What's included

14. The Guarantee
- Zero-risk
- Unconditional

15. The Bigger Vision
- Post-labor economics
- Purpose
- The first wave

16. The Close
- Final CTA

## Transition Approach

For now, `/twin` should follow this transition plan:

- keep the current cloned `/fast` section structure
- append the new storytelling sections below the current structure
- use the storytelling sequence as the new long-form direction for `/twin`
- after review, identify which existing sections should be hidden, merged, rewritten, or removed
- do not delete old sections until those choices are explicitly made

## Non-Visual Shared Infrastructure

These are not page sections, but they affect behavior and should be tracked as part of the page.

- Scroll depth tracking
- Section view tracking
- Conversion tracking
- Checkout integration
- Pricing API usage
- Language context / translations

## Checklist

### Isolation / Architecture

- [x] Create `/twin` route
- [x] Clone `/fast` into `src/components/versions/twin/`
- [x] Point `/twin` only to twin versioned components
- [ ] Audit for any remaining shared editable UI dependencies
- [ ] Decide whether any shared hooks or behaviors should also be isolated later
- [ ] Rename twin-internal component names for clarity if needed

### Design

- [x] Establish initial light-style baseline
- [ ] Define final visual direction for `/twin`
- [ ] Pick final color system for light mode
- [ ] Refine typography hierarchy
- [ ] Refine section spacing and rhythm
- [ ] Refine card surfaces, borders, and shadows
- [ ] Restyle modal flows to match the twin aesthetic
- [ ] Verify mobile polish and responsiveness

### Copy

- [ ] Review every section for purpose and conversion role
- [ ] Decide what copy stays from `/fast`
- [ ] Decide what copy is rewritten for `/twin`
- [ ] Map old sections to new storytelling sections
- [ ] Decide which old sections stay visible during the transition
- [ ] Decide which old sections should be hidden or removed
- [ ] Tighten headline and subheadline
- [ ] Rework CTA copy hierarchy
- [ ] Rework pricing framing if needed
- [ ] Rework FAQ to match the twin angle
- [ ] Write the new long-form storytelling sequence

### CRO / Strategy

- [ ] Confirm target audience for `/twin`
- [ ] Confirm whether `/twin` is an A/B variant or a net-new positioning page
- [ ] Decide the primary conversion goal
- [ ] Decide whether the exit-intent modal should remain the same
- [ ] Decide whether pricing and guarantee framing should differ from `/fast`

### QA

- [ ] Run full build once unrelated repo lint issues are resolved
- [ ] Test `/twin` route locally
- [ ] Verify checkout CTA behavior
- [ ] Verify analytics events still fire correctly
- [ ] Verify no edits to `/twin` affect `/fast`
- [ ] Verify no orphan/widow issues in final copy

### Git / Release

- [ ] Commit isolated `/twin` clone work
- [ ] Push to `main`
- [ ] Confirm Vercel deployment
- [ ] Review live `/twin` page after deploy

## Notes

- `/twin` should remain a zero-dependency page clone in the sense defined by `AGENTS.md`: edits to its versioned sections and UI must not change `/fast` or `/`.
- Design and copy are intentionally deferred for a later pass.
