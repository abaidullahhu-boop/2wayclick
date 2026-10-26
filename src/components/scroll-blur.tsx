/**
 * A fixed band at the bottom of the viewport that blurs whatever scrolls
 * beneath it. Desktop only — on a phone it eats too much of a short viewport.
 *
 * Two constraints here are easy to "simplify" and thereby break:
 *
 * 1. NO COLOUR FILL. The temptation is to add a warm-white gradient so the
 *    band reads as a fade. But the dark CTA panel scrolls under this element,
 *    and any light tint composites over it as a grey haze across the panel's
 *    bottom edge. Pure `backdrop-filter` alters what is behind without
 *    contributing colour of its own.
 *
 * 2. ONE BAND, faded with `mask-image`. Stacking several progressively
 *    blurred layers is the usual trick for a gradual falloff, but stacked
 *    backdrop-filters compose — each layer re-blurs the already-blurred
 *    output — so the effect creeps visibly further up the page than any
 *    single layer's height. A single band masked to fade toward its top
 *    gives the falloff without the compounding.
 */
export function ScrollBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden h-[150px] lg:block"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        maskImage:
          "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.72) 42%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.72) 42%, rgba(0,0,0,0) 100%)",
      }}
    />
  );
}
