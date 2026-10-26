import { TECH_ICONS } from "@/lib/tech";

/**
 * Infinite logo strip.
 *
 * The track is rendered twice so the `-50%` translate in the `marquee`
 * keyframe lands exactly on the seam — with a single copy the loop would jump.
 * The duplicate is `aria-hidden` so assistive tech reads each product once.
 *
 * Edges are masked rather than clipped, so icons dissolve at the boundary
 * instead of being sliced mid-glyph.
 */
export function TechMarquee() {
  return (
    <div
      className="relative w-full overflow-hidden py-2"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 9%, black 91%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 9%, black 91%, transparent)",
      }}
    >
      <ul className="animate-marquee flex w-max items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
        {TECH_ICONS.map((icon) => (
          <TechLogo key={icon.title} icon={icon} />
        ))}
        {TECH_ICONS.map((icon) => (
          <TechLogo key={`dup-${icon.title}`} icon={icon} duplicate />
        ))}
      </ul>
    </div>
  );
}

function TechLogo({
  icon,
  duplicate = false,
}: {
  icon: (typeof TECH_ICONS)[number];
  duplicate?: boolean;
}) {
  return (
    <li
      className="group shrink-0"
      aria-hidden={duplicate ? true : undefined}
      // Brand colour is applied on hover via a custom property so the fill can
      // stay `currentColor` and inherit the gray resting state.
      style={{ ["--brand" as string]: `#${icon.hex}` }}
    >
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label={duplicate ? undefined : icon.title}
        aria-hidden={duplicate ? true : undefined}
        // `fill-text-muted` not `fill-text-dim`: the resting state has to stay
        // legible as a shape on the sand background, and --text-faint is a
        // decorative tone that renders these as barely-there ghosts.
        className="h-7 w-7 fill-text-muted transition-colors duration-500 group-hover:fill-[var(--brand)] sm:h-8 sm:w-8"
      >
        {!duplicate && <title>{icon.title}</title>}
        <path d={icon.path} />
      </svg>
    </li>
  );
}
