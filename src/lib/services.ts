/**
 * Service catalogue. Rendered by the homepage sticky card stack, the /services
 * page, and serialised into `Service` JSON-LD nodes — one array so the schema
 * can never advertise an offering the page does not show.
 */

export type Service = {
  slug: string;
  /** Short label used on the sticky card chip. */
  category: string;
  name: string;
  /** One line, used on the homepage card. */
  summary: string;
  /** Longer positioning paragraph for /services and schema `description`. */
  description: string;
  /** Concrete deliverables — what the client actually receives. */
  includes: readonly string[];
  stack: readonly string[];
  timeline: string;
  /** Buyer qualification — who this is and is not for. */
  audience: string;
  image: string;
};

export const SERVICES: readonly Service[] = [
  {
    slug: "custom-software",
    category: "Custom Software",
    name: "Custom Software Development",
    summary:
      "Internal tools, workflow systems and platforms built around how a business actually operates.",
    description:
      "Off-the-shelf software forces your process to match its assumptions. We build the system around the process you already run — the approval chain, the pricing rules, the exceptions your team works around every day. Work starts with mapping the real workflow, including the parts that live in spreadsheets.",
    includes: [
      "Workflow and data model mapping before any code",
      "Role-based access matching your real org structure",
      "Integrations with the systems already in use",
      "Migration from spreadsheets or a legacy tool",
      "Admin tooling so your team can operate it without us",
      "Full source code ownership and documented handover",
    ],
    stack: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker"],
    timeline: "8–16 weeks",
    audience:
      "Companies running critical operations on spreadsheets, or paying for a SaaS tool that fits two thirds of the job.",
    image: "/service-custom-software.webp",
  },
  {
    slug: "saas-platforms",
    category: "SaaS Platforms",
    name: "SaaS Platform Development",
    summary:
      "Multi-tenant products with subscriptions, dashboards and role-based access.",
    description:
      "A SaaS product is a set of decisions about tenancy, billing and permissions that get expensive to reverse. We settle those first — how tenants are isolated, what a seat means, what happens on downgrade — then build the product on top of that foundation.",
    includes: [
      "Multi-tenant architecture with isolation at the data layer",
      "Subscription billing, trials, upgrades and dunning",
      "Role-based permissions and team accounts",
      "Customer-facing analytics dashboards",
      "Usage metering and plan enforcement",
      "Full source code ownership and documented handover",
    ],
    stack: ["TypeScript", "Next.js", "PostgreSQL", "Stripe", "Redis", "AWS"],
    timeline: "10–20 weeks",
    audience:
      "Founders taking a validated product to market, and teams turning an internal tool into something they can sell.",
    image: "/service-saas-platforms.webp",
  },
  {
    slug: "mobile-apps",
    category: "Mobile Apps",
    name: "Mobile App Development",
    summary: "iOS and Android, native or cross-platform, shipped to both stores.",
    description:
      "We pick the platform approach from your requirements, not from preference. Cross-platform when the feature set is shared and speed matters; native when you need deep hardware access or platform-specific interaction. Either way, we handle store submission and the review cycle.",
    includes: [
      "Native or cross-platform build, chosen from requirements",
      "Offline behaviour and state sync",
      "Push notifications and deep linking",
      "App Store and Play Store submission, including review responses",
      "Crash reporting and release analytics",
      "Full source code ownership and documented handover",
    ],
    stack: ["React Native", "Expo", "Swift", "Kotlin", "Flutter"],
    timeline: "10–18 weeks",
    audience:
      "Products where mobile is the primary surface, and companies extending an existing web platform to phones.",
    image: "/service-mobile-apps.webp",
  },
  {
    slug: "backend-apis",
    category: "Backend & APIs",
    name: "Backend & API Engineering",
    summary:
      "Data models, integrations and services built to stay fast as load grows.",
    description:
      "Most performance problems are data model problems that surfaced late. We design the schema and the query patterns together, load-test against realistic volumes rather than seed data, and document the API so the teams consuming it are not reverse-engineering behaviour from responses.",
    includes: [
      "Schema design with indexing and query patterns planned together",
      "Versioned REST or GraphQL APIs with published contracts",
      "Third-party integrations with retry and failure handling",
      "Background jobs, queues and scheduled work",
      "Load testing against realistic data volumes",
      "Full source code ownership and documented handover",
    ],
    stack: ["Node.js", "Python", "Go", "PostgreSQL", "Redis", "Kubernetes"],
    timeline: "6–14 weeks",
    audience:
      "Teams whose product outgrew its first backend, and companies exposing an API to partners or their own mobile clients.",
    image: "/service-backend-apis.webp",
  },
  {
    slug: "ai-integration",
    category: "AI Integration",
    name: "AI Integration",
    summary:
      "LLM features, automation and retrieval wired into existing products.",
    description:
      "AI features fail in production for ordinary engineering reasons: no evaluation set, no fallback when the model is wrong, costs that scale with usage nobody modelled. We build the feature and the guardrails around it — retrieval over your own data, measured output quality, and a defined behaviour for the failure case.",
    includes: [
      "Retrieval over your own documents and data",
      "Evaluation sets so output quality is measured, not assumed",
      "Defined fallback behaviour when the model is wrong or slow",
      "Token cost modelling before rollout",
      "Human review steps where the stakes require them",
      "Full source code ownership and documented handover",
    ],
    stack: ["Claude API", "Python", "TypeScript", "Vector search", "Postgres"],
    timeline: "4–12 weeks",
    audience:
      "Teams with an existing product and a specific task to automate — not teams looking for a use case.",
    image: "/service-ai-integration.webp",
  },
  {
    slug: "web-ecommerce",
    category: "Web & E-Commerce",
    name: "Web & E-Commerce Development",
    summary: "Marketing sites and stores that convert.",
    description:
      "The engineering standards we apply to platforms apply here too: real performance budgets, structured data, and a content model your team can edit without a deploy. Fixed scope and fixed price, because the requirements are knowable up front.",
    includes: [
      "Design and build, with a performance budget enforced at CI",
      "CMS your team edits without a developer",
      "Technical SEO: schema, sitemaps, metadata, Core Web Vitals",
      "Payments, checkout and inventory for store builds",
      "Analytics and conversion tracking",
      "Full source code ownership and documented handover",
    ],
    stack: ["Next.js", "TypeScript", "Sanity", "Shopify", "Stripe"],
    timeline: "2–4 weeks",
    audience:
      "Companies whose current site loads slowly, ranks poorly, or needs a developer for every copy change.",
    // Note: this render is ~5:4 while the rest of the set is 3:2. The cards
    // use `object-cover` against a fixed 3:2 frame, so it crops top and bottom
    // rather than distorting — the subject sits centre, so nothing is lost.
    image: "/service-web-ecommerce.webp",
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
