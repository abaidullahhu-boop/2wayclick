"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Label } from "@/components/label";
import { BlurIn, EASE, Reveal } from "@/components/motion-primitives";
import { Check } from "@/components/icons";
import { WORKFLOW_STEPS } from "@/lib/workflow";

/**
 * Pinned workflow rail on a dark panel.
 *
 * Scroll position is the SOLE driver of the active step — there is no hover
 * target, no click handler and no autoplay timer. Adding any of those would
 * put two sources of truth on the same state and let the rail disagree with
 * where the page actually is.
 */
export function Workflow() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = Math.min(
      WORKFLOW_STEPS.length - 1,
      Math.max(0, Math.floor(value * WORKFLOW_STEPS.length)),
    );
    // Guarded so a scroll that jitters across a phase boundary does not
    // re-trigger the card's enter animation on every frame. `setActive` with an
    // unchanged value is a no-op in React, but the explicit check also keeps
    // the intent obvious next to the AnimatePresence below, which restarts a
    // 0.55s sequence every time `step.id` changes.
    setActive((current) => (current === index ? current : index));
  });

  // The rail's fill is driven by the raw motion value rather than the derived
  // index, so it travels smoothly between phases instead of stepping.
  const railFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const step = WORKFLOW_STEPS[active];

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20" id="process">
      <div className="container-x px-0!">
        {/* `overflow: clip` — NOT `hidden`. `hidden` makes this a scroll
            container, which silently kills `position: sticky` for the pinned
            rail inside it (the rail scrolls away instead of pinning). `clip`
            still keeps the bloom and grid inside the rounded corners. */}
        <div className="relative overflow-clip rounded-[2rem] bg-ink">
          {/* Ambient warmth: a single soft orange bloom, plus the grid. Kept
              low-contrast so the numerals stay the brightest thing here. */}
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

          {/* Track height sets how much scroll the pinned rail consumes. At
              200vh across six phases each one got ~33vh — about a third of a
              flick, so phases blurred past faster than the card could be read.
              ~75vh each gives a phase time to land before the next arrives. */}
          <div ref={trackRef} className="relative mt-10 h-[450vh]">
            <div className="sticky top-24 h-fit px-6 pb-14 sm:px-12 sm:pb-16">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
                {/* ---- Rail ---- */}
                <ol className="relative">
                  {/* Unfilled track */}
                  <div
                    aria-hidden="true"
                    className="absolute left-[1.4rem] top-3 bottom-3 w-px bg-white/12"
                  />
                  {/* Filled portion — travels with raw scroll progress. */}
                  <motion.div
                    aria-hidden="true"
                    style={{ height: railFill }}
                    className="absolute left-[1.37rem] top-3 w-0.5 origin-top rounded-full bg-linear-to-b from-accent-amber via-accent-orange to-accent-red shadow-[0_0_12px_rgba(255,90,31,0.65)]"
                  />

                  {WORKFLOW_STEPS.map((item, index) => {
                    const isActive = index === active;
                    const isDone = index < active;
                    return (
                      <li
                        key={item.id}
                        className="relative flex items-center gap-5 py-2.5"
                      >
                        <motion.span
                          aria-hidden="true"
                          className={[
                            "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-[0.68rem] transition-colors duration-500",
                            isActive
                              ? "border-accent-orange bg-accent-orange text-white"
                              : isDone
                                ? "border-accent-orange/50 bg-ink text-accent-amber"
                                : "border-white/15 bg-ink text-white/35",
                          ].join(" ")}
                          animate={{ scale: isActive ? 1.1 : 1 }}
                          transition={{ duration: 0.5, ease: EASE }}
                        >
                          {isDone ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            String(index + 1).padStart(2, "0")
                          )}
                        </motion.span>

                        {/* Halo on the active node. Rendered as a sibling so it
                            cannot inflate the node's own hit box. */}
                        {isActive && (
                          <motion.span
                            aria-hidden="true"
                            layoutId="phase-halo"
                            transition={{ duration: 0.5, ease: EASE }}
                            className="absolute left-0 h-11 w-11 rounded-full bg-accent-orange/25 blur-md"
                          />
                        )}

                        <span className="min-w-0">
                          <span
                            className={[
                              "block text-base font-semibold transition-colors duration-500 sm:text-lg",
                              isActive
                                ? "text-white"
                                : isDone
                                  ? "text-white/55"
                                  : "text-white/35",
                            ].join(" ")}
                          >
                            {item.title}
                          </span>
                          <span
                            className={[
                              "block font-mono text-[0.62rem] uppercase tracking-[0.16em] transition-colors duration-500",
                              isActive ? "text-accent-amber" : "text-white/25",
                            ].join(" ")}
                          >
                            {item.timeline}
                          </span>
                        </span>

                        {/* State is carried in text too, never by colour alone. */}
                        {isActive && <span className="sr-only">(current phase)</span>}
                      </li>
                    );
                  })}
                </ol>

                {/* ---- Detail card ---- */}
                <div className="relative min-h-104 sm:min-h-96">
                  <AnimatePresence mode="wait">
                    <motion.article
                      key={step.id}
                      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                      transition={{ duration: 0.62, ease: EASE }}
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-7 backdrop-blur-sm sm:p-9"
                    >
                      {/* Oversized phase numeral — the premium cue. Decorative,
                          so the real number lives in the rail and the sr-only
                          counter below. */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-3 -top-10 select-none text-[9rem] font-bold leading-none tracking-[-0.06em] text-white/4.5 sm:text-[11rem]"
                      >
                        {String(active + 1).padStart(2, "0")}
                      </span>

                      <div className="relative">
                        <span className="inline-flex rounded-full border border-accent-orange/30 bg-accent-orange/10 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent-amber">
                          {step.timeline}
                        </span>

                        <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-white sm:text-[2rem]">
                          {step.title}
                        </h3>

                        <p className="mt-3.5 max-w-[46ch] text-[0.95rem] leading-relaxed text-text-on-dark-muted">
                          {step.description}
                        </p>

                        <ul className="mt-6 space-y-2.5">
                          {step.outputs.map((output, i) => (
                            <motion.li
                              key={output}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              // Starts after the card itself is mostly in, so
                              // the outputs read as arriving into a settled
                              // card rather than racing it.
                              transition={{
                                duration: 0.45,
                                delay: 0.2 + i * 0.08,
                                ease: EASE,
                              }}
                              className="flex gap-3 text-[0.88rem] leading-relaxed text-white/70"
                            >
                              <Check
                                className="mt-0.5 h-4 w-4 shrink-0 text-accent-orange"
                                aria-hidden="true"
                              />
                              <span>{output}</span>
                            </motion.li>
                          ))}
                        </ul>

                        <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
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

                  <p className="mt-5 text-center font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/30 lg:text-left">
                    Phase {active + 1} of {WORKFLOW_STEPS.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static, source-ordered copy of the same steps. The pinned rail shows
          one phase at a time and depends on scroll; this guarantees a crawler
          or a reader without JS still gets the full process. */}
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
