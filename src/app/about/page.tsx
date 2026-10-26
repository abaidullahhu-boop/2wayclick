import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Cta } from "@/components/sections/cta";
import { Reveal } from "@/components/motion-primitives";
import { Label } from "@/components/label";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbGraph } from "@/lib/schema";
import { FOUNDER, FOUNDING_YEAR, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the Studio",
  description: `${SITE_NAME} is a software development agency founded in ${FOUNDING_YEAR}. How the team is structured, how we work, and what we will tell you before you hire us.`,
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: `About — ${SITE_NAME}`,
    description:
      "A software development agency: how the team is structured, how we work, and what we will tell you before you hire us.",
  },
};

const PRINCIPLES = [
  {
    title: "Estimates are commitments, not hopes",
    body: "We estimate from a scoped architecture, not a feature list. If we get it wrong, we say so the week we notice rather than the week it lands.",
  },
  {
    title: "The client owns everything",
    body: "Code, infrastructure, documentation. No proprietary component you keep renting from us, no hostage clause in the handover.",
  },
  {
    title: "We turn down work that does not fit",
    body: "If your problem needs a team we do not have, or a stack your engineers cannot maintain, we will say that on the first call.",
  },
  {
    title: "Boring technology, on purpose",
    body: "We choose from your constraints — who maintains it, who you hire, what you already run. Novelty is a cost that gets paid after we leave.",
  },
] as const;

const TEAM_STRUCTURE = [
  {
    role: "Principal engineer",
    body: "Owns architecture and stays on the project from discovery to handover. Not a salesperson who disappears after signature.",
  },
  {
    role: "Product designer",
    body: "Designs against the real data model, so screens account for empty, partial, failed and loading states.",
  },
  {
    role: "Engineers",
    body: "Two to four, depending on the engagement. Named people, not a rotating pool of whoever is free that sprint.",
  },
  {
    role: "QA",
    body: "Joins from the first increment rather than the week before launch, when defects are cheapest to fix.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "About", path: "/about" }])} />

      <PageHeader
        eyebrow="About"
        title="A small team"
        dim="that ships production software."
        intro={`Founded in ${FOUNDING_YEAR}. We build custom platforms, mobile apps and the backends behind them — design and engineering under one roof, deliberately small enough that the people you meet are the people who build it.`}
      />

      <section className="container-x pb-20 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="space-y-5 text-[0.98rem] leading-relaxed text-text-2">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-text sm:text-3xl">
                Why we started
              </h2>
              <p>
                Most agencies are organised around billable hours, which quietly
                rewards the wrong things: longer projects, thicker documents, more
                people in every meeting. We wanted to run the opposite way — small
                teams, direct access to the engineers, and a bias toward shipping
                something reviewable in the first fortnight.
              </p>
              <p>
                The other reason is handover. We had both inherited systems from
                agencies that left behind a running application and nothing else:
                no documentation, no infrastructure definitions, no way to change
                anything without calling the people who built it. Every engagement
                here ends with the client genuinely able to take the system
                in-house, whether or not they choose to.
              </p>
              <p>
                We work with founders shipping a first product and with established
                companies extending or modernising systems that already carry real
                load. The second kind is harder and, most weeks, more interesting.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card p-7 sm:p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-accent-deep to-accent-light">
                <span className="font-script text-3xl leading-none text-white">
                  {FOUNDER.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-bold tracking-[-0.02em] text-text">
                {FOUNDER.name}
              </h2>
              <p className="mt-1 text-sm text-accent-deep">{FOUNDER.jobTitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-text-2">
                {FOUNDER.bio}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-canvas-alt py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <Label>How we work</Label>
          </Reveal>
          <h2 className="mt-5 max-w-[18ch] text-[8vw] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[5vw] lg:text-[3.4vw]">
            Four things we hold to
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PRINCIPLES.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.06}>
                <article className="card h-full p-7">
                  <span className="font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-text">
                    {principle.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-2">
                    {principle.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 sm:py-24">
        <Reveal>
          <Label>The team</Label>
        </Reveal>
        <h2 className="mt-5 max-w-[20ch] text-[8vw] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[5vw] lg:text-[3.4vw]">
          How an engagement is staffed
        </h2>

        <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {TEAM_STRUCTURE.map((member) => (
            <Reveal key={member.role}>
              <div className="border-t border-border pt-5">
                <dt className="text-base font-semibold text-text">
                  {member.role}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-2">
                  {member.body}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      <Cta />
    </>
  );
}
