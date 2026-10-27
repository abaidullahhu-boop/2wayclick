"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Label } from "@/components/label";
import { BlurIn, EASE, Reveal } from "@/components/motion-primitives";
import {
  Check,
  CodeIcon,
  LayersIcon,
  LifebuoyIcon,
  PenIcon,
  RocketIcon,
  SearchIcon,
} from "@/components/icons";
import { usePrefersReducedMotion } from "@/components/use-reduced-motion";
import {
  WORKFLOW_GROUPS,
  WORKFLOW_STEPS,
  type WorkflowStep,
} from "@/lib/workflow";

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  discovery: SearchIcon,
  architecture: LayersIcon,
  design: PenIcon,
  development: CodeIcon,
  "qa-launch": RocketIcon,
  support: LifebuoyIcon,
};

/** How long each phase stays highlighted before the chart moves on. */
const CYCLE_MS = 5200;

/* ---------------------------------------------------------------------------
   Geometry. Everything is laid out in real pixels from the measured width, so
   the SVG curves and the HTML nodes sitting on them share one coordinate
   system — no `preserveAspectRatio="none"` stretching circles into ovals.
   ------------------------------------------------------------------------ */
const ROW = 68;
const LABEL_H = 30;
const GROUP_GAP = 36;
const PAD_Y = 12;
const GROUP_H = LABEL_H + ROW * 2;
const HEIGHT = PAD_Y * 2 + GROUP_H * 3 + GROUP_GAP * 2;

type Leaf = { step: WorkflowStep; index: number; group: number; y: number };

function layout(width: number) {
  const compact = width < 640;
  const icon = compact ? 40 : 46;
  const textW = compact ? 116 : 200;
  const iconX = textW + (compact ? 10 : 18);
  const x0 = iconX + icon + (compact ? 6 : 14);

  const hubR = compact ? 38 : Math.min(112, Math.max(80, width * 0.09));
  const hubX = width - hubR - (compact ? 2 : 28);
  const hubY = HEIGHT / 2;
  const x3 = hubX - hubR - (compact ? 16 : 56);
  const x1 = x0 + (x3 - x0) * 0.44;

  const leaves: Leaf[] = [];
  const groups = WORKFLOW_GROUPS.map((group, g) => {
    const top = PAD_Y + g * (GROUP_H + GROUP_GAP);
    const ys = group.steps.map((_, i) => top + LABEL_H + ROW * i + ROW / 2);
    group.steps.forEach((id, i) => {
      const index = WORKFLOW_STEPS.findIndex((s) => s.id === id);
      leaves.push({ step: WORKFLOW_STEPS[index], index, group: g, y: ys[i] });
    });
    return { label: group.label, top, y: (ys[0] + ys[1]) / 2 };
  });

  // Horizontal S-curve: both control points sit halfway along x, at the
  // start and end heights, so every branch leaves and lands dead level.
  const curve = (ax: number, ay: number, bx: number, by: number) => {
    const mid = (bx - ax) / 2;
    return `M${ax} ${ay}C${ax + mid} ${ay} ${bx - mid} ${by} ${bx} ${by}`;
  };

  return {
    compact,
    icon,
    textW,
    iconX,
    x1,
    x3,
    hubX,
    hubY,
    hubR,
    leaves,
    groups,
    leafPaths: leaves.map((leaf) => curve(x0, leaf.y, x1, groups[leaf.group].y)),
    groupPaths: groups.map((group) => curve(x1, group.y, x3, hubY)),
    hubPath: `M${x3} ${hubY}L${hubX - hubR} ${hubY}`,
  };
}

/**
 * Process as a converging flow chart: six phases branch into three stages,
 * and the stages merge into the one thing you end up holding.
 *
 * The highlighted phase advances on its own while the chart is on screen;
 * hovering or focusing a phase takes over and pauses it. The timer IS the
 * progress bar's CSS animation — `onAnimationEnd` advances the phase — so the
 * bar and the state can never drift apart, and pausing is one
 * `animation-play-state` flip.
 */
export function Workflow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const inView = useInView(wrapRef, { margin: "-15% 0px" });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const geo = useMemo(() => (width ? layout(width) : null), [width]);
  const activeLeaf = geo?.leaves.find((leaf) => leaf.index === active);
  const activeGroup = activeLeaf?.group ?? 0;
  const running = inView && !paused;
  const step = WORKFLOW_STEPS[active];

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20" id="process">
      <div className="container-x px-0!">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-accent-orange/12 blur-[150px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-accent-red/12 blur-[150px]"
          />
          <div
            aria-hidden="true"
            className="grid-lines pointer-events-none absolute inset-0 opacity-[0.18]"
          />

          <div className="relative px-6 pt-16 sm:px-12 sm:pt-20">
            <Reveal>
              <Label>Process</Label>
            </Reveal>
            <BlurIn
              as="h2"
              className="mt-5 text-[8.2vw] font-bold leading-[1.06] tracking-[-0.045em] text-white sm:text-[5.2vw] lg:text-[3.5vw]"
            >
              {/* Two deliberate lines. The accent phrase is kept whole so the
                  gradient never splits across a wrap. */}
              <span className="block">Six phases, from first call</span>
              <span className="text-gradient block">to handover.</span>
            </BlurIn>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[54ch] text-[0.98rem] leading-relaxed text-text-on-dark-muted">
                Every phase ends with something in your hands — a document, a
                design, a release. Nothing is held back for a reveal at the end.
              </p>
            </Reveal>
          </div>

          <div className="relative px-4 pb-14 pt-10 sm:px-12 sm:pb-16">
            {/* ---- Chart ---- */}
            <div
              ref={wrapRef}
              className={`relative ${running ? "" : "flow-paused"}`}
              style={{ height: HEIGHT }}
              onMouseLeave={() => setPaused(false)}
            >
              {geo && (
                <>
                  <svg
                    aria-hidden="true"
                    width={width}
                    height={HEIGHT}
                    className="absolute inset-0 overflow-visible"
                  >
                    <defs>
                      {/* User-space units: the hub leg is a dead-straight
                          line with a zero-height bounding box, and an
                          objectBoundingBox gradient would not render on it. */}
                      <linearGradient
                        id="flow-hot"
                        gradientUnits="userSpaceOnUse"
                        x1={0}
                        x2={width}
                        y1={0}
                        y2={0}
                      >
                        <stop offset="0%" stopColor="var(--accent-amber)" />
                        <stop offset="100%" stopColor="var(--accent-orange)" />
                      </linearGradient>
                    </defs>

                    {/* Base wiring, drawn in from the leaves toward the hub. */}
                    {[
                      ...geo.leafPaths.map((d, i) => ({ d, level: 0, key: `l${i}` })),
                      ...geo.groupPaths.map((d, i) => ({ d, level: 1, key: `g${i}` })),
                      { d: geo.hubPath, level: 2, key: "h" },
                    ].map(({ d, level, key }) => (
                      <motion.path
                        key={key}
                        d={d}
                        fill="none"
                        stroke="rgba(255,255,255,0.16)"
                        strokeWidth={1.25}
                        initial={{ pathLength: 0 }}
                        animate={inView || reduced ? { pathLength: 1 } : undefined}
                        transition={{
                          duration: reduced ? 0 : 0.9,
                          delay: reduced ? 0 : 0.15 + level * 0.55,
                          ease: EASE,
                        }}
                      />
                    ))}

                    {/* Highlight of the active phase's route to the hub. */}
                    {geo.leafPaths.map((d, i) => (
                      <path
                        key={`hl${i}`}
                        d={d}
                        className="flow-route"
                        data-on={geo.leaves[i].index === active || undefined}
                      />
                    ))}
                    {geo.groupPaths.map((d, g) => (
                      <path
                        key={`hg${g}`}
                        d={d}
                        className="flow-route"
                        data-on={g === activeGroup || undefined}
                      />
                    ))}
                    <path d={geo.hubPath} className="flow-route" data-on />

                    {/* Travelling pulses. Each level waits for the one before
                        it, so a pulse visibly runs leaf → stage → hub.
                        `pathLength={1}` normalises every path so one dash
                        definition fits curves of any length. */}
                    {geo.leafPaths.map((d, i) => (
                      <path
                        key={`pl${i}`}
                        d={d}
                        pathLength={1}
                        className="flow-pulse"
                        style={{ animationDelay: `${geo.leaves[i].group * 0.45}s` }}
                      />
                    ))}
                    {geo.groupPaths.map((d, g) => (
                      <path
                        key={`pg${g}`}
                        d={d}
                        pathLength={1}
                        className="flow-pulse"
                        style={{ animationDelay: `${g * 0.45 + 1.1}s` }}
                      />
                    ))}
                    {WORKFLOW_GROUPS.map((_, g) => (
                      <path
                        key={`ph${g}`}
                        d={geo.hubPath}
                        pathLength={1}
                        className="flow-pulse"
                        style={{ animationDelay: `${g * 0.45 + 2.2}s` }}
                      />
                    ))}
                  </svg>

                  {/* Stage labels */}
                  {geo.groups.map((group, g) => (
                    <p
                      key={group.label}
                      className={`absolute font-mono text-[0.58rem] uppercase tracking-[0.24em] transition-colors duration-500 sm:text-[0.62rem] ${
                        g === activeGroup ? "text-accent-amber" : "text-white/35"
                      }`}
                      style={{ top: group.top, left: 0, width: geo.textW, textAlign: "right" }}
                    >
                      {group.label}
                    </p>
                  ))}

                  {/* Leaves */}
                  {geo.leaves.map((leaf) => {
                    const Icon = ICONS[leaf.step.id];
                    const isActive = leaf.index === active;
                    return (
                      <motion.button
                        key={leaf.step.id}
                        type="button"
                        aria-pressed={isActive}
                        aria-controls="process-detail"
                        onMouseEnter={() => {
                          setActive(leaf.index);
                          setPaused(true);
                        }}
                        onFocus={() => {
                          setActive(leaf.index);
                          setPaused(true);
                        }}
                        onBlur={() => setPaused(false)}
                        onClick={() => setActive(leaf.index)}
                        initial={{ opacity: 0, x: -14 }}
                        animate={inView || reduced ? { opacity: 1, x: 0 } : undefined}
                        transition={{ duration: 0.6, delay: 0.05 * leaf.index, ease: EASE }}
                        className="group absolute left-0 flex items-center text-left focus-visible:outline-none"
                        style={{ top: leaf.y - geo.icon / 2, height: geo.icon }}
                      >
                        <span
                          className="pr-2.5 text-right sm:pr-4"
                          style={{ width: geo.iconX }}
                        >
                          <span
                            className={`block text-[0.78rem] font-semibold leading-tight line-clamp-2 sm:leading-normal sm:line-clamp-1 transition-colors duration-500 sm:text-[0.95rem] ${
                              isActive ? "text-white" : "text-white/55 group-hover:text-white/80"
                            }`}
                          >
                            {leaf.step.title}
                          </span>
                          {!geo.compact && (
                            <span
                              className={`block font-mono text-[0.58rem] uppercase tracking-[0.16em] transition-colors duration-500 ${
                                isActive ? "text-accent-amber" : "text-white/30"
                              }`}
                            >
                              {leaf.step.timeline}
                            </span>
                          )}
                        </span>
                        <span
                          className={`relative flex shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-accent-orange ${
                            isActive
                              ? "scale-110 border-accent-orange/70 bg-accent-orange/15 text-accent-amber shadow-[0_0_24px_rgba(255,90,31,0.45)]"
                              : "border-white/12 bg-white/5 text-white/60 group-hover:border-white/25 group-hover:text-white"
                          }`}
                          style={{ width: geo.icon, height: geo.icon }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                      </motion.button>
                    );
                  })}

                  {/* Stage junctions */}
                  {geo.groups.map((group, g) => (
                    <motion.span
                      key={`j${g}`}
                      aria-hidden="true"
                      initial={{ scale: 0 }}
                      animate={inView || reduced ? { scale: 1 } : undefined}
                      transition={{ duration: 0.5, delay: reduced ? 0 : 0.8 + g * 0.08, ease: EASE }}
                      className={`absolute h-4 w-4 rounded-full border-2 bg-ink transition-[border-color,box-shadow] duration-500 ${
                        g === activeGroup
                          ? "border-accent-orange shadow-[0_0_14px_rgba(255,90,31,0.8)]"
                          : "border-white/35"
                      }`}
                      style={{ left: geo.x1 - 8, top: group.y - 8 }}
                    />
                  ))}

                  {/* Hub junction */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scale: 0 }}
                    animate={inView || reduced ? { scale: 1 } : undefined}
                    transition={{ duration: 0.5, delay: reduced ? 0 : 1.35, ease: EASE }}
                    className="absolute h-3 w-3 rounded-full bg-accent-orange shadow-[0_0_14px_rgba(255,90,31,0.9)]"
                    style={{ left: geo.x3 - 6, top: geo.hubY - 6 }}
                  />

                  {/* Hub */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView || reduced ? { opacity: 1, scale: 1 } : undefined}
                    transition={{ duration: 0.9, delay: reduced ? 0 : 1.5, ease: EASE }}
                    className="absolute"
                    style={{
                      left: geo.hubX - geo.hubR,
                      top: geo.hubY - geo.hubR,
                      width: geo.hubR * 2,
                      height: geo.hubR * 2,
                    }}
                  >
                    <span className="animate-pulse-glow absolute -inset-[45%] rounded-full bg-accent-orange/20 blur-3xl" />
                    <span className="flow-ripple absolute inset-0 rounded-full border border-accent-orange/40" />
                    <span
                      className="flow-ripple absolute inset-0 rounded-full border border-accent-orange/40"
                      style={{ animationDelay: "1.6s" }}
                    />
                    <span className="absolute -inset-3 rounded-full border border-white/8" />
                    <span className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-white/15 bg-linear-to-b from-ink-2 to-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <Image
                        src="/logo-mark.png"
                        alt=""
                        width={481}
                        height={622}
                        className={geo.compact ? "h-7 w-auto" : "h-12 w-auto"}
                      />
                      {!geo.compact && (
                        <>
                          <span className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-accent-amber">
                            Handover
                          </span>
                          <span className="mt-1 max-w-[12ch] text-center text-[0.72rem] leading-snug text-white/55">
                            Code, infra &amp; docs — yours
                          </span>
                        </>
                      )}
                    </span>
                  </motion.div>
                </>
              )}
            </div>

            {/* ---- Detail for the highlighted phase ---- */}
            <div
              id="process-detail"
              className="relative mx-auto mt-10 max-w-4xl"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.article
                  key={step.id}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="relative grid gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm sm:p-8 md:grid-cols-[1.1fr_1fr] md:gap-10"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-8 select-none text-[8rem] font-bold leading-none tracking-[-0.06em] text-white/4"
                  >
                    {String(active + 1).padStart(2, "0")}
                  </span>

                  <div className="relative">
                    <span className="inline-flex rounded-full border border-accent-orange/30 bg-accent-orange/10 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent-amber">
                      Phase {active + 1} · {step.timeline}
                    </span>
                    <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-white sm:text-[1.75rem]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-text-on-dark-muted">
                      {step.description}
                    </p>
                  </div>

                  <div className="relative">
                    <ul className="space-y-2.5">
                      {step.outputs.map((output, i) => (
                        <motion.li
                          key={output}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: EASE }}
                          className="flex gap-3 text-[0.87rem] leading-relaxed text-white/70"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent-orange"
                            aria-hidden="true"
                          />
                          <span>{output}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-4">
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/35">
                        You receive
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {step.deliverable}
                      </span>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>

              {/* Auto-advance timer. Not rendered under reduced motion: the
                  global rule shortens every animation to 0.01ms, which would
                  make `onAnimationEnd` spin through the phases. */}
              {!reduced && (
                <div aria-hidden="true" className="mx-auto mt-5 h-px max-w-xs overflow-hidden bg-white/10">
                  <div
                    key={active}
                    className="flow-progress h-full bg-linear-to-r from-accent-amber to-accent-orange"
                    style={{
                      animationDuration: `${CYCLE_MS}ms`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                    onAnimationEnd={() =>
                      setActive((current) => (current + 1) % WORKFLOW_STEPS.length)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Static, source-ordered copy of every phase. The chart shows one
          phase's detail at a time; this guarantees a crawler or a screen
          reader still gets the full process. */}
      <div className="sr-only">
        <h3>Our process in full</h3>
        <ol>
          {WORKFLOW_STEPS.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong> ({item.timeline}) — you receive:{" "}
              {item.deliverable}. {item.description}
              <ul>
                {item.outputs.map((output) => (
                  <li key={output}>{output}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
