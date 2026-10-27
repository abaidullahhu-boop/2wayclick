/**
 * Single source of truth for site-wide identity, URLs and entity data.
 * Everything SEO-facing (metadata, JSON-LD, sitemap, robots, OG images) reads
 * from here so the entity description can never drift between surfaces.
 */

/**
 * Trailing slash is stripped so callers can always compose `${SITE_URL}/path`
 * without producing a double slash — a double slash yields a distinct URL that
 * canonical tags and sitemap entries would then disagree about.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://2wayclick.com"
).replace(/\/+$/, "");

export const SITE_NAME = "2wayclick";
export const SITE_TAGLINE = "Software development agency";

export const CONTACT_EMAIL = "info@2wayclick.com";
export const X_HANDLE = "@2wayclick";

export const SITE_DESCRIPTION =
  "2wayclick is a software development agency building custom software, SaaS platforms, mobile apps and backend APIs. Design and engineering under one roof, with full source code ownership on handover.";

/**
 * Profiles that corroborate the entity in `sameAs`.
 *
 * A dead URL here is worse than an omission: `sameAs` exists to let a crawler
 * cross-check that the organisation is real, so a 404 is a *failed*
 * corroboration on the exact signal meant to prove it. Remove an entry the
 * moment the profile stops resolving rather than leaving it to rot.
 */
export const SOCIAL_LINKS = {
  x: "https://x.com/2wayclick",
  linkedin: "https://www.linkedin.com/company/2wayclick",
  github: "https://github.com/2wayclick",
  dribbble: "https://dribbble.com/2wayclick",
} as const;

export const PROFILE_LINKS = {
  /** Verified client reviews live here — the strongest corroboration we have. */
  upwork: "https://www.upwork.com/freelancers/abaidawan",
} as const;

export const SAME_AS: readonly string[] = [
  ...Object.values(SOCIAL_LINKS),
  ...Object.values(PROFILE_LINKS),
];

export const FOUNDER = {
  name: "Abaid Ullah",
  jobTitle: "Founder & Principal Engineer",
  bio: "Fifteen years shipping production software — from first-release startup products to platform modernisation inside established engineering teams.",
  url: `${SITE_URL}/about`,
  sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github],
} as const;

export const ORG_ADDRESS = {
  locality: "Lahore",
  region: "Punjab",
  country: "PK",
} as const;

export const FOUNDING_YEAR = 2018;

/** Topics the organisation claims expertise in — feeds `knowsAbout`. */
export const KNOWS_ABOUT: readonly string[] = [
  "Custom software development",
  "SaaS platform development",
  "Mobile app development",
  "Backend and API engineering",
  "Cloud infrastructure and DevOps",
  "AI and LLM integration",
  "System architecture",
  "Legacy system modernisation",
  "E-commerce development",
  "Technical due diligence",
];

export const NAV_LINKS: readonly { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Availability line rendered in the hero and CTA. Named month, current year. */
export function currentAvailability(): string {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long" });
  return `${month} ${now.getFullYear()}`;
}
