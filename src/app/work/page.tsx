import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { WorkGrid } from "@/components/sections/work-grid";
import { Cta } from "@/components/sections/cta";
import { JsonLd } from "@/components/json-ld";
import { workGraph, breadcrumbGraph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Software Development Case Studies",
  description:
    "Case studies from 2wayclick: dispatch systems, multi-tenant SaaS platforms, offline-first mobile apps, payment APIs and legacy migrations — with the technical problem behind each build.",
  alternates: { canonical: "/work" },
  openGraph: {
    url: "/work",
    title: "Software Development Case Studies — 2wayclick",
    description:
      "Dispatch systems, SaaS platforms, offline-first mobile apps, payment APIs and legacy migrations.",
  },
};

export default function WorkPage() {
  return (
    <>
      {/* Both graphs are generated from the same PROJECTS array the grid
          renders, so schema cannot describe a project that is not on the page. */}
      <JsonLd data={workGraph()} />
      <JsonLd data={breadcrumbGraph([{ name: "Work", path: "/work" }])} />

      <PageHeader
        eyebrow="Selected work"
        title="Systems we built,"
        dim="and the problems behind them."
        intro="Every case study below names the technical problem first. The visual outcome is the easy part; the engineering decision underneath it is what determined whether the build held up."
      />

      <section className="container-x pb-20 sm:pb-28">
        <WorkGrid />
      </section>

      <Cta />
    </>
  );
}
