// To use real photos: replace `gradient` with `src: "/avatars/name.jpg"` and render an <img> instead.
// Keep COUNT in sync with your actual customer base.

const COUNT = "300+";
const LABEL = "founders like you";
const STARS = 5;

// CSS gradient avatars — no external deps, swap for real photos anytime
const AVATARS = [
    { initials: "JR", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
    { initials: "MK", gradient: "linear-gradient(135deg, #10b981, #059669)" },
    { initials: "TS", gradient: "linear-gradient(135deg, #f97316, #ef4444)" },
    { initials: "AL", gradient: "linear-gradient(135deg, #3b82f6, #6366f1)" },
    { initials: "CW", gradient: "linear-gradient(135deg, #f59e0b, #f97316)" },
];

export function NavTrustBar() {
    return (
        <div className="flex items-center gap-3">
            {/* Overlapping avatar stack */}
            <div className="flex items-center">
                {AVATARS.map((avatar, i) => (
                    <div
                        key={i}
                        className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-[#0F172A] text-[10px] font-bold text-white select-none"
                        style={{
                            background: avatar.gradient,
                            marginLeft: i === 0 ? 0 : "-10px",
                            zIndex: AVATARS.length - i,
                            position: "relative",
                        }}
                        aria-label={`Founder ${avatar.initials}`}
                    >
                        {avatar.initials}
                    </div>
                ))}
            </div>

            {/* Stars + label */}
            <div className="flex flex-col leading-none gap-0.5">
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: STARS }).map((_, i) => (
                        <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-3 w-3 text-brand-green"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ))}
                </div>
                <p className="text-[11px] font-bold text-white/90 whitespace-nowrap">
                    Trusted by <span className="text-brand-green">{COUNT}</span> {LABEL}
                </p>
            </div>
        </div>
    );
}
