"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/versions/twin/ui/Section";
import { CTAButton } from "@/components/versions/twin/ui/CTAButton";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import type { PricingInfo } from "@/lib/pricing";

type StoryCard = {
  title: string;
  body: string;
};

type StorySection = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  kicker: string;
  body: string[];
  bullets?: string[];
  cards?: StoryCard[];
  quote?: string;
};

const STORY_ACCENTS = [
  {
    sectionClass: "bg-white",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700",
    cardClass: "border-sky-100 bg-sky-50/70",
  },
  {
    sectionClass: "bg-slate-50",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cardClass: "border-emerald-100 bg-emerald-50/70",
  },
  {
    sectionClass: "bg-white",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    cardClass: "border-amber-100 bg-amber-50/70",
  },
];

export function TwinStorySections() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d: PricingInfo) => setPricing(d))
      .catch(() => {});
  }, []);

  const currentPrice = pricing?.priceUsd ?? 1000;
  const nextPrice = pricing?.nextPriceUsd ?? null;
  const slotsLeft = pricing?.slotsRemaining ?? null;

  const sections: StorySection[] = [
    {
      id: "story-hook",
      number: "01",
      eyebrow: "The Hook",
      title: "You do not need more hustle. You need a new operating system.",
      kicker: "The real unlock is not another app. It is a better way to think, decide, and delegate.",
      body: [
        "Most founders, coaches, and creators are trying to solve an Intelligence Age problem with Industrial Age habits. More tabs. More tasks. More manual follow-up. More dependence on your own attention.",
        "The result is not scale. It is cognitive drag. The page, the funnel, the sales process, the onboarding flow, and the client experience all depend on you staying switched on for too many small decisions.",
      ],
      bullets: [
        "Your revenue should not depend on your nervous system",
        "Your business should remember what your team forgets",
        "Your systems should get smarter each week, not more fragile",
      ],
    },
    {
      id: "story-problem",
      number: "02",
      eyebrow: "The Problem",
      title: "The old model treats people like operators, then blames them for burning out.",
      kicker: "WHO defines burn-out as a syndrome from chronic workplace stress that has not been successfully managed.",
      body: [
        "For decades, work was designed around repetition, supervision, and human compliance. That logic still shows up in modern online businesses: manual handoffs, scattered information, repeated fixes, and constant inbox triage.",
        "When the founder becomes the router for every decision, the business starts to look efficient from the outside and exhausting from the inside. The issue is rarely effort. The issue is design.",
      ],
      cards: [
        {
          title: "The Industrial Age Lie",
          body: "If you are smart enough and disciplined enough, you can hold the whole machine together yourself.",
        },
        {
          title: "The Burnout Trap",
          body: "The more competent you are, the more invisible work the business sends back to you.",
        },
      ],
    },
    {
      id: "story-shift",
      number: "03",
      eyebrow: "The Shift",
      title: "Welcome to the Intelligence Age.",
      kicker: "The question is no longer who can do the most work. It is who can design the best system for thinking and action.",
      body: [
        "AI changes the economics of execution. Tasks that used to require constant human attention can now be handled, reviewed, or prepared by software systems that work with context, memory, and tools.",
        "That does not make human judgment less valuable. It makes judgment more valuable. The advantage shifts from doing everything yourself to building the environment where the right things happen without your direct intervention.",
      ],
      bullets: [
        "Less manual coordination",
        "More leverage per decision",
        "More room for strategy, teaching, and creation",
      ],
    },
    {
      id: "story-method",
      number: "04",
      eyebrow: "The Rehabit Method",
      title: "Transformation starts with three habits.",
      kicker: "Before you automate, you need a better way to see, model, and direct the business.",
      cards: [
        {
          title: "See the system",
          body: "Identify the hidden loops, breakdowns, and dependencies that keep stealing time and margin.",
        },
        {
          title: "Build the twin",
          body: "Create a living model of how the business should think, route work, and make decisions.",
        },
        {
          title: "Train the agents",
          body: "Turn your best processes into repeatable execution layers that reduce delay and drift.",
        },
      ],
      body: [
        "This is why the audit matters. It gives you a sequence for changing the business without guessing which tool, workflow, or hire should come first.",
      ],
    },
    {
      id: "story-agency-agents",
      number: "05",
      eyebrow: "Agency & Agents",
      title: "AI should give you more agency, not less.",
      kicker: "The best systems do not replace leadership. They give leadership reach.",
      body: [
        "Many teams approach AI as a shortcut for content, cheap labor, or surface-level productivity. That misses the point. The real leverage comes when AI helps you reclaim control over execution quality, follow-through, and operational memory.",
        "An agent is useful when it reduces chaos and increases choice. If it creates more supervision overhead than it removes, it is not leverage yet.",
      ],
      bullets: [
        "Agency means you can direct the business instead of constantly rescuing it",
        "Agents should remove repeated decision load",
        "The goal is trustworthy execution, not novelty",
      ],
    },
    {
      id: "story-what-is-an-agent",
      number: "06",
      eyebrow: "What an Agent Actually Is",
      title: "An AI agent is not magic. It is a system with context, rules, tools, and an objective.",
      kicker: "When people say agent, they often mean very different things. Clarity matters.",
      cards: [
        {
          title: "Context",
          body: "What the agent knows about your offer, audience, business rules, and current state.",
        },
        {
          title: "Tools",
          body: "What the agent can read, write, trigger, search, or update across your stack.",
        },
        {
          title: "Logic",
          body: "How it decides what to do, when to escalate, and what good output looks like.",
        },
        {
          title: "Feedback",
          body: "How the system improves through review, outcomes, and tighter operating constraints.",
        },
      ],
      body: [
        "The point of the audit is to show where those ingredients already exist in your business, and where they are missing. Most businesses have more raw material for agents than they think. They simply do not have the architecture yet.",
      ],
    },
    {
      id: "story-not",
      number: "07",
      eyebrow: "What This Is Not",
      title: "This is not hype, a prompt pack, or a generic automation teardown.",
      kicker: "A lot of AI consulting is still too shallow to change economics.",
      cards: [
        {
          title: "Not a shiny tools list",
          body: "You do not need more software without a stronger model for using it.",
        },
        {
          title: "Not a random prompt bundle",
          body: "Prompts without process design turn into busywork with better wording.",
        },
        {
          title: "Not a one-size-fits-all funnel audit",
          body: "The right architecture depends on your delivery model, audience, and constraints.",
        },
      ],
      body: [
        "This offer is built to expose operational leverage. That means identifying where intelligence should live in the business, where humans should stay in the loop, and where execution should stop depending on memory.",
      ],
    },
    {
      id: "story-identity",
      number: "08",
      eyebrow: "The Identity Shift",
      title: "The move is from consumer to conscious creator.",
      kicker: "The businesses that win will not be the ones that use the most AI tools. They will be the ones that design the clearest systems.",
      body: [
        "A consumer asks, which tool should I buy next. A conscious creator asks, what kind of machine am I trying to build here, and what role should intelligence play inside it.",
        "That identity shift changes how you hire, document, delegate, and prioritize. You stop treating AI as a trick and start treating it as infrastructure.",
      ],
      quote:
        "You do not become more powerful by adding more noise. You become more powerful by designing clearer systems.",
    },
    {
      id: "story-who-this-is-for",
      number: "09",
      eyebrow: "Who This Is For",
      title: "This is built for the 4C coach and operator-led expert business.",
      kicker: "Especially if your brand promise is strong, but your back-end execution is still too manual.",
      bullets: [
        "Coaches and educators with premium offers and too much founder dependency",
        "Course creators with fragmented onboarding, fulfillment, or support workflows",
        "Platform operators with strong traffic but weak follow-through after lead capture",
        "Teams sitting on valuable knowledge that still lives in people, not systems",
      ],
      body: [
        "If you already have demand, clients, audience trust, or an offer that works, this audit helps you convert that momentum into durable operating leverage.",
      ],
    },
    {
      id: "story-digital-twin",
      number: "10",
      eyebrow: "The Digital Twin",
      title: "Every serious system needs a digital twin.",
      kicker: "IBM defines a digital twin as a virtual representation of an object or system that reflects its real-world counterpart and supports monitoring, simulation, and decision-making.",
      body: [
        "In a business context, your digital twin is the model of how the company should operate: what matters, how information moves, what decisions need to be made, and what good execution looks like.",
        "Without that model, your tools stay disconnected. With it, agents become useful because they are no longer guessing what the business is trying to do.",
      ],
      bullets: [
        "A digital twin turns tribal knowledge into system knowledge",
        "It gives agents a map instead of a blank page",
        "It helps you simulate bottlenecks before they become revenue leaks",
      ],
    },
    {
      id: "story-social-proof",
      number: "11",
      eyebrow: "Social Proof",
      title: "The point is not borrowed authority. It is pattern recognition.",
      kicker: "The names, offers, and outcomes behind this work matter because they expose repeating operational problems across high-value businesses.",
      body: [
        "Mike's advantage is not theory alone. It is seeing how premium education, transformation, and expert-led businesses actually break when growth outpaces systems. Messaging gets ahead of delivery. Sales gets ahead of onboarding. Demand gets ahead of follow-through.",
        "That pattern recognition is what makes the audit useful. You are not paying for generic advice. You are paying for a sharper diagnosis of where your business is leaking leverage and what to build next.",
      ],
      cards: [
        {
          title: "Story",
          body: "Years of seeing the gap between front-end promise and back-end execution.",
        },
        {
          title: "Credentials",
          body: "Strategic and operational exposure across creator, education, and transformation businesses.",
        },
        {
          title: "Results",
          body: "A bias toward systems that improve speed, consistency, and margin instead of adding more work.",
        },
      ],
    },
    {
      id: "story-value-stack",
      number: "12",
      eyebrow: "The Value Stack",
      title: "You are not buying a diagnosis alone. You are buying clarity, sequence, and leverage.",
      kicker: "The goal is to leave with a stronger model of the business and a sharper path forward.",
      bullets: [
        "A full audit of where intelligence should live in the business",
        "A digital-twin style map of workflows, bottlenecks, and decision points",
        "Clear recommendations for what to automate, what to agentize, and what to keep human",
        "A priority order for implementation so the next move is obvious",
      ],
      body: [
        "The real value is not a PDF. It is the reduction in uncertainty. You stop guessing which bottleneck matters most and start acting on the highest-leverage opportunities first.",
      ],
    },
    {
      id: "story-pricing-offer",
      number: "13",
      eyebrow: "Prime Pricing & The Offer",
      title: `The current founding rate is $${currentPrice.toLocaleString()}.`,
      kicker: "This is launch pricing for businesses willing to move before the offer matures upward.",
      body: [
        "The founding rate exists because the brand is early, not because the value is small. The price is designed to reward speed while the case base, reviews, and market positioning are still compounding.",
        nextPrice
          ? `When the next pricing threshold is hit, the offer moves up to $${nextPrice.toLocaleString()}.`
          : "This price is not positioned as permanent. It is positioned as early.",
      ],
      cards: [
        {
          title: "What you buy",
          body: "A strategic audit, a systems map, and a prioritized path to implementation.",
        },
        {
          title: "Why now",
          body: slotsLeft && slotsLeft > 0
            ? `${slotsLeft} founding slots remain at the current rate.`
            : "The best time to buy is before social proof pushes the offer upward.",
        },
      ],
    },
    {
      id: "story-guarantee",
      number: "14",
      eyebrow: "The Guarantee",
      title: "Zero-risk should mean zero hedging.",
      kicker: "If the audit does not uncover meaningful value, the offer should not feel dangerous to buy.",
      body: [
        "Risk reversal matters because most service offers still ask the buyer to absorb too much uncertainty. This one should feel different. The logic is simple: if the diagnosis is sharp, the next steps become clearer and more valuable immediately.",
        "That is why the guarantee sits at the center of the page, not in the fine print. Confidence should be visible.",
      ],
      quote:
        "A strong guarantee is not decoration. It is proof that the offer is built to create a measurable shift in clarity.",
    },
    {
      id: "story-bigger-vision",
      number: "15",
      eyebrow: "The Bigger Vision",
      title: "This is bigger than automation. It is about how work changes when intelligence becomes abundant.",
      kicker: "OECD notes that AI can improve productivity and job quality, while also creating risks around agency and oversight. That is the real design challenge.",
      body: [
        "We are moving into a world where execution becomes cheaper, memory becomes externalized, and coordination can be partially delegated. The winners will not simply cut labor. They will redesign the role of human judgment inside the business.",
        "That is why this matters now. The first wave will go to the builders who learn how to pair purpose with systems, and speed with stewardship.",
      ],
      bullets: [
        "More intelligence does not remove the need for values",
        "Abundant execution makes architecture more important",
        "The future belongs to businesses that can think clearly at scale",
      ],
    },
    {
      id: "story-close",
      number: "16",
      eyebrow: "The Close",
      title: "If your business already has traction, the next leap is architectural.",
      kicker: "The audit is the fastest way to see what the business could become with clearer systems, stronger memory, and more leverage per decision.",
      body: [
        "You do not need to rebuild everything at once. You need to see the machine clearly enough to know where to start. That is what this process gives you.",
        "If you are ready to move from heroic effort to designed intelligence, this is the next step.",
      ],
    },
  ];

  return (
    <>
      {sections.map((section, index) => {
        const accent = STORY_ACCENTS[index % STORY_ACCENTS.length];
        const isFinal = section.id === "story-close";

        return (
          <Section
            key={section.id}
            id={section.id}
            className={`${accent.sectionClass} border-t border-slate-200/80`}
            noAnimate
          >
            <motion.div
              className="mx-auto max-w-6xl"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
                <div>
                  <motion.div
                    variants={fadeInUp}
                    className={`inline-flex items-center gap-3 rounded-full border px-4 py-1.5 text-sm font-semibold ${accent.badgeClass}`}
                  >
                    <span className="font-mono text-xs">{section.number}</span>
                    <span>{section.eyebrow}</span>
                  </motion.div>

                  <motion.h2
                    variants={fadeInUp}
                    className="mt-6 max-w-4xl text-3xl font-bold leading-tight text-slate-950 md:text-5xl text-balance"
                  >
                    {section.title}
                  </motion.h2>

                  <motion.p
                    variants={fadeInUp}
                    className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-600 text-balance"
                  >
                    {section.kicker}
                  </motion.p>

                  <div className="mt-8 space-y-5">
                    {section.body.map((paragraph) => (
                      <motion.p
                        key={paragraph}
                        variants={fadeInUp}
                        className="max-w-3xl text-base leading-8 text-slate-700 md:text-lg"
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>

                  {section.bullets && (
                    <motion.ul variants={fadeInUp} className="mt-8 grid gap-4 md:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium leading-7 text-slate-700 shadow-[0_12px_40px_rgba(15,23,42,0.04)]"
                        >
                          <span className="mr-2 text-brand-orange">+</span>
                          {bullet}
                        </li>
                      ))}
                    </motion.ul>
                  )}

                  {section.quote && (
                    <motion.blockquote
                      variants={fadeInUp}
                      className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-6 text-xl font-medium leading-relaxed text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
                    >
                      {section.quote}
                    </motion.blockquote>
                  )}

                  {isFinal && (
                    <motion.div variants={fadeInUp} className="mt-10">
                      <CTAButton location="final_cta">Reserve Your Audit</CTAButton>
                    </motion.div>
                  )}
                </div>

                <motion.div variants={fadeInUp} className="lg:pt-20">
                  {section.cards ? (
                    <div className="grid gap-4">
                      {section.cards.map((card) => (
                        <div
                          key={card.title}
                          className={`rounded-[1.75rem] border p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] ${accent.cardClass}`}
                        >
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {card.title}
                          </p>
                          <p className="mt-3 text-base leading-7 text-slate-700">
                            {card.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`rounded-[2rem] border p-8 shadow-[0_18px_60px_rgba(15,23,42,0.05)] ${accent.cardClass}`}>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Why this section matters
                      </p>
                      <p className="mt-4 text-lg leading-8 text-slate-700">
                        Each story block is designed to move the reader from insight to conviction, so the offer feels like the logical next step rather than a hard sell.
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </Section>
        );
      })}
    </>
  );
}
