# Technology Stack Research: Rehabit

**Project:** AI-powered personalized meditation/transformation practice web app
**Researched:** 2025-01-22
**Overall Confidence:** HIGH

## Executive Summary

For an AI-powered meditation app generating personalized multimedia content (voice, music, video), the 2025 standard stack prioritizes:

1. **Next.js 15 App Router** with TypeScript for full-stack development
2. **Managed services** for auth, database, and async jobs to minimize operational overhead
3. **Model-agnostic architecture** via OpenRouter for AI flexibility
4. **Specialized APIs** for each asset type (voice, music, video) with fallback strategies
5. **Serverless-first infrastructure** optimized for variable workloads

**Key Architectural Decision:** Use job queues (BullMQ) for all asset generation to handle long-running API calls (20s-5min) without blocking user requests.

---

## Frontend Stack

### Core Framework

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Next.js** | 15.5+ | Full-stack framework | Industry standard for React SSR/SSG. App Router is production-ready with React Server Components, Turbopack (66% faster builds), and native streaming. **Confidence: HIGH** |
| **React** | 19+ | UI library | Ships with Next.js 15. Server Components reduce client bundle size for content-heavy meditation app. **Confidence: HIGH** |
| **TypeScript** | 5.7+ | Type safety | Essential for tRPC end-to-end type safety and reducing runtime errors in AI integrations. **Confidence: HIGH** |

**Sources:**
- [Next.js 15 Best Practices](https://strapi.io/blog/react-and-nextjs-in-2025-modern-best-practices)
- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js 15.5 Release](https://nextjs.org/blog/next-15-5)

### UI Components & Styling

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **shadcn/ui** | Latest | Component library | Pre-styled Radix UI primitives with Tailwind. Saves 40-80 hours vs building from scratch. WCAG-compliant by default - critical for meditation app accessibility. **Confidence: HIGH** |
| **Radix UI** | Latest | Headless primitives | Underlying primitives for shadcn/ui. Provides unstyled, accessible components for custom meditation player UI. **Confidence: HIGH** |
| **Tailwind CSS** | 3.4+ | Utility-first CSS | Industry standard for rapid UI development. Tree-shakable for minimal bundle size. **Confidence: HIGH** |

**Why NOT Material UI:** Heavier bundle, less customizable for unique meditation UX needs.

**Sources:**
- [shadcn/ui vs Radix UI Comparison](https://makersden.io/blog/react-ui-libs-2025-comparing-shadcn-radix-mantine-mui-chakra)
- [React UI Libraries 2025](https://varbintech.com/blog/ui-component-libraries-5-must-try-picks-for-next-js-in-2025)

### State Management

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Zustand** | 5+ | Client state | Lightweight (1KB), perfect for meditation player state, practice session tracking. Simpler than Redux for this app's complexity level. **Confidence: HIGH** |
| **TanStack Query** | 5+ | Server state | Built into tRPC. Handles caching, background refetching for AI-generated content. **Confidence: HIGH** |

**Why Zustand over Jotai:** Zustand's centralized store pattern better suits interconnected state (current meditation, playback position, user persona). Jotai's atomic approach is overkill for this app's state complexity.

**Sources:**
- [State Management 2025 Guide](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)
- [Zustand vs Jotai Performance](https://www.reactlibraries.com/blog/zustand-vs-jotai-vs-valtio-performance-guide-2025)

---

## Backend Stack

### API Architecture

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **tRPC** | 11+ (@next) | Type-safe API | End-to-end TypeScript type safety from client to server. Reduces API bugs, perfect for Next.js App Router integration. **Confidence: HIGH** |
| **Zod** | 3.24+ | Schema validation | Input validation for tRPC procedures. Prevents malformed AI prompts. **Confidence: HIGH** |
| **SuperJSON** | 2+ | Data serialization | Handles Date objects and other non-JSON types in tRPC responses. **Confidence: MEDIUM** |

**Best Practice:** Call tRPC procedures directly in React Server Components for server-side data fetching, use client-side queries for interactive components.

**Sources:**
- [tRPC with Next.js 15 Guide](https://www.wisp.blog/blog/how-to-use-trpc-with-nextjs-15-app-router)
- [tRPC Best Practices 2025](https://dev.to/code_2/how-i-built-full-stack-typescript-apps-faster-with-trpc-and-nextjs-15-2oib)

### Database

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **PostgreSQL** | 18+ | Primary database | Industry standard. Supports JSONB for flexible vision persona storage, full-text search for meditation content. **Confidence: HIGH** |
| **Neon** | Latest | Serverless Postgres | Instant database branching for development, scales to zero, autoscaling compute. 80% of Neon databases created by AI agents - perfect fit. Acquired by Databricks for $1B in May 2025 (strong validation). **Confidence: HIGH** |
| **Drizzle ORM** | Latest | TypeScript ORM | Lighter than Prisma (better for Edge Functions), SQL-like API, zero build step. Supports serverless Postgres (Neon, Supabase). **Confidence: HIGH** |

**Alternative:** Supabase (if you need their auth + realtime + storage bundle). For Rehabit, Neon + Clerk is cleaner separation of concerns.

**Why Drizzle over Prisma:** Prisma's large client bundle not recommended for Edge Functions. Drizzle is 10x lighter, works natively with serverless Postgres, and has better DX for developers comfortable with SQL.

**Sources:**
- [Neon vs Supabase 2025](https://dev.to/dataformathub/serverless-postgresql-2025-the-truth-about-supabase-neon-and-planetscale-7lf)
- [Drizzle vs Prisma Guide](https://medium.com/@ashishmehtawork108/stop-using-prisma-why-i-switched-to-drizzle-orm-in-next-js-with-postgresql-setup-guide-62b200df8d81)
- [PostgreSQL 18 Release](https://dev.to/dataformathub/neon-postgres-deep-dive-why-the-2025-updates-change-serverless-sql-5o0)

### Job Queue for Async Asset Generation

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **BullMQ** | 6+ | Job queue | Redis-based queue for async voice/music/video generation. Handles retries, concurrency, failed job tracking. Industry standard for Node.js. **Confidence: HIGH** |
| **Upstash Redis** | Latest | Queue backend | Serverless Redis with HTTP API (no connection pooling issues). Pay-per-request pricing. Global replication for low latency. **Confidence: HIGH** |

**Critical for Rehabit:** Voice generation (ElevenLabs) takes 10-30s, music generation (Suno) takes 1-2 minutes, video generation (Kling) takes 3-5 minutes. Job queue is NOT optional - it prevents request timeouts and enables progress tracking.

**Sources:**
- [BullMQ Ultimate Guide 2025](https://www.dragonflydb.io/guides/bullmq)
- [Upstash Redis with Next.js](https://upstash.com/docs/redis/tutorials/nextjs_with_redis)
- [Redis Caching Next.js 2025](https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production)

---

## Authentication

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Clerk** | Latest | Auth-as-a-Service | Pre-built UI components save 40-80 hours. Setup takes 1-3 days vs 2-5 days for Supabase Auth. Native Next.js integration. SOC 2 Type 2 compliant. **Confidence: HIGH** |

**Alternative:** Supabase Auth if you're all-in on Supabase ecosystem. For Rehabit (using Neon), Clerk is cleaner.

**Why Clerk over Supabase Auth:**
- Faster implementation (1-3 days vs 2-5 days)
- Better DX with pre-built components
- No need to learn PostgreSQL RLS for authorization
- Supabase's free tier advantage (50K MAU) doesn't matter at MVP scale

**Pricing comparison:**
- Clerk: 10K MAU free, $25/month Pro
- Supabase Auth: 50K MAU free, $25/month for 100K MAU

**Sources:**
- [Clerk vs Supabase Auth 2025](https://clerk.com/articles/clerk-vs-supabase-auth)
- [Production Reality: Clerk vs Supabase](https://medium.com/better-dev-nextjs-react/clerk-vs-supabase-auth-vs-nextauth-js-the-production-reality-nobody-tells-you-a4b8f0993e1b)

---

## AI & LLM Integration

### LLM Routing

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **OpenRouter** | Latest API | Model-agnostic LLM gateway | Access 400+ models through OpenAI-compatible API. Automatic fallbacks, cost optimization. Swap providers without code changes. **Confidence: HIGH** |

**Best Practices for OpenRouter:**
1. **Use OpenAI SDK** - Point `baseURL` to OpenRouter, keep existing code
2. **Set HTTP-Referer and X-Title headers** - Attribution for leaderboards
3. **Implement retry logic** - OpenRouter auto-retries 5xx errors across providers
4. **Start with explicit model selection** - Use auto-routing (`:nitro`, `:floor`) behind feature flags
5. **Track costs via `/api/v1/generation` endpoint** - Retrieve token counts post-request

**Model Recommendations:**
- **Vision Co-Pilot (multimodal chat):** `gpt-4o`, `claude-3.5-sonnet` (via OpenRouter)
- **Journey Co-Pilot (practice guidance):** `gpt-4o-mini`, `claude-3-haiku` (faster, cheaper)
- **Content generation (meditation scripts):** `claude-3.5-sonnet` (best creative writing)

**Sources:**
- [OpenRouter Review 2025](https://skywork.ai/blog/openrouter-review-2025-api-gateway-latency-pricing/)
- [OpenRouter Production Guide](https://skywork.ai/blog/openrouter-review-2025-multi-model-llm-gateway/)
- [OpenRouter Universal API Guide](https://www.codegpt.co/blog/openrouter-universal-api-ai-development)

---

## Asset Generation Services

### Voice Generation

| Service | Type | Pricing | Rationale |
|---------|------|---------|-----------|
| **ElevenLabs** | Primary | $22/month (100K chars) | Industry-leading quality for meditation voiceovers. Natural prosody, emotion control. 10-30s generation time. **Confidence: HIGH** |
| **Fish Audio** | Alternative | $9.99/month (200 mins) | Open-source alternative with #1 TTS-Arena ranking. 15x cheaper than ElevenLabs at scale ($15 per 1M chars vs $330). **Confidence: MEDIUM** |
| **Cartesia** | Real-time | Pay-per-use | Sub-second latency for conversational agents (Journey Co-Pilot). 10s of audio for instant cloning. **Confidence: MEDIUM** |

**Recommendation for Rehabit:**
- **Start with ElevenLabs** - Best quality for meditation content where voice naturalness is critical
- **Add Fish Audio** - When costs exceed $100/month (around 500K characters/month)
- **Use Cartesia** - Only if building real-time conversational features

**Why NOT open-source (Chatterbox-Turbo):**
- Requires self-hosting GPU infrastructure
- Higher latency than managed APIs
- Operational complexity not worth it at MVP stage

**Sources:**
- [ElevenLabs Alternatives 2025](https://cartesia.ai/learn/top-elevenlabs-alternatives)
- [Best Free ElevenLabs Alternatives](https://nerdynav.com/open-source-ai-voice/)
- [Open-Source Voice Generation](https://medium.com/@bytefer/the-open-source-elevenlabs-alternative-is-here-instant-expressive-voice-generation-34a91b5189c4)

### Music Generation

| Service | Type | Pricing | Rationale |
|---------|------|---------|-----------|
| **Suno** | Primary | $10/month (500 songs) | Gold standard for full-song generation. Radio-ready quality with v4.5 model. Supports "Personas" for consistent style. **Confidence: HIGH** |
| **Mubert** | Alternative | API pricing | Real-time generation, infinite streams. Best for background ambient music. Developer-friendly API. **Confidence: MEDIUM** |
| **Mureka** | Alternative | $15/month Basic | Full-stack music platform with stems export. Powered by Skywork AI. Good for meditation tracks needing mixing. **Confidence: MEDIUM** |

**Recommendation for Rehabit:**
- **Use Suno** - For personalized meditation soundtracks with lyrics/vocals
- **Use Mubert** - For ambient background music (cheaper, faster, infinite variations)
- **Skip Mureka** - Overlaps with Suno but less proven in production

**All three offer commercial licensing under paid tiers.**

**Sources:**
- [Best AI Music API Platforms](https://www.mureka.ai/hub/ai-music-api/best-ai-music-api-platforms/)
- [AI Music Generators 2025](https://www.digitalocean.com/resources/articles/ai-music-generators)
- [Suno vs Mureka Comparison](https://singify.fineshare.com/blog/ai-music-apps/suno-vs-mureka)

### Video/Visual Generation

| Service | Type | Pricing | Rationale |
|---------|------|---------|-----------|
| **Kling AI** | Primary | Pay-per-video | High-quality video generation from text/images. 3-5 minute generation time. **Confidence: MEDIUM** |
| **Hailuo AI (MiniMax)** | Alternative | Pay-per-video | 2x faster than Kling (60-90s vs 3-4 min). Good quality for meditation visuals. **Confidence: MEDIUM** |
| **Luma AI** | Alternative | Pay-per-video | Fastest (1-2 min generation). Good for quick iterations. **Confidence: MEDIUM** |
| **Google Veo** | Future option | Limited access | Best quality (native 1080p, 60s context). Currently limited availability. **Confidence: LOW** |

**Recommendation for Rehabit:**
- **Start with Hailuo AI** - 2x faster than Kling, good enough quality for meditation backgrounds
- **Use WaveSpeedAI** - Unified API for multiple video models, eliminates geographic restrictions
- **Add Luma AI** - For rapid prototyping (1-2 min generation)

**Critical limitation:** Most video generation APIs have 2-5 minute generation times. MUST use job queues with progress tracking.

**Sources:**
- [Kling AI Alternatives 2025](https://www.eesel.ai/blog/kling-ai-alternatives)
- [Best Kling AI Alternative 2026](https://wavespeed.ai/blog/posts/best-kling-ai-alternative-2026/)
- [AI Video Generator Battle 2025](https://www.fahimai.com/kling-vs-basedlabs)

---

## Infrastructure

### Deployment

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Vercel** | Latest | Hosting platform | Native Next.js integration, zero-config Edge Network (CDN), serverless functions, preview deployments. **Confidence: HIGH** |

**Best Practices:**
- Use ISR (Incremental Static Regeneration) over SSG for content-heavy pages
- Avoid external CDNs in front of Vercel - causes stale content issues
- Use `CDN-Cache-Control` header for fine-grained cache control

**Why NOT self-hosted:** Meditation app has variable workloads (spiky asset generation). Vercel's serverless model better matches usage patterns than always-on servers.

**Sources:**
- [Vercel CDN Best Practices](https://vercel.com/docs/cdn-cache)
- [Vercel Build Optimization](https://zackproser.com/blog/vercel-build-time-optimization)

### Storage & CDN

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **UploadThing** | Latest | File uploads/storage | Next.js-native file uploads. $25/month for 250GB. Type-safe APIs. Simpler than Cloudinary for basic storage. **Confidence: MEDIUM** |
| **Cloudinary** | Latest | Alternative for video | Better video transformation features. Use if you need video editing/resizing APIs. More expensive. **Confidence: MEDIUM** |

**Recommendation for Rehabit:**
- **Start with UploadThing** - Simpler, Next.js-native, cheaper for basic storage
- **Switch to Cloudinary** - If you need advanced video transformations (trimming, overlays, filters)

**Storage estimates:**
- Voice files: ~500KB per minute (MP3)
- Music files: ~5MB per 3-minute track (MP3)
- Video files: ~50MB per 2-minute video (720p MP4)
- 1000 meditation sessions = ~55GB

UploadThing's $25/month (250GB) plan sufficient for 4500+ sessions.

**Sources:**
- [UploadThing for Next.js](https://codeparrot.ai/blogs/uploadthing-a-modern-file-upload-solution-for-nextjs-applications)
- [Cloudinary Alternatives 2025](https://www.fastpix.io/blog/the-best-cloudinary-alternatives-in-2025-compared)

### Email

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Resend** | Latest | Transactional email | Built by React Email team. 3000 emails/month free. 5-minute setup vs 30-60 minutes for SendGrid. Auto DKIM/SPF/DMARC. **Confidence: HIGH** |

**Why Resend over SendGrid:**
- SendGrid discontinued free tier (July 2025)
- Resend has React Email integration (build emails with React components)
- Simpler setup, idempotency keys, better DX

**Use cases for Rehabit:**
- Welcome emails
- Practice reminders
- Generated content ready notifications

**Sources:**
- [Email APIs 2025 Comparison](https://medium.com/@nermeennasim/email-apis-in-2025-sendgrid-vs-resend-vs-aws-ses-a-developers-journey-8db7b5545233)
- [Resend vs SendGrid Guide](https://nextbuild.co/blog/resend-vs-sendgrid-vs-ses-email)

---

## Supporting Libraries

### Utilities

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **date-fns** | 4+ | Date manipulation | Lighter than Moment.js. For practice scheduling, session tracking. |
| **clsx** | 2+ | Conditional classNames | Comes with shadcn/ui. For dynamic Tailwind classes. |
| **react-hook-form** | 7+ | Form management | For vision persona creation forms. Works with Zod validation. |
| **framer-motion** | 11+ | Animations | For meditation player UI, transitions. Tree-shakable. |

### Media Playback

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Howler.js** | 2.2+ | Audio playback | Handles meditation audio with fade in/out, crossfading, spatial audio. |
| **video.js** | 8+ | Video playback | Meditation video player with custom controls, adaptive streaming. |

---

## Development Tools

### Required

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20 LTS | Runtime |
| **pnpm** | 9+ | Package manager (faster than npm) |
| **ESLint** | 9+ | Linting |
| **Prettier** | 3+ | Code formatting |

### Recommended

| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | 2+ | Unit testing (faster than Jest) |
| **Playwright** | 1.48+ | E2E testing |
| **Storybook** | 8+ | Component development |

---

## Key Recommendations

### 1. Architecture: API-First with Job Queues

```
User Request → tRPC API → BullMQ Job → Asset Generation API → Storage → Database
                                ↓
                          Progress Updates (via polling or WebSocket)
```

**Why:** Voice/music/video generation takes 10s-5min. Job queues prevent timeout errors and enable progress tracking.

### 2. Database: Neon + Drizzle

**Why:** Serverless Postgres scales to zero (saves costs during low usage), instant branching for development, lightweight ORM works in Edge Functions.

### 3. Auth: Clerk

**Why:** Faster implementation (1-3 days vs 5+), pre-built components, no PostgreSQL RLS learning curve.

### 4. Asset Services: Start Simple, Scale Strategically

- **Voice:** ElevenLabs → Fish Audio (when costs exceed $100/month)
- **Music:** Suno (personalized) + Mubert (ambient)
- **Video:** Hailuo AI (2x faster than Kling)

### 5. Deployment: Vercel (Zero Config)

**Why:** Native Next.js support, global CDN, serverless functions scale automatically, preview deployments for every PR.

---

## What to Avoid

### Anti-Patterns

| Don't | Why | Do Instead |
|-------|-----|------------|
| **Prisma ORM** | Large client bundle, not recommended for Edge Functions | Use Drizzle ORM (10x lighter) |
| **Self-host Redis** | Connection pooling issues in serverless | Use Upstash Redis (HTTP API) |
| **External CDN in front of Vercel** | Causes stale content, 404 errors | Use Vercel's built-in Edge Network |
| **Synchronous asset generation in API routes** | Timeout errors (Next.js has 60s limit on Hobby plan) | Use BullMQ job queue |
| **Material UI** | Heavier bundle, less customizable | Use shadcn/ui + Tailwind |
| **Redux** | Overkill for this app's state complexity | Use Zustand (simpler, lighter) |
| **SendGrid** | Discontinued free tier, harder setup | Use Resend (better DX) |
| **MongoDB** | JSONB in PostgreSQL provides same flexibility + ACID guarantees | Use Neon PostgreSQL |

### Outdated Approaches (2025)

- **Next.js Pages Router** - Use App Router (Server Components, better streaming)
- **getServerSideProps/getStaticProps** - Use Server Components instead
- **NextAuth.js** - Use Clerk or Supabase Auth (better DX)
- **Webpack** - Use Turbopack (66% faster builds)
- **REST APIs** - Use tRPC (end-to-end type safety)

---

## Installation Guide

### Core Dependencies

```bash
# Framework
pnpm create next-app@latest rehabit --typescript --tailwind --app --use-pnpm

# UI Components
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card dialog form input label select textarea

# State Management
pnpm add zustand @tanstack/react-query

# API Layer
pnpm add @trpc/server@next @trpc/client@next @trpc/react-query@next @trpc/next@next zod superjson

# Database
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit

# Job Queue
pnpm add bullmq @upstash/redis

# Auth
pnpm add @clerk/nextjs

# File Uploads
pnpm add uploadthing @uploadthing/react

# Email
pnpm add resend react-email

# Utilities
pnpm add date-fns clsx react-hook-form @hookform/resolvers framer-motion

# Media Playback
pnpm add howler @types/howler video.js
```

### API Integrations

```bash
# AI Services
pnpm add openai  # For OpenRouter (uses OpenAI SDK)

# Asset Generation (install as needed)
pnpm add elevenlabs  # Voice
# Suno, Mubert, Kling - use direct HTTP APIs via fetch
```

### Dev Dependencies

```bash
pnpm add -D eslint prettier vitest @vitejs/plugin-react playwright @playwright/test
```

---

## Environment Variables Template

```bash
# Database
DATABASE_URL="postgresql://..."  # Neon connection string

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# OpenRouter
OPENROUTER_API_KEY="sk-or-..."

# Asset Generation
ELEVENLABS_API_KEY="..."
SUNO_API_KEY="..."
MUBERT_LICENSE_KEY="..."
HAILUO_API_KEY="..."

# Job Queue
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# File Storage
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."

# Email
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Sources

### Framework & Frontend
- [Next.js 15 Best Practices](https://strapi.io/blog/react-and-nextjs-in-2025-modern-best-practices)
- [React UI Libraries 2025](https://makersden.io/blog/react-ui-libs-2025-comparing-shadcn-radix-mantine-mui-chakra)
- [State Management 2025](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)

### Backend & Database
- [tRPC Next.js 15 Guide](https://www.wisp.blog/blog/how-to-use-trpc-with-nextjs-15-app-router)
- [Drizzle vs Prisma](https://medium.com/@ashishmehtawork108/stop-using-prisma-why-i-switched-to-drizzle-orm-in-next-js-with-postgresql-setup-guide-62b200df8d81)
- [Serverless PostgreSQL 2025](https://dev.to/dataformathub/serverless-postgresql-2025-the-truth-about-supabase-neon-and-planetscale-7lf)
- [BullMQ Guide 2025](https://www.dragonflydb.io/guides/bullmq)
- [Upstash Redis Next.js](https://upstash.com/docs/redis/tutorials/nextjs_with_redis)

### Auth & Infrastructure
- [Clerk vs Supabase Auth](https://clerk.com/articles/clerk-vs-supabase-auth)
- [Vercel CDN Best Practices](https://vercel.com/docs/cdn-cache)
- [UploadThing Guide](https://codeparrot.ai/blogs/uploadthing-a-modern-file-upload-solution-for-nextjs-applications)
- [Email APIs 2025](https://medium.com/@nermeennasim/email-apis-in-2025-sendgrid-vs-resend-vs-aws-ses-a-developers-journey-8db7b5545233)

### AI & Asset Generation
- [OpenRouter Review 2025](https://skywork.ai/blog/openrouter-review-2025-api-gateway-latency-pricing/)
- [ElevenLabs Alternatives](https://cartesia.ai/learn/top-elevenlabs-alternatives)
- [AI Music API Platforms](https://www.mureka.ai/hub/ai-music-api/best-ai-music-api-platforms/)
- [Kling AI Alternatives](https://www.eesel.ai/blog/kling-ai-alternatives)

---

## Confidence Assessment

| Category | Confidence | Reason |
|----------|------------|--------|
| Frontend Stack | HIGH | Next.js 15, shadcn/ui, Zustand all proven in production for similar apps |
| Backend Stack | HIGH | tRPC, Drizzle, BullMQ widely adopted for TypeScript stacks in 2025 |
| Database | HIGH | Neon's $1B acquisition validates serverless Postgres approach |
| Auth | HIGH | Clerk is standard for Next.js apps prioritizing DX |
| AI/LLM | HIGH | OpenRouter is production-ready, widely used for model-agnostic architecture |
| Voice Generation | HIGH | ElevenLabs industry standard, Fish Audio proven alternative |
| Music Generation | MEDIUM | Suno well-established, Mubert proven, but API stability varies |
| Video Generation | MEDIUM | Fast-evolving space, APIs change frequently, limited production data |
| Infrastructure | HIGH | Vercel + Upstash standard for Next.js serverless deployments |

---

## Next Steps

1. **Start with MVP stack:**
   - Next.js 15 + TypeScript + shadcn/ui
   - Clerk auth
   - Neon + Drizzle
   - tRPC API
   - OpenRouter (Claude 3.5 Sonnet)
   - ElevenLabs voice only (defer music/video)

2. **Add job queue when implementing asset generation:**
   - BullMQ + Upstash Redis
   - Critical for 10s+ API calls

3. **Scale asset services based on usage:**
   - Add Suno/Mubert when music generation validated
   - Add Hailuo AI when video generation validated
   - Switch to Fish Audio when voice costs exceed $100/month

4. **Optimize after MVP validation:**
   - Add caching layer (Upstash Redis)
   - Implement ISR for content pages
   - Set up monitoring (Vercel Analytics, Sentry)
