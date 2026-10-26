import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ServicesIntro } from "@/components/sections/services-intro";
import { ServiceStack } from "@/components/sections/service-stack";
import { Workflow } from "@/components/sections/workflow";
import { Pricing } from "@/components/sections/pricing";
import { Cta } from "@/components/sections/cta";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { JsonLd } from "@/components/json-ld";
import { faqGraph } from "@/lib/schema";

export const metadata: Metadata = {
  // `absolute` overrides the layout's `%s — 2wayclick` template: the homepage
  // title already ends in the brand and would otherwise be suffixed twice.
  title: {
    absolute:
      "Software Development Agency — Custom Software, SaaS & Mobile Apps | 2wayclick",
  },
  description:
    "2wayclick is a software development agency building custom software, SaaS platforms, mobile apps and backend APIs. A firm timeline and price range on the first call, and you own the source code.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      {/* FAQPage schema is scoped to this route only: the accordion it
          describes is rendered here, and structured data must describe
          content visible at the URL that carries it. */}
      <JsonLd data={faqGraph()} />

      <Hero />
      <ServicesIntro />
      <ServiceStack />
      <Workflow />
      <Pricing />
      <Cta />
      <Testimonials />
      <Faq />
    </>
  );
}
