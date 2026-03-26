"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { CTAButton } from "@/components/versions/twin/ui/CTAButton";

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
  image?: string;
};

const USE_CASES: UseCase[] = [
  {
    id: "use-case-sales",
    eyebrow: "Sales Conversion",
    title: "Close more right-fit buyers with calm",
    accent: "consistency",
    body:
      "Rehabit 4C turns your best sales instincts into a repeatable system—handling objections in your voice, sharpening the offer, and guiding each prospect to the right next step so fewer “hot” leads stall, ghost, or slip away.",
    cta: "Improve close rate",
    chips: ["Objection handling", "Offer clarity", "Next-step routing"],
    stat: "2.1×",
    statBody: "more qualified sales conversations",
    image: "/images/pain-opportunity-features/new-digital-twin-chat-sales-followup.png",
  },
  {
    id: "use-case-leads",
    eyebrow: "Lead Generation",
    title: "Wake up to better leads—not more",
    accent: "admin",
    body:
      "Your Digital Twin qualifies, collects details, and follows up automatically—so you stop losing fit prospects to slow replies and messy intake.",
    cta: "Grow with AI",
    chips: ["Auto lead capture", "CRM sync", "No-code setup"],
    stat: "3.4×",
    statBody: "more qualified leads",
    image: "/images/pain-opportunity-features/new-digital-twin-chat-lead-qualification.png",
  },
  {
    id: "use-case-content",
    eyebrow: "Content Engine",
    title: "Scale your authority content",
    accent: "faster",
    body:
      "Rehabit 4C turns one coaching session into a week of on-brand assets. Your Digital Twin extracts the best moments, drafts the posts/emails/clips, and keeps everything consistent with your frameworks—so you publish without starting from scratch.",
    cta: "Scale my content",
    chips: ["Session-to-content", "Multi-channel output", "Brand-safe"],
    stat: "10×",
    statBody: "more usable content from one core source",
    image: "/images/pain-opportunity-features/new-digital-twin-chat-content-creation.png",
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
    image: "/images/pain-opportunity-features/new-digital-twin-chat-product-revenue.png",
  },
  {
    id: "use-case-engagement",
    eyebrow: "Client Engagement",
    title: "Increase life-time value",
    accent: "between sessions",
    body:
      "Between-session messaging keeps momentum high, improves completion, and creates more upsell and renewal moments by delivering timely nudges, check-ins, and next steps.",
    cta: "Boost retention",
    chips: ["Behavior nudges", "Progress check-ins", "Renewal triggers"],
    stat: "+27%",
    statBody: "higher client continuation when support stays active between sessions",
    image: "/images/pain-opportunity-features/new-digital-twin-chat-user-engagement.png",
  },
];

export function UseCaseSections() {
  return (
    <div>
      {USE_CASES.map((useCase, index) => {
        const reverse = index % 2 === 1;
        const bg = index % 2 === 0 ? "bg-slate-50" : "bg-[#eef2f7]";

        return (
          <section key={useCase.id} id={useCase.id} className={`${bg} px-6 py-16 md:py-24`}>
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
                <div className="mt-8">
                  <CTAButton className="px-6 py-3 text-base">
                    {useCase.cta} →
                  </CTAButton>
                </div>
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
                {useCase.image ? (
                  <div className="relative w-full pb-14">
                    <div className="relative w-full overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] aspect-[16/10]">
                      <Image
                        src={useCase.image}
                        alt={`${useCase.eyebrow} feature`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 520px"
                        className="object-contain bg-slate-100"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-slate-950/55 to-transparent" />
                    </div>
                    <div className="absolute -bottom-1 right-[-0.25rem] z-10 w-[52%] rounded-2xl border border-slate-200/70 bg-white/95 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-sm">
                      <p className="text-5xl font-black tracking-tight text-emerald-400">
                        {useCase.stat}
                      </p>
                      <p className="mt-1 text-lg leading-snug text-slate-700">
                        {useCase.statBody}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-3xl border border-white/80 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                    <p className="text-6xl font-black tracking-tight text-emerald-300">
                      {useCase.stat}
                    </p>
                    <p className="mt-3 text-xl text-slate-500">{useCase.statBody}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
