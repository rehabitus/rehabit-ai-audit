export const TWIN_LOCKED_COPY = {
  nav: {
    cta: "Get My Spot Now",
  },
  hero: {
    headlines: [
      "Get an AI Operating System for Your Coaching Business (So It Runs Without You)",
      "Become an AI‑Empowered Coach With a Digital Twin That Elevates Your Delivery and Frees Your Time",
      "Stop “Using AI.” Start Building an AI System That Buys Back 10–20 Hours a Week",
      "We Built an AI Clone of You. It Found $20,000 You Were Leaving on the Table.",
      "From Overwhelmed to AI-First: Your Digital Twin + Roadmap to Scale Without Burnout",
      "Become the Orchestrator: Your Digital Twin Runs Your Content, Client Ops, and Growth.",
      "You Don’t Need More Hustle. You Need an AI Twin That Finds the Money and Reclaims Your Time.",
      "Most Coaches Lose Revenue in Silence. Your AI Twin Exposes It Fast.",
      "What If Your AI Clone Could Find 20% More Profit Hiding in Your Workflow?",
      "Your Digital Twin Spots the Bottlenecks Costing Your Coaching Business Growth.",
      "AI Without a Method Is Just a Faster To‑Do List—Here’s the System That Fixes It ",
      "This AI Audit Turns Guesswork Into a Clear Growth Roadmap for Your Coaching Business.",
      "You’re Closer to Scaling Your Coaching Business Than You Think. Your AI Twin Proves It.",
    ],
    splitTest: {
      queryParam: "hh",
      storageKey: "twin_hero_headline_variant",
    },
    subheadline:
      "In 5 days, get a clear audit of how this digital twin can save you time & money with: content creation, social posting, admin emails, and lead follow up.",
    primaryCta: "Get My Twin in 5 Days",
  },
  bridge: {
    title: "💡 Your Digital Twin Is Powerful Alone. With the Full Audit, It Becomes Unstoppable.",
    line1: "",
    line2Prefix: "The ",
    line2Bold: "AI Transformation Audit & Implementation Report",
    line2Middle: " shows you ",
    line2Italic: "exactly",
    line2Suffix: " where to deploy it to stop the bleeding — and start compounding growth.",
  },
  video: {
    caption:
      "7 Minute Preview - Watch how we build your scalable Coaching Authority with your Digital Twin",
  },
  painSections: [
    {
      id: "use-case-sales",
      sup: "Sales Conversion",
      head: "Close more right-fit buyers with calm",
      headAccent: "consistency",
      sub:
        "Rehabit 4C turns your best sales instincts into a repeatable system—handling objections in your voice, sharpening the offer, and guiding each prospect to the right next step so fewer “hot” leads stall, ghost, or slip away.",
      metric: "2.1×",
      metricBenefit: "more qualified sales conversations",
      ctaButton: "Improve close rate",
      benefitTags: ["Objection handling", "Offer clarity", "Next-step routing"],
      image: "/images/pain-opportunity-features/new-digital-twin-chat-sales-followup.png",
    },
    {
      id: "use-case-leads",
      sup: "Lead Generation",
      head: "Wake up to better leads—not more",
      headAccent: "admin",
      sub:
        "Your Digital Twin qualifies, collects details, and follows up automatically—so you stop losing fit prospects to slow replies and messy intake.",
      metric: "3.4×",
      metricBenefit: "more qualified leads",
      ctaButton: "Grow with AI",
      benefitTags: ["Auto lead capture", "CRM sync", "No-code setup"],
      image: "/images/pain-opportunity-features/new-digital-twin-chat-lead-qualification.png",
    },
    {
      id: "use-case-content",
      sup: "Content Engine",
      head: "Scale your authority content",
      headAccent: "faster",
      sub:
        "Rehabit 4C turns one coaching session into a week of on-brand assets. Your Digital Twin extracts the best moments, drafts the posts/emails/clips, and keeps everything consistent with your frameworks—so you publish without starting from scratch.",
      metric: "10×",
      metricBenefit: "more usable content from one core source",
      ctaButton: "Scale my content",
      benefitTags: ["Session-to-content", "Multi-channel output", "Brand-safe"],
      image: "/images/pain-opportunity-features/new-digital-twin-chat-content-creation.png",
    },
    {
      id: "use-case-experience",
      sup: "Client Experience",
      head: "A premium AI coaching experience",
      headAccent: "premium",
      sub:
        "Your AI delivers support in your tone, using your methods and frameworks. Clients get fast, personal guidance between live sessions.",
      metric: "+$97",
      metricBenefit: "$20 - $100 per user per month in new product revenue",
      ctaButton: "Add New Revenue",
      benefitTags: ["Your voice, your methods", "Always available", "ICF-aligned"],
      image: "/images/pain-opportunity-features/new-digital-twin-chat-product-revenue.png",
    },
    {
      id: "use-case-engagement",
      sup: "Client Engagement",
      head: "Increase life-time value",
      headAccent: "between sessions",
      sub:
        "Between-session messaging keeps momentum high, improves completion, and creates more upsell and renewal moments by delivering timely nudges, check-ins, and next steps.",
      metric: "+27%",
      metricBenefit: "higher client continuation when support stays active between sessions",
      ctaButton: "Boost retention",
      benefitTags: ["Behavior nudges", "Progress check-ins", "Renewal triggers"],
      image: "/images/pain-opportunity-features/new-digital-twin-chat-user-engagement.png",
    },
  ],
  integrationSection: {
    id: "integration",
    title: "Integrations That Fit Your Workflow",
    sub:
      "Connect your Digital Twin to the tools you already use for lead capture, qualification, follow-up, and community delivery. We can finalize exact ingestion + deployment paths as your stack is confirmed.",
    features: [
      {
        title: "Connect in one layer",
        body: "Use secure connectors and API/webhook patterns to route lead + chat context into your CRM and automation stack.",
      },
      {
        title: "Deploy where buyers already are",
        body: "Embed on pages, forms, chat surfaces, and community touchpoints so high-intent conversations start in the right place.",
      },
      {
        title: "Ingest from your source of truth",
        body: "Train from docs, call notes, offers, FAQs, and messaging frameworks to keep responses consistent and on-brand.",
      },
      {
        title: "Escalate to humans when needed",
        body: "Use confidence thresholds and intent rules to hand off critical moments to your team without losing context.",
      },
    ],
  },
} as const;
