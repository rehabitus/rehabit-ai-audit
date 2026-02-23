// Swap AVATARS src values for real photos when ready.
// Keep count in sync with your actual customer base.

const AVATARS = [
    { src: "https://i.pravatar.cc/40?img=11", alt: "Founder" },
    { src: "https://i.pravatar.cc/40?img=32", alt: "Founder" },
    { src: "https://i.pravatar.cc/40?img=53", alt: "Founder" },
    { src: "https://i.pravatar.cc/40?img=64", alt: "Founder" },
    { src: "https://i.pravatar.cc/40?img=15", alt: "Founder" },
];

const COUNT = "300+";
const LABEL = "founders like you";
const STARS = 5;

export function NavTrustBar() {
    return (
        <div className="flex items-center gap-3">
            {/* Overlapping avatars */}
            <div className="flex items-center">
                {AVATARS.map((avatar, i) => (
                    <div
                        key={i}
                        className="relative h-8 w-8 rounded-full ring-2 ring-brand-dark overflow-hidden"
                        style={{ marginLeft: i === 0 ? 0 : "-10px", zIndex: AVATARS.length - i }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={avatar.src}
                            alt={avatar.alt}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Stars + text */}
            <div className="flex flex-col leading-none gap-0.5">
                {/* Trustpilot-style stars */}
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
                {/* Count + label */}
                <p className="text-[11px] font-bold text-white/90 whitespace-nowrap">
                    Trusted by <span className="text-brand-green">{COUNT}</span> {LABEL}
                </p>
            </div>
        </div>
    );
}
