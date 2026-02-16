# Requirements: Rehabit

**Defined:** 2025-01-22
**Core Value:** Every interaction produces something personally resonant that helps the user embody their future self through practice

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can create account with email and password
- [ ] **AUTH-02**: User can log in and maintain session across browser refresh
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: User can save and retrieve profile preferences

### Vision Projection System (VPS)

- [ ] **VPS-01**: User can describe future self via text chat with Vision Co-Pilot
- [ ] **VPS-02**: User can record video during vision chat (captures voice + image)
- [ ] **VPS-03**: User can upload images during vision chat
- [ ] **VPS-04**: System extracts structured Future Self Persona from chat
- [ ] **VPS-05**: User can view their persona summary
- [ ] **VPS-06**: User can refine/edit their persona through additional chat

### Content Generation

- [ ] **GEN-01**: System generates meditation/affirmation script from persona
- [ ] **GEN-02**: System generates voice narration from script (TTS)
- [ ] **GEN-03**: System generates or selects music/soundscape for meditation
- [ ] **GEN-04**: System generates visual imagery aligned with persona vision
- [ ] **GEN-05**: System composes voice + music + visuals into playable video
- [ ] **GEN-06**: System shows progress during generation (async workflow)

### Playback & Media

- [ ] **PLAY-01**: User can play composed meditation video with controls (play/pause/seek)
- [ ] **PLAY-02**: User can switch to audio-only mode
- [ ] **PLAY-03**: User can download audio for offline use
- [ ] **PLAY-04**: Audio continues playing when app is minimized (background playback)
- [ ] **PLAY-05**: User can adjust volume and playback speed

### Progress & Engagement

- [ ] **PROG-01**: System tracks total sessions completed
- [ ] **PROG-02**: System tracks total meditation time
- [ ] **PROG-03**: User sees personalized home screen with suggested next session
- [ ] **PROG-04**: User can log mood before meditation
- [ ] **PROG-05**: User can log mood after meditation
- [ ] **PROG-06**: System shows mood trends over time

### Monetization & Credits

- [ ] **MON-01**: System supports subscription tiers (Basic, Premium)
- [ ] **MON-02**: User can purchase subscription via payment processor
- [ ] **MON-03**: System tracks credit balance per user
- [ ] **MON-04**: User can purchase credit packs
- [ ] **MON-05**: User can request partial re-roll (single element: voice, music, or visual)
- [ ] **MON-06**: User can request full re-roll (regenerate entire meditation)
- [ ] **MON-07**: System debits appropriate credits for re-rolls (partial = 1, full = 10)
- [ ] **MON-08**: Admin can issue coupon/gift credits to users

### Journey Co-Pilot

- [ ] **JRN-01**: Vision Co-Pilot guides user through persona building chat
- [ ] **JRN-02**: Journey Co-Pilot tracks user engagement patterns (logins, plays, completions)
- [ ] **JRN-03**: Journey Co-Pilot prompts user for insights and feedback
- [ ] **JRN-04**: System can apply subtle variations to content (timing, music, animation)
- [ ] **JRN-05**: Journey Co-Pilot recommends next session based on engagement and mood

### Asset Library (Backend)

- [ ] **LIB-01**: System stores generated voice assets with metadata
- [ ] **LIB-02**: System stores generated music assets with metadata
- [ ] **LIB-03**: System stores generated visual assets with metadata
- [ ] **LIB-04**: System tracks composition relationships (which assets form which meditation)
- [ ] **LIB-05**: System can retrieve individual components for re-composition

### Infrastructure

- [ ] **INF-01**: Async job queue handles long-running generation tasks
- [ ] **INF-02**: WebSocket provides real-time progress updates during generation
- [ ] **INF-03**: Provider abstraction layer enables swapping AI services
- [ ] **INF-04**: System handles provider failures with fallbacks
- [ ] **INF-05**: Cost tracking per generation for unit economics visibility

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Voice Personalization

- **VOICE-01**: User can clone their own voice from captured audio
- **VOICE-02**: User can hear meditation in their own cloned voice

### Visual Personalization

- **VIS-01**: User can include their own image in generated visuals
- **VIS-02**: System generates scenes featuring user's likeness

### Asset Library UI

- **LIBUI-01**: User can browse their generated asset library
- **LIBUI-02**: User can manually select assets for new compositions

### Multi-Project

- **PROJ-01**: Premium users can create multiple Vision Projects
- **PROJ-02**: User can switch between Vision Projects

### Advanced Engagement

- **ENG-01**: Streak tracking with loss aversion mechanics
- **ENG-02**: Milestone celebrations (7 days, 30 days, etc.)
- **ENG-03**: Weekly progress summary emails

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Social media integration | Research shows meditation users explicitly don't want this |
| Community forums/feeds | Private transformation journey, not social platform |
| Leaderboards | Gamification conflicts with meditation philosophy |
| Live teacher calls | High complexity, not core to AI personalization value |
| Native mobile apps | PWA first; native deferred until PWA proves insufficient |
| Extensive pre-built library | AI generation is the differentiator, not content breadth |
| Real-time voice chat | Async generation sufficient for v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| VPS-01 | Phase 1 | Pending |
| VPS-02 | Phase 5 | Pending |
| VPS-03 | Phase 5 | Pending |
| VPS-04 | Phase 1 | Pending |
| VPS-05 | Phase 1 | Pending |
| VPS-06 | Phase 3 | Pending |
| GEN-01 | Phase 1 | Pending |
| GEN-02 | Phase 1 | Pending |
| GEN-03 | Phase 2 | Pending |
| GEN-04 | Deferred (v2+) | Pending |
| GEN-05 | Phase 1 | Pending |
| GEN-06 | Phase 2 | Pending |
| PLAY-01 | Phase 1 | Pending |
| PLAY-02 | Phase 2 | Pending |
| PLAY-03 | Phase 2 | Pending |
| PLAY-04 | Phase 2 | Pending |
| PLAY-05 | Phase 2 | Pending |
| PROG-01 | Phase 1 | Pending |
| PROG-02 | Phase 1 | Pending |
| PROG-03 | Phase 1 | Pending |
| PROG-04 | Phase 2 | Pending |
| PROG-05 | Phase 2 | Pending |
| PROG-06 | Phase 2 | Pending |
| MON-01 | Phase 1 | Pending |
| MON-02 | Phase 2 | Pending |
| MON-03 | Phase 1 | Pending |
| MON-04 | Phase 2 | Pending |
| MON-05 | Phase 3 | Pending |
| MON-06 | Phase 3 | Pending |
| MON-07 | Phase 3 | Pending |
| MON-08 | Phase 5 | Pending |
| JRN-01 | Phase 4 | Pending |
| JRN-02 | Phase 4 | Pending |
| JRN-03 | Phase 4 | Pending |
| JRN-04 | Phase 4 | Pending |
| JRN-05 | Phase 4 | Pending |
| LIB-01 | Phase 3 | Pending |
| LIB-02 | Phase 3 | Pending |
| LIB-03 | Phase 3 | Pending |
| LIB-04 | Phase 3 | Pending |
| LIB-05 | Phase 3 | Pending |
| INF-01 | Phase 2 | Pending |
| INF-02 | Phase 2 | Pending |
| INF-03 | Phase 3 | Pending |
| INF-04 | Phase 3 | Pending |
| INF-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 45 total
- Mapped to phases: 44
- Deferred (v2+): 1 (GEN-04: Visual imagery generation - high cost, defer until audio validated)
- Unmapped: 0 ✓

**Phase Distribution:**
- Phase 1: 17 requirements
- Phase 2: 11 requirements
- Phase 3: 7 requirements
- Phase 4: 5 requirements
- Phase 5: 5 requirements
- Phase 6: 0 requirements (infrastructure improvements)

---
*Requirements defined: 2025-01-22*
*Last updated: 2026-01-22 after roadmap creation*
