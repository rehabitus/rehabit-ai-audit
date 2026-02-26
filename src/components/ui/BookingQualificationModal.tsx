"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BOOKING_QUESTIONS = [
  {
    id: "business_type",
    category: "Client Type",
    question: "What best describes your business?",
    options: [
      "Coach or Consultant",
      "Course Creator / Educator",
      "Online Platform or Community",
      "Agency or Service Business",
    ],
  },
  {
    id: "revenue",
    category: "Capacity",
    question: "What's your approximate annual revenue?",
    options: ["Under $50K", "$50K–$250K", "$250K–$1M", "$1M+"],
  },
  {
    id: "pain_point",
    category: "Core Challenge",
    question: "Where is your biggest operational bottleneck right now?",
    options: [
      "Too much manual admin work between tools",
      "Client onboarding and delivery takes too long",
      "Content creation is eating my time",
      "Client retention and engagement",
    ],
  },
  {
    id: "commitment",
    category: "Commitment",
    question: "How ready are you to invest in AI solutions?",
    options: [
      "Ready now — I have budget and want to move fast",
      "Evaluating — want to decide in the next 30–60 days",
      "Still exploring — not ready to commit yet",
      "No budget available right now",
    ],
  },
] as const;

type Phase = "intro" | "questions" | "loading" | "qualified" | "redirect";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingQualificationModal({ isOpen, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [redirectUrl, setRedirectUrl] = useState("");

  const reset = () => {
    setPhase("intro");
    setCurrentStep(0);
    setAnswers({});
    setRedirectUrl("");
    onClose();
  };

  const handleStart = () => {
    setPhase("questions");
    setCurrentStep(0);
  };

  const handleAnswer = async (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    const nextStep = currentStep + 1;

    if (nextStep < BOOKING_QUESTIONS.length) {
      setCurrentStep(nextStep);
    } else {
      // All answers collected — evaluate
      setPhase("loading");
      try {
        const res = await fetch("/api/qualify-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: newAnswers }),
        });
        const data: { qualified: boolean; reason: string } = await res.json();
        if (data.qualified) {
          setRedirectUrl("https://calendly.com/mikeolaski/");
          setPhase("qualified");
        } else {
          setRedirectUrl("https://rehabit.pro/");
          setPhase("redirect");
        }
      } catch {
        // On error, default to Calendly — never block a user
        setRedirectUrl("https://calendly.com/mikeolaski/");
        setPhase("qualified");
      }
    }
  };

  const question =
    phase === "questions" ? BOOKING_QUESTIONS[currentStep] : null;
  const progress =
    phase === "questions"
      ? ((currentStep + 1) / BOOKING_QUESTIONS.length) * 100
      : 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={reset}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0F172A] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Strategy Call Application"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            {/* Close button */}
            <button
              onClick={reset}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/10 hover:text-white transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-6 pt-5">
              <AnimatePresence mode="wait">
                {/* ── Intro ── */}
                {phase === "intro" && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-green">
                      Free Strategy Call
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Quick qualification before we book
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      4 questions (60 seconds) so Mike can come prepared with
                      specific insights for your business — and confirm this
                      call is the right next step for you.
                    </p>
                    <ul className="mt-4 space-y-2">
                      {[
                        "No sales pressure",
                        "Personalized insights for your business",
                        "Routed to the best resource for where you are right now",
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-slate-300"
                        >
                          <svg
                            className="h-4 w-4 shrink-0 text-brand-green"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleStart}
                      className="mt-6 w-full rounded-lg bg-brand-green px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-green-light active:scale-[0.98]"
                    >
                      Start Application →
                    </button>
                    <p className="mt-3 text-center text-xs text-slate-500">
                      Takes about 60 seconds
                    </p>
                  </motion.div>
                )}

                {/* ── Questions ── */}
                {phase === "questions" && question && (
                  <motion.div
                    key={`q-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Progress bar */}
                    <div className="mb-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand-green">
                          {question.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {currentStep + 1} of {BOOKING_QUESTIONS.length}
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-1 rounded-full bg-brand-green"
                          initial={{ width: `${(currentStep / BOOKING_QUESTIONS.length) * 100}%` }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-white">
                      {question.question}
                    </h2>

                    <div className="mt-4 space-y-2">
                      {question.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(question.id, opt)}
                          className="group w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-slate-300 transition-all hover:border-brand-green/50 hover:bg-brand-green/5 hover:text-white active:scale-[0.99]"
                        >
                          <span className="flex items-center gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-[10px] text-slate-500 group-hover:border-brand-green/50 group-hover:text-brand-green transition-all">
                              {String.fromCharCode(65 + question.options.indexOf(opt))}
                            </span>
                            {opt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── Loading ── */}
                {phase === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-14 text-center"
                  >
                    <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-2 border-white/10 border-t-brand-green" />
                    <p className="text-sm font-semibold text-white">
                      Reviewing your application…
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Matching you to the right next step
                    </p>
                  </motion.div>
                )}

                {/* ── Qualified → Calendly ── */}
                {phase === "qualified" && (
                  <motion.div
                    key="qualified"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="py-2 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brand-green/30 bg-brand-green/10">
                      <svg
                        className="h-7 w-7 text-brand-green"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      You&rsquo;re a great fit.
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      Based on your answers, this call will be genuinely
                      valuable. Pick a time and Mike will come prepared with
                      specific insights for your business.
                    </p>
                    <a
                      href={redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 block w-full rounded-lg bg-brand-green px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-brand-green-light"
                      onClick={reset}
                    >
                      Book Your 15-Minute Call →
                    </a>
                    <button
                      onClick={reset}
                      className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                )}

                {/* ── Not qualified → rehabit.pro ── */}
                {phase === "redirect" && (
                  <motion.div
                    key="redirect"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="py-2 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brand-orange/30 bg-brand-orange/10">
                      <svg
                        className="h-7 w-7 text-brand-orange"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Here&rsquo;s a better starting point.
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      Based on where you are right now, we have free resources
                      at Rehabit designed exactly for your stage. Start there
                      — it&rsquo;s free and immediately actionable.
                    </p>
                    <a
                      href={redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 block w-full rounded-lg bg-brand-orange px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:opacity-90"
                      onClick={reset}
                    >
                      Visit Rehabit.pro →
                    </a>
                    <p className="mt-3 text-xs text-slate-500">
                      Already at $50K+ revenue?{" "}
                      <button
                        onClick={() => {
                          setPhase("qualified");
                          setRedirectUrl("https://calendly.com/mikeolaski/");
                        }}
                        className="text-brand-green hover:underline"
                      >
                        Book the call anyway.
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
