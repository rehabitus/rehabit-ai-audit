"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeInUp, staggerContainer, scaleIn, viewportOnce } from "@/lib/animations";
import { credentials } from "@/lib/constants";

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

export function TrustSection() {
  return (
    <Section className="bg-brand-dark trust-glow-bg overflow-hidden" id="trust" noAnimate>
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white md:text-4xl">
          Built by someone who&rsquo;s done this before.
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Mike Olaski</span>&nbsp;&mdash;
          founder of Rehabit and the 4C AI Coaching OS. Not a consultant who read a book about AI.
          Someone who builds and deploys these systems every day.
        </motion.p>
        <motion.ul variants={staggerContainer} className="mt-8 space-y-4">
          {credentials.map((item, i) => (
            <motion.li key={i} variants={fadeInUp} className="flex items-start gap-3">
              <motion.span
                variants={scaleIn}
                className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-green"
              />
              <span className="text-slate-300">{item}</span>
            </motion.li>
          ))}
        </motion.ul>
        <motion.p variants={fadeInUp} className="mt-8 text-lg text-slate-300 leading-relaxed">
          We&rsquo;ve seen what works, what fails, and what wastes money. Our job is to make sure
          you only invest in what works.
        </motion.p>

        {/* Featured Clients Integration */}
        <motion.div variants={fadeInUp} className="mt-20">
          <p className="mb-10 text-center text-sm font-bold uppercase tracking-widest text-slate-400">
            Worked with or on Projects Featuring:
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

        {/* Results delivered summary */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 mx-auto max-w-3xl rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white md:text-2xl mb-8 text-center">Results Delivered</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-brand-green mb-1">Generated</span>
              <span className="text-lg text-slate-300 font-medium">$75,000 / mo</span>
              <span className="text-xs text-slate-500 uppercase">in MRR for agency</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-brand-blue mb-1">Built</span>
              <span className="text-lg text-slate-300 font-medium">250,000</span>
              <span className="text-xs text-slate-500 uppercase">email list in 18 mo</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-brand-orange mb-1">Systems</span>
              <span className="text-lg text-slate-300 font-medium">7-Figure</span>
              <span className="text-xs text-slate-500 uppercase">Coaching Launch</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
