"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "./motion-primitives";
import { usePrefersReducedMotion } from "./use-reduced-motion";

type Props = {
  words: readonly string[];
  /** Static word used for the accessible copy. Should read well on its own. */
  staticWord: string;
  /** Time a word stays fully settled, measured from the end of the last
   *  transition rather than from the start — see the interval below. */
  intervalMs?: number;
  className?: string;
};

/** `useLayoutEffect` warns during SSR; fall back to `useEffect` on the server. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A word that cycles in place inside the h1.
 *
 * The hard part is width. The headline is sized in `vw`, so a word's rendered
 * width is not knowable at build time and changes on every resize and again
 * when the webfont replaces the fallback. We measure all candidates off one
 * hidden node and animate the slot's width so the rest of the line glides
 * rather than snapping.
 */
export function RotatingWord({
  words,
  staticWord,
  intervalMs = 3400,
  className = "",
}: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLSpanElement>(null);

  /**
   * Derived rather than a separate `mounted` flag set from an effect: the
   * measuring effect below only ever runs on the client, so a populated
   * `widths` array *is* the signal that we have hydrated and measured. It also
   * avoids animating before the slot has a real width to animate to.
   */
  const measured = widths.length === words.length;

  // Measure every candidate against a single hidden node so all widths come
  // from identical font metrics.
  useIsomorphicLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;

    const measure = () => {
      const next = words.map((word) => {
        node.textContent = word;
        // `getBoundingClientRect` forces a synchronous reflow, so the width
        // read here belongs to the word just written. Keep the write and the
        // read adjacent — batching the writes first and the reads after would
        // return the last word's width for every entry.
        return node.getBoundingClientRect().width;
      });
      node.textContent = "";
      // Only commit when every candidate measured non-zero. A pass that runs
      // before layout settles can return zeros, and a zero width would collapse
      // the slot and clip the word.
      if (next.every((w) => w > 0)) setWidths(next);
    };

    measure();

    // The headline is sized in vw, so every width changes on resize.
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);

    // The first measurement can land while the fallback font is still active,
    // which makes every width wrong once the real face swaps in.
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [words]);

  useEffect(() => {
    if (prefersReduced || !measured || words.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      intervalMs,
    );
    return () => window.clearInterval(timer);
  }, [prefersReduced, measured, words.length, intervalMs]);

  const active = words[index] ?? staticWord;
  const targetWidth = widths[index];

  return (
    <>
      {/* Accessible copy. The animated slot is aria-hidden, so this is the
          only version a screen reader announces, and the only one present in
          the served HTML before hydration. */}
      <span className="sr-only">{staticWord}</span>

      {/* Hidden measuring node.
          It must render at EXACTLY the visible word's metrics or every measured
          width is wrong and the slot leaves a gap beside short words. Font
          size, weight and tracking are inherited from the h1 because the node
          sits inside it; `className` is deliberately not applied, since
          `text-gradient` only changes fill, not metrics.

          It sits OUTSIDE the animated slot on purpose. Inside, its containing
          block is a box whose `width` is mid-transition, so each measurement
          reads against a different in-flight container and the widths come back
          belonging to the wrong words. Here it is a sibling of the slot, so its
          own width is free and depends only on the glyphs and the inherited
          font metrics.

          `position: fixed` takes it out of flow without needing a positioned
          ancestor, so it can never widen the headline or wrap a line. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed left-0 top-0 whitespace-nowrap"
      />

      <motion.span
        aria-hidden="true"
        className="relative inline-grid align-bottom"
        // Width is animated by framer-motion, NOT a CSS transition. A CSS
        // transition is a second, independent timing system: it starts the
        // instant React commits the new index, so the box finished resizing
        // around a word that was still at opacity 0, then the word popped in.
        // Driving both from one system lets them share a curve and overlap.
        animate={{ width: targetWidth ? targetWidth : "auto" }}
        initial={false}
        // Same duration and curve as the word itself, so the box and the glyphs
        // arrive together. A longer width animation left the line still
        // creeping sideways after the new word had fully settled.
        transition={targetWidth ? { duration: 0.5, ease: EASE } : { duration: 0 }}
      >
        {!measured || prefersReduced ? (
          <span className={`whitespace-nowrap ${className}`}>{staticWord}</span>
        ) : (
          /* Both words occupy the same grid cell, so the outgoing and incoming
             word overlap in place instead of the exiting one being pulled out
             of flow (which let it drift across the rest of the line). */
          <AnimatePresence initial={false} mode="sync">
            <motion.span
              key={active}
              // `justify-self-start` + `w-fit` stop the grid item from
              // stretching to the column. Without them each word is sized by
              // the ANIMATING slot rather than by its own glyphs: mid-change
              // both words render at the outgoing width, so `text-gradient`
              // (a background-clip fill) paints its ramp across the wrong box
              // and the letters sit off-centre until the animation ends. The
              // artefact scales with the width delta, so the big jumps
              // (Platform->App, System->Platform) showed it worst.
              className={`col-start-1 row-start-1 w-fit justify-self-start whitespace-nowrap ${className}`}
              // Animated as ONE unit. A per-letter stagger fights the width
              // animation — the slot resizes to the full word while only some
              // glyphs have arrived, leaving it visibly half-empty.
              initial={{ opacity: 0, y: "0.28em", filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: "-0.28em", filter: "blur(6px)" }}
              // One duration for every property, so the word stops drifting and
              // de-blurring at the moment it becomes opaque rather than after.
              // Opacity gets a linear curve because the shared ease-out drove it
              // to ~0.9 within a third of the duration, making the two words
              // trade over abruptly instead of dissolving evenly.
              transition={{
                duration: 0.5,
                ease: EASE,
                opacity: { duration: 0.5, ease: "linear" },
              }}
            >
              {active}
            </motion.span>
          </AnimatePresence>
        )}
      </motion.span>
    </>
  );
}
