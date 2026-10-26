"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/components/motion-primitives";

/**
 * Releases shipped per sprint across a typical engagement. Bar heights and the
 * summary figure are both computed from this array — nothing is hard-coded in
 * the markup, so editing the data updates the chart and the label together.
 */
const SPRINTS = [
  { label: "S1", releases: 2 },
  { label: "S2", releases: 4 },
  { label: "S3", releases: 5 },
  { label: "S4", releases: 7 },
  { label: "S5", releases: 9 },
  { label: "S6", releases: 12 },
] as const;

const MAX = Math.max(...SPRINTS.map((s) => s.releases));
const TOTAL = SPRINTS.reduce((sum, s) => sum + s.releases, 0);

export function ReleaseCadence() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <div ref={ref}>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-[-0.04em] text-text tabular-nums">
          {TOTAL}
        </span>
        <span className="text-sm text-text-muted">
          releases across six sprints
        </span>
      </div>

      <div
        className="mt-5 flex h-[132px] items-end gap-2.5"
        role="img"
        aria-label={`Release cadence rising from ${SPRINTS[0].releases} releases in sprint 1 to ${SPRINTS[SPRINTS.length - 1].releases} in sprint 6.`}
      >
        {SPRINTS.map((sprint, index) => (
          <div
            key={sprint.label}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            {/* The bar's percentage height resolves against this fixed-height
                track, not against the column — the column also holds the
                label, which would make the percentage mean the wrong thing. */}
            <div className="flex h-[104px] w-full items-end">
              <motion.div
                className="w-full rounded-t-md bg-linear-to-t from-accent-deep to-accent-light"
                initial={{ height: 0 }}
                animate={
                  inView
                    ? { height: `${(sprint.releases / MAX) * 100}%` }
                    : undefined
                }
                transition={{
                  duration: 0.85,
                  delay: index * 0.08,
                  ease: EASE,
                }}
              />
            </div>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-text-muted">
              {sprint.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
