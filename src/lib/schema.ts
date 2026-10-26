/**
 * Structured-data builders. Every node is derived from the same typed content
 * arrays the pages render, so schema and page content cannot drift apart.
 */
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  SAME_AS,
  FOUNDER,
  ORG_ADDRESS,
  FOUNDING_YEAR,
  KNOWS_ABOUT,
  X_HANDLE,
} from "./site";
import { SERVICES } from "./services";
import { FAQS } from "./faqs";
import { PROJECTS } from "./projects";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * `ProfessionalService` is a subtype of LocalBusiness and of Organization —
 * it carries the service-provider semantics without claiming a storefront.
 */
export function organizationNode(): Record<string, unknown> {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: SITE_NAME,
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    foundingDate: String(FOUNDING_YEAR),
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: ORG_ADDRESS.locality,
      addressRegion: ORG_ADDRESS.region,
      addressCountry: ORG_ADDRESS.country,
    },
    founder: {
      "@type": "Person",
      name: FOUNDER.name,
      jobTitle: FOUNDER.jobTitle,
      url: FOUNDER.url,
      sameAs: [...FOUNDER.sameAs],
    },
    knowsAbout: [...KNOWS_ABOUT],
    areaServed: { "@type": "Place", name: "Worldwide" },
    sameAs: [...SAME_AS],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software development services",
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          url: `${SITE_URL}/services#${service.slug}`,
        },
      })),
    },
  };
}

export function websiteNode(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** Root graph: the organisation plus the website it publishes. */
export function rootGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), websiteNode()],
  };
}

/**
 * FAQ graph. Scoped to the homepage only — structured data must describe
 * content visible at the URL that carries it, and the accordion lives on `/`.
 */
export function faqGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** One `Service` node per offering, tied back to the org via `provider`. */
export function servicesGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": SERVICES.map((service) => ({
      "@type": "Service",
      "@id": `${SITE_URL}/services#${service.slug}`,
      name: service.name,
      serviceType: service.category,
      description: service.description,
      url: `${SITE_URL}/services#${service.slug}`,
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "Place", name: "Worldwide" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${service.name} deliverables`,
        itemListElement: service.includes.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item },
        })),
      },
    })),
  };
}

/**
 * `CreativeWork` nodes generated from the same PROJECTS array /work renders,
 * wrapped in an ItemList so the ordering matches the grid.
 */
export function workGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/work#collection`,
    url: `${SITE_URL}/work`,
    name: `Work — ${SITE_NAME}`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: PROJECTS.length,
      itemListElement: PROJECTS.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          "@id": `${SITE_URL}/work#${project.slug}`,
          name: project.name,
          headline: project.name,
          description: project.summary,
          genre: project.category,
          // Images must be absolute in structured data; the array stores
          // root-relative paths for next/image.
          image: `${SITE_URL}${project.image}`,
          dateCreated: String(project.year),
          keywords: [...project.stack].join(", "),
          creator: { "@id": ORG_ID },
          author: { "@id": ORG_ID },
          // Only emitted for work that is publicly reachable — a `url` that
          // 404s is a failed corroboration, same as a dead sameAs entry.
          ...(project.liveUrl ? { url: project.liveUrl } : {}),
        },
      })),
    },
  };
}

/** Breadcrumbs for a non-home route. */
export function breadcrumbGraph(
  trail: readonly { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${SITE_URL}${crumb.path}`,
      }),
    ),
  };
}

export const TWITTER_HANDLE = X_HANDLE;
