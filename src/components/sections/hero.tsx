import Link from "next/link";
import { BlurIn, Reveal } from "@/components/motion-primitives";
import { RotatingWord } from "@/components/rotating-word";
import { TechMarquee } from "@/components/tech-marquee";
import { ArrowUpRight } from "@/components/icons";
import { currentAvailability } from "@/lib/site";

const ROTATING = ["Software", "Platform", "App", "System"] as const;

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-28 pb-12 sm:pt-32">
      {/* Layered background: radial warm wash, grid, two out-of-phase orbs. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 65% at 50% 0%, var(--accent-tint) 0%, var(--canvas) 62%)",
        }}
      />
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden="true"
        className="animate-pulse-glow absolute -left-24 top-16 -z-10 h-[26rem] w-[26rem] rounded-full bg-accent-glow/55 blur-[110px]"
      />
      <div
        aria-hidden="true"
        // Offset delay so the two orbs breathe out of phase rather than
        // pulsing in lockstep, which reads as a single flashing shape.
        className="animate-pulse-glow absolute -right-20 top-52 -z-10 h-[30rem] w-[30rem] rounded-full bg-accent-light/40 blur-[130px]"
        style={{ animationDelay: "-4.5s" }}
      />

      <div className="container-x">
        <div className="flex flex-col items-center text-center">
          <BlurIn immediate>
            <p className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[0.8rem] font-medium text-text-2">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="animate-ping-dot absolute inline-flex h-full w-full rounded-full bg-accent" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-deep" />
              </span>
              Trusted by 40+ founders and engineering teams
            </p>
          </BlurIn>

          <BlurIn
            as="h1"
            immediate
            delay={0.1}
            className="mt-7 text-[8.6vw] font-bold leading-[1.02] tracking-[-0.045em] sm:text-[7.4vw] lg:text-[5.4vw]"
          >
            {/* Exactly two lines, enforced rather than left to the wrapper.
                Each half is `whitespace-nowrap` and they are separated by a
                block break, so the headline cannot orphan a word onto a third
                line as the rotating slot changes width. Type is sized so the
                longer half still fits the container at every breakpoint. */}
            <span className="block whitespace-nowrap">
              We Build the{" "}
              <RotatingWord
                words={ROTATING}
                staticWord="Software"
                className="text-gradient"
              />
            </span>
            <span className="tone-dim block whitespace-nowrap">
              Your Business Runs On
            </span>
          </BlurIn>

          <Reveal delay={0.28}>
            <p className="mt-7 max-w-[54ch] text-balance text-base leading-relaxed text-text-2 sm:text-lg">
              A software development agency shipping custom platforms, SaaS
              products, mobile apps and the backends behind them. Design and
              engineering under one roof — and you own every line of it.
            </p>
          </Reveal>

          <Reveal delay={0.38}>
            <div className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Book a call
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/work" className="btn-ghost">
                See our work
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.48}>
            <p className="mt-6 text-sm text-text-muted">
              Taking on new projects for{" "}
              <span className="font-hand text-xl text-accent-deep">
                {currentAvailability()}
              </span>
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.6} className="mt-14 sm:mt-16">
        <p className="container-x mb-6 text-center font-mono text-[0.68rem] uppercase tracking-[0.22em] text-text-muted">
          The stack we build on
        </p>
        <TechMarquee />
      </Reveal>
    </section>
  );
}
