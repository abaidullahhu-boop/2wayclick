"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Label, TwoTone } from "@/components/label";
import { BlurIn, EASE, Reveal } from "@/components/motion-primitives";
import { Check, ArrowUpRight } from "@/components/icons";
import {
  TIERS,
  getAddOn,
  computeTotal,
  formatUsd,
  type AddOnId,
  type Tier,
} from "@/lib/pricing";

export function Pricing() {
  return (
    <section className="relative py-20 sm:py-28" id="pricing">
      <div className="container-x">
        <Reveal>
          <Label>Engagements</Label>
        </Reveal>
        <BlurIn
          as="h2"
          className="mt-5 max-w-[18ch] text-[9vw] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[6vw] lg:text-[4.1vw]"
        >
          <TwoTone lead="Three ways" dim="to work with us." />
        </BlurIn>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-text-2">
            Figures below are starting points, not quotes. You get a firm number
            after discovery — and in every model, the source code is yours.
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
          {TIERS.map((tier, index) => (
            <TierCard key={tier.id} tier={tier} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  const [selected, setSelected] = useState<AddOnId[]>([]);
  const fastTracked = selected.includes("fast-track");
  const total = computeTotal(tier, selected);
  const weeks = fastTracked ? tier.fastTrackWeeks : tier.standardWeeks;

  const toggle = (id: AddOnId) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    );

  return (
    <Reveal delay={index * 0.08}>
      <article
        className={[
          "card flex h-full flex-col p-7 sm:p-8",
          tier.featured
            ? "border-accent/45 shadow-(--shadow-lg) lg:-mt-4"
            : "",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold tracking-[-0.02em] text-text">
            {tier.name}
          </h3>
          {tier.featured && (
            /* Not colour alone — the chip says what it means in words. */
            <span className="shrink-0 rounded-full bg-accent-red px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white">
              Most chosen
            </span>
          )}
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
          {tier.tagline}
        </p>

        <div className="mt-6 flex items-baseline gap-1.5">
          {tier.isFrom && (
            <span className="text-sm text-text-muted">from</span>
          )}
          <motion.span
            key={total}
            initial={{ opacity: 0.5, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="text-4xl font-bold tracking-[-0.04em] text-text tabular-nums"
          >
            {formatUsd(total)}
          </motion.span>
          {tier.priceSuffix && (
            <span className="text-sm text-text-muted">{tier.priceSuffix}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-text-muted">
          Typical engagement: {tier.timelineLabel}
        </p>

        <DeliveryGauge
          weeks={weeks}
          maxWeeks={tier.standardWeeks}
          fastTracked={fastTracked}
        />

        <ul className="mt-6 space-y-2.5">
          {tier.includes.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-text-2">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <fieldset className="mt-7 border-t border-border pt-5">
          <legend className="sr-only">Add-ons for {tier.name}</legend>
          <p
            aria-hidden="true"
            className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-text-muted"
          >
            Add to this engagement
          </p>
          <div className="flex flex-wrap gap-2">
            {tier.addOns.map((id) => {
              const addOn = getAddOn(id);
              const isOn = selected.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  aria-pressed={isOn}
                  title={addOn.description}
                  className={[
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-400",
                    isOn
                      ? "border-accent bg-accent-tint text-accent-deep"
                      : "border-border-strong bg-surface text-text-disabled hover:border-accent",
                  ].join(" ")}
                >
                  {/* The check is a redundant cue for the colour change so the
                      on/off state does not rely on colour alone. */}
                  {isOn && <Check className="h-3 w-3" aria-hidden="true" />}
                  {addOn.label}
                  <span className="text-text-muted">
                    +{formatUsd(addOn.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <Link
          href="/contact"
          className={[
            "mt-7 w-full",
            tier.featured ? "btn-primary" : "btn-ghost",
          ].join(" ")}
        >
          Start a conversation
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </article>
    </Reveal>
  );
}

/**
 * Delivery gauge. Animates between the standard and fast-tracked timeline when
 * the fast-track add-on is toggled, so the trade-off is visible rather than
 * only stated in the price.
 */
function DeliveryGauge({
  weeks,
  maxWeeks,
  fastTracked,
}: {
  weeks: number;
  maxWeeks: number;
  fastTracked: boolean;
}) {
  const pct = Math.max(12, (weeks / maxWeeks) * 100);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">Delivery</span>
        <span className="font-semibold text-text tabular-nums">
          ~{weeks} weeks{fastTracked ? " (fast tracked)" : ""}
        </span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-canvas-deep"
        role="img"
        aria-label={`Estimated delivery: about ${weeks} weeks${fastTracked ? ", fast tracked" : ""}.`}
      >
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-accent-deep to-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </div>
    </div>
  );
}
