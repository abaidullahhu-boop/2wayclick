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
 * Seeded PRNG (mulberry32). The star field must be identical on the server
 * and the client — `Math.random()` here would be a hydration mismatch.
 */
function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;
const rand = seeded(2026);

/**
 * Falling stars. Delays are negative so the shower is already mid-flight on
 * first paint instead of every star launching together. Durations vary
 * enough that no two stars stay in step.
 */
const FALLING_STARS = Array.from({ length: 22 }, () => ({
  left: round(rand() * 100),
  size: round(1 + rand() * 1),
  length: Math.round(70 + rand() * 110),
  duration: round(6 + rand() * 8),
  delay: round(-rand() * 14),
}));

const TWINKLE_STARS = Array.from({ length: 48 }, () => ({
  left: round(rand() * 100),
  top: round(rand() * 100),
  size: round(1 + rand() * 1.6),
  duration: round(2.5 + rand() * 4.5),
  delay: round(-rand() * 7),
}));

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

          {/* Star field */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            {TWINKLE_STARS.map((star, index) => (
              <span
                key={index}
                className="twinkle-star"
                style={
                  {
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    "--duration": `${star.duration}s`,
                    "--delay": `${star.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}

            {/* Oversized and tilted so the diagonal fall still covers the
                panel's corners. */}
            <div className="absolute -inset-[25%] rotate-[22deg]">
              {FALLING_STARS.map((star, index) => (
                <span
                  key={index}
                  className="falling-star"
                  style={
                    {
                      left: `${star.left}%`,
                      "--size": `${star.size}px`,
                      "--length": `${star.length}px`,
                      "--duration": `${star.duration}s`,
                      "--delay": `${star.delay}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
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
