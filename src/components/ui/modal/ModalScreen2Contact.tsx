"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
    onContinue: (contact: { name: string; email: string; phone: string; website: string }) => void;
    onBack: () => void;
}

export function ModalScreen2Contact({ onContinue, onBack }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isValid = email.includes("@") && name.trim().length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) {
            setError("Please enter your name and a valid email address.");
            return;
        }
        setLoading(true);
        setError("");
        onContinue({ name: name.trim(), email: email.trim(), phone: phone.trim(), website: website.trim() });
    };

    const inputClass =
        "w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white placeholder-slate-500 outline-none transition-all focus:border-brand-green/60 focus:bg-white/[0.08] focus:ring-2 focus:ring-brand-green/20";

    return (
        <motion.div
            key="screen2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-xl font-extrabold text-white mb-1">
                Almost there &mdash; who should we send your results to?
            </h2>
            <p className="text-slate-400 text-sm mb-6">
                We&rsquo;ll email your personalized AI Savings Report after you complete the survey.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Full Name <span className="text-brand-red">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Email Address <span className="text-brand-red">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="jane@yourcompany.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Phone <span className="text-slate-600 font-normal">(optional)</span>
                    </label>
                    <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Website <span className="text-slate-600 font-normal">(optional — helps personalize your score)</span>
                    </label>
                    <input
                        type="url"
                        placeholder="https://yoursite.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className={inputClass}
                    />
                </div>

                {error && <p className="text-brand-red text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="w-full rounded-xl bg-brand-green px-8 py-3.5 text-base font-bold text-brand-dark transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? "Loading..." : "Continue to Survey \u2192"}
                </button>
            </form>

            <button
                onClick={onBack}
                className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
                &#8592; Go back
            </button>
        </motion.div>
    );
}
