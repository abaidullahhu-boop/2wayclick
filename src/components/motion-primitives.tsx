"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";

/** Shared easing. Weight settling, not bouncing — no spring overshoot. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Viewport margin at which reveals trigger — slightly before full entry. */
const IN_VIEW_MARGIN = "-70px";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds of delay before the reveal starts. */
  delay?: number;
  /** Travel distance in px. */
  y?: number;
  as?: "div" | "section" | "li" | "span";
};

/** Fade + rise as the element scrolls into view. Fires once. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });

  /**
   * Indexing `motion` by a union of tag names intersects the per-element ref
   * types, producing a signature no single ref can satisfy. Widening to the
   * common supertype (`motion.div` accepts an HTMLElement ref) keeps the
   * component polymorphic without an `any`.
   */
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

type BlurInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * Skip the in-view gate. Above-the-fold headings are already visible on
   * first paint, so waiting for an intersection callback shows them blurred
   * for a frame before the observer fires.
   */
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div";
};

/** Heading entrance: blur(14px) → blur(0) with opacity and a small rise. */
export function BlurIn({
  children,
  className,
  delay = 0,
  immediate = false,
  as = "div",
}: BlurInProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });
  const show = immediate || inView;
  // See the note in `Reveal` on why this cast is needed for polymorphic tags.
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, filter: "blur(14px)", y: 16 }}
      animate={show ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** Parent variant for staggered card grids. */
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

/** Child variant matching `staggerParent`. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
};

/** Grid wrapper that runs `staggerParent` once in view. */
export function StaggerGroup({ children, className }: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerParent}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}
