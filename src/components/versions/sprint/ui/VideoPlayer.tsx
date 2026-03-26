"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp } from "@/lib/animations";
import { trackVideoPlay, trackVideoProgress } from "@/lib/analytics";

const VIMEO_ID = "1171820962";
const THUMBNAIL_PATH = "/images/campaign-variations-digital-twin/rhb-audit-poster-square-brand-colors-1.91x1.png";

export function VideoPlayer() {
    const [showVideo, setShowVideo] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const firedDepths = useRef(new Set<number>());
    const durationRef = useRef<number>(0);

    const handlePlay = useCallback(() => {
        setShowVideo(true);
        trackVideoPlay();
    }, []);

    // Listen for Vimeo postMessage events to track progress
    useEffect(() => {
        if (!showVideo) return;

        const onMessage = (e: MessageEvent) => {
            if (!e.origin.includes("vimeo.com")) return;
            try {
                const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
                if (data.event === "ready") {
                    // Tell Vimeo we want timeupdate events
                    iframeRef.current?.contentWindow?.postMessage(
                        JSON.stringify({ method: "addEventListener", value: "timeupdate" }),
                        "https://player.vimeo.com"
                    );
                    iframeRef.current?.contentWindow?.postMessage(
                        JSON.stringify({ method: "getDuration" }),
                        "https://player.vimeo.com"
                    );
                }
                if (data.method === "getDuration" && data.value) {
                    durationRef.current = data.value as number;
                }
                if (data.event === "timeupdate" && durationRef.current > 0) {
                    const pct = ((data.data?.seconds ?? 0) / durationRef.current) * 100;
                    for (const depth of [25, 50, 75, 100] as const) {
                        if (pct >= depth && !firedDepths.current.has(depth)) {
                            firedDepths.current.add(depth);
                            trackVideoProgress(depth);
                        }
                    }
                }
            } catch { /* ignore */ }
        };

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [showVideo]);

    return (
        <motion.div
            variants={fadeInUp}
            className="mx-auto mt-12 w-full max-w-4xl"
        >
            {/* VSL Banner */}
            <div className="bg-brand-green/90 py-2 text-center text-sm font-bold uppercase tracking-wider text-brand-dark">
                Watch this before you do anything
            </div>

            {/* Video Container */}
            <div
                className="relative aspect-video w-full overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-black shadow-2xl"
                aria-label="Watch: How the audit works (4 min)"
            >
                {showVideo ? (
                    <iframe
                        ref={iframeRef}
                        src={`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&api=1&background=0&color=00dc82&title=0&byline=0&portrait=0`}
                        className="absolute inset-0 h-full w-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="How the AI Transformation Audit works"
                    />
                ) : (
                    <button
                        onClick={handlePlay}
                        className="group absolute inset-0 flex items-center justify-center"
                        aria-label="Play video"
                    >
                        <Image
                            src={THUMBNAIL_PATH}
                            alt="Video Thumbnail"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 800px"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/20 text-white shadow-lg shadow-brand-green/25 transition-transform group-hover:scale-110">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-9 w-9 translate-x-0.5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </button>
                )}
            </div>
            <p className="mt-2 text-center text-sm text-slate-500">
                Watch: How the audit works (4 min)
            </p>
        </motion.div>
    );
}
