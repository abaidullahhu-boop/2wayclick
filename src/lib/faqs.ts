/**
 * FAQ content. The homepage accordion and the `FAQPage` JSON-LD graph both
 * read from this array, so the schema always describes text that is genuinely
 * visible at that URL — the requirement Google enforces for FAQ rich results.
 */

export type Faq = {
  question: string;
  answer: string;
};

export const FAQS: readonly Faq[] = [
  {
    question: "Who owns the code and the IP?",
    answer:
      "You do, in full, from the first commit. We work in a repository you own where possible, or transfer ownership at handover where it is ours. That covers application code, infrastructure definitions, CI pipelines and design files. There is no licence-back arrangement and no component you keep paying us to use.",
  },
  {
    question: "Can you take over an existing or legacy codebase?",
    answer:
      "Yes, and a good share of our work is exactly that. We start with a paid technical assessment: reading the code, the schema and the deployment setup, then reporting what is sound, what is risky and what it will cost to extend. You get that assessment as a document whether or not you continue with us.",
  },
  {
    question: "How do maintenance and support work after launch?",
    answer:
      "Every build includes 30 days of post-launch support for defects at no charge. After that you can move to a monthly retainer covering dependency updates, monitoring, security patches and a defined response time, or take the system in-house — the documentation and runbooks are written so that is a real option rather than a nominal one.",
  },
  {
    question: "What happens if the scope changes mid-build?",
    answer:
      "Scope changes are expected on anything longer than a few weeks. Small changes we absorb. Anything that moves the timeline gets a written estimate before work starts, and you decide whether to add it, swap it for something already planned, or defer it. You will not find out about a change in cost after the fact.",
  },
  {
    question: "Do you sign NDAs?",
    answer:
      "Yes, before any detailed discussion of your product. We will sign yours as written in most cases. If a clause is genuinely unworkable — perpetual non-competes that would bar us from an entire sector, for example — we say so on the call rather than after legal review.",
  },
  {
    question: "How do you handle security and data protection?",
    answer:
      "Secrets stay out of the repository and in a managed secret store. Access is least-privilege and logged. Dependencies are scanned in CI. For products handling personal or regulated data we design the isolation and audit model up front and document it against the standard you are held to, whether that is GDPR, HIPAA or a customer's own security review.",
  },
  {
    question: "Do you work alongside our in-house engineers?",
    answer:
      "Often. We can operate as an embedded squad inside your process — your board, your review standards, your on-call rotation — or run a workstream independently and integrate at defined points. What we ask for is a named technical counterpart on your side who can make architectural decisions.",
  },
  {
    question: "What is your stack, and how do you choose it?",
    answer:
      "Most commonly TypeScript, Next.js and Node.js on Postgres, with Python or Go where the workload suits them, and React Native or native Swift and Kotlin for mobile. We choose from your constraints, not our preferences: the team who will maintain it, the hiring market you recruit from, and what you already run. If your team is a Django team, we will not hand you a Node service to look after.",
  },
];
