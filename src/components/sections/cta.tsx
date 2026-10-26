"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/motion-primitives";
import { currentAvailability } from "@/lib/site";

const REASONS = [
  {
    title: "A number on the first call",
    body: "You leave with a firm timeline and a price range, not a promise to send one next week.",
  },
  {
    title: "Engineers, not account managers",
    body: "You talk to the people writing the code. Nothing gets relayed through a layer that cannot answer.",
  },
  {
    title: "You own everything",
    body: "Source code, infrastructure and documentation transfer to you. Taking it in-house is a real option.",
  },
] as const;

/**
 * Falling light streaks.
 *
 * Durations are mutually non-divisible (7 / 11 / 17) so the three layers never
 * re-align into a visible repeating pattern. With 6/12/18 the layers would
 * resync every 18 seconds and the eye picks that up immediately.
 *
 * Each layer is drawn at 200% height with the pattern tiled twice, so the
 * -50% translate in `streak-fall` lands exactly on the seam.
 */
const STREAK_TIERS = [
  { duration: "7s", opacity: 0.5, width: "1px", gap: "120px" },
  { duration: "11s", opacity: 0.32, width: "1.5px", gap: "190px" },
  { duration: "17s", opacity: 0.22, width: "1px", gap: "260px" },
] as const;

export function Cta() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax travel for the background image.
  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={sectionRef} className="relative px-4 py-16 sm:px-6 sm:py-20">
      <div className="container-x px-0!">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 sm:px-12 sm:py-24">
          {/* Parallax image. The wrapper is inset NEGATIVELY on the vertical
              axis so the ±12% travel never pulls an edge of the image inside
              the panel and expose the bare background. */}
          <motion.div
            aria-hidden="true"
            style={{ y: imageY }}
            className="absolute -inset-y-[18%] inset-x-0"
          >
            <Image
              src="/cta.png"
              alt=""
              fill
              quality={85}
              sizes="100vw"
              className="object-cover opacity-70"
            />
          </motion.div>

          <div
            aria-hidden="true"
            // Lighter than a flat scrim: the artwork is a bright arc across the
            // lower half, so the gradient is weighted to the top where the
            // headline sits and thins out where the arc should read through.
            className="absolute inset-0 bg-linear-to-b from-ink/92 via-ink/78 to-ink/55"
          />

          {/* Streak layers */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            {STREAK_TIERS.map((tier) => (
              <div
                key={tier.duration}
                className="streak-layer absolute inset-x-0 top-0 h-[200%]"
                style={{
                  opacity: tier.opacity,
                  animation: `streak-fall ${tier.duration} linear infinite`,
                  backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent ${tier.gap}, rgba(253,186,116,0.9) ${tier.gap}, rgba(253,186,116,0.9) calc(${tier.gap} + ${tier.width}), transparent calc(${tier.gap} + ${tier.width}), transparent calc(${tier.gap} * 2))`,
                  maskImage:
                    "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
                }}
              />
            ))}
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-accent-light">
                Let&rsquo;s talk
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-5 text-[10vw] font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-[6.5vw] lg:text-[4.4vw]">
                Tell us what you&rsquo;re building.
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mx-auto mt-5 max-w-[52ch] text-[0.98rem] leading-relaxed text-accent-glow/85">
                A 30-minute call. Bring the problem, the constraints and the
                deadline — we will tell you what it takes to build, or that we
                are not the right firm for it.
              </p>
            </Reveal>

            <ol className="mx-auto mt-11 grid max-w-2xl gap-6 text-left sm:grid-cols-3">
              {REASONS.map((reason, index) => (
                <Reveal key={reason.title} delay={0.22 + index * 0.08} as="li">
                  <span className="font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold text-white">
                    {reason.title}
                  </h3>
                  <p className="mt-1.5 text-[0.82rem] leading-relaxed text-accent-glow/70">
                    {reason.body}
                  </p>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.5}>
              <Link
                href="/contact"
                // Inverted for the dark panel. The sheen is suppressed because
                // a white-on-white sweep is invisible anyway and only costs a
                // compositing layer.
                className="btn-primary mt-11 bg-white! bg-none! text-ink! after:hidden! hover:bg-accent-glow!"
              >
                Book a call
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal delay={0.58}>
              <p className="mt-5 text-sm text-accent-glow/70">
                Taking on new projects for{" "}
                <span className="font-hand text-xl text-accent-light">
                  {currentAvailability()}
                </span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
