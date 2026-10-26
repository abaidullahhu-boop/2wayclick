/**
 * Engagement models and pricing.
 *
 * PRICES ARE ILLUSTRATIVE. Everything numeric lives in this file so replacing
 * it with real figures is a single-file edit — no component reads a hard-coded
 * number.
 */

export type AddOnId = "design" | "development" | "mobile" | "fast-track";

export type AddOn = {
  id: AddOnId;
  label: string;
  /** Flat amount added to the tier base price, in USD. */
  price: number;
  description: string;
};

export type Tier = {
  id: string;
  name: string;
  /** Displayed base price in USD. */
  basePrice: number;
  /** When true the price renders as "from $X" — retainers have no fixed total. */
  isFrom: boolean;
  /** Billing suffix, e.g. "/month". Empty for one-off projects. */
  priceSuffix: string;
  tagline: string;
  /** Standard delivery in weeks — drives the gauge. */
  standardWeeks: number;
  /** Delivery in weeks when fast track is enabled. */
  fastTrackWeeks: number;
  timelineLabel: string;
  includes: readonly string[];
  /** Add-ons offered on this tier. */
  addOns: readonly AddOnId[];
  /** Marks the default / most-popular tier. */
  featured: boolean;
};

export const ADD_ONS: readonly AddOn[] = [
  {
    id: "design",
    label: "Design",
    price: 4500,
    description: "Full interface design against the real data model.",
  },
  {
    id: "development",
    label: "Development",
    price: 9000,
    description: "Additional engineering capacity on the build.",
  },
  {
    id: "mobile",
    label: "Mobile app",
    price: 14000,
    description: "iOS and Android build, submitted to both stores.",
  },
  {
    id: "fast-track",
    label: "Fast track",
    price: 6000,
    description: "Compressed schedule with a larger team in parallel.",
  },
];

export const TIERS: readonly Tier[] = [
  {
    id: "web-ecommerce",
    name: "Web & E-Commerce",
    basePrice: 8000,
    isFrom: false,
    priceSuffix: "",
    tagline: "Fixed scope, fixed price. The requirements are knowable up front.",
    standardWeeks: 4,
    fastTrackWeeks: 2,
    timelineLabel: "2–4 weeks",
    includes: [
      "Design and build, up to 8 pages",
      "CMS your team edits without a developer",
      "Technical SEO: schema, sitemap, Core Web Vitals",
      "Payments and checkout for store builds",
      "Analytics and conversion tracking",
      "You own the source code, with full handover",
    ],
    addOns: ["design", "development", "fast-track"],
    featured: false,
  },
  {
    id: "product-build",
    name: "Product Build",
    basePrice: 45000,
    isFrom: false,
    priceSuffix: "",
    tagline:
      "A full custom app or SaaS platform, priced from a discovery phase.",
    standardWeeks: 16,
    fastTrackWeeks: 10,
    timelineLabel: "8–16 weeks",
    includes: [
      "Discovery, architecture and data modelling",
      "Full custom build with reviewable increments",
      "Multi-tenancy, billing and role-based access as required",
      "Automated test coverage on critical paths",
      "Deployment pipeline and infrastructure as code",
      "30 days post-launch defect support",
      "You own the source code, with full handover",
    ],
    addOns: ["design", "mobile", "fast-track"],
    featured: true,
  },
  {
    id: "dedicated-team",
    name: "Dedicated Team",
    basePrice: 12000,
    isFrom: true,
    priceSuffix: "/month",
    tagline: "An embedded squad working inside your process, month to month.",
    standardWeeks: 4,
    fastTrackWeeks: 2,
    timelineLabel: "Ongoing",
    includes: [
      "Named engineers, not a rotating pool",
      "Works in your board, your review standards, your rituals",
      "Weekly demos and a written progress summary",
      "Scale the squad up or down with 30 days notice",
      "Direct access to the engineers doing the work",
      "You own the source code, with full handover",
    ],
    addOns: ["design", "development", "mobile"],
    featured: false,
  },
];

export function getAddOn(id: AddOnId): AddOn {
  const found = ADD_ONS.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown add-on: ${id}`);
  return found;
}

/** Live total for a tier given the currently selected add-ons. */
export function computeTotal(tier: Tier, selected: readonly AddOnId[]): number {
  return selected.reduce((sum, id) => sum + getAddOn(id).price, tier.basePrice);
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
