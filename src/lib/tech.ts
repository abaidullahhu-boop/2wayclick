/**
 * Marquee logo strip. Geometry comes from the `simple-icons` package rather
 * than hotlinked images — no external requests, no broken logos when a CDN
 * moves, and the paths are colourable at render time.
 *
 * The list deliberately spans frontend, backend, mobile, data and infra so the
 * strip reads as a full engineering stack rather than a front-end one.
 *
 * Note: AWS was removed from simple-icons over trademark policy, so cloud is
 * represented by Docker and Kubernetes.
 */
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siNodedotjs,
  siPython,
  siGo,
  siFlutter,
  siSwift,
  siKotlin,
  siPostgresql,
  siDocker,
  siKubernetes,
  siExpo,
  siFigma,
  type SimpleIcon,
} from "simple-icons";

export type TechIcon = {
  title: string;
  /** Brand colour, without the leading `#`. */
  hex: string;
  /** Raw SVG path data, viewBox 0 0 24 24. */
  path: string;
};

function toTech(icon: SimpleIcon): TechIcon {
  return { title: icon.title, hex: icon.hex, path: icon.path };
}

export const TECH_ICONS: readonly TechIcon[] = [
  siReact,
  siNextdotjs,
  siTypescript,
  siNodedotjs,
  siPython,
  siGo,
  siPostgresql,
  siExpo,
  siFlutter,
  siSwift,
  siKotlin,
  siDocker,
  siKubernetes,
  siFigma,
].map(toTech);
