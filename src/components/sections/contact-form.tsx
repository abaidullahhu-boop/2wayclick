"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  type FormEvent,
} from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/motion-primitives";
import { Check, ArrowUpRight } from "@/components/icons";
import { sendEnquiry } from "@/app/contact/actions";
import { SERVICES } from "@/lib/services";
import {
  BUDGETS,
  INITIAL_ENQUIRY_STATE,
  NOT_SURE,
  type EnquiryField,
} from "@/lib/enquiry";

/**
 * Contact form.
 *
 * Submits to the `sendEnquiry` server action, which validates and emails the
 * brief. The submit is routed through `onSubmit` rather than `<form action>`
 * because React resets uncontrolled fields after every form action — on a
 * validation error that would wipe the brief the visitor just typed. Here the
 * fields are reset only once the enquiry has actually gone through.
 */
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    sendEnquiry,
    INITIAL_ENQUIRY_STATE,
  );

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  };

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-busy={pending}
      className="card p-7 sm:p-9"
    >
      {/* Honeypot. Off-screen rather than `display:none`, which some bots
          detect and skip. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="name"
          required
          autoComplete="name"
          maxLength={120}
          error={errors.name}
        />
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
          maxLength={120}
          error={errors.company}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          error={errors.email}
          className="sm:col-span-2"
        />

        <SelectField label="What do you need?" name="service">
          {SERVICES.map((service) => (
            <option key={service.slug} value={service.category}>
              {service.category}
            </option>
          ))}
          <option value={NOT_SURE}>{NOT_SURE}</option>
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
            <span className="text-accent-deep" aria-hidden="true">
              {" "}
              *
            </span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={5000}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            placeholder="The problem, the constraints, and any deadline you are working to."
            className={`mt-2 w-full rounded-2xl border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-disabled focus:border-accent focus:outline-none ${
              errors.message ? "border-accent-deep" : "border-border-strong"
            }`}
          />
          <FieldError id="message-error" error={errors.message} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-7 w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {pending ? "Sending…" : "Send enquiry"}
        <ArrowUpRight
          className={`h-4 w-4 ${pending ? "animate-pulse" : ""}`}
        />
      </button>

      {/* `aria-live` so the outcome is announced, not only shown. */}
      <div aria-live="polite" className="mt-4">
        {state.status === "success" && (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex items-start gap-2 text-sm text-accent-deep"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Thanks — your brief is with us. We will reply within one business
            day.
          </motion.p>
        )}
        {state.status === "error" && (
          <motion.p
            key={state.message}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            role="alert"
            className="text-sm text-accent-deep"
          >
            {state.message}
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
  maxLength,
  error,
  className = "",
}: {
  label: string;
  name: EnquiryField;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  error?: string;
  className?: string;
}) {
  const errorId = `${name}-error`;
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
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 w-full rounded-full border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-disabled focus:border-accent focus:outline-none ${
          error ? "border-accent-deep" : "border-border-strong"
        }`}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 pl-4 text-xs text-accent-deep">
      {error}
    </p>
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
