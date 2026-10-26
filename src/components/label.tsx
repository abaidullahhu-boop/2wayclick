import type { ReactNode } from "react";

/**
 * Eyebrow label — mono, uppercase, tracked out, with a short accent rule.
 * The rule is decorative; the text carries the meaning on its own.
 */
export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-accent-deep">
      <span aria-hidden="true" className="h-px w-6 bg-accent-deep/45" />
      {children}
    </span>
  );
}

/**
 * Two-tone heading: the emphasised half in --text, the remainder dimmed.
 * `--text-dim` fails contrast on its own, so `dim` must never carry meaning
 * that `lead` does not already state.
 */
export function TwoTone({
  lead,
  dim,
  className = "",
}: {
  lead: string;
  dim: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {lead} <span className="tone-dim">{dim}</span>
    </span>
  );
}
