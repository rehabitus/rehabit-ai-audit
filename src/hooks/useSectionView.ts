"use client";

import { useEffect, useRef } from "react";
import { trackSectionView } from "@/lib/analytics";

// Pass an array of section IDs matching the page's id attributes
export function useSectionView(sectionIds: string[]) {
  const fired = useRef(new Set<string>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !fired.current.has(id)) {
            fired.current.add(id);
            trackSectionView(id);
          }
        }
      },
      { threshold: 0.3 } // fire when 30% of section is visible
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
