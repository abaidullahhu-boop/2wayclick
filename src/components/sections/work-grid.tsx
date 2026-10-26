"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Reveal } from "@/components/motion-primitives";
import { Close, ArrowUpRight, Check } from "@/components/icons";
import { PROJECTS, type Project } from "@/lib/projects";

export function WorkGrid() {
  const [active, setActive] = useState<Project | null>(null);

  // Escape closes the sheet, and the page behind it is locked while it is open.
  useEffect(() => {
    if (!active) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);

    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPadding: body.style.paddingRight,
    };

    // Both elements: classic scrollbars live on the documentElement, so
    // locking <body> alone leaves the bar visible beside a frozen page.
    const gap = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.paddingRight = previous.bodyPadding;
    };
  }, [active]);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((project, index) => (
          <Reveal key={project.slug} delay={(index % 2) * 0.08}>
            <article className="card group h-full overflow-hidden rounded-[1.75rem]! hover:-translate-y-1 hover:shadow-(--shadow-lg)">
              <button
                type="button"
                onClick={() => setActive(project)}
                aria-label={`Read the ${project.name} case study`}
                className="flex h-full w-full flex-col text-left"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    quality={85}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    priority={index < 2}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-surface/92 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent-deep backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold tracking-[-0.03em] text-text">
                      {project.name}
                    </h2>
                    <span className="font-mono text-xs text-text-muted">
                      {project.year}
                    </span>
                  </div>

                  <p className="mt-2.5 text-sm leading-relaxed text-text-2">
                    {project.summary}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-border bg-canvas-alt px-2.5 py-1 text-[0.68rem] text-text-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep">
                    Read the case study
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            </article>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active && <DetailSheet project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </>
  );
}


function DetailSheet({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-70 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close case study"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} case study`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease: EASE }}
        /**
         * `data-lenis-prevent` is REQUIRED for this panel to scroll at all.
         * Lenis intercepts wheel events at the window and drives the page
         * itself, so without opting out the panel's own `overflow-y-auto`
         * never receives them and the sheet appears frozen.
         *
         * `overscroll-contain` stops a scroll that reaches the panel's end
         * from chaining to the page behind it.
         */
        data-lenis-prevent
        className="relative flex h-full w-full max-w-3xl flex-col overflow-y-auto overscroll-contain bg-canvas shadow-(--shadow-lg)"
      >
        {/* Sticky header so the title and close control stay reachable no
            matter how far into a long case study the reader has scrolled. */}
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-canvas/92 px-6 py-4 backdrop-blur-md sm:px-10">
          <div className="min-w-0">
            <span className="block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-accent-deep">
              {project.category} · {project.year}
            </span>
            <h3 className="mt-1 truncate text-lg font-bold tracking-[-0.03em] text-text sm:text-xl">
              {project.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-text transition-colors hover:border-accent hover:text-accent-deep"
          >
            <Close className="h-4 w-4" />
          </button>
        </header>

        <div className="relative aspect-square shrink-0 sm:aspect-[4/3]">
          <Image
            src={project.image}
            alt={`${project.name} interface`}
            fill
            quality={85}
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>

        <div className="px-6 pb-14 pt-8 sm:px-10">
          <p className="text-[1.02rem] leading-relaxed text-text-2">
            {project.detail}
          </p>

          {/* Only rendered for work that is publicly reachable. */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-6 py-2.5! text-[0.85rem]!"
            >
              Visit the live site
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}

          {/* Rendered only when the project actually has verified figures — a
              project without them shows no stat row rather than invented
              numbers. */}
          {project.stats && (
            <dl className="mt-8 grid gap-3 sm:grid-cols-3">
              {project.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-surface px-5 py-4"
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-xl font-bold tracking-[-0.03em] text-accent-deep">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-text-muted">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <section className="mt-10">
            <h4 className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-text-muted">
              What we did
            </h4>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-[0.92rem] leading-relaxed text-text-2">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {project.sections && (
            <div className="mt-10 space-y-8 border-t border-border pt-8">
              {project.sections.map((section) => (
                <section key={section.heading}>
                  <h4 className="text-lg font-semibold tracking-[-0.02em] text-text">
                    {section.heading}
                  </h4>
                  <p className="mt-2.5 text-[0.92rem] leading-relaxed text-text-2">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          )}

          <section className="mt-10 border-t border-border pt-8">
            <h4 className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-text-muted">
              Stack
            </h4>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-2"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 rounded-2xl border border-border bg-canvas-alt p-6">
            <p className="text-sm font-semibold text-text">
              Working on something similar?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-2">
              Tell us the problem and the constraints. You get a firm timeline
              and a price range on the call.
            </p>
            <Link href="/contact" className="btn-primary mt-5 py-2.5! text-[0.85rem]!">
              Start a conversation
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
