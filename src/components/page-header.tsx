import { Label } from "./label";
import { BlurIn, Reveal } from "./motion-primitives";

/**
 * Shared hero for inner routes. Renders the page's single `h1` — no route
 * using this may declare another one.
 */
export function PageHeader({
  eyebrow,
  title,
  dim,
  intro,
}: {
  eyebrow: string;
  title: string;
  /** Dimmed continuation of the heading. Decorative emphasis only. */
  dim?: string;
  intro: string;
}) {
  return (
    <header className="relative overflow-hidden pt-36 pb-14 sm:pt-44 sm:pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-tint) 0%, var(--canvas) 65%)",
        }}
      />
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 opacity-60" />

      <div className="container-x">
        <Reveal>
          <Label>{eyebrow}</Label>
        </Reveal>

        <BlurIn
          as="h1"
          immediate
          delay={0.06}
          className="mt-5 max-w-[16ch] text-[11vw] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[7.5vw] lg:text-[5.2vw]"
        >
          {title} {dim && <span className="tone-dim">{dim}</span>}
        </BlurIn>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-text-2 sm:text-lg">
            {intro}
          </p>
        </Reveal>
      </div>
    </header>
  );
}
