/**
 * Case studies. The /work grid, the detail sheet and the `CreativeWork`
 * JSON-LD nodes all read from this array, so structured data can never
 * describe a project that is not on the page.
 *
 * `stats` and `sections` are optional on purpose. A project without verified
 * numbers renders with no stat row at all rather than with invented ones —
 * fabricated metrics are the fastest way to lose a technical buyer.
 */

export type ProjectStat = {
  value: string;
  label: string;
};

export type CaseSection = {
  heading: string;
  body: string;
};

export type Project = {
  slug: string;
  name: string;
  /** Free-text positioning label shown on the card chip. */
  category: string;
  /** Card-level one-liner. */
  summary: string;
  /** Opening paragraph of the detail sheet. */
  detail: string;
  stack: readonly string[];
  highlights: readonly string[];
  year: number;
  /** Local asset in /public — never a hotlinked remote image. */
  image: string;
  /** Public URL, when the work is live and linkable. */
  liveUrl?: string;
  /** Omit entirely when there are no verified figures. */
  stats?: readonly ProjectStat[];
  /** Optional long-form case study. */
  sections?: readonly CaseSection[];
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "gomer",
    name: "Gomer",
    category: "AI employee marketing site",
    summary:
      "The marketing site for an AI employee that works inside Slack and Microsoft Teams, built end to end from positioning to production code.",
    detail:
      "Gomer sells an AI coworker, not a chatbot, and the site had to carry that distinction without hand-waving. We took it from positioning through to production code: information architecture, copy, design system and build.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Design tokens"],
    highlights: [
      "Data-driven comparison framework — a new competitor page is a data task, not a rebuild",
      "Filterable, outcome-forward case studies",
      "Enterprise page answering security, IT and procurement questions in plain language",
      "Token-based design system the founding team can extend after handoff",
      "Accessible throughout",
    ],
    year: 2025,
    image: "/work-gomer.webp",
    liveUrl: "https://gomer-7i3jm.ondigitalocean.app/",
    stats: [
      { value: "3,200+", label: "tools connected" },
      { value: "5", label: "page templates" },
      { value: "SOC 2", label: "compliance story" },
    ],
    sections: [
      {
        heading: "The positioning problem",
        body: "The site is anchored on “Not a chatbot. A coworker.” The information architecture walks a visitor through three questions in order — what is this, can I trust it, let's go — because a buyer who has not cleared the trust question will not read a pricing page.",
      },
      {
        heading: "Comparison pages as data",
        body: "Competitor comparison pages are structured data rendered through one shared component rather than hand-built pages. Adding a competitor means adding a record, which is what keeps the page count from becoming a maintenance liability for a small team.",
      },
      {
        heading: "Handover",
        body: "Delivered by one person as production code, on a token-based design system the founding team extends themselves.",
      },
    ],
  },
  {
    slug: "packit",
    name: "Packit",
    category: "Multi-channel e-commerce operations",
    summary:
      "An operations platform that syncs inventory, orders and shipping across Amazon and eBay from a single dashboard.",
    detail:
      "Packit keeps one operational view across two marketplaces that expose different inventory semantics and deliver events out of order. The visible product is a dashboard; the real product is a synchronisation engine that stays correct while Amazon and eBay disagree.",
    stack: ["Ruby on Rails", "Sidekiq", "Amazon SP-API", "eBay API", "Tailwind CSS"],
    highlights: [
      "Real-time inventory and order sync across both marketplaces",
      "Order dispatch queue with per-status segmentation and bulk actions",
      "Cross-channel analytics: revenue, units sold and return rate",
      "Background sync on Sidekiq so the UI never blocks",
    ],
    year: 2025,
    image: "/work-packit.webp",
    stats: [
      { value: "2", label: "marketplaces synced" },
      { value: "10 min", label: "order sync interval" },
      { value: "Live", label: "inventory sync" },
    ],
    sections: [
      {
        heading: "Orders that un-stick themselves",
        body: "Orders walk an ordered set of gates — paid, SKU known, listing mapped, address usable. A failed gate parks the order with the reason recorded rather than dropping it, and the check is re-runnable, so an order that was blocked by missing data clears itself once the data arrives instead of needing manual intervention.",
      },
      {
        heading: "Avoiding oversell and deadlock",
        body: "Stock reservation is all-or-nothing inside a transaction, with rows locked in id order so concurrent reservations cannot deadlock against each other. Overselling is the failure that costs a seller their account rating, so the reservation has to be atomic rather than eventually consistent.",
      },
      {
        heading: "Scheduling",
        body: "Sidekiq runs orders every 10 minutes, FBA quantities every 15, Buy Box prices every 2 hours and listings nightly. A Redis lock prevents overlapping sweeps, so a slow run cannot stack on top of the next scheduled one.",
      },
    ],
  },
  {
    slug: "nybvc",
    name: "NYBVC",
    category: "Compliance services platform",
    summary:
      "A violation-resolution platform for NYC property owners, with lookup, cart-based checkout and SMS/WhatsApp payment links.",
    detail:
      "NYBVC resolves NYC Department of Buildings violations for property owners. Owners arrive knowing an address or a BIN, not a violation number, so the product turns a vague identifier into an itemised, payable cart.",
    stack: ["Ruby on Rails", "Sidekiq", "Tailwind CSS", "Framer Motion"],
    highlights: [
      "Violation lookup by BIN, address or violation number",
      "Cart-based checkout with a running subtotal",
      "Square payment links delivered over SMS and WhatsApp via Twilio",
      "Animated marketing site serving all five boroughs",
    ],
    year: 2025,
    image: "/work-nybvc.webp",
    stats: [
      { value: "5", label: "boroughs covered" },
      { value: "2", label: "payment channels" },
      { value: "11+ yrs", label: "domain expertise" },
    ],
    sections: [
      {
        heading: "The problem before the platform",
        body: "Every quote was a phone call. Owners could not tell what a city notice meant or what it would cost, and establishing what a building owed meant manual lookups one record at a time.",
      },
      {
        heading: "Approach",
        body: "Lookup accepts whatever identifier the owner actually has and resolves it before querying, so a search succeeds regardless of how it is phrased. Payment was built channel-agnostic: the same invoice goes out as an SMS link, a WhatsApp message or a hosted checkout, because collection rates differ sharply by owner.",
      },
    ],
  },
  {
    slug: "munshionclick",
    name: "MunshiOnClick",
    category: "Cloud ERP suite",
    summary:
      "A full cloud ERP for the Pakistani market — accounting, inventory, payroll, POS and CRM in one platform.",
    detail:
      "MunshiOnClick replaces the stack of disconnected tools a mid-sized business typically runs. The scope is deliberately broad, which makes tenancy and the accounting core the whole engineering problem.",
    stack: ["Ruby on Rails", "Sidekiq", "Bootstrap"],
    highlights: [
      "One ERP covering accounting, inventory, payroll, POS and CRM",
      "Dashboard with live payable and receivable reporting",
      "Monthly and yearly reports with interactive charts",
      "Role-based access",
    ],
    year: 2024,
    image: "/work-munshionclick.webp",
    liveUrl: "https://munshionclick.com/",
    stats: [
      { value: "14+", label: "trade interfaces" },
      { value: "1", label: "accounting core" },
      { value: "2", label: "UI generations" },
    ],
    sections: [
      {
        heading: "One app, many databases",
        body: "A single Rails app runs against per-company databases, switched per request from the signed-in user's company. That is what makes per-trade interfaces affordable: the trade selects the sidebar and controllers, while accounting, inventory and payroll stay one codebase across all of them — cold storage, factory, fast food, oil station, mobile shop, housing scheme, taxi, dealer and tower among fourteen-plus.",
      },
      {
        heading: "Keeping corrections off the web request",
        body: "Ledger correction runs on Sidekiq's low queue with its own database connection. A back-dated entry can rebuild a party's entire running balance, and that work must never hold a web request open while it does.",
      },
      {
        heading: "Two interfaces, no migration date",
        body: "The platform ships two interface generations simultaneously behind a persisted V1/V2 toggle. Both reach the same records, so no customer is migrated on our release date — they move when they are ready.",
      },
    ],
  },
  {
    slug: "price-optimizer-pro",
    name: "Price Optimizer Pro",
    category: "AI repricing SaaS",
    summary:
      "An AI repricer for Amazon FBA sellers that raises prices when competitors go out of stock, optimising for profit over Buy Box wins.",
    detail:
      "Most repricers race to the bottom, undercutting until the seller wins the Buy Box on margin they cannot afford. Price Optimizer Pro inverts that: it detects when competing offers go out of stock and raises price into the gap, so winning the Buy Box and protecting margin stop being opposed goals.",
    stack: ["React", "NestJS", "Tailwind CSS", "Amazon SP-API"],
    highlights: [
      "AI repricing that raises prices on competitor stockouts",
      "Catalogue view across 1,000+ SKUs with live profit and margin",
      "Brand-level ROI and inventory allocation reporting",
      "Live repricer activity log with per-change reasoning",
    ],
    year: 2025,
    image: "/work-price-optimizer-pro.webp",
    liveUrl: "https://www.priceoptimizerpro.com/",
    // No stats block: there are no verified figures for this one, and the
    // component renders no stat row rather than inventing them.
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
