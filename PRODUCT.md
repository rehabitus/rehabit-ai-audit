# Rehabit 4C AI Coaching OS — Product Context

## The 4C Framework

The "4C" defines who we serve. Our ICP must meet all four criteria:

| C | Name | Definition |
|---|------|------------|
| **1st C** | **Conscious** | Focus on mindset, awareness, personal transformation — not just tactics. Works in coaching, personal development, health, relationships, or any field where inner change drives outer results. |
| **2nd C** | **Creative** | Already creating content — YouTube channel, podcast, community, book, or course. Has a methodology and a voice worth amplifying. |
| **3rd C** | **Connected** | Has traction: $500k–$5M annual revenue, 5k–500k subscribers/followers. Not building from zero — scaling from proof. |
| **4th C** | **Coach** | Delivers recurring transformation — retainers, group programs, memberships. Not one-off info products. Client LTV matters to them. |

**Disqualifiers:** Solopreneurs with no audience, pure e-commerce, one-off course creators without a recurring coaching model, non-conscious niches (pure tactics/growth hacking).

---

## ICP Profile: The Scaling Coach

**Current reality:**
- 200–5,000 active clients
- Team of 2–25 people (or solo fractional leaders with 5+ high-ticket clients)
- Using: Kajabi, Teachable, Skool, Circle, Zoom, ActiveCampaign
- Annual revenue: $500k–$5M
- Audience: 5k–500k subscribers/followers
- Model: Recurring revenue (retainers, group coaching, memberships)

**Core pain:** Can't scale personalization without losing quality. As they grow, the human touch that made them great gets diluted. Clients churn. Leads aren't nurtured. Content is exhausting to produce.

**What they want:** To serve more people without burning out. To keep the soul of their work while systematizing the delivery.

---

## The Product Ecosystem

### This Repo: Rehabit.ai AI Transformation Audit

**What it is:** The entry point to the 4C OS. A "human-first" AI audit — not just a tech audit, a *you* audit through the lens of what AI makes possible.

**Position in the value ladder:**
```
AI Transformation Audit ($1,200)  ←— THIS PRODUCT
        ↓
4C OS Full Implementation ($15,000–$30,000/year)
        ↓
Rehabit Pro SaaS ($97/month)
        ↓
Rehabit.us B2C App ($27–197/month)
```

**Who buys the Audit:**
- Coaches, course creators, platform operators losing revenue to broken workflows
- Not necessarily 4C-qualified yet — the audit *qualifies* them and introduces the OS
- Also: knowledge workers, creators, anyone navigating the AI shift

---

## Audit Product: What's Included

### Standard Audit ($1,200 — Founding Member Rate)

1. **The Deep Dive** — 90-minute strategy session. Business model, bottlenecks, strengths, blind spots. Identifies where AI creates leverage *and* where it would strip away what clients love.

2. **AI Transformation Blueprint** — Comprehensive, prioritized roadmap specific to their business, capacity, and values. What to automate. What to protect. What to reimagine.

3. **The Humanity Map** — Unique to Rehabit. Explicitly identifies the human elements that AI should *never* replace. Shows how AI can make those elements stronger, not weaker.

4. **First AI Implementation** — One working AI workflow, automation, or tool deployed in their business before the engagement ends. They leave with momentum, not just a plan.

5. **30-Day Follow-Up** — Check-in call 30 days later.

### Pay-in-Full Bonus (included — no extra charge)
**First Core AI System — built, tested, and delivered FREE** in the same 5-day audit window.
Standalone value: $3,000+. Your cost: $0. This is the primary closer — treat it as a headline, not a footnote.

---

## Pricing Model

**Pricing mechanic:** Review-based tier ladder. Price rises $500 with every 5 verified audit client reviews.
**Industry standard comparable:** $5,000–$15,000 for an AI readiness assessment

| Reviews | Price | Tier Label |
|---------|-------|------------|
| 0–4 | $500 | Early Access |
| 5–9 | $1,000 | Founding Member |
| 10–14 | $1,500 | Early Adopter |
| 15–19 | $2,000 | Standard |
| 20–24 | $2,500 | Standard+ |
| 25+ | $3,000 | Full Rate (cap) |

**How it works:**
- **One env var only: `REVIEW_COUNT`** — set on Vercel, update manually when a verified audit client leaves a review, then redeploy
- Only audit clients count — not B2C app users, not generic Trustpilot strangers
- "X slots left at this price" is auto-computed: `reviewsToNextTier = nextTier.minReviews - currentReviewCount`
- Trust bar count auto-shows at 5+ reviews, hides below 5 — same `REVIEW_COUNT` drives it
- Stripe checkout pulls live price at time of purchase — no hardcoded amount

**The framing:** "Price reflects proof. Right now you're getting in at the lowest this will ever be. Every review is a verified client who found $20k+ in savings — that's what moves the price."

**Tier complexity (Level 1 vs Level 2) — TBD:**
- Level 1 (Standard): Solo operator, standard audit → base tier price
- Level 2 (Complex): Multiple operators, larger org, requires multiple stakeholder interviews → custom quote
- For now: all audits start at base price. If Level 2 complexity is discovered post-booking, scope separately.

---

## Trust Widget Rules

The trust bar appears in the nav and hero. Governed by review count.

**Avatar style:** Person silhouettes (CSS head + shoulders) in 5 brand-color gradients. No external image deps. Swap for real photos by replacing gradient with `src: "/avatars/name.jpg"` in `NavTrustBar.tsx`.

**Count display logic:**
- **0–4 reviews** → label reads: *"Founders like **you**"* — no number shown
- **5+ reviews** → label reads: *"Trusted by **N** founders like you"* — count auto-shows
- Threshold is `SHOW_COUNT_THRESHOLD = 5` in `NavTrustBar.tsx`

**Why 5?** Specific (not a round number), feels earned not inflated, achievable in the first quarter, and coincides exactly with the move from Early Access ($500) to Founding Member ($1,000) — both milestones land at the same time.

**DO NOT show a number before 5 verified audit clients.** The ICP are sophisticated founders who will see through fake social proof instantly.

---

## The "Big 3" Systems (Full 4C OS)

These are what the Audit leads into:

**1. Journey Co-Pilot (Digital Twin Engine)**
- DeepSelf Digital Twin embedded in every client's journey
- Personalized check-ins, accountability, micro-coaching between calls
- Available 24/7 across web, mobile, WhatsApp, Telegram, community
- Reduces churn by providing continuous support between sessions

**2. Lead Generation (PersonaBot)**
- AI Scout finds ideal clients matching 4C criteria
- PersonaBot greets visitors, qualifies leads, books calls automatically
- Value-first outreach: builds them a free Digital Twin to prove competence

**3. Content Generation (Automated Thought Leadership)**
- Turns one piece of content into 20+ formats
- Custom meditations, affirmations, emails, posts — all in coach's voice
- Feeds Digital Twin's knowledge base automatically

---

## Guarantee

**"It Has to Sound Like You" Guarantee:**
- If the Digital Twin doesn't produce content that sounds like the client — we rebuild it until it does, or full refund.
- If the audit doesn't reveal at least $20,000 in annual savings opportunities — full refund. No questions.

---

## Full 4C OS Pricing (B2B)

| Offer | Price |
|-------|-------|
| Founding 50 (lifetime) | $30,000 |
| Founding 50 (annual × 3) | $15,000/year |
| Single system implementation | Variable |
| Rehabit Pro SaaS | $97/month |
| Syndicus (revenue share) | % model |

**Guarantee on full OS:** 30% increase in client LTV within 90 days or we work for free until achieved.

---

## Tech Stack (Audit Site)

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + Framer Motion
- Three.js / React Three Fiber (WebGL)
- Stripe ($1,200 checkout, promo codes enabled)
- Vercel (auto-deploy from `main`)
- Repo: github.com/rehabitus/rehabit-ai-audit
- Live: rehabit-ai-audit.vercel.app

---

## Key Copy Assets

**Hero headline options (from Notion):**
- "Something Big Is Happening. You Get to Choose How You Meet It."
- "AI is rewriting every industry. The question isn't whether it will change your business — it's whether *you* will be the one directing that change."

**Core reframe:**
> "The people who will thrive aren't the ones who adopt AI fastest. They're the ones who adopt it most consciously."

**The Rehabit difference:**
> "Every other AI consultant will tell you to automate everything and move fast. That's not transformation. That's panic with a spreadsheet."
