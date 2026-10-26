/**
 * The six phases of a software engagement, rendered by the scroll-pinned
 * workflow section. Scroll position is the sole driver of the active step.
 */

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  /** Short chip, e.g. "Week 1" or "Ongoing". */
  timeline: string;
  /** What the client physically receives at the end of this phase. */
  deliverable: string;
  /** Two or three concrete activities — rendered as a checklist. */
  outputs: readonly string[];
};

export const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  {
    id: "discovery",
    title: "Discovery & Scope",
    description:
      "We map the workflow, the data and the integrations before estimating anything. You leave the call with a firm timeline and a price range, not a promise to send one next week.",
    timeline: "Week 1",
    deliverable: "Scope document and price range",
    outputs: [
      "Workflow mapped, including the parts living in spreadsheets",
      "Integration and data constraints identified",
      "Firm timeline and price range, on the call",
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    description:
      "Data model, service boundaries, hosting and the decisions that get expensive to reverse — settled and written down while they are still cheap to change.",
    timeline: "Week 2",
    deliverable: "Architecture decision record",
    outputs: [
      "Data model and service boundaries agreed",
      "Hosting, scaling and cost envelope defined",
      "Decisions written down, with the reasoning",
    ],
  },
  {
    id: "design",
    title: "Design",
    description:
      "Interface design against the real data model, so screens reflect states the system can actually produce: empty, partial, failed and loading, not just the happy path.",
    timeline: "Weeks 2–4",
    deliverable: "Design system and screens",
    outputs: [
      "Every screen drawn against real data shapes",
      "Empty, partial, failed and loading states covered",
      "Token-based system your team can extend",
    ],
  },
  {
    id: "development",
    title: "Development",
    description:
      "You get reviewable increments on a staging environment throughout, not one reveal at the end. Every increment is something you can click through and send back.",
    timeline: "Weeks 4–12",
    deliverable: "Working software, every sprint",
    outputs: [
      "Reviewable increments on staging from sprint one",
      "Weekly demo and a written progress summary",
      "Feedback folded in before the next increment",
    ],
  },
  {
    id: "qa-launch",
    title: "QA & Launch",
    description:
      "Automated test coverage on the paths that matter, load testing against realistic volumes, and a rollback plan agreed before anything reaches production.",
    timeline: "Weeks 12–14",
    deliverable: "Production release",
    outputs: [
      "Automated coverage on the critical paths",
      "Load tested against realistic volumes",
      "Rollback plan agreed before go-live",
    ],
  },
  {
    id: "support",
    title: "Support & Iteration",
    description:
      "Thirty days of defect support included. After that, a retainer or a clean handover — documentation and runbooks are written so taking it in-house is a real option.",
    timeline: "Ongoing",
    deliverable: "Handover pack and runbooks",
    outputs: [
      "30 days of defect support included",
      "Repository, infrastructure and docs transferred",
      "Retainer or clean exit — your call",
    ],
  },
];
