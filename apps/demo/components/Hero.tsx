"use client";

import { useState } from "react";
import Image from "next/image";
import type { NicheConfig } from "../lib/niche";
import Qualifier from "./Qualifier";
import { WhatsAppIcon } from "./Icon";

interface Props {
  config: NicheConfig;
}

export default function Hero({ config }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        id="inicio"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "calc(100dvh - 64px)",
          backgroundColor: "var(--color-bg)",
        }}
        className="hero-grid"
      >
        {/* Left: editorial text panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "5rem 4rem 5rem 5rem",
          }}
          className="hero-text"
        >
          {/* Eyebrow */}
          <p
            style={{
              marginBottom: "1.5rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            {config.tagline}
          </p>

          {/* Headline */}
          <h1
            style={{
              marginBottom: "1.5rem",
              fontSize: "clamp(2.75rem, 5vw, 4.5rem)",
              fontWeight: 600,
              lineHeight: 1.1,
              fontFamily: `"${config.fontDisplay}", serif`,
              color: "var(--color-text)",
              letterSpacing: "-0.01em",
            }}
          >
            {config.heroHeadline}
          </h1>

          {/* Thin gold line */}
          <div style={{ width: "2.5rem", height: "1px", backgroundColor: "var(--color-accent)", marginBottom: "1.5rem" }} />

          {/* Subheadline */}
          <p
            style={{
              marginBottom: "2.5rem",
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "var(--color-muted)",
              maxWidth: "28rem",
            }}
          >
            {config.heroSubheadline}
          </p>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
            <button
              onClick={() => setOpen(true)}
              data-testid="hero-cta-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "1rem 2.25rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#fff",
                backgroundColor: "var(--color-text)",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <WhatsAppIcon size={18} color="#fff" />
              Agendar avaliação
            </button>
            <p style={{ fontSize: "0.72rem", color: "var(--color-muted)", letterSpacing: "0.05em" }}>
              Avaliação gratuita · Sem compromisso
            </p>
          </div>

          {/* Trust strip */}
          <div
            style={{
              marginTop: "3rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--color-primary-light)",
              display: "flex",
              gap: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "1.500+", label: "Pacientes" },
              { value: "8 anos", label: "Experiência" },
              { value: "100%", label: "Produtos ANVISA" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    fontFamily: `"${config.fontDisplay}", serif`,
                    color: "var(--color-text)",
                    lineHeight: 1,
                    marginBottom: "0.25rem",
                  }}
                >
                  {s.value}
                </p>
                <p style={{ fontSize: "0.7rem", color: "var(--color-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: photo panel */}
        <div style={{ position: "relative", overflow: "hidden" }} className="hero-photo">
          <Image
            src={config.heroImageUrl}
            alt={config.heroImageAlt}
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center top" }}
            sizes="50vw"
          />
          {/* Very subtle warm gradient on left edge to blend with text panel */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to right, ${config.bgColor}30 0%, transparent 15%)`,
            }}
          />
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-text { padding: 3rem 1.5rem !important; }
          .hero-photo { min-height: 55vw; }
        }
      `}</style>

      {open && <Qualifier config={config} onClose={() => setOpen(false)} />}
    </>
  );
}
