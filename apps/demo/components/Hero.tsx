"use client";

import { useState } from "react";
import type { NicheConfig } from "../lib/niche";
import Qualifier from "./Qualifier";

interface Props {
  config: NicheConfig;
}

export default function Hero({ config }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="inicio"
      style={{
        minHeight: "92dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "5rem 1.25rem",
        backgroundColor: "var(--color-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blob */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "22rem",
          height: "22rem",
          borderRadius: "9999px",
          backgroundColor: "var(--color-primary)",
          opacity: 0.12,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <p
        style={{
          marginBottom: "1rem",
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-primary)",
        }}
      >
        {config.brandName}
      </p>

      <h1
        style={{
          maxWidth: "38rem",
          marginBottom: "1.25rem",
          fontSize: "clamp(2rem, 6vw, 3rem)",
          fontWeight: 700,
          lineHeight: 1.2,
          fontFamily: `"${config.fontDisplay}", serif`,
          color: "var(--color-text)",
        }}
      >
        {config.heroHeadline}
      </h1>

      <p
        style={{
          maxWidth: "30rem",
          marginBottom: "2.5rem",
          fontSize: "1rem",
          lineHeight: 1.65,
          color: "var(--color-muted)",
        }}
      >
        {config.heroSubheadline}
      </p>

      <button
        onClick={() => setOpen(true)}
        data-testid="hero-cta-btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          borderRadius: "9999px",
          padding: "1rem 2rem",
          fontSize: "1rem",
          fontWeight: 600,
          color: "#fff",
          backgroundColor: "var(--color-primary)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
          transition: "transform 0.15s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
        }
      >
        <WaIcon />
        Falar no WhatsApp
      </button>

      <p
        style={{
          marginTop: "0.75rem",
          fontSize: "0.75rem",
          color: "var(--color-muted)",
        }}
      >
        Responda 3 perguntas rápidas — leva menos de 30 segundos
      </p>

      {open && <Qualifier config={config} onClose={() => setOpen(false)} />}
    </section>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="white" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.526 5.854L.053 23.447a.75.75 0 0 0 .921.912l5.733-1.497A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.934 0-3.74-.526-5.284-1.44l-.378-.224-3.405.889.913-3.317-.248-.385A9.797 9.797 0 0 1 2.182 12c0-5.413 4.405-9.818 9.818-9.818 5.413 0 9.818 4.405 9.818 9.818 0 5.413-4.405 9.818-9.818 9.818z" />
    </svg>
  );
}
