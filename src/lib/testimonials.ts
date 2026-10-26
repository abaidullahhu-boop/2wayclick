/**
 * Testimonial carousel content.
 *
 * These are VERBATIM client reviews from the Upwork profile linked below.
 * Do not paraphrase or "tighten" the quotes — they are attributable public
 * statements, and editing them would misrepresent what a client actually said.
 *
 * Clients are not named because the source reviews are not attributed by name.
 * Each entry is instead identified by engagement type and region, which is what
 * the platform itself displays. Inventing names to fill the gap would turn a
 * verifiable review into a fabricated one.
 *
 * `gradient` is a distinct two-stop orange pair per slide so the portrait
 * panel changes character as the carousel advances.
 */

import { PROFILE_LINKS } from "./site";

/** Re-exported from site.ts so the URL is defined in exactly one place. */
export const UPWORK_PROFILE_URL = PROFILE_LINKS.upwork;

export type Testimonial = {
  id: string;
  quote: string;
  /** How the client is identified. Not a personal name — see the note above. */
  name: string;
  role: string;
  /** Initials rendered on the gradient portrait panel. */
  initials: string;
  /** Star rating the client left, out of 5. */
  rating: number;
  /** Pull-out phrase shown beside the quote. */
  stat: string;
  statLabel: string;
  gradient: readonly [string, string];
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "rails-web-app",
    quote:
      "It was great working together — professional, reliable, and easy to communicate with. The work was completed on time and met expectations. I'd be happy to work together again in the future. Highly recommended!",
    name: "Ruby on Rails web application",
    role: "Manchester, United Kingdom",
    initials: "RW",
    rating: 5,
    stat: "Endorsed",
    statLabel: "Reliable Professional",
    gradient: ["#ff5a1f", "#ffa552"],
  },
  {
    id: "software-support",
    quote:
      "2wayclick was fantastic to work with. He was highly responsive, extremely technical, and paid great attention to detail throughout the project. His communication was clear and consistent, making the entire process smooth and efficient. I'd happily work with him again and highly recommend him to anyone needing quality software support.",
    name: "Software support engagement",
    role: "Verified Upwork client",
    initials: "SS",
    rating: 5,
    stat: "5.0",
    statLabel: "client rating",
    gradient: ["#d9381e", "#ffa552"],
  },
  {
    id: "oltp-optimisation",
    quote:
      "2wayclick delivered high-quality OLTP and database optimisation work, quickly understood our system architecture, and implemented meaningful performance improvements to our database. Communication was clear and consistent, and he approached every task with professionalism and attention to detail. Would definitely hire again for future database or optimisation work.",
    name: "OLTP & database optimisation",
    role: "Verified Upwork client",
    initials: "DB",
    rating: 5,
    stat: "Rehired",
    statLabel: "for future optimisation work",
    gradient: ["#c2410c", "#ff5a1f"],
  },
  {
    id: "repeat-engagement",
    quote:
      "This is my second time working with 2wayclick, and he exceeded my expectations once again. His code quality and delivery were outstanding, showing a significant improvement since our last project. I truly appreciate his dedication and attention to detail. Looking forward to hiring him again in the future!",
    name: "Repeat engagement",
    role: "Verified Upwork client",
    initials: "RE",
    rating: 5,
    stat: "2nd project",
    statLabel: "with the same client",
    gradient: ["#ff5a1f", "#fcd34d"],
  },
];
