import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/sections/contact-form";
import { Reveal } from "@/components/motion-primitives";
import { JsonLd } from "@/components/json-ld";
import { Mail } from "@/components/icons";
import { breadcrumbGraph } from "@/lib/schema";
import { CONTACT_EMAIL, currentAvailability } from "@/lib/site";
import { WORKFLOW_STEPS } from "@/lib/workflow";

export const metadata: Metadata = {
  title: "Contact & Project Enquiries",
  description:
    "Start a software project with 2wayclick. Tell us the problem, the constraints and the deadline — you get a firm timeline and a price range on the first call.",
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: "Contact — 2wayclick",
    description:
      "Tell us what you are building. A firm timeline and a price range on the first call.",
  },
};

const WHAT_HAPPENS = [
  {
    title: "You send the brief",
    body: "The problem, any constraints, and the deadline you are working to. Rough is fine.",
  },
  {
    title: "We reply within a business day",
    body: "Either with a time for a call, or with an honest note that we are not the right firm for it.",
  },
  {
    title: "A 30-minute call",
    body: "We ask about the workflow, the data and the integrations, then give you a timeline and a price range on the call.",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbGraph([{ name: "Contact", path: "/contact" }])} />

      <PageHeader
        eyebrow="Contact"
        title="Tell us what"
        dim="you're building."
        intro="Bring the problem, the constraints and the deadline. You will get a firm timeline and a price range on the call — not a week later, and not after a discovery invoice."
      />

      <section className="container-x pb-20 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-8">
              <div className="card p-7">
                <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-muted">
                  Prefer email
                </h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group mt-3 inline-flex items-center gap-2.5 text-lg font-semibold text-text transition-colors hover:text-accent-deep"
                >
                  <Mail className="h-5 w-5 text-accent" />
                  {CONTACT_EMAIL}
                </a>
                <p className="mt-4 text-sm text-text-muted">
                  Taking on new projects for{" "}
                  <span className="font-hand text-lg text-accent-deep">
                    {currentAvailability()}
                  </span>
                </p>
              </div>

              <div>
                <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-muted">
                  What happens next
                </h2>
                <ol className="mt-4 space-y-5">
                  {WHAT_HAPPENS.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-light bg-accent-tint font-mono text-[0.68rem] text-accent-deep"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-text">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-text-2">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-border bg-canvas-alt p-6">
                <h2 className="text-sm font-semibold text-text">
                  Already have a codebase?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-2">
                  Say so in the brief. We start those engagements with a paid
                  technical assessment — you keep the written findings whether or
                  not you continue with us.
                </p>
              </div>

              <div>
                <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-muted">
                  Then the engagement runs
                </h2>
                <ol className="mt-3 flex flex-wrap gap-1.5">
                  {WORKFLOW_STEPS.map((step) => (
                    <li
                      key={step.id}
                      className="rounded-full border border-border bg-surface px-3 py-1.5 text-[0.7rem] text-text-muted"
                    >
                      {step.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
