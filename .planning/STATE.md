# Project State: Rehabit

**Last Updated:** 2026-01-22

## Current Position

**Phase:** Not started
**Status:** Ready for Phase 1 planning
**Last Activity:** Roadmap created with 6 phases covering 45 v1 requirements

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-22)

**Core value:** Every interaction produces something personally resonant that helps the user embody their future self through practice — not generic meditation content.

**Current focus:** Foundation & Validation (Phase 1)

**Target:** Users can create their Future Self Persona and experience their first personalized meditation with transparent pricing.

## Progress Overview

```
[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%

Phase 1: Foundation & Validation          [Pending]
Phase 2: Async Pipeline & Engagement      [Pending]
Phase 3: Multi-Provider & Asset Mgmt      [Pending]
Phase 4: Journey Intelligence             [Pending]
Phase 5: Advanced Playback & Personalization [Pending]
Phase 6: Scale & Polish                   [Pending]
```

| Phase | Status | Plans | Requirements | Completion |
|-------|--------|-------|--------------|------------|
| 1 - Foundation & Validation | Pending | 0/? | 17 | 0% |
| 2 - Async Pipeline & Engagement | Pending | 0/? | 11 | 0% |
| 3 - Multi-Provider & Asset Management | Pending | 0/? | 7 | 0% |
| 4 - Journey Intelligence | Pending | 0/? | 5 | 0% |
| 5 - Advanced Playback & Personalization | Pending | 0/? | 5 | 0% |
| 6 - Scale & Polish | Pending | 0/? | 0 | 0% |

**Overall:** 0/45 requirements complete (0%)

## Performance Metrics

**Velocity:** N/A (no plans executed yet)

**Blockers resolved:** 0
**Plans completed:** 0
**Days active:** 1

## Recent Decisions

| Date | Decision | Rationale | Impact |
|------|----------|-----------|--------|
| 2026-01-22 | Full v1 scope (45 requirements) | User confirmed all features essential for launch | Complete roadmap coverage |
| 2026-01-22 | 6-phase structure | Standard depth (5-8 phases), derived from natural requirement clusters | Clear delivery boundaries |
| 2026-01-22 | Audio-only in Phase 1-2, defer video to later | Control costs, validate core value before expensive video generation | Faster MVP, lower risk |
| 2026-01-22 | Human review of AI scripts in Phase 1 | Prevent generic content pitfall before scale | Quality over automation speed |
| 2026-01-22 | Multi-provider abstraction in Phase 3 | Research shows provider lock-in is existential risk | Flexibility for cost/quality optimization |

## Accumulated Context

### Key Insights
- Meditation apps face 96% retention failure after 30 days — habit formation architecture more critical than content volume
- Each meditation costs $0.35-$4.65 in provider fees — unit economics require careful validation before scale
- Generation takes 30-120s (voice 10-30s, music 1-2min, video 3-5min) — async job queues non-negotiable from day 1
- Research shows users explicitly DON'T want social features, extensive content libraries cause paralysis
- "Believable imperfection" in AI voice prevents uncanny valley — technical perfection less important than emotional resonance

### Technical Constraints
- Next.js 15 App Router with Server Components
- Model-agnostic architecture (OpenRouter for LLM routing)
- Provider abstraction layer for all AI services (voice, music, video)
- Credit system with idempotency (prevent double-charging during retries)
- Async job queue (BullMQ) required for generation workflows
- WebSocket real-time updates during 30-120s generation

### Business Constraints
- Full markup from day 1, gift/coupon credits for early adopters
- 1 Vision Project per basic account (forces focus)
- Partial re-roll cheaper than full (encourages surgical changes)
- Ship as soon as possible, no hard deadline but speed matters

## Active TODOs

### Immediate (Next Session)
- [ ] Plan Phase 1: Foundation & Validation (17 requirements)
- [ ] Set up project repository structure
- [ ] Consult privacy lawyer re: GDPR/HIPAA compliance before building (mental health data)
- [ ] Consult meditation teachers re: safety protocols (psychological harm prevention)

### Upcoming (This Phase)
- [ ] Calculate exact unit economics with real provider costs
- [ ] Design friction-free onboarding flow (landing → listening in <60s)
- [ ] Prototype Vision Co-Pilot conversation flow
- [ ] Define human review process for AI-generated scripts

### Deferred (Later Phases)
- [ ] A/B test pricing models (subscription vs credits vs hybrid) — Phase 2
- [ ] FFmpeg composition research for meditation-specific audio mixing — Phase 3
- [ ] Load testing with realistic generation volumes — Phase 2
- [ ] User testing for video necessity validation — Phase 4+

## Known Blockers

None currently.

## Session Continuity

**Last session:** 2026-01-22
**Context:**
- Project initialized with PROJECT.md, REQUIREMENTS.md (45 v1 requirements), research/SUMMARY.md
- Roadmap created with 6 phases following research recommendations
- Phase 1 targets: 17 requirements covering auth, persona creation, basic generation, playback, progress tracking, credits
- Research identified critical pitfalls: generic AI content, async orchestration failures, credit unpredictability, overwhelming onboarding, 96% retention failure

**Next session:**
- Run `/gsd:plan-phase 1` to decompose Phase 1 into executable plans
- Expected 3-5 plans (standard depth) covering: auth setup, Vision Co-Pilot, content generation, playback, monetization foundation

**Context for continuity:**
- User wants personally resonant meditation content (not generic)
- Core flow: Chat → Persona → Script → Voice → Compose → Play
- Asset library hidden in v1, backend ready for future surgical re-rolls
- Journey Co-Pilot manages practice evolution with subtle variations

---

*State maintained by: /gsd orchestrator*
*Format: STATE.md v1.0*
