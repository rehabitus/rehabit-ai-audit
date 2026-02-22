"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export function VideoPlayer() {
    return (
        <motion.div
            variants={fadeInUp}
            className="mx-auto mt-12 w-full max-w-4xl"
        >
            {/* VSL Banner */}
            <div className="bg-brand-green/90 py-2 text-center text-sm font-bold uppercase tracking-wider text-brand-dark">
                ⚡ Watch this VSL before you do anything ⚡
            </div>

            {/* Video Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-black shadow-2xl">
                {/* Placeholder for Video - using an iframe for a demo/placeholder */}
                <div className="flex h-full w-full items-center justify-center bg-slate-900/50">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-8 w-8 translate-x-0.5"
                            >
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-slate-400 font-medium">Video Player Placeholder</p>
                        <p className="text-slate-500 text-xs mt-1">Ready to embed Loom, Wistia, or YouTube</p>
                    </div>
                </div>

                {/* Optional: Real iframe would go here */}
                {/* 
        <iframe 
          className="h-full w-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
          title="Product Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe> 
        */}
            </div>
        </motion.div>
    );
}
