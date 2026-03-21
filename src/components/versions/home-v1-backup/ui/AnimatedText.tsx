"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/animations";

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  /** Use whileInView (scroll trigger) vs initial/animate (mount trigger) */
  triggerOnScroll?: boolean;
}

/**
 * Wraps children in a stagger container.
 * Each direct child should be a motion element with fadeInUp variants.
 * For convenience, this just wraps the parent — children need motion wrappers.
 */
export function StaggerWrapper({
  children,
  className = "",
  triggerOnScroll = true,
}: AnimatedTextProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      {...(triggerOnScroll
        ? { whileInView: "visible", viewport: viewportOnce }
        : { animate: "visible" })}
    >
      {children}
    </motion.div>
  );
}

/**
 * A single child that fades in + slides up. Works inside a StaggerWrapper.
 */
export function FadeInUp({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeInUp}>
      {children}
    </motion.div>
  );
}
