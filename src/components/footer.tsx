import Link from "next/link";
import {
  CONTACT_EMAIL,
  SITE_NAME,
  SOCIAL_LINKS,
  currentAvailability,
} from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { XIcon, LinkedInIcon, GitHubIcon, DribbbleIcon, ArrowUpRight } from "./icons";

const SOCIALS = [
  { href: SOCIAL_LINKS.x, label: "X", Icon: XIcon },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: SOCIAL_LINKS.github, label: "GitHub", Icon: GitHubIcon },
  { href: SOCIAL_LINKS.dribbble, label: "Dribbble", Icon: DribbbleIcon },
] as const;

const COMPANY_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-canvas-alt pt-16 sm:pt-20">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <p className="text-sm leading-relaxed text-text-2">
              A software development agency. Design and engineering under one
              roof — custom platforms, mobile apps and the backends behind them.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group mt-5 inline-flex items-center gap-2 text-base font-semibold text-text transition-colors hover:text-accent-deep"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <p className="mt-4 text-sm text-text-muted">
              Taking on new projects for{" "}
              <span className="font-hand text-lg text-accent-deep">
                {currentAvailability()}
              </span>
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-muted">
              Services
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="text-sm text-text-2 transition-colors hover:text-accent-deep"
                  >
                    {service.category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-muted">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-2 transition-colors hover:text-accent-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-muted">
              Elsewhere
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-surface text-text-2 transition-all duration-500 hover:-translate-y-0.5 hover:border-accent hover:text-accent-deep"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="h-[1.05rem] w-[1.05rem]" />
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-primary mt-6 px-6! py-3! text-[0.85rem]!">
              Start a project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Oversized wordmark. Decorative repetition of the site name — the
            <footer> already carries the brand in the copyright line. */}
        {/* Oversized script wordmark. The script face has long ascenders and
            descenders, so `leading-[0.8]` clipped them against the row above
            and below — the padding plus a taller line-height gives the strokes
            room instead of cropping them.
            Sized in `cqw`, not `vw`: the container caps at 1240px, so a vw size
            kept growing on wide screens and clipped the final "k". Sacramento's
            ink runs ~3.37× the font size for this word, so 26cqw fills ~88%
            of the row at every width. */}
        <div aria-hidden="true" className="@container mt-14 overflow-hidden py-4">
          <span className="block select-none bg-linear-to-b from-accent-light/70 to-accent-tint/40 bg-clip-text text-center text-[26cqw] leading-[1.15] text-transparent font-script">
            {SITE_NAME}
          </span>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-xs text-text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p>Design and engineering under one roof.</p>
        </div>
      </div>
    </footer>
  );
}
