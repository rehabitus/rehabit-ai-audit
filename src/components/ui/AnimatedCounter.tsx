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
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, to, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => {
        setDisplayValue(decimals > 0 ? parseFloat(v.toFixed(decimals)) : Math.round(v));
      },
    });

    return () => controls.stop();
  }, [isInView, to, from, duration, decimals, motionValue]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
