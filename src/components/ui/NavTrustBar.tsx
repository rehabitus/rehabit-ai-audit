const STARS = 5;

const AVATAR_COLORS = [
  "from-emerald-400 to-teal-600",
  "from-sky-400 to-blue-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-pink-600",
];

const AVATAR_INITIALS = ["M", "S", "J", "A", "K"];

function PersonAvatar({
  color,
  initial,
  size = 32,
  offset = 0,
  zIndex = 1,
  ring = "#0F172A",
}: {
  color: string;
  initial: string;
  size?: number;
  offset?: number;
  zIndex?: number;
  ring?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${color}`}
      style={{
        width: size,
        height: size,
        marginLeft: offset,
        zIndex,
        boxShadow: `0 0 0 2px ${ring}`,
        flexShrink: 0,
        fontSize: size * 0.4,
      }}
      aria-hidden="true"
    >
      <span className="font-bold text-white/90 leading-none">{initial}</span>
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
  const showCount = reviewCount > 5;
  const avatarSize = size === "md" ? 40 : 32;
  const ring = "#0F172A";
  const starSize = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";
  const labelSize = size === "md" ? "text-sm" : "text-[11px]";

  return (
    <div className="flex items-center gap-3">
      {/* Avatar stack */}
      <div className="flex items-center">
        {AVATAR_COLORS.map((color, i) => (
          <PersonAvatar
            key={i}
            color={color}
            initial={AVATAR_INITIALS[i]}
            size={avatarSize}
            offset={i === 0 ? 0 : -10}
            zIndex={AVATAR_COLORS.length - i}
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
            <>Trusted by founders like <span className="text-brand-green">you</span></>
          )}
        </p>
      </div>
    </div>
  );
}
