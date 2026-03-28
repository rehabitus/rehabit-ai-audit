"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Hook that detects prefers-reduced-motion.
 * Returns true when the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const prefersReduced = useFramerReducedMotion();
  return !!prefersReduced;
}
