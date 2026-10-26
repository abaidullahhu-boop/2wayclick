"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Tracks `prefers-reduced-motion: reduce`.
 *
 * `useSyncExternalStore` rather than useState + useEffect: the media query is
 * an external store, and reading it in an effect would set state during the
 * commit and trigger a cascading render on every mount.
 *
 * The server snapshot is `false` so SSR and the first client render agree.
 * Components using this must therefore tolerate one frame in the animated
 * state before a reduced-motion user's preference is applied — the CSS
 * `@media (prefers-reduced-motion)` block in globals.css covers that gap for
 * anything expressible in CSS.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
