"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/versions/apply/ui/Section";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";

const PEOPLE = [
  { name: "Eckhart Tolle", image: "/images/social-proof/eckhart-tolle.jpg" },
  { name: "Joe Dispenza", image: "/images/social-proof/joe-dispenza.jpg" },
  { name: "Shefali Tsabury", image: "/images/social-proof/shefali-tsabury.jpg" },
  { name: "Les Brown", image: "/images/social-proof/les-brown.jpg" },
  { name: "Don Miguel Ruiz Sr", image: "/images/social-proof/don-miguel-ruiz.jpg" },
  { name: "Lewis Howes", image: "/images/social-proof/lewis-howes.jpg" },
  { name: "John Assaraf", image: "/images/social-proof/john-assaraf.jpg" },
  { name: "Brian Tracy", image: "/images/social-proof/brian-tracy.jpg" },
  { name: "Bob Proctor", image: "/images/social-proof/bob-proctor.jpg" },
  { name: "Sonia Ricotti", image: "/images/social-proof/sonia-ricotti.jpg" },
];

type TrustPoint = { title: string; text: string };
type ResultEntry = { category: string; verb: string; value: string; unit: string };
type Testimonial = { quote: string; name: string; role: string };

export function TrustSection() {
  const { t, tObjects } = useLanguage();
  const trustPoints = tObjects<TrustPoint>("trust.trustPoints");
  const results = tObjects<ResultEntry>("trust.results");
  const testimonials = tObjects<Testimonial>("trust.testimonials");

  return (
    <Section className="bg-brand-dark trust-glow-bg overflow-hidden !py-10 md:!py-14" id="trust" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <motion.div variants={fadeInUp} className="lg:col-span-7">
            <h2 className="text-[28px] font-bold text-white md:text-[34px] leading-tight text-balance">
              {t("trust.headline")}
            </h2>
            <p className="mt-6 text-xl text-slate-300">
              <span className="font-semibold text-white">{t("trust.intro_pre")}</span>
              {t("trust.intro_post")}
            </p>

            <div className="mt-10 space-y-6">
              {trustPoints.map((point, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
                    &#10003;
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{point.title}</h3>
                    <p className="text-slate-400">{point.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.p variants={fadeInUp} className="mt-10 text-slate-300 italic">
              {t("trust.closing")}
            </motion.p>
          </motion.div>

          <motion.div variants={fadeInUp} className="hidden lg:flex justify-end lg:col-span-5 relative">
            <div className="relative h-[22rem] w-[22rem] overflow-hidden rounded-[2rem] border-2 border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.15)] bg-white/5">
              <Image
                src="/images/social-proof/rehabit-mike-olaski-headshot-suit.png"
                alt="Mike Olaski"
                fill
                sizes="(max-width: 1024px) 100vw, 350px"
                className="object-cover object-top"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Featured Clients */}
        <motion.div variants={fadeInUp} className="mt-10">
          <p className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-slate-400">
            {t("trust.featured_label")}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-6">
            {PEOPLE.map((person) => (
              <motion.div
                key={person.name}
                variants={fadeInUp}
                className="group relative flex flex-col items-center"
              >
                <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-brand-green/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] md:h-28 md:w-28">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] font-semibold text-slate-500 transition-colors duration-300 group-hover:text-white md:text-xs">
                  {person.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Results Delivered */}
        <motion.div
          variants={fadeInUp}
          className="mt-10 mx-auto rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white md:text-2xl mb-8 text-center">{t("trust.results_headline")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {results.map((r, i) => {
              const colors = ["text-brand-green", "text-brand-blue", "text-brand-orange", "text-brand-gold"];
              return (
                <div key={i} className="flex flex-col items-center text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{r.category}</span>
                  <span className={`text-2xl font-bold mb-1 ${colors[i] ?? "text-white"}`}>{r.verb}</span>
                  <span className="text-lg text-slate-300 font-medium">{r.value}</span>
                  <span className="text-xs text-slate-500 uppercase">{r.unit}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div variants={fadeInUp} className="mt-10">
          <h3 className="text-xl font-bold text-white md:text-2xl mb-6 text-center">{t("trust.testimonials_headline")}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t_item) => (
              <div
                key={t_item.name}
                className="rounded-xl border border-brand-green/10 bg-brand-green/[0.04] p-6 flex flex-col gap-4"
              >
                <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{t_item.quote}&rdquo;</p>
                <div className="mt-auto">
                  <p className="text-sm font-bold text-white">{t_item.name}</p>
                  <p className="text-xs text-slate-500">{t_item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
