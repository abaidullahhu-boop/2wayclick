import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Software development case studies from 2wayclick";

export default function Image() {
  // Categories are derived from the same array the page renders, so the card
  // never advertises a kind of work that is not in the grid.
  const categories = [...new Set(PROJECTS.map((p) => p.category))];

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
          <div style={{ display: "flex", fontSize: "30px", fontWeight: 600, color: "#1c1310" }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "76px",
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-3.2px",
              color: "#1c1310",
            }}
          >
            Systems we built, and the
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "76px",
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-3.2px",
              color: "#b09383",
            }}
          >
            problems behind them.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "32px" }}>
            {categories.map((category) => (
              <div
                key={category}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: "999px",
                  border: "1px solid #edcbae",
                  background: "#ffffff",
                  fontSize: "24px",
                  color: "#4a3428",
                }}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: "26px", color: "#7d6355" }}>
            {PROJECTS.length} case studies
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
