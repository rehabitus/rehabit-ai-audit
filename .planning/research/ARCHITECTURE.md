# Architecture Research: Rehabit

**Domain:** AI-powered personalized meditation/transformation practice app
**Researched:** 2026-01-22
**Confidence:** MEDIUM (based on verified patterns from similar systems, needs validation for specific providers)

## Executive Summary

Rehabit requires a sophisticated multi-layered architecture combining:
1. **Multi-agent orchestration** for Vision Co-Pilot and Journey Co-Pilot
2. **Async content generation pipeline** with provider abstraction for voice, music, and visuals
3. **Credit-based metering system** tracking multi-provider consumption
4. **Asset library with metadata management** enabling surgical re-rolls and remixing
5. **Real-time progress updates** via WebSocket for long-running generation jobs

This architecture mirrors patterns from Netflix's video processing (Cosmos), modern AI content generation platforms (ReelMind), and multi-agent systems (2026 standard patterns). The key architectural challenge is maintaining provider-agnostic abstractions while tracking per-provider costs and capabilities.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  Next.js 15 App Router + React + Tailwind                      │
│  - Vision Chat UI (multimodal input)                           │
│  - Journey Practice Dashboard                                  │
│  - Media Player (video composition playback)                   │
│  - Asset Library Browser (remix/re-roll UI)                    │
│  - Real-time Progress Display (WebSocket client)               │
└────────────┬────────────────────────────────────────────────────┘
             │ Server Actions / API Routes
             │ WebSocket Connection
┌────────────▼────────────────────────────────────────────────────┐
│                      API & Orchestration Layer                  │
│  Next.js Backend (Server Actions + API Routes)                 │
│  - Auth & Session Management (NextAuth.js)                     │
│  - Rate Limiting & Request Validation                          │
│  - Credit Balance Checking                                     │
│  - Agent Orchestration Coordinator                             │
│  - Job Queue Interface (BullMQ)                                │
│  - WebSocket Server (progress broadcasts)                      │
└────────────┬────────────────────────────────────────────────────┘
             │
   ┌─────────┴──────────┬─────────────────────────────────┐
   │                    │                                 │
┌──▼────────────────┐  ┌▼────────────────────┐  ┌────────▼──────────┐
│  Agent System     │  │  Content Pipeline   │  │  Credit System    │
│  - Vision Co-Pilot│  │  - Job Queue        │  │  - Usage Tracking │
│  - Journey        │  │    (BullMQ/Redis)   │  │  - Balance Check  │
│    Co-Pilot       │  │  - Provider         │  │  - Wallet Mgmt    │
│  - Context Mgmt   │  │    Abstraction      │  │  - Event Stream   │
│  - LLM Gateway    │  │  - Async Workers    │  │    (Dedup)        │
└──┬────────────────┘  └┬────────────────────┘  └────────┬──────────┘
   │                    │                                 │
┌──▼────────────────────▼─────────────────────────────────▼──────────┐
│                     Data Layer (PostgreSQL)                        │
│  - Users, Personas (VPS), Sessions                                │
│  - Conversations, Messages (chat state)                           │
│  - Scripts, Assets, Compositions                                  │
│  - Jobs, Job Status, Progress Updates                             │
│  - Credits, Transactions, Audit Trail                             │
│  - Asset Metadata (tags, embeddings, relationships)               │
└────────────────────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│                   External Provider Layer                       │
│  Text Generation    Voice Generation    Music Generation        │
│  - OpenAI          - ElevenLabs         - Mubert                │
│  - Anthropic       - OpenAI TTS         - Suno                  │
│  - Gemini          - Azure TTS          - Custom models         │
│                    - Fish Audio                                 │
│                                                                  │
│  Image/Video        Composition         Storage                 │
│  - DALL-E          - FFmpeg workers     - S3/Cloudinary         │
│  - Midjourney      - MediaConvert       - CDN (CloudFront)      │
│  - Stable Diffusion                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend Layer (Next.js 15 App Router)

**Technology:** Next.js 15 with App Router, Server Actions, Streaming, React Server Components

**Responsibilities:**
- Multimodal chat interface (text + video/voice capture)
- Real-time streaming responses from agents
- Video player for generated meditations
- Asset library browser with filter/search
- Progress tracking UI for async jobs
- Credit balance display and purchase flow

**Key Patterns:**
- **Server Actions with Streaming**: Use `experimental_StreamingReactResponse` for agent conversations, allowing partial results to display as they generate
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with real-time features
- **Optimistic UI Updates**: Show pending states immediately, sync with server via WebSocket

**Build Priority:** HIGH (Phase 1)
- Start with basic chat UI and static player
- Add streaming and WebSocket in Phase 2
- Asset library browser in Phase 3

**Sources:**
- [Next.js App Router Advanced Patterns 2026](https://medium.com/@beenakumawat002/next-js-app-router-advanced-patterns-for-2026-server-actions-ppr-streaming-edge-first-b76b1b3dcac7)
- [Next.js Backend for Conversational AI 2026](https://www.sashido.io/en/blog/nextjs-backend-conversational-ai-2026)

---

### 2. API & Orchestration Layer

**Technology:** Next.js Server Actions + API Routes, NextAuth.js, Vercel AI SDK

**Responsibilities:**
- Authentication and session management
- Request validation and rate limiting
- Credit balance verification before expensive operations
- Coordinate between agents, content pipeline, and database
- WebSocket connection management for progress updates
- Stream AI responses to frontend

**Key Patterns:**
- **Server Actions for Mutations**: Use Server Actions for all data mutations (create persona, generate content, update profile)
- **API Routes for Webhooks**: Use API routes for external webhooks (payment confirmations, provider callbacks)
- **Middleware for Auth**: Centralize auth checks in Next.js middleware
- **Credit Pre-Check**: Always verify sufficient credits before enqueueing jobs

**Anti-Patterns to Avoid:**
- ❌ Don't mix Server Actions and API routes arbitrarily (prefer Server Actions unless external integration)
- ❌ Don't skip credit checks assuming frontend validation is enough
- ❌ Don't block requests waiting for long-running jobs (always async + WebSocket)

**Build Priority:** HIGH (Phase 1)
- Auth and basic API layer first
- Add job queue integration in Phase 2
- WebSocket server in Phase 2

**Sources:**
- [Next.js Deep Dive 2026: Server Actions](https://medium.com/@Samira8872/next-js-deep-dive-2026-mastering-the-power-of-server-actions-and-data-layer-optimization-c8483b9d138c)
- [Next.js Streaming Server Actions](https://jherr2020.medium.com/nextjss-amazing-new-streaming-server-actions-ef4f6e2b1ca2)

---

### 3. Agent System (Vision Co-Pilot & Journey Co-Pilot)

**Technology:** LangChain/LangGraph or CrewAI for agent orchestration, Vercel AI SDK for streaming

**Responsibilities:**
- **Vision Co-Pilot**: Multimodal conversation to build Future Self Persona (VPS)
  - Process text, voice, and video inputs
  - Ask clarifying questions
  - Synthesize persona document
  - Store in VPS (structured format)
- **Journey Co-Pilot**: Practice management and content generation
  - Generate meditation scripts from persona
  - Suggest variations and remixes
  - Track practice history and adapt

**Architecture Pattern: Sequential Orchestration with Shared Context**

```
User Input → Intent Classification → Specialized Agent → Response
                 ↓                         ↓
            Context Store           Tool Execution
            (PostgreSQL)            (API calls, DB queries)
```

**Agent Components:**
1. **Context Manager**: Maintains conversation state, persona state, user preferences
2. **LLM Gateway**: Abstracts LLM provider (OpenAI, Anthropic, Gemini)
3. **Tool Registry**: Available actions (create_script, generate_asset, search_library)
4. **Memory System**: Long-term storage of user interactions and preferences

**Key Decisions:**
- **Centralized Orchestration** over decentralized: Simpler to implement, easier to debug, sufficient for 2-agent system
- **Shared Context Store** in PostgreSQL: All agents read/write to same conversation and persona tables
- **Streaming Responses**: Use Vercel AI SDK's streaming capabilities for responsive UX

**Provider Abstraction:**
```typescript
interface LLMProvider {
  generateStream(prompt: string, context: Context): AsyncIterator<string>
  generateStructured<T>(prompt: string, schema: Schema<T>): Promise<T>
}
```

**Build Priority:** HIGH (Phase 1)
- Vision Co-Pilot with basic text chat first
- Add multimodal input in Phase 2
- Journey Co-Pilot in Phase 3 (depends on content pipeline)

**Sources:**
- [AI Agent Orchestration Patterns - Azure](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [Multi-Agent Systems 2026 Guide](https://dev.to/eira-wexford/how-to-build-multi-agent-systems-complete-2026-guide-1io6)
- [Agentic AI Architectures](https://medium.com/@anil.jain.baba/agentic-ai-architectures-and-design-patterns-288ac589179a)
- [Multi-Agent Orchestration](https://www.kore.ai/blog/what-is-multi-agent-orchestration)

---

### 4. Content Generation Pipeline (CoSM - Conscious State Management System)

**Technology:** BullMQ (Redis-backed job queue), FFmpeg (composition), Node.js workers

**Responsibilities:**
- Receive generation requests (script → assets → composition)
- Queue jobs with priority and dependencies
- Route to appropriate provider via abstraction layer
- Track progress and update via WebSocket
- Handle retries and failures
- Compose final video from assets
- Store results in asset library

**Architecture Pattern: Async Workflow with Provider Abstraction**

```
API Request → Job Queue → Worker Pool → Provider Layer → Result Storage
    ↓           ↓              ↓              ↓              ↓
  Credit     Priority      Provider       API Call      S3/CDN
  Check      Routing      Selection      + Retry       + DB
```

#### Job Queue Architecture (BullMQ)

**Queue Structure:**
1. **script-generation**: LLM-based script creation (HIGH priority, fast)
2. **voice-generation**: Text-to-speech synthesis (MEDIUM priority, medium)
3. **music-generation**: Background music creation (LOW priority, slow)
4. **visual-generation**: Image/video generation (LOW priority, slow)
5. **composition**: FFmpeg assembly of final video (HIGH priority, fast once deps ready)

**Worker Configuration:**
- Horizontal scaling: Deploy multiple workers per queue type
- Concurrency: Voice workers run 3 concurrent jobs, music/visual run 1 (GPU-intensive)
- Priority: User subscription level affects queue position
- Rate limiting: Per-provider rate limits enforced at worker level

**Job Dependencies:**
```javascript
// Example: Script must complete before voice generation
const voiceJob = await voiceQueue.add('generate', {
  scriptId: script.id,
  text: script.content,
  providerId: 'elevenlabs'
}, {
  parent: {
    id: scriptJob.id,
    queue: scriptQueue.name
  }
})
```

**Sources:**
- [BullMQ Job Queue Architecture 2026](https://oneuptime.com/blog/post/2026-01-06-nodejs-job-queue-bullmq-redis/view)
- [Building Scalable Job Queues with BullMQ](https://medium.com/@sanipatel0401/building-scalable-job-queues-with-bullmq-a-complete-guide-with-image-processing-example-88c58b550cb8)
- [ReelMind Content Pipeline](https://reelmind.ai/blog/the-content-pipeline-from-aigc-task-queue-to-final-video-sharing-on-the-platform)

#### Provider Abstraction Layer

**Goal:** Make asset generation model-agnostic. Swap providers without changing application logic.

**Design Pattern: Strategy Pattern with Factory**

```typescript
// Core abstraction
interface AssetProvider {
  readonly id: string
  readonly type: 'voice' | 'music' | 'image' | 'video'
  readonly creditsPerUnit: number

  generate(params: GenerationParams): Promise<Asset>
  getCapabilities(): Capabilities
  healthCheck(): Promise<boolean>
}

// Provider registry
class ProviderRegistry {
  private providers: Map<string, AssetProvider>

  register(provider: AssetProvider): void
  get(providerId: string): AssetProvider
  getBestAvailable(type: AssetType, requirements: Requirements): AssetProvider
}

// Worker uses registry
async function processVoiceJob(job: Job) {
  const provider = registry.get(job.data.providerId) // Explicit selection
  // OR
  const provider = registry.getBestAvailable('voice', job.data.requirements) // Auto-select

  const asset = await provider.generate(job.data)
  return asset
}
```

**Provider Implementations:**
- `ElevenLabsProvider`: Voice generation
- `OpenAITTSProvider`: Voice generation (alternative)
- `AzureTTSProvider`: Voice generation (alternative)
- `MubertProvider`: Music generation
- `SunoProvider`: Music generation (alternative)
- `DallEProvider`: Image generation
- `MidjourneyProvider`: Image generation (alternative)

**Configuration:**
- Providers configured via environment variables
- Each provider has API key, rate limits, cost per unit
- Application code references providers by ID, not hardcoded

**Sources:**
- [Multi-Provider AI Gateway - AWS](https://aws.amazon.com/blogs/machine-learning/streamline-ai-operations-with-the-multi-provider-generative-ai-gateway-reference-architecture/)
- [AI Provider Integration Architecture](https://www.superblocks.com/blog/ai-layer)
- [Best TTS APIs 2026](https://www.speechmatics.com/company/articles-and-news/best-tts-apis-in-2025-top-12-text-to-speech-services-for-developers)

#### Composition Engine (FFmpeg)

**Responsibility:** Combine voice, music, and visuals into single playable video

**Architecture:**
- Dedicated composition queue (depends on all asset jobs)
- Worker pool with FFmpeg installed
- Input: Asset URLs (S3 paths) + timing metadata
- Output: Composed video (S3) + thumbnail + metadata

**FFmpeg Pipeline:**
1. Download assets from S3 to worker temporary storage
2. Execute FFmpeg command with complex filters:
   - Layer video/images with timing
   - Mix voice and music audio tracks with ducking
   - Add fade in/out transitions
   - Generate multiple resolutions (1080p, 720p, 480p)
3. Upload composed video to S3/CDN
4. Generate thumbnail and preview
5. Update database with final URLs

**High Availability:**
- Multiple FFmpeg workers behind load balancer
- Retry failed compositions with exponential backoff
- Health monitoring and auto-restart via orchestration (Docker Swarm or Kubernetes)

**Sources:**
- [Building Automated Video Processing Pipeline with FFmpeg](https://www.cincopa.com/learn/building-an-automated-video-processing-pipeline-with-ffmpeg)
- [FFmpeg High Availability](https://hoop.dev/blog/ffmpeg-high-availability-building-resilient-video-pipelines/)
- [Netflix Cosmos Platform](https://netflixtechblog.com/rebuilding-netflix-video-processing-pipeline-with-microservices-4e5e6310e359)

**Build Priority:** MEDIUM (Phase 2-3)
- Start with simple queue and single provider in Phase 2
- Add provider abstraction in Phase 2
- Build composition engine in Phase 3
- Optimize and scale in Phase 4

---

### 5. Credit System & Metering

**Technology:** PostgreSQL (transactional), event streaming with deduplication

**Responsibilities:**
- Track credit balance per user
- Deduct credits for each generation operation
- Prevent double-charging via idempotency
- Support multiple pricing tiers
- Provide audit trail for compliance
- Real-time balance updates
- Handle prepaid credits and subscription renewals

**Architecture Pattern: Event-Driven Credit Ledger**

```
Operation Request → Credit Check → Job Execution → Usage Event → Credit Deduction
      ↓                  ↓              ↓               ↓              ↓
   User ID           Balance        Provider        Event ID      Transaction
   Cost Est.         >= Cost        API Call       (Idempotent)      Record
```

#### Database Schema (Simplified)

```sql
-- User credit wallets
CREATE TABLE credit_wallets (
  user_id UUID PRIMARY KEY,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Transaction ledger (append-only)
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL, -- negative for deductions
  operation_type VARCHAR(50) NOT NULL, -- 'voice_gen', 'music_gen', etc.
  provider_id VARCHAR(50),
  job_id UUID, -- links to jobs table
  idempotency_key VARCHAR(255) UNIQUE, -- prevents double-charging
  metadata JSONB, -- provider response, duration, etc.
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Pricing rules
CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY,
  operation_type VARCHAR(50) NOT NULL,
  provider_id VARCHAR(50) NOT NULL,
  credits_per_unit DECIMAL(10,4) NOT NULL, -- e.g., 0.001 per second
  unit_type VARCHAR(20) NOT NULL, -- 'second', 'token', 'image'
  tier VARCHAR(20) DEFAULT 'standard', -- 'free', 'standard', 'premium'
  effective_from TIMESTAMP NOT NULL,
  effective_to TIMESTAMP
);
```

#### Credit Deduction Flow

```typescript
async function deductCreditsForOperation(
  userId: string,
  operation: Operation,
  idempotencyKey: string
): Promise<void> {
  // 1. Check for existing transaction (idempotency)
  const existing = await db.creditTransactions.findByIdempotencyKey(idempotencyKey)
  if (existing) {
    return // Already processed
  }

  // 2. Calculate cost
  const pricing = await db.pricingRules.getActive(operation.type, operation.providerId)
  const cost = pricing.creditsPerUnit * operation.units

  // 3. Atomic deduction (transaction)
  await db.transaction(async (tx) => {
    // Check balance
    const wallet = await tx.creditWallets.findById(userId, { lock: true })
    if (wallet.balance < cost) {
      throw new InsufficientCreditsError()
    }

    // Deduct
    await tx.creditWallets.update(userId, {
      balance: wallet.balance - cost
    })

    // Record transaction
    await tx.creditTransactions.create({
      userId,
      amount: -cost,
      operationType: operation.type,
      providerId: operation.providerId,
      jobId: operation.jobId,
      idempotencyKey,
      metadata: operation.metadata
    })
  })
}
```

#### Subscription Tiers

**Pricing Model:** Hybrid (monthly subscription + usage credits)

| Tier | Monthly Fee | Included Credits | Overage Rate | Priority |
|------|-------------|------------------|--------------|----------|
| Free | $0 | 50 | N/A (hard limit) | Low |
| Standard | $19 | 500 | $0.01/credit | Medium |
| Premium | $49 | 2000 | $0.008/credit | High |

**Credit Refill:**
- Auto-refill on subscription renewal
- One-time credit purchases (e.g., $10 for 100 credits)
- Credits expire 12 months after purchase (not included credits)

**Sources:**
- [SaaS Credits System Guide 2026](https://colorwhistle.com/saas-credits-system-guide/)
- [Credit-Based Pricing for AI Companies](https://flexprice.io/blog/best-credit-based-pricing-software-for-ai-companies)
- [How to Switch to Credit System 2026](https://medium.com/@lesiapolivod/how-to-switch-your-ai-product-to-a-credit-system-in-2026-and-why-you-must-a-data-driven-guide-6edf7a9a2e35)
- [Usage-Based Billing Best Practices](https://www.getlago.com/blog/credit-based-pricing)

**Build Priority:** HIGH (Phase 1)
- Basic credit wallet and transaction ledger in Phase 1
- Subscription integration in Phase 2
- Advanced metering (per-provider, per-tier) in Phase 2

---

### 6. Asset Library & Metadata Management

**Technology:** PostgreSQL (metadata), S3/Cloudinary (storage), CDN (delivery)

**Responsibilities:**
- Store generated assets with rich metadata
- Enable search, filter, and discovery
- Support versioning and variations (surgical re-rolls)
- Track relationships (script → voice → music → composition)
- Provide asset URLs for playback and download
- Manage asset lifecycle (cleanup, archival)

**Architecture Pattern: Metadata + Blob Storage**

```
Asset Generation → Metadata DB → Blob Storage → CDN
       ↓               ↓              ↓           ↓
   Asset Info      PostgreSQL       S3/R2      CloudFront
   (size, type,    (searchable)   (durable)   (fast delivery)
    tags, etc.)
```

#### Database Schema (Simplified)

```sql
-- Assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'script', 'voice', 'music', 'image', 'video', 'composition'
  provider_id VARCHAR(50),
  storage_url TEXT NOT NULL, -- S3 URL
  cdn_url TEXT, -- CloudFront URL
  file_size BIGINT,
  duration_seconds DECIMAL(10,2), -- for audio/video
  metadata JSONB, -- provider-specific metadata, generation params
  tags TEXT[], -- user-defined tags
  embedding VECTOR(1536), -- for semantic search (pgvector)
  parent_asset_id UUID, -- for variations/versions
  version INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'deleted'
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (parent_asset_id) REFERENCES assets(id)
);

-- Asset relationships (graph)
CREATE TABLE asset_relationships (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL, -- e.g., composition ID
  child_id UUID NOT NULL, -- e.g., voice asset ID
  relationship_type VARCHAR(50) NOT NULL, -- 'contains', 'derived_from', 'variant_of'
  metadata JSONB, -- timing info, layer info
  FOREIGN KEY (parent_id) REFERENCES assets(id),
  FOREIGN KEY (child_id) REFERENCES assets(id)
);

-- Asset collections (playlists, favorites)
CREATE TABLE collections (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE collection_items (
  collection_id UUID NOT NULL,
  asset_id UUID NOT NULL,
  position INT NOT NULL,
  PRIMARY KEY (collection_id, asset_id)
);
```

#### Key Features

**1. Surgical Re-Rolls:**
User can regenerate single component (e.g., just voice) while keeping others:
- Query asset_relationships to find components of composition
- Mark old voice asset as `version=1`, create new as `version=2` with `parent_asset_id`
- Re-run composition job with new voice, same music/visuals
- New composition inherits relationship graph

**2. Semantic Search with pgvector:**
```sql
-- Find similar meditations by semantic content
SELECT * FROM assets
WHERE type = 'composition'
  AND user_id = $1
ORDER BY embedding <-> $2 -- cosine distance
LIMIT 10;
```

**3. Asset Metadata Enrichment:**
- AI-generated tags (extracted from script content)
- User preferences (favorited, frequently played)
- Usage statistics (play count, completion rate)
- Provenance tracking (C2PA content authenticity)

**Sources:**
- [Digital Asset Management Trends 2026](https://www.fotoware.com/blog/digital-asset-management-trends-2026)
- [AI in DAM 2026](https://www.aprimo.com/blog/ai-in-digital-asset-management-how-2026-is-changing-everything)
- [Digital Asset Library Guide](https://cloudinary.com/guides/digital-asset-management/digital-asset-library)
- [PostgreSQL Vector Embeddings for AI](https://medium.com/@richardhightower/building-ai-powered-search-and-rag-with-postgresql-and-vector-embeddings-09af314dc2ff)

**Build Priority:** MEDIUM (Phase 3)
- Basic asset storage in Phase 2
- Rich metadata and search in Phase 3
- Semantic search and advanced features in Phase 4

---

### 7. Real-Time Progress Updates (WebSocket)

**Technology:** WebSocket (Socket.IO or native), Redis Pub/Sub (for horizontal scaling)

**Responsibilities:**
- Broadcast job progress to connected clients
- Support multiple concurrent jobs per user
- Scale across multiple server instances
- Handle reconnection gracefully

**Architecture Pattern: Pub/Sub with WebSocket Broadcasting**

```
Job Worker → Redis Pub/Sub → WebSocket Server → Client Browser
     ↓            ↓                  ↓                ↓
  Progress    Channel           Broadcast        Real-time
  Update     (job:123)        to subscribers       UI Update
```

#### Implementation

```typescript
// Worker publishes progress
async function updateJobProgress(jobId: string, progress: number, message: string) {
  await redis.publish(`job:${jobId}`, JSON.stringify({
    jobId,
    progress, // 0-100
    message,
    timestamp: Date.now()
  }))
}

// WebSocket server subscribes
io.on('connection', (socket) => {
  socket.on('subscribe:job', async (jobId) => {
    // Verify user owns job
    const job = await db.jobs.findById(jobId)
    if (job.userId !== socket.data.userId) {
      socket.emit('error', 'Unauthorized')
      return
    }

    // Subscribe to Redis channel
    const subscriber = redis.duplicate()
    await subscriber.subscribe(`job:${jobId}`)

    subscriber.on('message', (channel, message) => {
      socket.emit('job:progress', JSON.parse(message))
    })

    socket.on('disconnect', () => {
      subscriber.unsubscribe()
      subscriber.quit()
    })
  })
})
```

**Scalability:**
- Multiple WebSocket server instances behind load balancer (sticky sessions)
- Redis Pub/Sub ensures all servers receive progress updates
- Clients automatically reconnect on disconnect

**Alternative: Server-Sent Events (SSE)**
- Simpler than WebSocket (one-way server → client)
- Works over HTTP (no special infrastructure)
- Consider for MVP if only progress updates needed

**Sources:**
- [WebSockets for Real-Time Updates 2026](https://www.gavant.com/library/using-websockets-for-real-time-updates-in-a-serverless-web-application)
- [Using WebSockets in React 2026](https://oneuptime.com/blog/post/2026-01-15-websockets-react-real-time-applications/view)
- [SSE vs WebSockets 2026](https://www.nimbleway.com/blog/server-sent-events-vs-websockets-what-is-the-difference-2026-guide)

**Build Priority:** MEDIUM (Phase 2)
- Basic WebSocket in Phase 2
- Redis Pub/Sub scaling in Phase 3

---

### 8. Data Layer (PostgreSQL)

**Technology:** PostgreSQL 17 with extensions (pgvector for embeddings, possibly pg_cron for cleanup jobs)

**Responsibilities:**
- Persistent storage for all application data
- Transactional consistency (credit deductions, job state)
- Relational queries (asset graph, user history)
- Vector search (semantic asset discovery)

#### Core Tables (High-Level)

**Users & Auth:**
- `users`: User accounts, subscription tier
- `sessions`: NextAuth.js session management
- `profiles`: User preferences, settings

**VPS (Vision Projection System):**
- `personas`: Future Self Persona documents (structured)
- `persona_versions`: Version history for editing

**Conversations & Agents:**
- `conversations`: Chat threads with Vision/Journey Co-Pilot
- `messages`: Individual messages (user + assistant)
- `agent_context`: Agent-specific context and memory

**Content Pipeline:**
- `scripts`: Generated meditation scripts
- `assets`: Generated voice, music, visuals, compositions
- `asset_relationships`: Graph of asset dependencies
- `jobs`: Job queue metadata (status, progress, errors)

**Credit System:**
- `credit_wallets`: User credit balances
- `credit_transactions`: Append-only ledger
- `pricing_rules`: Per-provider, per-tier pricing

**Asset Library:**
- `collections`: User-created playlists
- `collection_items`: Assets in collections
- `favorites`: Quick access to favorited assets

#### Key Design Decisions

**1. Conversation State Management:**
- Store full conversation history for agents to reference
- Use JSONB for flexible message metadata (attachments, tool calls)
- Index on `user_id`, `conversation_id`, `created_at` for fast retrieval

**2. Job State Tracking:**
- Jobs table mirrors BullMQ state (pending, active, completed, failed)
- Redundant with Redis, but provides durable audit trail
- Worker updates both Redis (queue state) and PostgreSQL (business logic)

**3. Asset Versioning:**
- Use `parent_asset_id` and `version` for surgical re-rolls
- Soft delete (`status='archived'`) instead of hard delete
- Keep old versions for rollback and comparison

**4. Multi-Tenancy:**
- All tables include `user_id` for data isolation
- Row-level security (RLS) policies enforce access control
- Index on `user_id` for every table

**Sources:**
- [Chat Application Database Schema](https://www.back4app.com/tutorials/how-to-design-a-database-schema-for-a-real-time-chat-and-messaging-app)
- [PostgreSQL for AI Applications 2026](https://medium.com/@richardhightower/building-ai-powered-search-and-rag-with-postgresql-and-vector-embeddings-09af314dc2ff)
- [Letta AI Agents with PostgreSQL](https://aws.amazon.com/blogs/database/how-letta-builds-production-ready-ai-agents-with-amazon-aurora-postgresql/)

**Build Priority:** HIGH (Phase 1)
- Core schema (users, personas, conversations) in Phase 1
- Jobs, assets, credits in Phase 2
- Advanced features (pgvector, RLS) in Phase 3-4

---

## Data Flow: End-to-End User Journey

### Journey 1: Create Future Self Persona

```
1. User opens app → Next.js page
2. User starts Vision Co-Pilot chat → Server Action
3. Agent streams questions → Vercel AI SDK streaming
4. User provides multimodal input (text, voice, video) → File upload + Server Action
5. Agent synthesizes persona → LLM API call (OpenAI/Anthropic)
6. Persona saved to VPS → INSERT into personas table
7. UI updates with persona summary → React state update
```

**Key Technology Interactions:**
- Frontend: Next.js App Router, Server Actions, Streaming
- Backend: Vercel AI SDK, LangChain agent
- Database: PostgreSQL (personas, conversations, messages)
- External: OpenAI/Anthropic API

---

### Journey 2: Generate Personalized Meditation

```
1. User requests meditation → Server Action
2. Credit check → Query credit_wallets, check balance
3. Generate script → Journey Co-Pilot agent + LLM
4. Enqueue asset jobs:
   a. Voice generation → BullMQ adds to voice-generation queue
   b. Music generation → BullMQ adds to music-generation queue
   c. Visual generation → BullMQ adds to visual-generation queue
5. Workers process jobs:
   a. Voice worker → ElevenLabs API → Upload to S3 → Update assets table
   b. Music worker → Mubert API → Upload to S3 → Update assets table
   c. Visual worker → DALL-E API → Upload to S3 → Update assets table
6. Workers publish progress → Redis Pub/Sub → WebSocket → Browser UI update
7. All assets complete → Enqueue composition job
8. Composition worker:
   a. Download assets from S3 → FFmpeg compose → Upload to S3
   b. Update assets table with composition
   c. Create asset_relationships entries
9. Credit deduction → INSERT into credit_transactions (idempotent)
10. User notified → WebSocket event "complete"
11. User plays meditation → Load CDN URL from assets table
```

**Key Technology Interactions:**
- Frontend: Next.js, WebSocket client
- Backend: Server Actions, BullMQ, Redis Pub/Sub, FFmpeg workers
- Database: PostgreSQL (scripts, assets, asset_relationships, jobs, credit_transactions)
- External: ElevenLabs, Mubert, DALL-E APIs
- Storage: S3 + CloudFront CDN

---

### Journey 3: Surgical Re-Roll (Regenerate Voice Only)

```
1. User views composition in library → Query assets + asset_relationships
2. User clicks "Re-roll voice" → Server Action
3. Credit check → Query credit_wallets
4. Query existing composition:
   a. Find current voice asset via asset_relationships
   b. Find music and visual assets (keep these)
5. Enqueue new voice job → BullMQ (same flow as Journey 2)
6. Voice worker generates new asset → S3 + assets table (version=2, parent=old_voice_id)
7. Enqueue composition job with new voice + existing music/visuals
8. Composition worker creates new composition → S3 + assets table
9. Update asset_relationships → New composition points to new voice + old music/visuals
10. Credit deduction → INSERT credit_transactions
11. User notified → WebSocket "complete"
12. UI updates library → New composition appears
```

**Key Benefit of Architecture:**
- Asset graph (asset_relationships) makes dependencies explicit
- Workers are stateless; just reference asset IDs
- Composition worker doesn't care if assets are new or reused
- Credit system only charges for new voice generation, not recomposition

---

## Provider Abstraction: How It Works

### Problem Statement
Rehabit needs to:
1. Support multiple voice providers (ElevenLabs, OpenAI TTS, Azure TTS)
2. Switch providers easily (A/B testing, cost optimization, fallback)
3. Track per-provider costs and usage
4. Maintain consistent interface in application code

### Solution: Strategy Pattern + Registry

**Step 1: Define Common Interface**

```typescript
interface VoiceProvider {
  id: string
  name: string

  generate(params: {
    text: string
    voice: string
    options?: Record<string, any>
  }): Promise<{
    audioUrl: string
    duration: number
    metadata: Record<string, any>
  }>

  getVoices(): Promise<Voice[]>
  estimateCost(params: { text: string }): number // credits
  healthCheck(): Promise<boolean>
}
```

**Step 2: Implement Providers**

```typescript
class ElevenLabsProvider implements VoiceProvider {
  id = 'elevenlabs'
  name = 'ElevenLabs'

  async generate(params) {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech', {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
      body: JSON.stringify({
        text: params.text,
        voice_id: params.voice,
        ...params.options
      })
    })
    const audioBuffer = await response.arrayBuffer()
    const audioUrl = await uploadToS3(audioBuffer, 'voice.mp3')
    return {
      audioUrl,
      duration: await getAudioDuration(audioUrl),
      metadata: { providerId: this.id, voiceId: params.voice }
    }
  }

  estimateCost(params) {
    const charCount = params.text.length
    return charCount * 0.01 // Example: 0.01 credits per character
  }
}

class OpenAITTSProvider implements VoiceProvider {
  id = 'openai-tts'
  name = 'OpenAI TTS'

  async generate(params) {
    // Similar implementation for OpenAI API
  }

  estimateCost(params) {
    // OpenAI pricing logic
  }
}
```

**Step 3: Registry for Dynamic Selection**

```typescript
class ProviderRegistry {
  private providers = new Map<string, VoiceProvider>()

  register(provider: VoiceProvider) {
    this.providers.set(provider.id, provider)
  }

  get(id: string): VoiceProvider {
    const provider = this.providers.get(id)
    if (!provider) throw new Error(`Provider ${id} not found`)
    return provider
  }

  async getBestAvailable(requirements?: {
    maxCost?: number
    features?: string[]
  }): Promise<VoiceProvider> {
    for (const provider of this.providers.values()) {
      if (await provider.healthCheck()) {
        return provider // Simple: return first healthy provider
      }
    }
    throw new Error('No voice providers available')
  }
}

// Initialize at startup
const voiceRegistry = new ProviderRegistry()
voiceRegistry.register(new ElevenLabsProvider())
voiceRegistry.register(new OpenAITTSProvider())
voiceRegistry.register(new AzureTTSProvider())
```

**Step 4: Worker Uses Registry**

```typescript
async function processVoiceJob(job: Job) {
  const { text, voice, providerId } = job.data

  // Get provider (explicit or auto-select)
  const provider = providerId
    ? voiceRegistry.get(providerId)
    : await voiceRegistry.getBestAvailable()

  // Pre-flight credit check
  const cost = provider.estimateCost({ text })
  await ensureSufficientCredits(job.userId, cost)

  // Generate
  const result = await provider.generate({ text, voice })

  // Save asset
  const asset = await db.assets.create({
    userId: job.userId,
    type: 'voice',
    providerId: provider.id,
    storageUrl: result.audioUrl,
    duration: result.duration,
    metadata: result.metadata
  })

  // Deduct credits
  await deductCredits(job.userId, cost, provider.id, job.id)

  return asset
}
```

**Benefits:**
1. ✅ Application code doesn't reference specific providers
2. ✅ Easy to add new providers (implement interface, register)
3. ✅ A/B testing: route % of traffic to different providers
4. ✅ Fallback: if primary fails health check, use secondary
5. ✅ Cost tracking: `providerId` in credit_transactions table
6. ✅ Configuration-driven: enable/disable providers via env vars

---

## Build Order Recommendations

Building Rehabit requires careful sequencing due to dependencies. This order minimizes rework and enables iterative testing.

### Phase 1: Foundation (Weeks 1-3)
**Goal:** User can sign up, chat with Vision Co-Pilot, create persona

**Components:**
1. **Data Layer**: PostgreSQL schema (users, personas, conversations, messages)
2. **Auth**: NextAuth.js integration
3. **Frontend**: Next.js App Router pages (home, sign up, chat)
4. **Vision Co-Pilot**: Basic text chat with LLM (OpenAI/Anthropic)
5. **VPS Storage**: Save persona to database

**Why First:**
- Core value prop (persona creation) can be validated without asset generation
- Establishes data model and auth patterns
- Unblocks frontend and agent development in parallel

**Testing Milestone:** User creates account, chats with agent, sees saved persona

---

### Phase 2: Async Pipeline & Credits (Weeks 4-6)
**Goal:** User can generate meditation, track progress, see credit deductions

**Components:**
1. **Credit System**: Wallets, transactions, pricing rules
2. **Job Queue**: BullMQ setup with Redis
3. **Worker Infrastructure**: Basic worker with one provider per type (ElevenLabs voice, placeholder music/visuals)
4. **WebSocket Server**: Real-time progress updates
5. **Asset Storage**: S3 integration, assets table
6. **Journey Co-Pilot**: Script generation from persona

**Why Second:**
- Establishes async job pattern before adding complexity
- Single provider validates end-to-end flow
- Credit system integration catches issues early

**Testing Milestone:** User generates meditation (voice only), sees progress, credits deducted, can play result

---

### Phase 3: Multi-Provider & Composition (Weeks 7-10)
**Goal:** Full meditation with voice + music + visuals + composition

**Components:**
1. **Provider Abstraction**: Interface + registry for voice, music, visuals
2. **Multiple Providers**: Add 2-3 providers per category
3. **FFmpeg Composition**: Combine assets into video
4. **Asset Library**: Browse, search, filter generated content
5. **Asset Relationships**: Graph of composition → components
6. **Surgical Re-Roll**: Regenerate single component

**Why Third:**
- Depends on working async pipeline from Phase 2
- Provider abstraction easier to implement when pattern is established
- Composition requires all asset types to be functional

**Testing Milestone:** User generates full meditation, sees all assets, plays composed video, re-rolls voice

---

### Phase 4: Scale & Optimize (Weeks 11-14)
**Goal:** Production-ready, handles concurrent users, cost-optimized

**Components:**
1. **Horizontal Scaling**: Multiple workers, Redis Pub/Sub for WebSocket
2. **CDN Integration**: CloudFront for asset delivery
3. **Monitoring**: Job failure alerts, cost tracking dashboard
4. **Admin Dashboard**: View provider health, job queue status
5. **A/B Testing**: Route traffic to different providers
6. **Semantic Search**: pgvector for asset discovery
7. **Subscription Integration**: Stripe for payments
8. **Rate Limiting**: Per-tier request limits

**Why Fourth:**
- Requires production traffic to validate scaling strategy
- Monitoring reveals bottlenecks not visible in dev
- Payment integration can block launch; do last

**Testing Milestone:** 100 concurrent users, <5% job failure rate, <$X per meditation

---

### Phase 5: Advanced Features (Weeks 15+)
**Goal:** Differentiators and polish

**Components:**
1. **Multimodal Input**: Video/voice capture for persona creation
2. **Advanced Remixing**: Combine components from different meditations
3. **Collections**: Playlists and favorites
4. **Sharing**: Public meditation library
5. **Analytics**: Practice streaks, usage patterns
6. **Mobile App**: Native iOS/Android (or React Native)

**Why Last:**
- Not MVP-critical; validate core product first
- Some features may not be needed based on user feedback
- Can be developed in parallel with Phase 4 by separate team

---

## Scaling Considerations

### At 100 Users (MVP)
- **Frontend**: Single Vercel deployment (serverless)
- **Database**: Single PostgreSQL instance (Supabase/Neon free tier)
- **Redis**: Single instance (Upstash free tier)
- **Workers**: 1 worker per queue type (5 total), shared VPS
- **Storage**: S3 Standard
- **Expected Load**: ~10 jobs/hour, <1GB storage/day

### At 10K Users (Growth)
- **Frontend**: Vercel Pro (auto-scaling)
- **Database**: Managed PostgreSQL with read replicas (Supabase Pro)
- **Redis**: Redis Cloud with persistence
- **Workers**: 10-20 workers, Docker Swarm on dedicated servers
- **Storage**: S3 Intelligent-Tiering + CloudFront CDN
- **Costs**: Primary driver is provider API calls; optimize provider selection
- **Expected Load**: ~1000 jobs/hour, ~50GB storage/day

### At 1M Users (Scale)
- **Frontend**: Multi-region Vercel deployment
- **Database**: PostgreSQL with connection pooling (PgBouncer), partitioned tables
- **Redis**: Redis Cluster (multi-node)
- **Workers**: Kubernetes cluster with auto-scaling (50-200 pods)
- **Storage**: S3 + CDN + object lifecycle policies (archive old assets)
- **Cost Optimization**:
  - Cache generated assets (dedup similar requests)
  - Tiered storage (hot: CDN, warm: S3 Standard, cold: Glacier)
  - Provider negotiation (volume discounts)
  - Batching (combine small jobs)
- **Expected Load**: ~100K jobs/hour, ~5TB storage/day
- **Monitoring**: DataDog/New Relic for full observability

**Key Scaling Bottlenecks:**
1. **Database writes**: Asset creation and credit deductions are write-heavy; consider write-through cache or CQRS
2. **Provider rate limits**: Multi-provider abstraction enables failover; monitor per-provider quota
3. **FFmpeg workers**: CPU/memory intensive; consider AWS MediaConvert or dedicated GPU instances
4. **WebSocket connections**: Sticky sessions complicate load balancing; consider serverless WebSocket (AWS API Gateway WebSocket)

---

## Anti-Patterns to Avoid

### 1. ❌ Tight Coupling to Providers
**Problem:** Hardcode ElevenLabs API calls throughout codebase
**Consequence:** Switching providers requires changes in 20+ files, high risk of bugs
**Instead:** Use provider abstraction layer from day one (Phase 2)

### 2. ❌ Blocking API Requests
**Problem:** Wait for voice generation to complete before returning response to user
**Consequence:** 30-second request timeout, terrible UX
**Instead:** Async jobs + WebSocket progress updates (always)

### 3. ❌ Missing Idempotency in Credit Deductions
**Problem:** Network retry causes double-charge
**Consequence:** User loses credits, support tickets, angry users
**Instead:** Idempotency keys on all financial transactions (Phase 2)

### 4. ❌ Storing Large Files in Database
**Problem:** Save audio/video blobs in PostgreSQL BYTEA column
**Consequence:** Database bloat, slow queries, expensive backups
**Instead:** S3 for files, PostgreSQL for metadata (always)

### 5. ❌ No Provider Health Checks
**Problem:** Assume ElevenLabs API is always available
**Consequence:** All voice jobs fail silently when provider is down
**Instead:** Regular health checks + automatic failover to backup provider (Phase 3)

### 6. ❌ Single Giant Worker
**Problem:** One worker process handles all job types (voice, music, video, composition)
**Consequence:** GPU jobs block CPU jobs, inefficient resource usage
**Instead:** Dedicated queues and workers per job type (Phase 2)

### 7. ❌ No Asset Versioning
**Problem:** Overwrite voice asset when user re-rolls
**Consequence:** Can't undo, can't compare old vs new
**Instead:** Parent-child relationships with version tracking (Phase 3)

### 8. ❌ Ignoring Credit Costs During Development
**Problem:** Use most expensive providers (ElevenLabs premium voices) in dev/staging
**Consequence:** $1000+ bill before launch
**Instead:** Mock providers in dev, low-cost providers in staging, monitor costs weekly

---

## Sources Summary

This architecture is synthesized from the following authoritative sources:

### Multi-Agent Systems & Orchestration
- [AI Agent Orchestration Patterns - Azure](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [Multi-Agent Systems 2026 Guide](https://dev.to/eira-wexford/how-to-build-multi-agent-systems-complete-2026-guide-1io6)
- [Multi-Agent Orchestration](https://www.kore.ai/blog/what-is-multi-agent-orchestration)
- [Agentic AI Trends 2026](https://machinelearningmastery.com/7-agentic-ai-trends-to-watch-in-2026/)

### Content Generation Pipelines
- [ReelMind Content Pipeline](https://reelmind.ai/blog/the-content-pipeline-from-aigc-task-queue-to-final-video-sharing-on-the-platform)
- [Workflow Orchestration: AI Pipelines](https://medium.com/@omark.k.aly/workflow-orchestration-building-complex-ai-pipelines-c8504ab8306f)
- [Netflix Cosmos Platform](https://netflixtechblog.com/rebuilding-netflix-video-processing-pipeline-with-microservices-4e5e6310e359)

### Provider Abstraction
- [Multi-Provider AI Gateway - AWS](https://aws.amazon.com/blogs/machine-learning/streamline-ai-operations-with-the-multi-provider-generative-ai-gateway-reference-architecture/)
- [AI Layer Architecture](https://www.superblocks.com/blog/ai-layer)
- [Best TTS APIs 2026](https://www.speechmatics.com/company/articles-and-news/best-tts-apis-in-2025-top-12-text-to-speech-services-for-developers)

### Job Queue & Async Processing
- [BullMQ Job Queue 2026](https://oneuptime.com/blog/post/2026-01-06-nodejs-job-queue-bullmq-redis/view)
- [Building Scalable Job Queues with BullMQ](https://medium.com/@sanipatel0401/building-scalable-job-queues-with-bullmq-a-complete-guide-with-image-processing-example-88c58b550cb8)
- [BullMQ Documentation](https://docs.bullmq.io)

### Video Composition
- [Building Automated Video Processing Pipeline with FFmpeg](https://www.cincopa.com/learn/building-an-automated-video-processing-pipeline-with-ffmpeg)
- [FFmpeg High Availability](https://hoop.dev/blog/ffmpeg-high-availability-building-resilient-video-pipelines/)

### Credit Systems & Metering
- [SaaS Credits System Guide 2026](https://colorwhistle.com/saas-credits-system-guide/)
- [Credit-Based Pricing for AI Companies](https://flexprice.io/blog/best-credit-based-pricing-software-for-ai-companies)
- [How to Switch to Credit System 2026](https://medium.com/@lesiapolivod/how-to-switch-your-ai-product-to-a-credit-system-in-2026-and-why-you-must-a-data-driven-guide-6edf7a9a2e35)
- [Usage-Based Billing](https://www.getlago.com/blog/credit-based-pricing)

### Asset Management
- [Digital Asset Management Trends 2026](https://www.fotoware.com/blog/digital-asset-management-trends-2026)
- [AI in DAM 2026](https://www.aprimo.com/blog/ai-in-digital-asset-management-how-2026-is-changing-everything)
- [Digital Asset Library Guide](https://cloudinary.com/guides/digital-asset-management/digital-asset-library)

### Next.js & Modern Frameworks
- [Next.js App Router Advanced Patterns 2026](https://medium.com/@beenakumawat002/next-js-app-router-advanced-patterns-for-2026-server-actions-ppr-streaming-edge-first-b76b1b3dcac7)
- [Next.js Backend for Conversational AI 2026](https://www.sashido.io/en/blog/nextjs-backend-conversational-ai-2026)
- [Next.js Streaming Server Actions](https://jherr2020.medium.com/nextjss-amazing-new-streaming-server-actions-ef4f6e2b1ca2)

### Real-Time Updates
- [WebSockets for Real-Time Updates](https://www.gavant.com/library/using-websockets-for-real-time-updates-in-a-serverless-web-application)
- [Using WebSockets in React 2026](https://oneuptime.com/blog/post/2026-01-15-websockets-react-real-time-applications/view)
- [SSE vs WebSockets 2026](https://www.nimbleway.com/blog/server-sent-events-vs-websockets-what-is-the-difference-2026-guide)

### Database & State Management
- [PostgreSQL for AI Applications](https://medium.com/@richardhightower/building-ai-powered-search-and-rag-with-postgresql-and-vector-embeddings-09af314dc2ff)
- [Letta AI Agents with PostgreSQL](https://aws.amazon.com/blogs/database/how-letta-builds-production-ready-ai-agents-with-amazon-aurora-postgresql/)
- [Chat Application Database Schema](https://www.back4app.com/tutorials/how-to-design-a-database-schema-for-a-real-time-chat-and-messaging-app)

---

## Confidence Assessment

| Area | Confidence | Reasoning |
|------|------------|-----------|
| **Overall Architecture** | HIGH | Multi-layered pattern is industry standard for AI content apps; Netflix Cosmos validates at scale |
| **Multi-Agent System** | HIGH | 2026 patterns well-documented; LangChain/CrewAI proven for orchestration |
| **Async Job Pipeline** | HIGH | BullMQ widely adopted; pattern used by Reelmind and similar platforms |
| **Provider Abstraction** | MEDIUM | Strategy pattern is sound, but implementation details depend on specific provider APIs (need validation) |
| **Credit System** | HIGH | Multiple SaaS platforms use this pattern; event-driven ledger is best practice |
| **Asset Management** | MEDIUM | DAM patterns apply, but meditation-specific metadata needs domain validation |
| **Video Composition** | MEDIUM | FFmpeg is standard, but timing/layering logic specific to meditation videos needs prototyping |
| **Scaling Strategy** | MEDIUM | Based on general SaaS patterns; actual bottlenecks will emerge with real traffic |

---

## Open Questions for Phase-Specific Research

### Phase 2 (Async Pipeline):
- **Q:** Which voice provider offers best quality/cost ratio for meditation (calm, soothing tone)?
  - Need: A/B test ElevenLabs vs OpenAI vs Azure with sample scripts
- **Q:** How to handle job retries when provider rate-limited vs when provider returns error?
  - Need: Study each provider's error codes and design retry logic accordingly

### Phase 3 (Composition):
- **Q:** What FFmpeg filters best create meditation ambiance (audio ducking, fade transitions)?
  - Need: Prototype with sample assets, get user feedback on "meditation feel"
- **Q:** Should visuals be static images with pan/zoom (Ken Burns effect) or generated video clips?
  - Need: Cost analysis (generation time + credits) and user preference testing

### Phase 4 (Scale):
- **Q:** At what user count does single PostgreSQL instance become bottleneck?
  - Need: Load testing with realistic job distribution
- **Q:** Can we deduplicate similar requests (e.g., same script + same providers = cache result)?
  - Need: Measure cache hit rate vs freshness requirement (users want unique content)

### Phase 5 (Advanced):
- **Q:** How to handle multimodal persona input (video/voice analysis)?
  - Need: Research video processing APIs (Deepgram for transcription, OpenAI Vision for analysis)
- **Q:** What metadata schema best supports "find meditations similar to this one"?
  - Need: User research on discovery patterns, then design semantic search strategy

---

## Summary for Roadmap Creation

**Recommended Phase Structure:**

1. **Phase 1 (Foundation)**: Next.js + PostgreSQL + Vision Co-Pilot (text-only) + VPS
   - Validates core value prop (persona creation) without asset generation complexity
   - Establishes auth, data model, agent patterns

2. **Phase 2 (Async Pipeline)**: BullMQ + Workers + Credits + WebSocket + Single provider per type
   - Proves end-to-end generation flow with real costs
   - Unblocks user testing of full meditation experience

3. **Phase 3 (Multi-Provider & Composition)**: Provider abstraction + FFmpeg + Asset library + Re-rolls
   - Delivers differentiated features (surgical re-rolls, model-agnostic)
   - Requires Phase 2 pipeline to be stable

4. **Phase 4 (Scale & Optimize)**: Horizontal scaling + Monitoring + Subscriptions + Production hardening
   - Addresses bottlenecks discovered under load
   - Integrates payment system for revenue

5. **Phase 5 (Advanced Features)**: Multimodal input + Advanced remixing + Mobile app + Analytics
   - Nice-to-haves after core product validated
   - Can be deprioritized based on user feedback

**Critical Path Dependencies:**
- Auth → Agents → Content Pipeline → Asset Library
- Credit System must be in Phase 2 (before multi-user testing)
- Provider abstraction can wait until Phase 3 (single provider sufficient for MVP)
- Composition can be simplified in Phase 2 (e.g., voice-only, add music/visuals in Phase 3)

**Research Flags:**
- Phase 2: Deep dive on voice provider selection (quality, cost, latency)
- Phase 3: FFmpeg composition research (meditation-specific techniques)
- Phase 4: Load testing to validate scaling assumptions
