import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Sacramento, Caveat } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollBlur } from "@/components/scroll-blur";
import { SmoothScroll } from "@/components/smooth-scroll";
import { JsonLd } from "@/components/json-ld";
import { rootGraph } from "@/lib/schema";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, X_HANDLE } from "@/lib/site";

/* Geometric grotesque for body and headings — tight tracking at display size. */
const sans = Space_Grotesk({
  variable: "--font-sans-brand",
  subsets: ["latin"],
  display: "swap",
});

/* Mono is scoped to eyebrow labels and step numbers only. */
const mono = JetBrains_Mono({
  variable: "--font-mono-brand",
  subsets: ["latin"],
  display: "swap",
});

/* Connecting script for the wordmark. Single weight — Sacramento has one. */
const script = Sacramento({
  variable: "--font-script-brand",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/* Handwritten face for the one-off accent word (availability line). */
const hand = Caveat({
  variable: "--font-hand-brand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  /**
   * Required for crawlers to resolve relative OG and canonical URLs. Without
   * it Next emits relative paths that social scrapers cannot fetch.
   */
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Software Development Agency — Custom Software, SaaS & Mobile Apps | 2wayclick",
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "software development agency",
    "custom software development",
    "SaaS development company",
    "mobile app development agency",
    "API development services",
    "backend engineering",
    "web application development",
    "AI integration services",
    "legacy system modernisation",
    "dedicated development team",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: "Software Development Agency — Custom Software, SaaS & Mobile Apps",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
    title: "Software Development Agency — Custom Software, SaaS & Mobile Apps",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  formatDetection: { telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${script.variable} ${hand.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-canvas antialiased">
        <JsonLd data={rootGraph()} />

        {/* Film grain over the whole page. `pointer-events: none` so it never
            intercepts a click; opacity is low enough to read as paper tooth
            rather than noise. */}
        <div
          aria-hidden="true"
          className="noise pointer-events-none fixed inset-0 z-60 opacity-[0.025] mix-blend-multiply"
        />

        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollBlur />
      </body>
    </html>
  );
}
