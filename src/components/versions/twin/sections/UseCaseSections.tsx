"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

type UseCase = {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  cta: string;
  chips: string[];
  stat: string;
  statBody: string;
  icon: string;
};

const USE_CASES: UseCase[] = [
  {
    id: "use-case-leads",
    eyebrow: "Lead Generation",
    title: "Generate qualified leads",
    accent: "24/7",
    body:
      "Your AI chats to visitors, answers questions, and captures contact details while you coach. Every lead is pre-qualified before it reaches your inbox.",
    cta: "Grow with AI",
    chips: ["Auto lead capture", "CRM sync", "No-code setup"],
    stat: "3.4×",
    statBody: "more qualified leads vs. contact forms alone",
    icon: "🎯",
  },
  {
    id: "use-case-experience",
    eyebrow: "Client Experience",
    title: "A premium AI coaching experience",
    accent: "premium",
    body:
      "Your AI delivers support in your tone, using your methods and frameworks. Clients get fast, personal guidance between live sessions.",
    cta: "Create my AI",
    chips: ["Your voice, your methods", "Always available", "ICF-aligned"],
    stat: "5+",
    statBody: "hours saved per week by top coaches using Rehabit AI",
    icon: "🤖",
  },
  {
    id: "use-case-content",
    eyebrow: "Content Engine",
    title: "Scale your authority content",
    accent: "faster",
    body:
      "Turn one coaching session into emails, posts, short clips, and lead magnets without starting from scratch each time.",
    cta: "Scale my content",
    chips: ["Session-to-content", "Multi-channel output", "Brand-safe"],
    stat: "10×",
    statBody: "more usable content from one core source",
    icon: "✍️",
  },
  {
    id: "use-case-followup",
    eyebrow: "Sales Follow-Up",
    title: "Never lose hot leads to delay",
    accent: "again",
    body:
      "Your Digital Twin handles instant responses, remembers context, and keeps prospects moving until they book or buy.",
    cta: "Automate follow-up",
    chips: ["Instant response", "Context memory", "Pipeline nudges"],
    stat: "<5m",
    statBody: "median first-response time after lead capture",
    icon: "⚡",
  },
];

export function UseCaseSections() {
  return (
    <div>
      {USE_CASES.map((useCase, index) => {
        const reverse = index % 2 === 1;
        const bg = index % 2 === 0 ? "bg-slate-50" : "bg-[#eef2f7]";
        const spacing =
          index === 0 ? "px-6 pb-16 pt-8 md:pb-24 md:pt-12" : "px-6 py-16 md:py-24";

        return (
          <section key={useCase.id} id={useCase.id} className={`${bg} ${spacing}`}>
            <motion.div
              className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className={`${reverse ? "md:order-2" : ""}`}
              >
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800/80">
                  {useCase.eyebrow}
                </p>
                <h3 className="max-w-xl text-4xl font-extrabold leading-[1.05] text-slate-900 md:text-5xl text-balance">
                  {useCase.title}{" "}
                  <span className="text-emerald-400">{useCase.accent}</span>
                </h3>
                <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-600 text-balance">
                  {useCase.body}
                </p>
                <p className="mt-8 text-lg font-semibold text-emerald-800">
                  {useCase.cta} →
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {useCase.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-slate-200/70 px-4 py-2 text-sm font-semibold text-slate-600"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className={`${reverse ? "md:order-1" : ""}`}
              >
                <div className="relative rounded-3xl border border-white/80 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                  <div className="absolute -top-9 left-6 flex h-18 w-18 items-center justify-center rounded-full bg-slate-900 text-2xl shadow-[0_10px_30px_rgba(15,23,42,0.25)]">
                    <span aria-hidden>{useCase.icon}</span>
                  </div>
                  <div className="pt-10">
                    <p className="text-6xl font-black tracking-tight text-emerald-300">
                      {useCase.stat}
                    </p>
                    <p className="mt-3 text-xl text-slate-500">{useCase.statBody}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
