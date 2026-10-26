"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Label, TwoTone } from "@/components/label";
import { BlurIn, EASE, Reveal } from "@/components/motion-primitives";
import { Plus } from "@/components/icons";
import { FAQS } from "@/lib/faqs";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="relative py-20 sm:py-28" id="faq">
      <div className="container-x">
        <Reveal>
          <Label>Questions</Label>
        </Reveal>
        <BlurIn
          as="h2"
          className="mt-5 max-w-[17ch] text-[9vw] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[6vw] lg:text-[4.1vw]"
        >
          <TwoTone lead="The things" dim="technical buyers ask first." />
        </BlurIn>

        <div className="mt-12 grid gap-3 lg:mx-auto lg:max-w-4xl">
          {FAQS.map((faq, index) => {
            const isOpen = open === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <Reveal key={faq.question} delay={index * 0.04}>
                <div
                  className={[
                    "card overflow-hidden rounded-2xl! transition-all duration-500",
                    isOpen
                      ? "border-accent/60 shadow-(--shadow-md)"
                      : "hover:border-border-strong",
                  ].join(" ")}
                >
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                    >
                      <span className="text-[0.98rem] font-semibold text-text sm:text-lg">
                        {faq.question}
                      </span>

                      <motion.span
                        aria-hidden="true"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-400",
                          isOpen
                            ? "border-accent-red bg-accent-red text-white"
                            : "border-border-strong bg-surface text-text-2",
                        ].join(" ")}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-[0.92rem] leading-relaxed text-text-2">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
