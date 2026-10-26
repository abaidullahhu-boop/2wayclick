import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "2wayclick — software development agency building custom software, SaaS platforms and mobile apps";

/**
 * ImageResponse supports flexbox and a subset of CSS only — no grid, no
 * external stylesheets, and CSS custom properties do not resolve here, so the
 * brand colours are written as literals.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #fffcf8 0%, #fff7ed 55%, #ffedd5 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "#1a1008",
              color: "#f97316",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            2w
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              fontWeight: 600,
              color: "#1c1310",
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "78px",
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-3.4px",
              color: "#1c1310",
              maxWidth: "960px",
            }}
          >
            We build the software your business runs on.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "26px",
              fontSize: "30px",
              color: "#4a3428",
              maxWidth: "1000px",
            }}
          >
            Custom software · SaaS · Mobile apps · APIs
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: "26px", color: "#7d6355" }}>
            Design and engineering under one roof
          </div>
          <div
            style={{
              display: "flex",
              height: "12px",
              width: "220px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #ea580c, #fdba74)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
