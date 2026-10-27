"use server";

import { headers } from "next/headers";
import { SERVICES } from "@/lib/services";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import {
  BUDGETS,
  NOT_SURE,
  type EnquiryField,
  type EnquiryState,
} from "@/lib/enquiry";

const LIMITS = { name: 120, company: 120, email: 254, message: 5000 } as const;
const MIN_MESSAGE = 10;

// Deliberately loose: the mail server is the real validator. This only stops
// obvious typos and header-injection attempts (no whitespace or newlines).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICE_OPTIONS = new Set<string>([
  ...SERVICES.map((service) => service.category),
  NOT_SURE,
]);
const BUDGET_OPTIONS = new Set<string>(BUDGETS);

/**
 * Per-IP throttle. In-memory, so it is per server instance — enough to blunt a
 * script hammering one deployment, not a substitute for edge rate limiting.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recentByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    recentByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentByIp.set(ip, recent);
  return false;
}

type Email = {
  from: string;
  to: string;
  reply_to: string;
  subject: string;
  text: string;
};

/**
 * Delivers through Resend's REST API — one HTTPS call, so no SDK dependency.
 *
 * Without `RESEND_API_KEY` in development the message is logged instead, so
 * the form can be exercised end to end locally. In production a missing key
 * is an error — silently dropping enquiries is the one failure mode a contact
 * form must never have.
 */
async function deliver(email: Email): Promise<"sent" | "logged" | "unconfigured"> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") return "unconfigured";
    console.info("[contact] RESEND_API_KEY not set — enquiry logged:", email);
    return "logged";
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
    // A hung request would leave the visitor on "Sending…" indefinitely.
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
  return "sent";
}

function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function sendEnquiry(
  _prev: EnquiryState,
  data: FormData,
): Promise<EnquiryState> {
  // Honeypot. Real visitors never see this input; bots fill every field.
  // Report success so the bot has no signal to adapt to.
  if (field(data, "website")) return { status: "success" };

  const name = field(data, "name");
  const company = field(data, "company");
  const email = field(data, "email");
  const message = field(data, "message");
  const service = SERVICE_OPTIONS.has(field(data, "service"))
    ? field(data, "service")
    : NOT_SURE;
  const budget = BUDGET_OPTIONS.has(field(data, "budget"))
    ? field(data, "budget")
    : NOT_SURE;

  const fieldErrors: Partial<Record<EnquiryField, string>> = {};
  if (!name) fieldErrors.name = "Tell us who we are talking to.";
  else if (name.length > LIMITS.name) fieldErrors.name = "That name is too long.";
  if (company.length > LIMITS.company)
    fieldErrors.company = "That company name is too long.";
  if (!email) fieldErrors.email = "We need an address to reply to.";
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email))
    fieldErrors.email = "That email address does not look right.";
  if (message.length < MIN_MESSAGE)
    fieldErrors.message = "A sentence or two about the project, please.";
  else if (message.length > LIMITS.message)
    fieldErrors.message = `Please keep it under ${LIMITS.message} characters.`;

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "A few fields need another look.",
      fieldErrors,
    };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: `Too many enquiries in a short time. Try again in a few minutes, or write to ${CONTACT_EMAIL}.`,
    };
  }

  const text = [
    `Name: ${name}`,
    `Company: ${company || "—"}`,
    `Email: ${email}`,
    `Service: ${service}`,
    `Budget: ${budget}`,
    "",
    message,
  ].join("\n");

  try {
    const result = await deliver({
      // Must be an address on a domain verified in Resend.
      from: process.env.CONTACT_FROM ?? `${SITE_NAME} website <${CONTACT_EMAIL}>`,
      to: process.env.CONTACT_TO ?? CONTACT_EMAIL,
      // Hitting reply in the inbox goes straight to the person enquiring.
      // Bare address: the name is free text, and quoting it into a mailbox
      // header is where injection bugs live.
      reply_to: email,
      subject: `Project enquiry — ${name}${company ? ` (${company})` : ""}`,
      text,
    });
    if (result === "unconfigured") {
      console.error("[contact] RESEND_API_KEY is not set; enquiry not sent.");
      return {
        status: "error",
        message: `We could not send that just now. Please write to ${CONTACT_EMAIL} directly.`,
      };
    }
  } catch (error) {
    console.error("[contact] Failed to send enquiry:", error);
    return {
      status: "error",
      message: `We could not send that just now. Please try again, or write to ${CONTACT_EMAIL}.`,
    };
  }

  return { status: "success" };
}
