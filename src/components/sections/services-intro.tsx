"use client";

import { Label, TwoTone } from "@/components/label";
import { BlurIn, Reveal, StaggerGroup, staggerChild } from "@/components/motion-primitives";
import { GrowthCurve } from "@/components/visuals/growth-curve";
import { ReleaseCadence } from "@/components/visuals/release-cadence";
import { motion } from "framer-motion";

export function ServicesIntro() {
  return (
    <section className="relative bg-canvas-alt py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <Label>How we work</Label>
        </Reveal>

        <BlurIn
          as="h2"
          className="mt-5 max-w-[19ch] text-[9vw] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[6vw] lg:text-[4.1vw]"
        >
          <TwoTone lead="Engineering decisions" dim="made in the open." />
        </BlurIn>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-text-2">
            You see the architecture before the build starts and reviewable
            increments while it runs. No black box, no reveal at the end.
          </p>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-2">
          <FeatureCard
            title="Performance is a requirement, not a phase"
            body="We set a budget at the start and measure against it in CI. A regression fails the build rather than surfacing in a launch-week audit."
          >
            <GrowthCurve />
          </FeatureCard>

          <FeatureCard
            title="You get working software throughout"
            body="Work lands on staging in reviewable increments from the first sprint. Cadence rises as the foundation settles and the risky decisions are behind us."
          >
            <ReleaseCadence />
          </FeatureCard>
        </StaggerGroup>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      variants={staggerChild}
      className="card p-7 transition-shadow hover:shadow-(--shadow-md) sm:p-8"
    >
      {children}
      <h3 className="mt-7 text-xl font-semibold tracking-[-0.02em] text-text">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-text-2">{body}</p>
    </motion.article>
  );
}
