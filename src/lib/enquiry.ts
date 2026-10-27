/**
 * Shared between the contact form (client) and the `sendEnquiry` server
 * action. The server re-validates against these same lists, so a hand-crafted
 * POST cannot put an arbitrary string into the service or budget line.
 */

export const BUDGETS = [
  "Under $10k",
  "$10k – $30k",
  "$30k – $75k",
  "$75k+",
  "Not sure yet",
] as const;

export const NOT_SURE = "Not sure yet";

export type EnquiryField = "name" | "company" | "email" | "message";

export type EnquiryState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<EnquiryField, string>>;
    };

export const INITIAL_ENQUIRY_STATE: EnquiryState = { status: "idle" };
