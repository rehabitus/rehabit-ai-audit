"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

interface AnimatedCounterProps {
  /** The number to count to */
  to: number;
  /** Starting number (default 0) */
  from?: number;
  /** Text before the number */
  prefix?: string;
  /** Text after the number */
  suffix?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Decimal places */
  decimals?: number;
  /** Additional className */
  className?: string;
}

export function AnimatedCounter({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(from);
  // Start with final value so SSR/noscript/reduced-motion users see real numbers
  const [displayValue, setDisplayValue] = useState(to);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplayValue(to);
      setHasAnimated(true);
      return;
    }

    // Reset to starting value then animate up
    setDisplayValue(from);
    const controls = animate(motionValue, to, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => {
        setDisplayValue(decimals > 0 ? parseFloat(v.toFixed(decimals)) : Math.round(v));
      },
      onComplete: () => setHasAnimated(true),
    });

    return () => controls.stop();
  }, [isInView, to, from, duration, decimals, motionValue, hasAnimated]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
