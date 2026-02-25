// Avatar appearance. Swap `gradient` for a real photo path when ready:
// { gradient: null, src: "/avatars/name.jpg" }
//
// Count display: auto-shows when reviewCount >= SHOW_COUNT_THRESHOLD.
// Pass reviewCount prop from /api/pricing data. Nav defaults to 0 (hidden).

const SHOW_COUNT_THRESHOLD = 5;  // show count only once you have this many reviews
const STARS = 5;

const AVATARS = [
  { gradient: "linear-gradient(160deg, #6366f1 0%, #8b5cf6 100%)" },
  { gradient: "linear-gradient(160deg, #10b981 0%, #059669 100%)" },
  { gradient: "linear-gradient(160deg, #f97316 0%, #ef4444 100%)" },
  { gradient: "linear-gradient(160deg, #3b82f6 0%, #6366f1 100%)" },
  { gradient: "linear-gradient(160deg, #f59e0b 0%, #f97316 100%)" },
];

// Person silhouette — reads as "blank headshot" at small sizes.
// Replace with <img src={avatar.src} /> when you have real photos.
function PersonAvatar({
  gradient,
  size = 32,
  offset = 0,
  zIndex = 1,
  ring = "#0F172A",
}: {
  gradient: string;
  size?: number;
  offset?: number;
  zIndex?: number;
  ring?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        background: gradient,
        marginLeft: offset,
        zIndex,
        boxShadow: `0 0 0 2px ${ring}`,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {/* Head */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.88)",
        }}
      />
      {/* Shoulders */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "50%",
          borderRadius: "50% 50% 0 0",
          background: "rgba(255,255,255,0.72)",
        }}
      />
    </div>
  );
}

export function NavTrustBar({
  size = "sm",
  reviewCount = 0,
}: {
  size?: "sm" | "md";
  reviewCount?: number;
}) {
  const showCount = reviewCount >= SHOW_COUNT_THRESHOLD;
  const avatarSize = size === "md" ? 40 : 32;
  const ring = "#0F172A";
  const starSize = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";
  const labelSize = size === "md" ? "text-sm" : "text-[11px]";

  return (
    <div className="flex items-center gap-3">
      {/* Avatar stack */}
      <div className="flex items-center">
        {AVATARS.map((av, i) => (
          <PersonAvatar
            key={i}
            gradient={av.gradient}
            size={avatarSize}
            offset={i === 0 ? 0 : -10}
            zIndex={AVATARS.length - i}
            ring={ring}
          />
        ))}
      </div>

      {/* Stars + label */}
      <div className="flex flex-col leading-none gap-1">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: STARS }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`${starSize} text-brand-green`}
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
        <p className={`${labelSize} font-bold text-white/90 whitespace-nowrap`}>
          {showCount ? (
            <>Trusted by <span className="text-brand-green">{reviewCount}</span> founders like you</>
          ) : (
            <>Founders like <span className="text-brand-green">you</span></>
          )}
        </p>
      </div>
    </div>
  );
}
