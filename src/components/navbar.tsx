"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS, SITE_NAME } from "@/lib/site";
import { EASE } from "./motion-primitives";
import { ArrowUpRight } from "./icons";
import { Logo } from "./logo";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  /**
   * The menu's open state is stored as the pathname it was opened on, not a
   * boolean. A bare boolean survives client-side navigation, so a link tap
   * could leave the overlay mounted — or worse, unmounted while its scroll
   * lock stayed applied. Keying on the route makes any navigation
   * self-invalidating: the stored path stops matching, and the menu is closed
   * by definition.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const isOpen = openedOn !== null && openedOn === pathname;

  const close = useCallback(() => setOpenedOn(null), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Scroll lock while the overlay is open.
  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPadding: body.style.paddingRight,
      gapVar: body.style.getPropertyValue("--scrollbar-gap"),
    };

    // Classic (non-overlay) scrollbars render their track on the
    // documentElement, so hiding overflow on <body> alone leaves the bar
    // visible beside a locked page. Both elements have to be locked.
    const gap = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    if (gap > 0) {
      // Padding <body> stops the page content shifting, but a viewport-fixed
      // element is positioned against the viewport and ignores body padding
      // entirely. Exposing the width as a custom property lets the fixed
      // header compensate for itself.
      body.style.paddingRight = `${gap}px`;
      body.style.setProperty("--scrollbar-gap", `${gap}px`);
    }

    return () => {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.paddingRight = previous.bodyPadding;
      if (previous.gapVar) {
        body.style.setProperty("--scrollbar-gap", previous.gapVar);
      } else {
        body.style.removeProperty("--scrollbar-gap");
      }
    };
  }, [isOpen]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4"
        // Consume the gap the scroll lock created. Without this the fixed
        // header stays full-viewport-width and visibly jumps when the
        // scrollbar disappears.
        style={{ paddingRight: "var(--scrollbar-gap, 0px)" }}
      >
        <div className="container-x">
          <div
            className={[
              "flex items-center justify-between rounded-full transition-all duration-500",
              scrolled
                ? "glass px-4 py-2.5 sm:px-5"
                : "border border-transparent px-1 py-2",
            ].join(" ")}
            style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          >
            <Link href="/" onClick={close} aria-label={`${SITE_NAME} home`}>
              <Logo />
            </Link>

            {/* Desktop links — hidden once scrolled, replaced by the hamburger */}
            <nav
              aria-label="Primary"
              className={[
                "items-center gap-7 transition-opacity duration-300",
                scrolled ? "hidden" : "hidden lg:flex",
              ].join(" ")}
            >
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "text-sm font-medium transition-colors hover:text-accent-deep",
                      active
                        ? "text-accent-deep underline underline-offset-4"
                        : "text-text-2",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5">
              <Link
                href="/contact"
                className="btn-primary hidden px-5! py-2.5! text-[0.82rem]! sm:inline-flex"
              >
                Book a call
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => (isOpen ? close() : setOpenedOn(pathname))}
                aria-expanded={isOpen}
                aria-controls="menu-overlay"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface transition-colors hover:border-accent",
                  scrolled ? "" : "lg:hidden",
                ].join(" ")}
              >
                <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
                <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
                  <motion.span
                    className="block h-[1.6px] w-full rounded bg-text"
                    animate={isOpen ? { rotate: 45, y: 3.3 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                  <motion.span
                    className="block h-[1.6px] w-full rounded bg-text"
                    animate={isOpen ? { rotate: -45, y: -3.3 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            // z-45 sits ABOVE the page but BELOW the z-50 header, so the pill
            // and its close button stay clickable while the overlay covers
            // everything else. Padding clears the header band so the first
            // link cannot slide underneath the pill.
            className="fixed inset-0 z-45 flex flex-col justify-center overflow-y-auto bg-canvas/97 pt-28 pb-12 backdrop-blur-xl"
          >
            <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-60" />
            <nav aria-label="Menu" className="container-x relative my-auto">
              <ul className="flex flex-col gap-1.5">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.07 + index * 0.07,
                      ease: EASE,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className="group flex items-baseline py-1.5"
                    >
                      {/* Sized so all five links clear the header band and
                          still fit a short viewport without scrolling. */}
                      <span className="text-[11vw] font-bold leading-[1.05] tracking-[-0.045em] text-text transition-colors group-hover:text-accent-deep sm:text-[7.5vw] lg:text-[5vw]">
                        {link.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
