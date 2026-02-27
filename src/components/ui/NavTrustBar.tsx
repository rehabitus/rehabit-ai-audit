// Avatar photos: swap src for a local path when you have real client photos.
// e.g. { src: "/avatars/sarah.jpg" }
//
// Count display: shows when reviewCount > 5.
// Pass reviewCount prop from /api/pricing data. Nav defaults to 0 (hidden).

const STARS = 5;

const AVATARS = [
  { src: "https://i.pravatar.cc/40?img=10" },
  { src: "https://i.pravatar.cc/40?img=25" },
  { src: "https://i.pravatar.cc/40?img=33" },
  { src: "https://i.pravatar.cc/40?img=48" },
  { src: "https://i.pravatar.cc/40?img=56" },
];

import Image from "next/image";

function PersonAvatar({
  src,
  size = 32,
  offset = 0,
  zIndex = 1,
  ring = "#0F172A",
}: {
  src: string;
  size?: number;
  offset?: number;
  zIndex?: number;
  ring?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-full bg-slate-700"
      style={{
        width: size,
        height: size,
        marginLeft: offset,
        zIndex,
        boxShadow: `0 0 0 2px ${ring}`,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-cover"
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
  const showCount = reviewCount > 5;
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
            src={av.src}
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
            <>Trusted by founders like <span className="text-brand-green">you</span></>
          )}
        </p>
      </div>
    </div>
  );
}
