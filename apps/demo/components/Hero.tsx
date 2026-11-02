"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NicheConfig } from "../lib/niche";
import Qualifier from "./Qualifier";
import { WhatsAppIcon, ArrowRightIcon } from "./Icon";

interface Props {
  config: NicheConfig;
}

export default function Hero({ config }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section id="inicio" style={{ position: "relative", overflow: "hidden", minHeight: "88dvh", display: "flex", alignItems: "center" }}>
      {/* Background image */}
      <Image
        src={config.heroImageUrl}
        alt={config.heroImageAlt}
        fill
        priority
        style={{ objectFit: "cover", objectPosition: "center" }}
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(105deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "4rem 1.5rem",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "36rem" }}>
          <p
            style={{
              marginBottom: "0.75rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-primary-light)",
              opacity: 0.9,
            }}
          >
            {config.brandName}
          </p>

          <h1
            style={{
              marginBottom: "1.25rem",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              fontFamily: `"${config.fontDisplay}", serif`,
              color: "#ffffff",
            }}
          >
            {config.heroHeadline}
          </h1>

          <p
            style={{
              marginBottom: "2.5rem",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {config.heroSubheadline}
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <button
              onClick={() => setOpen(true)}
              data-testid="hero-cta-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "9999px",
                padding: "0.9rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "var(--color-primary)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                transition: "transform 0.15s, opacity 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <WhatsAppIcon size={20} color="#fff" />
              Falar no WhatsApp
            </button>

            <Link
              href="/servicos/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                borderRadius: "9999px",
                padding: "0.9rem 1.75rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.6)",
                textDecoration: "none",
                transition: "background 0.15s",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent")
              }
            >
              Ver serviços
              <ArrowRightIcon size={18} color="#fff" />
            </Link>
          </div>

          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            3 perguntas rápidas — menos de 30 segundos
          </p>
        </div>
      </div>

      {open && <Qualifier config={config} onClose={() => setOpen(false)} />}
    </section>
  );
}
