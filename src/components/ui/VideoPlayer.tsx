"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

const YOUTUBE_ID = "Oq_SvL-3o4I";

export function VideoPlayer() {
    const [showVideo, setShowVideo] = useState(false);

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
            <div className="relative aspect-video w-full overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-black shadow-2xl">
                {showVideo ? (
                    <iframe
                        className="h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
                        title="AI Transformation Audit"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <button
                        onClick={() => setShowVideo(true)}
                        className="group absolute inset-0 flex items-center justify-center"
                        aria-label="Play video"
                    >
                        {/* YouTube thumbnail as background */}
                        <img
                            src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/90 text-white shadow-lg shadow-brand-green/25 transition-transform group-hover:scale-110">
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
        </motion.div>
    );
}
