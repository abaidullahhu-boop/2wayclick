"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "./use-reduced-motion";

/**
 * Lenis smooth scroll, mounted once in the root layout.
 *
 * Disabled entirely under `prefers-reduced-motion: reduce` — smoothing hijacks
 * the native scroll position, which is exactly the kind of motion the setting
 * asks us to stop doing.
 */
export function SmoothScroll() {
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      // Both are required: cancelling the frame stops the loop, destroy()
      // releases the wheel/touch listeners and restores native scrolling.
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return null;
}
