"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/motion-primitives";
import { Check, ArrowUpRight } from "@/components/icons";
import { SERVICES } from "@/lib/services";
import { CONTACT_EMAIL } from "@/lib/site";

const BUDGETS = [
  "Under $10k",
  "$10k – $30k",
  "$30k – $75k",
  "$75k+",
  "Not sure yet",
] as const;

/**
 * Contact form.
 *
 * There is no backend in this build, so submission composes a mailto: with the
 * form contents rather than pretending to POST somewhere. Swapping this for a
 * server action means replacing `handleSubmit` — the markup and validation
 * stay as they are.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const subject = `Project enquiry — ${String(data.get("name") ?? "")}`;
    const body = [
      `Name: ${data.get("name") ?? ""}`,
      `Company: ${data.get("company") ?? ""}`,
      `Email: ${data.get("email") ?? ""}`,
      `Service: ${data.get("service") ?? ""}`,
      `Budget: ${data.get("budget") ?? ""}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-7 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Company" name="company" autoComplete="organization" />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="sm:col-span-2"
        />

        <SelectField label="What do you need?" name="service">
          {SERVICES.map((service) => (
            <option key={service.slug} value={service.category}>
              {service.category}
            </option>
          ))}
          <option value="Not sure yet">Not sure yet</option>
        </SelectField>

        <SelectField label="Budget range" name="budget">
          {BUDGETS.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </SelectField>

        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-text"
          >
            What are you building?
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="The problem, the constraints, and any deadline you are working to."
            className="mt-2 w-full rounded-2xl border border-border-strong bg-surface px-4 py-3 text-sm text-text placeholder:text-text-disabled focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary mt-7 w-full sm:w-auto">
        Send enquiry
        <ArrowUpRight className="h-4 w-4" />
      </button>

      {/* `aria-live` so the confirmation is announced, not only shown. */}
      <div aria-live="polite" className="mt-4">
        {sent && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex items-center gap-2 text-sm text-accent-deep"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            Your email client should have opened. If it did not, write to{" "}
            {CONTACT_EMAIL}.
          </motion.p>
        )}
      </div>

      <p className="mt-4 text-xs text-text-muted">
        We reply within one business day. Happy to sign an NDA before you share
        details.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-text">
        {label}
        {required && (
          <span className="text-accent-deep" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-full border border-border-strong bg-surface px-4 py-3 text-sm text-text placeholder:text-text-disabled focus:border-accent focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-text">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="mt-2 w-full rounded-full border border-border-strong bg-surface px-4 py-3 text-sm text-text focus:border-accent focus:outline-none"
      >
        {children}
      </select>
    </div>
  );
}
