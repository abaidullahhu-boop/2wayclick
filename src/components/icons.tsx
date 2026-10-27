import type { SVGProps } from "react";
import { siUpwork } from "simple-icons";

type IconProps = SVGProps<SVGSVGElement>;

/** Shared defaults — stroke icons inherit colour from the parent. */
const stroke: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function ArrowRight(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M19 12H6M12 19l-7-7 7-7" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={2.5} {...props}>
      <path d="m4 12.5 5.2 5.2L20 7" />
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={2} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Star(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="m12 17.27 5.18 3.13a.6.6 0 0 0 .89-.65l-1.37-5.89 4.57-3.96a.6.6 0 0 0-.34-1.05l-6.02-.51-2.35-5.55a.6.6 0 0 0-1.11 0L9.1 8.34l-6.02.51a.6.6 0 0 0-.34 1.05l4.57 3.96-1.37 5.89a.6.6 0 0 0 .89.65z" />
    </svg>
  );
}

/**
 * Upwork wordmark glyph, used on the verified-review badge.
 * Path is taken verbatim from the `simple-icons` package so the mark is the
 * real trademark shape rather than a hand-traced approximation.
 */
export function UpworkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={siUpwork.path} />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/* --- Brand marks. Filled paths, so no stroke defaults. --- */

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function DribbbleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.615 0 12-5.373 12-12S18.615 0 12 0zm9.938 11.398c-.216-.056-2.4-.72-4.896-.32-1.04-2.856-2.2-5.2-2.376-5.552 2.6 1.04 4.552 3.4 5.032 5.872zM12 2.16c1.936 0 3.712.72 5.064 1.912-.152.216-1.2 1.632-3.68 2.552-1.144-2.104-2.416-3.832-2.6-4.088.4-.048.808-.072 1.216-.072zM8.32 2.848c.184.24 1.432 1.976 2.6 4.032-3.28.872-6.176.856-6.488.856.48-2.28 2.016-4.176 3.888-4.888zM2.136 12.016v-.312c.304.008 3.712.048 7.208-1 .2.392.392.792.568 1.192-.088.024-.184.056-.272.088-3.616 1.168-5.536 4.36-5.696 4.632-1.128-1.256-1.808-2.912-1.808-4.6zm3.4 6.144c.104-.216 1.44-2.76 5.392-4.136l.048-.016c.984 2.56 1.392 4.704 1.496 5.32-1.04.44-2.176.688-3.376.688-1.336 0-2.584-.32-3.688-.888zm7.048.288c-.072-.44-.448-2.48-1.36-5 2.336-.376 4.384.232 4.64.312-.328 2.056-1.504 3.832-3.152 4.912zm.664-6.472c-.096-.232-.2-.464-.312-.696 2.336-.952 3.36-2.32 3.48-2.488 1.336 1.624 1.44 3.352 1.44 3.352s-2.44-.496-4.608-.168z" />
    </svg>
  );
}

/* ---- Process phase icons ---- */

export function SearchIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

export function PenIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M4 20l1.2-4.6L15.6 5a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8 4 20Z" />
      <path d="m13.5 7 3.5 3.5" />
    </svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
    </svg>
  );
}

export function RocketIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 15c3.9-2 7-6.2 7-11-4.8 0-9 3.1-11 7l4 4Z" />
      <path d="M8 11H4.5L7 8h3.5M13 16v3.5l3-2.5v-3.5" />
      <path d="M6.5 17.5c-1.2.4-2 1.6-2 3 1.4 0 2.6-.8 3-2" />
      <circle cx="14.5" cy="9.5" r="1.3" />
    </svg>
  );
}

export function LifebuoyIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="m6 6 3.5 3.5M14.5 14.5 18 18M18 6l-3.5 3.5M9.5 14.5 6 18" />
    </svg>
  );
}
