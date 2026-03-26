"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { CTAButton } from "@/components/versions/twin/ui/CTAButton";
import { TWIN_LOCKED_COPY } from "@/components/versions/twin/constants";

export function UseCaseSections() {
  return (
    <div>
      {TWIN_LOCKED_COPY.painSections.map((useCase, index) => {
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
                  {useCase.sup}
                </p>
                <h3 className="max-w-xl text-4xl font-extrabold leading-[1.05] text-slate-900 md:text-5xl text-balance">
                  {useCase.head}{" "}
                  <span className="text-emerald-400">{useCase.headAccent}</span>
                </h3>
                <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-600 text-balance">
                  {useCase.sub}
                </p>
                <div className="mt-8">
                  <CTAButton className="px-6 py-3 text-base">
                    {useCase.ctaButton} →
                  </CTAButton>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {useCase.benefitTags.map((chip) => (
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
                        alt={`${useCase.sup} feature`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 520px"
                        className="object-contain bg-slate-100"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-slate-950/55 to-transparent" />
                    </div>
                    <div className="absolute -bottom-1 right-[-0.25rem] z-10 w-[52%] rounded-2xl border border-slate-200/70 bg-white/95 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-sm">
                      <p className="text-5xl font-black tracking-tight text-emerald-400">
                        {useCase.metric}
                      </p>
                      <p className="mt-1 text-lg leading-snug text-slate-700">
                        {useCase.metricBenefit}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-3xl border border-white/80 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                    <p className="text-6xl font-black tracking-tight text-emerald-300">
                      {useCase.metric}
                    </p>
                    <p className="mt-3 text-xl text-slate-500">{useCase.metricBenefit}</p>
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
