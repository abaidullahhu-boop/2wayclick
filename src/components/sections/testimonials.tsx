"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Label, TwoTone } from "@/components/label";
import { BlurIn, EASE, Reveal } from "@/components/motion-primitives";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Star,
  UpworkIcon,
} from "@/components/icons";
import { TESTIMONIALS, UPWORK_PROFILE_URL } from "@/lib/testimonials";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  // Direction drives which side the slide enters from.
  const [direction, setDirection] = useState(1);
  const active = TESTIMONIALS[index];

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="relative bg-canvas-alt py-20 sm:py-28" id="testimonials">
      <div className="container-x">
        <Reveal>
          <Label>Clients</Label>
        </Reveal>
        <BlurIn
          as="h2"
          className="mt-5 max-w-[16ch] text-[9vw] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[6vw] lg:text-[4.1vw]"
        >
          <TwoTone lead="What it’s like" dim="to work with us." />
        </BlurIn>

        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            {/* Provenance badge. Every quote below is verbatim from a
                completed Upwork contract, so the source is stated plainly
                rather than left as an unbacked claim. */}
            <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 py-2 text-[0.8rem] font-medium text-text-2">
              <UpworkIcon className="h-4 w-4 text-accent-deep" />
              Verified reviews from Upwork
            </span>

            <a
              href={UPWORK_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-accent-deep"
            >
              See the full profile
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>

        <div className="mt-12">
          {/* `items-stretch` on the grid plus `h-full` on the slide is what
              lets the gradient panel run the full card height. Without it the
              panel sizes to its own content and leaves a band of bare card
              below it. */}
          <div className="card relative overflow-hidden rounded-[1.75rem]!">
            <div className="relative min-h-[30rem] sm:min-h-[22rem]">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.blockquote
                  key={active.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 44 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -44 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="absolute inset-0 grid items-stretch sm:grid-cols-[minmax(0,13.5rem)_1fr]"
                >
                  {/* Gradient panel — a distinct two-stop orange per slide. */}
                  <div
                    className="relative flex min-h-40 items-center justify-center overflow-hidden sm:min-h-full"
                    style={{
                      backgroundImage: `linear-gradient(150deg, ${active.gradient[0]}, ${active.gradient[1]})`,
                    }}
                  >
                    {/* Oversized quote mark. Decorative — the <blockquote>
                        already conveys that this is a quote. Positioned so the
                        glyph body sits inside the panel; the script face has a
                        tall bearing, so a negative top inset pushes it out of
                        view entirely. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-0 select-none font-script text-[10rem] leading-[0.9] text-white/20"
                    >
                      &ldquo;
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative font-script text-6xl leading-none text-white drop-shadow-sm sm:text-7xl"
                    >
                      {active.initials}
                    </span>
                    <span className="absolute bottom-4 left-0 right-0 text-center font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/70">
                      Upwork client
                    </span>
                  </div>

                  <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
                    {/* Rating is stated in text for assistive tech; the stars
                        themselves are decorative, so the score is never
                        carried by the glyphs alone. */}
                    <div className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={
                              i < active.rating
                                ? "h-[1.05rem] w-[1.05rem] text-accent"
                                : "h-[1.05rem] w-[1.05rem] text-border-strong"
                            }
                          />
                        ))}
                      </span>
                      <span className="text-sm font-bold text-text">
                        {active.rating.toFixed(1)}
                      </span>
                      <span className="sr-only">out of 5</span>
                    </div>

                    <p className="mt-4 text-[1.02rem] leading-relaxed text-text sm:text-[1.1rem] sm:leading-relaxed">
                      &ldquo;{active.quote}&rdquo;
                    </p>

                    <footer className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-7">
                      <div>
                        <cite className="block text-sm font-semibold not-italic text-text">
                          {active.name}
                        </cite>
                        <span className="mt-0.5 block text-sm text-text-muted">
                          {active.role}
                        </span>
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-canvas-alt px-2.5 py-1 text-[0.7rem] font-medium text-text-2">
                          <UpworkIcon className="h-3 w-3 text-accent-deep" />
                          Verified on Upwork
                        </span>
                      </div>

                      <div className="rounded-2xl border border-accent/25 bg-accent-tint px-4 py-3 text-right">
                        <span className="block text-lg font-bold tracking-[-0.03em] text-accent-deep">
                          {active.stat}
                        </span>
                        <span className="mt-0.5 block text-[0.68rem] leading-snug text-text-muted">
                          {active.statLabel}
                        </span>
                      </div>
                    </footer>
                  </div>
                </motion.blockquote>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface text-text transition-all duration-500 hover:-translate-y-0.5 hover:border-accent hover:text-accent-deep"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface text-text transition-all duration-500 hover:-translate-y-0.5 hover:border-accent hover:text-accent-deep"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-text-muted tabular-nums">
                {String(index + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
              </span>
              <ul className="flex gap-1.5">
                {TESTIMONIALS.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Show testimonial from ${item.name}`}
                      aria-current={i === index ? "true" : undefined}
                      className={[
                        "h-2 rounded-full transition-all duration-500",
                        i === index
                          ? "w-7 bg-accent"
                          : "w-2 bg-border-strong hover:bg-accent-light",
                      ].join(" ")}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
