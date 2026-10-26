import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only real, indexable routes are listed. `/work` and `/services` render their
 * detail content in-page (a sheet and anchored sections), so there are no
 * per-project or per-service URLs to enumerate — listing anchors here would
 * advertise URLs that are not distinct documents.
 */
const ROUTES = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/work", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
] as const satisfies readonly {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}[];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
