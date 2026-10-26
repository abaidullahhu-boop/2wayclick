"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/components/motion-primitives";
import { usePrefersReducedMotion } from "@/components/use-reduced-motion";

/**
 * Uptime by month. The curve, the axis labels and the count-up all derive
 * from this one array, so the drawn path and the numbers beside it can never
 * disagree — the usual failure mode when a path is hand-authored as a `d`
 * string next to hard-coded labels.
 */
const SERIES = [
  { month: "Jan", value: 41 },
  { month: "Feb", value: 48 },
  { month: "Mar", value: 57 },
  { month: "Apr", value: 63 },
  { month: "May", value: 78 },
  { month: "Jun", value: 94 },
] as const;

const W = 320;
const H = 132;
const PAD = 10;

function buildPath(): { line: string; area: string } {
  const max = Math.max(...SERIES.map((d) => d.value));
  const min = Math.min(...SERIES.map((d) => d.value));
  const span = max - min || 1;

  const points = SERIES.map((d, i) => {
    const x = PAD + (i / (SERIES.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((d.value - min) / span) * (H - PAD * 2);
    return { x, y };
  });

  // Catmull-Rom style smoothing via cubic segments — a polyline reads as a
  // chart, a smoothed curve reads as growth.
  let line = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p = points[i];
    const n = points[i + 1];
    const cx = (p.x + n.x) / 2;
    line += ` C ${cx} ${p.y}, ${cx} ${n.y}, ${n.x} ${n.y}`;
  }

  const area = `${line} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;
  return { line, area };
}

const { line, area } = buildPath();
const TARGET = SERIES[SERIES.length - 1].value;

export function GrowthCurve() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  const prefersReduced = usePrefersReducedMotion();
  const [animatedCount, setAnimatedCount] = useState(0);

  /**
   * Under reduced motion the final value is derived at render rather than
   * written through an effect — setting state synchronously in an effect just
   * to reach a value already knowable during render causes a cascading render.
   */
  const count = prefersReduced ? TARGET : animatedCount;

  useEffect(() => {
    if (!inView || prefersReduced) return;

    const DURATION = 1400;
    let frame = 0;
    let start: number | null = null;

    const step = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / DURATION, 1);
      // Ease-out cubic — fast start, settling finish.
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedCount(Math.round(eased * TARGET));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, prefersReduced]);

  return (
    <div ref={ref}>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-[-0.04em] text-text tabular-nums">
          {count}
          <span className="text-accent">%</span>
        </span>
        <span className="text-sm text-text-muted">faster p95 response</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full"
        role="img"
        aria-label={`Response time improvement from ${SERIES[0].value}% in ${SERIES[0].month} to ${TARGET}% in ${SERIES[SERIES.length - 1].month}.`}
      >
        <defs>
          <linearGradient id="gc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.26" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gc-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-deep)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>

        <motion.path
          d={area}
          fill="url(#gc-fill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="url(#gc-line)"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.5, ease: EASE }}
        />
      </svg>

      <ul className="mt-1 flex justify-between font-mono text-[0.6rem] uppercase tracking-[0.16em] text-text-muted">
        {SERIES.map((d) => (
          <li key={d.month}>{d.month}</li>
        ))}
      </ul>
    </div>
  );
}
