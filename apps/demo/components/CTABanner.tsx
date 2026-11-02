"use client";

import { useState } from "react";
import type { NicheConfig } from "../lib/niche";
import Qualifier from "./Qualifier";
import { WhatsAppIcon } from "./Icon";

interface Props {
  config: NicheConfig;
  headline?: string;
  sub?: string;
}

export default function CTABanner({ config, headline, sub }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section
      style={{
        padding: "5rem 1.25rem",
        backgroundColor: "var(--color-primary-dark)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
        <h2
          style={{
            marginBottom: "1rem",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            fontFamily: `"Playfair Display", serif`,
            color: "#ffffff",
          }}
        >
          {headline ?? "Pronto para dar o próximo passo?"}
        </h2>
        <p
          style={{
            marginBottom: "2.5rem",
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          {sub ??
            "Entre em contato agora. Responda 3 perguntas rápidas e nossa equipe entrará em contato com você."}
        </p>
        <button
          onClick={() => setOpen(true)}
          data-testid="cta-banner-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            borderRadius: "9999px",
            padding: "0.9rem 2rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "var(--color-primary-dark)",
            backgroundColor: "#ffffff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          <WhatsAppIcon size={20} color="var(--color-primary-dark)" />
          Falar no WhatsApp
        </button>
      </div>

      {open && <Qualifier config={config} onClose={() => setOpen(false)} />}
    </section>
  );
}
