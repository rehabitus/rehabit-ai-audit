# Rehabit

## What This Is

A web app where users describe their ideal future self and AI generates personalized meditation/affirmation content to help them embody that vision through consistent practice. Users chat with the app (text + optional video/voice capture), the system builds a Future Self Persona, generates a tailored script with voice, music, and visuals, and composes these into a playable meditation video. The focus is on building a transformation practice with subtle novelty to maintain engagement — personally resonant content, never generic.

## Core Value

Every interaction produces something personally resonant that helps the user embody their future self through practice — not generic meditation content.

## Core Systems

### VPS (Vision Projection System)
The user's Clear Vision / Future Self Persona. Captures attributes, values, challenges overcome, and the vision of who they're becoming. One Vision Project per basic account. Can be refined but represents the singular vision they're working toward.

### CoSM (Conscious State Management System)
The practice engine that produces meditation content. Generates scripts, assets, and composed products. Manages the asset library for remixing. Goal: get user "In-State" — gratitude, elevated emotions, alignment, embodiment.

### Vision Co-Pilot
Agent that helps build and refine the vision through the initial chat experience. Hybrid approach: starts open, probes for gaps, captures rich media (video/voice) for future use. Optimizes for getting user to "wow" moment as fast as possible while capturing complete context.

### Journey Co-Pilot
Agent that guides the practice over time. Tracks engagement (login frequency, product plays, user feedback), decides variations, prompts for insights. Manages the balance between novelty (helps transformation) and consistency (builds practice). Aware of account status, subscription level, credits.

## Core Flow

1. **Chat** — User describes future self via multimodal chat (text + video/voice capture)
2. **Persona** — System builds Future Self Persona (VPS)
3. **Script** — System generates meditation/affirmation script tailored to persona
4. **Assets** — System generates voice (narrator), music, visuals (symbols/scenes from vision)
5. **Compose** — System assembles into playable meditation video

User receives video (richest format) with option for audio-only playback/download.

## Asset Library

Component assets (voice clips, music, visuals) stored for remixing into future "rolls." Hidden from user in v1 but architecturally present. Enables surgical variations without full re-generation.

## Variation Philosophy

Subtle changes maintain engagement without losing the practice thread:
- Re-order lines in timeline
- Adjust spacing (3s vs 5s between affirmations)
- Change/animate visuals differently
- Re-roll music
- Change voice

Full re-rolls are rare — prompt user for insights and adapt accordingly. The point is building consistent practice, not novelty for novelty's sake.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Multimodal chat experience (text + video/voice capture)
- [ ] Future Self Persona generation and storage
- [ ] Script generation from persona
- [ ] Voice generation (narrator voice)
- [ ] Music generation
- [ ] Visual generation (symbols/scenes from vision)
- [ ] Video composition from assets
- [ ] Audio-only playback/download option
- [ ] Asset library (backend, hidden from user)
- [ ] Partial re-rolls (single element)
- [ ] Full re-rolls
- [ ] Credit system with consumption tracking
- [ ] Subscription tiers
- [ ] User authentication
- [ ] Vision Project management (1 per basic account)
- [ ] Coupon/gift credit mechanism

### Out of Scope

- Voice cloning (user's own voice) — v2, capture infrastructure ready
- User image in AI visuals — v2, capture infrastructure ready
- Exposed asset library UI — v2, backend ready
- Multiple Vision Projects on basic tier — premium feature
- Mobile app — web-first

## Context

**Target user:** People seeking personal transformation who want to build a consistent meditation/visualization practice with content that actually feels personal to their journey.

**Problem being solved:** Generic meditation apps don't connect to your specific vision. Affirmations feel hollow when they're not yours. This creates personally resonant content from your own articulated future self.

**Differentiator:** The content speaks to YOUR specific vision, generated from YOUR words, potentially in YOUR voice (v2). Practice management with intelligent variation keeps engagement without losing the thread.

## Constraints

- **Tech stack**: Next.js/React for web app
- **Auth**: Managed authentication (Clerk, Supabase Auth, or similar)
- **Architecture**: Model-agnostic asset generation — must swap providers without touching core logic
- **LLM routing**: OpenRouter with dynamic routing based on quality needs vs cost
- **Voice providers**: ElevenLabs primary, open source fallbacks for cost reduction
- **Music providers**: Suno/Mubert/Mureka, open source options
- **Video providers**: Kling and others, swappable
- **Timeline**: Ship as soon as possible, no hard deadline but speed matters
- **Pricing**: Full markup from day 1, gift/coupon credits for early adopters

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Narrator voice for v1 (not cloned) | Simplest path to value, voice cloning is v2 | — Pending |
| AI-generated scenes/symbols for v1 (not user image) | Reduce complexity, user image is v2 | — Pending |
| Hidden asset library | Backend complexity now, expose UI later when UX is clear | — Pending |
| Model-agnostic architecture | Must swap providers for cost/quality optimization | — Pending |
| Credit system from day 1 | Validate willingness to pay early, gift credits for early adopters | — Pending |
| 1 Vision Project on basic | Forces focus, premium unlocks multiple | — Pending |
| Partial re-roll cheaper than full | Encourages surgical changes over wholesale regeneration | — Pending |

---
*Last updated: 2025-01-22 after initialization*
