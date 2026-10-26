import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Cta } from "@/components/sections/cta";
import { Reveal } from "@/components/motion-primitives";
import { JsonLd } from "@/components/json-ld";
import { Check, ArrowUpRight } from "@/components/icons";
import { servicesGraph, breadcrumbGraph } from "@/lib/schema";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Software Development Services",
  description:
    "Custom software, SaaS platforms, mobile apps, backend and API engineering, AI integration and e-commerce. What each engagement includes, the stack, the timeline and who it is for.",
  alternates: { canonical: "/services" },
  openGraph: {
    url: "/services",
    title: "Software Development Services — 2wayclick",
    description:
      "Custom software, SaaS platforms, mobile apps, backend APIs, AI integration and e-commerce builds.",
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* One Service node per offering, each tied back to the organisation
          via `provider`. */}
      <JsonLd data={servicesGraph()} />
      <JsonLd data={breadcrumbGraph([{ name: "Services", path: "/services" }])} />

      <PageHeader
        eyebrow="Services"
        title="Engineering work,"
        dim="described in full."
        intro="Six kinds of engagement. Each section below covers what is included, the stack we would reach for, a realistic timeline, and who the work suits — so you can rule us in or out without a call."
      />

      {/* Anchor index */}
      <nav aria-label="Services on this page" className="container-x">
        <ul className="flex flex-wrap gap-2">
          {SERVICES.map((service) => (
            <li key={service.slug}>
              <a
                href={`#${service.slug}`}
                className="inline-flex rounded-full border border-border-strong bg-surface px-4 py-2 text-sm text-text-2 transition-all duration-500 hover:-translate-y-0.5 hover:border-accent hover:text-accent-deep"
              >
                {service.category}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-x mt-16 space-y-20 pb-20 sm:mt-20 sm:space-y-28 sm:pb-28">
        {SERVICES.map((service, index) => (
          <section
            key={service.slug}
            id={service.slug}
            // Offset so the fixed header does not cover the heading when an
            // anchor link jumps here.
            className="scroll-mt-28"
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <Reveal>
                {/* Bordered rather than scrimmed: the artwork is near-white at
                    the edges, so it needs a boundary against the warm canvas,
                    not a dark overlay that would grey the render out. */}
                <div className="relative aspect-3/2 overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-(--shadow-md)">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    quality={85}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-accent-deep">
                  {String(index + 1).padStart(2, "0")} · {service.category}
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-text sm:text-4xl">
                  {service.name}
                </h2>

                <p className="mt-4 text-[0.95rem] leading-relaxed text-text-2">
                  {service.description}
                </p>

                <h3 className="mt-8 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-muted">
                  What&rsquo;s included
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-text-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-muted">
                      Typical timeline
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-text">
                      {service.timeline}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-muted">
                      Stack
                    </h3>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {service.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-border bg-canvas-alt px-2.5 py-1 text-[0.68rem] text-text-muted"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <h3 className="mt-8 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-muted">
                  Who it&rsquo;s for
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2">
                  {service.audience}
                </p>

                <Link
                  href="/contact"
                  className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep"
                >
                  Talk about a {service.category.toLowerCase()} project
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <Cta />
    </>
  );
}
