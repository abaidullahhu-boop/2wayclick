"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Label, TwoTone } from "@/components/label";
import { BlurIn, Reveal } from "@/components/motion-primitives";
import { ArrowUpRight } from "@/components/icons";
import { SERVICES, type Service } from "@/lib/services";

/**
 * Scroll-driven sticky card stack. Each card pins at the same offset and the
 * one beneath scales down as the next arrives, so the stack reads as cards
 * settling onto each other rather than a plain list scrolling past.
 */
export function ServiceStack() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Progress is measured over a tall track element rather than the viewport,
  // so the pin duration scales with the number of cards.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="relative py-20 sm:py-28" id="services">
      <div className="container-x">
        <Reveal>
          <Label>What we build</Label>
        </Reveal>
        <BlurIn
          as="h2"
          className="mt-5 max-w-[17ch] text-[9vw] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[6vw] lg:text-[4.1vw]"
        >
          <TwoTone lead="Six ways we ship" dim="production software." />
        </BlurIn>
      </div>

      <div ref={trackRef} className="container-x relative mt-12">
        {SERVICES.map((service, index) => (
          <StackCard
            key={service.slug}
            service={service}
            index={index}
            total={SERVICES.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function StackCard({
  service,
  index,
  total,
  progress,
}: {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // The window during which this card is the topmost one.
  const start = index / total;
  const end = (index + 1) / total;

  // Cards shrink slightly as the next one covers them, which reads as depth.
  //
  // Only `scale` is animated — NOT opacity. Fading a covered card makes it
  // translucent, and because the whole stack is pinned at overlapping offsets
  // the card underneath shows straight through it, so two cards' headings and
  // images composite on top of each other.
  const scale = useTransform(progress, [start, end], [1, 0.92]);

  return (
    <div
      className="sticky"
      // Each card pins a little lower than the last so the stack fans out and
      // the covered cards' top edges stay visible.
      style={{ top: `calc(6.5rem + ${index * 1.05}rem)`, zIndex: index + 1 }}
    >
      <motion.article
        style={{ scale }}
        // `bg-surface` is explicit rather than inherited: the card must be
        // fully opaque so the pinned card beneath it cannot bleed through.
        className="card mb-6 overflow-hidden rounded-[1.75rem]! bg-surface shadow-(--shadow-md)"
      >
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          <div className="relative aspect-3/2 md:aspect-auto md:min-h-80">
            <Image
              src={service.image}
              alt=""
              fill
              quality={85}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              // The first card is above the fold on tall viewports.
              priority={index === 0}
            />
            {/* No dark scrim here. The service artwork is a bright white-and-
                orange render, so an ink overlay only greys it out — and the
                chip below carries its own opaque background for legibility. */}
            <span className="absolute left-4 top-4 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent-deep shadow-(--shadow-sm)">
              {String(index + 1).padStart(2, "0")} · {service.category}
            </span>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-9">
            <h3 className="text-2xl font-bold tracking-[-0.03em] text-text sm:text-[1.75rem]">
              {service.name}
            </h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-text-2">
              {service.summary}
            </p>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {service.stack.slice(0, 4).map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border bg-canvas-alt px-2.5 py-1 text-[0.7rem] text-text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <Link
              href={`/services#${service.slug}`}
              className="group mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent-deep"
            >
              {service.timeline} · see what&rsquo;s included
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
