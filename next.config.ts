import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // No `remotePatterns`: every image on the site is a local asset in
    // /public. Nothing is hotlinked, so there is no remote host to allow —
    // and no third-party CDN that can break the page by moving a URL.
    //
    // Next 16 narrowed the default `qualities` allow-list to `[75]`, and any
    // `quality` prop outside the array is silently coerced to the nearest
    // member. We render large full-bleed art, so 85 is declared explicitly.
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
