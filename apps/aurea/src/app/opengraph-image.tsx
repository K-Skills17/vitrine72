import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.descriptor}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Typographic share image in the brand palette (ivory on espresso). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#292720",
          color: "#F4EFE8",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: "#D5C2A5" }}>CLÍNICA DE ESTÉTICA AVANÇADA</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 132, letterSpacing: 28 }}>{siteConfig.name}</div>
          <div style={{ display: "flex", fontSize: 34, color: "rgba(244,239,232,0.8)" }}>Avaliação individual, planejamento por etapas.</div>
        </div>
        <div style={{ display: "flex", height: 1, background: "rgba(244,239,232,0.25)" }} />
      </div>
    ),
    size,
  );
}
