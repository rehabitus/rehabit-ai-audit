"use client";

import { useEffect, useRef } from "react";

// Extend Window interface to include Trustpilot
declare global {
    interface Window {
        Trustpilot?: {
            loadFromElement: (element: HTMLElement | null) => void;
        };
    }
}

export function TrustpilotWidget() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // If Trustpilot is already loaded, we might need to trigger a reload for the widget
        if (window.Trustpilot) {
            window.Trustpilot.loadFromElement(ref.current);
        }
    }, []);

    return (
        <div className="border-t border-slate-200/80 bg-gradient-to-r from-sky-50 via-white to-amber-50 py-8">
            <div className="mx-auto max-w-6xl px-6">
                <div
                    ref={ref}
                    className="trustpilot-widget"
                    data-locale="en-US"
                    data-template-id="56278e9abfbbba0bdcd568bc"
                    data-businessunit-id="698efda19111479251cadb0a"
                    data-style-height="52px"
                    data-style-width="100%"
                    data-token="d56ed9f1-8800-447a-b9ab-7de5030c5afa"
                >
                    <a
                        href="https://www.trustpilot.com/review/rehabit.us"
                        target="_blank"
                        rel="noopener"
                        className="text-slate-500 hover:text-slate-950 transition-colors"
                    >
                        Trustpilot
                    </a>
                </div>
            </div>
        </div>
    );
}
