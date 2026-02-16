# Roadmap: Rehabit

**Created:** 2026-01-22
**Depth:** Standard
**Phases:** 6
**Requirements:** 45 v1 requirements

## Overview

Rehabit delivers AI-generated personalized meditation content that helps users embody their future self through consistent practice. This roadmap sequences features to validate core value (persona → meditation) before adding complexity, avoiding the 96% retention failure rate of generic meditation apps through habit formation architecture and personally resonant content.

| Phase | Name | Goal | Requirements | Status |
|-------|------|------|--------------|--------|
| 1 | Foundation & Validation | Users can create their Future Self Persona and experience their first personalized meditation | 17 | Pending |
| 2 | Async Pipeline & Engagement | Users experience production-grade content generation with habit-forming progress tracking | 11 | Pending |
| 3 | Multi-Provider & Asset Management | Users benefit from reliable, cost-optimized content generation with surgical re-roll capability | 7 | Pending |
| 4 | Journey Intelligence | Users receive adaptive practice recommendations that evolve their transformation journey | 5 | Pending |
| 5 | Advanced Playback & Personalization | Users enjoy enhanced playback control and multimodal persona enrichment | 5 | Pending |
| 6 | Scale & Polish | System handles production traffic with monitoring, optimization, and cost controls | 0 | Pending |

**Progress:** 0/45 requirements complete (0%)

---

## Phase Details

### Phase 1: Foundation & Validation

**Goal:** Users can create their Future Self Persona through text chat and experience their first personalized meditation with transparent pricing.

**Requirements:**
- AUTH-01, AUTH-02, AUTH-03, AUTH-04
- VPS-01, VPS-04, VPS-05
- GEN-01, GEN-02, GEN-05
- PLAY-01
- PROG-01, PROG-02, PROG-03
- MON-01, MON-03

**Success Criteria:**
1. User can sign up, log in, and maintain session across browser refresh
2. User can describe their future self via text chat with Vision Co-Pilot
3. User can view generated Future Self Persona summary
4. User can see credit cost before requesting meditation generation
5. User sees meditation generation complete (voice + script, audio playback)
6. User can play meditation with basic controls (play/pause/seek)
7. User sees progress tracking (sessions completed, total meditation time)
8. User sees credit balance and understands credit consumption

**Dependencies:** None

**Rationale:** Validates core value proposition (persona → meditation) before investing in complex infrastructure. Research shows overwhelming first-session experience kills apps—this phase delivers friction-free flow from landing to listening in under 60 seconds. Human review of AI scripts ensures authenticity before scale.

**Stack Elements:**
- Next.js 15 App Router + Clerk + Neon + Drizzle
- OpenRouter for LLM (Vision Co-Pilot, script generation)
- ElevenLabs for voice (TTS only, defer music)
- Server Actions (defer job queue until Phase 2)

**Pitfall Prevention:**
- Overwhelming first session: Simple flow (describe → generate → listen)
- Generic content: Human review ensures authenticity
- Credit unpredictability: Show cost upfront, preflight checks
- Vulnerable data: Encryption, anonymization, consent from start

---

### Phase 2: Async Pipeline & Engagement

**Goal:** Users experience production-grade async content generation with real-time progress updates and habit-forming engagement features.

**Requirements:**
- GEN-03, GEN-06
- PLAY-02, PLAY-03, PLAY-04, PLAY-05
- PROG-04, PROG-05, PROG-06
- MON-02, MON-04
- INF-01, INF-02

**Success Criteria:**
1. User sees real-time progress during 30-120s generation workflow (script → voice → music → composition)
2. User hears meditation with music/soundscape integrated (not just voice)
3. User can switch to audio-only mode and download for offline use
4. User can continue playback when app is minimized (background audio)
5. User can log mood before and after meditation, see mood trends over time
6. User can purchase subscription or credit packs via payment processor
7. User experiences no timeout errors during long-running generation jobs

**Dependencies:** Phase 1

**Rationale:** Phase 1 proves users want personalized meditations. Phase 2 adds production-grade infrastructure to handle concurrent generations and real costs. Research shows retention requires habit formation—adds streak mechanics, mood tracking, and engagement features.

**Stack Elements:**
- BullMQ + Upstash Redis (job queue for async generation)
- WebSocket + Redis Pub/Sub (real-time progress updates)
- Mubert or Suno (music generation)
- Stripe (subscription and credit purchase)
- FFmpeg (audio composition: voice + music layering)

**Architecture Components:**
- Content Pipeline: Job queue with dedicated workers per asset type
- Real-Time Updates: WebSocket broadcasting via Redis pub/sub
- Audio Composition: FFmpeg worker combines voice + music

**Pitfall Prevention:**
- Async orchestration failures: Fallback strategies, timeouts, circuit breakers
- Wait time abandonment: WebSocket progress updates, engaging loading states
- Retention failure: Habit formation (mood tracking, streak visibility)
- Cost spikes: Monitoring with alerts, cost controls

---

### Phase 3: Multi-Provider & Asset Management

**Goal:** Users benefit from reliable, cost-optimized content generation with the ability to surgically regenerate individual components.

**Requirements:**
- VPS-06
- MON-05, MON-06, MON-07
- LIB-01, LIB-02, LIB-03, LIB-04, LIB-05
- INF-03, INF-04

**Success Criteria:**
1. User can refine their Future Self Persona through additional chat conversations
2. User can request partial re-roll (regenerate voice only, keeping music/visuals)
3. User can request full re-roll (regenerate entire meditation)
4. System debits appropriate credits (partial = 1, full = 10) automatically
5. User experiences automatic fallback when primary provider fails (no visible error)
6. System maintains asset relationships so re-rolls preserve composition coherence

**Dependencies:** Phase 2

**Rationale:** Phase 2 proves async pipeline works with single provider. Phase 3 adds provider abstraction to prevent vendor lock-in and enables surgical re-rolls (core differentiator). Research shows provider price changes and outages are existential risks—multi-provider from architecture level.

**Stack Elements:**
- Provider abstraction layer (Strategy pattern + registry)
- Fish Audio (alternative voice provider, 15x cheaper at scale)
- Suno (alternative music provider for personalized soundtracks)
- S3 + CloudFront (asset storage and CDN)

**Architecture Components:**
- Provider Abstraction Layer: Interface + registry + implementations
- Asset Library: Rich metadata with relationships graph
- Credit System: Event-driven ledger with idempotency

**Pitfall Prevention:**
- Single-provider lock-in: Abstraction enables switching without code changes
- Rate limit blind spots: Multi-provider spreads load, fallback prevents outages
- Context loss: Asset relationships maintain composition coherence

---

### Phase 4: Journey Intelligence

**Goal:** Users receive adaptive practice recommendations driven by Journey Co-Pilot's understanding of engagement patterns and transformation progress.

**Requirements:**
- JRN-01, JRN-02, JRN-03, JRN-04, JRN-05

**Success Criteria:**
1. Vision Co-Pilot guides user through structured persona-building chat (not just freeform)
2. Journey Co-Pilot tracks engagement patterns (login frequency, play completions, session timing)
3. Journey Co-Pilot prompts user for insights and feedback at optimal moments
4. System applies subtle variations to content (timing adjustments, music changes, animation)
5. Personalized home screen recommends next session based on history, mood trends, and time of day

**Dependencies:** Phase 2 (requires engagement data), Phase 3 (requires asset library for variations)

**Rationale:** Phases 1-3 deliver complete content generation pipeline. Phase 4 adds intelligence layer that prevents the 96% retention failure by adapting practice to user behavior. Research shows active engagement (not passive listening) drives transformation outcomes.

**Stack Elements:**
- LangChain or CrewAI (multi-agent orchestration)
- PostgreSQL (conversation state, engagement metrics)
- OpenRouter with GPT-4 or Claude (agent reasoning)

**Architecture Components:**
- Agent System: Vision Co-Pilot + Journey Co-Pilot with shared context
- Engagement Analytics: Pattern detection, optimal timing algorithms
- Variation Engine: Surgical content adjustments based on asset library

**Pitfall Prevention:**
- Overwhelming variations: Quality over quantity, curated progression not buffet
- Generic recommendations: Based on user's actual behavior, not population averages
- Retention failure: Accountability partner approach, not content buffet

---

### Phase 5: Advanced Playback & Personalization

**Goal:** Users enjoy enhanced playback control and can enrich their persona with voice and image capture for future personalization features.

**Requirements:**
- VPS-02, VPS-03
- MON-08
- INF-05

**Success Criteria:**
1. User can record video during vision chat (captures voice + image for future use)
2. User can upload images during vision chat (captures visual references)
3. Admin can issue coupon/gift credits to users for promotional campaigns
4. System tracks cost per generation for unit economics visibility
5. Captured media is stored securely for future v2 features (voice cloning, user image in visuals)

**Dependencies:** Phase 1 (requires basic persona system)

**Rationale:** Phases 1-4 deliver complete v1 experience. Phase 5 adds infrastructure for future personalization (voice cloning, user image in AI visuals) without exposing those features yet. Research shows multimodal capture increases persona richness but isn't MVP blocker.

**Stack Elements:**
- Deepgram or AssemblyAI (voice transcription)
- OpenAI Vision (image analysis)
- S3 (secure media storage with lifecycle policies)

**Architecture Components:**
- Multimodal Capture: Video/voice recording with metadata extraction
- Admin Tools: Credit management interface
- Cost Tracking: Per-generation economics dashboard

**Pitfall Prevention:**
- Vulnerable data: Encryption at rest, strict access controls for captured media
- Cost blindness: Visibility into unit economics before scaling

---

### Phase 6: Scale & Polish

**Goal:** System handles production traffic with monitoring, horizontal scaling, and cost optimization ready for growth.

**Requirements:** None (infrastructure improvements)

**Success Criteria:**
1. System handles 100+ concurrent generation jobs without degradation
2. Monitoring dashboard shows job failure alerts, cost tracking, provider health
3. Horizontal scaling configured for workers (multiple instances behind load balancer)
4. CDN optimized for asset delivery (CloudFront or similar)
5. Advanced analytics track practice patterns, optimal meditation times, retention cohorts

**Dependencies:** Phases 1-5 (requires production traffic to validate scaling)

**Rationale:** Phases 1-5 deliver complete feature set. Phase 6 ensures system can scale to growth without performance degradation. Research shows most apps fail from premature optimization—defer scaling until traffic validates need.

**Stack Elements:**
- Kubernetes or Docker Swarm (worker scaling)
- CloudFront CDN (asset delivery optimization)
- DataDog or New Relic (monitoring and observability)
- Horizontal scaling patterns (multiple workers, Redis Pub/Sub)

**Architecture Components:**
- Horizontal Scaling: Multiple workers behind load balancer
- Monitoring: Provider health, job queue status, cost alerts
- Admin Dashboard: System health visibility

**Pitfall Prevention:**
- Premature optimization: Build when traffic validates need, not before
- Cost spikes: Alerts configured before scaling production traffic
- Blind spots: Comprehensive monitoring reveals issues early

---

## Progress Tracking

| Phase | Plans | Completed | In Progress | Blocked | Status |
|-------|-------|-----------|-------------|---------|--------|
| 1 - Foundation & Validation | 0 | 0 | 0 | 0 | Pending |
| 2 - Async Pipeline & Engagement | 0 | 0 | 0 | 0 | Pending |
| 3 - Multi-Provider & Asset Management | 0 | 0 | 0 | 0 | Pending |
| 4 - Journey Intelligence | 0 | 0 | 0 | 0 | Pending |
| 5 - Advanced Playback & Personalization | 0 | 0 | 0 | 0 | Pending |
| 6 - Scale & Polish | 0 | 0 | 0 | 0 | Pending |

**Overall:** 0/45 requirements complete (0%)

---

## Research Flags

**Phases needing research-phase during planning:**
- **Phase 2:** Compare voice/music provider quality and costs (ElevenLabs vs Fish vs OpenAI TTS, Suno vs Mubert) - Need A/B testing with real meditation content
- **Phase 2:** Load testing with realistic generation volumes - Validate BullMQ configuration (worker count, concurrency, queue priorities)
- **Phase 2:** Pricing model testing - Subscription vs credits vs hybrid, what feels fair to users
- **Phase 3:** FFmpeg composition techniques - Meditation-specific audio mixing (ducking, crossfade timings for calm transitions)

**Phases with standard patterns (skip research-phase):**
- **Phase 1:** Next.js + Clerk + Neon + OpenRouter - Established patterns, extensive documentation
- **Phase 3:** Provider abstraction layer - Strategy pattern well-documented
- **Phase 6:** Horizontal scaling - Docker Swarm and Kubernetes patterns mature

---

*Last updated: 2026-01-22*
*Next step: `/gsd:plan-phase 1`*
