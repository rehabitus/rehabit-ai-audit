"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";

import { useState } from "react";
import { BookingQualificationModal } from "@/components/ui/BookingQualificationModal";
import { useLanguage } from "@/context/LanguageContext";

export default function CancelPage() {
    const [surveyOpen, setSurveyOpen] = useState(false);
    const { t, localizeHref } = useLanguage();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-brand-dark px-6 text-center">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-2xl"
            >
                <motion.div
                    variants={fadeInUp}
                    className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-brand-orange/20 text-brand-orange"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-12 w-12"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    className="text-4xl font-extrabold text-white md:text-5xl"
                >
                    {t("cancel.headline")}
                </motion.h1>

                <motion.p
                    variants={fadeInUp}
                    className="mt-6 text-xl text-slate-300"
                >
                    {t("cancel.body")}
                </motion.p>

                <motion.div
                    variants={fadeInUp}
                    className="mt-12 grid gap-6 md:grid-cols-2"
                >
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-left">
                        <h3 className="font-bold text-white mb-2">{t("cancel.questions_title")}</h3>
                        <p className="text-sm text-slate-400 mb-4">{t("cancel.questions_body")}</p>
                        <button
                            onClick={() => setSurveyOpen(true)}
                            className="text-brand-green font-semibold hover:underline"
                        >
                            {t("cancel.questions_cta")}
                        </button>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-left">
                        <h3 className="font-bold text-white mb-2">{t("cancel.info_title")}</h3>
                        <p className="text-sm text-slate-400 mb-4">{t("cancel.info_body")}</p>
                        <Link
                            href={localizeHref("/#faq")}
                            className="text-brand-green font-semibold hover:underline"
                        >
                            {t("cancel.info_cta")}
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="mt-12">
                    <Link
                        href={localizeHref("/")}
                        className="inline-block rounded-lg border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
                    >
                        {t("cancel.back_home")}
                    </Link>
                </motion.div>
            </motion.div>

            <BookingQualificationModal
                isOpen={surveyOpen}
                onClose={() => setSurveyOpen(false)}
            />
        </main>
    );
}
