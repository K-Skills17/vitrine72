"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NicheConfig } from "../lib/niche";
import Qualifier from "./Qualifier";
import { ArrowRightIcon } from "./Icon";

interface Props {
  config: NicheConfig;
  showAll?: boolean;
}

export default function Services({ config, showAll = false }: Props) {
  const layout = config.servicesLayout ?? "minimal-list";
  if (layout === "photo-grid") return <ServicesPhotoGrid config={config} showAll={showAll} />;
  return <ServicesMinimalList config={config} showAll={showAll} />;
}

// ─── Photo grid variant (planejados / architectural) ──────────────────────────

function ServicesPhotoGrid({ config, showAll }: Props) {
  const [open, setOpen] = useState(false);
  const [preselect, setPreselect] = useState<string | undefined>();
  const displayed = showAll ? config.services : config.services.slice(0, 4);

  function openQualifier(service?: string) { setPreselect(service); setOpen(true); }

  return (
    <section
      id="servicos"
      style={{ padding: "5rem 1.25rem", backgroundColor: config.bgColor }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: config.accentColor, marginBottom: "0.75rem" }}>
              Ambientes
            </p>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 700,
                fontFamily: `"${config.fontDisplay}", sans-serif`,
                color: config.textColor,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {showAll ? "Todos os ambientes" : "O que fazemos"}
            </h2>
          </div>
          <p style={{ fontSize: "0.875rem", color: config.mutedColor, maxWidth: "22rem", lineHeight: 1.65 }}>
            Cada projeto dimensionado ao milímetro do seu imóvel.
          </p>
        </div>

        {/* 2-column masonry-style grid */}
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
          className="services-grid"
        >
          {displayed.map((service, i) => (
            <article
              key={service.id}
              onClick={() => openQualifier(service.qualifierPreselect)}
              style={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                aspectRatio: i === 0 ? "16/9" : "4/3",
                gridColumn: i === 0 ? "span 2" : "span 1",
              }}
              className={`service-card ${i === 0 ? "service-card-wide" : ""}`}
            >
              <Image
                src={service.imageUrl}
                alt={service.imageAlt}
                fill
                sizes={i === 0 ? "100vw" : "50vw"}
                style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.5s ease" }}
                className="service-img"
              />
              {/* Dark gradient overlay */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.4) 50%, rgba(10,9,8,0.0) 100%)",
                  transition: "opacity 0.3s ease",
                }}
              />
              {/* Text overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "1.75rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "1rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: i === 0 ? "1.5rem" : "1.1rem",
                      fontWeight: 700,
                      fontFamily: `"${config.fontDisplay}", sans-serif`,
                      color: "#f0ece4",
                      marginBottom: "0.4rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {service.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "rgba(240,236,228,0.65)", lineHeight: 1.5, maxWidth: "32rem" }}>
                    {service.description}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); openQualifier(service.qualifierPreselect); }}
                  data-testid={`service-cta-${service.id}`}
                  style={{
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.6rem 1.1rem",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: config.bgColor,
                    backgroundColor: config.accentColor,
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "opacity 0.15s",
                  }}
                >
                  Tenho interesse
                </button>
              </div>
            </article>
          ))}
        </div>

        {!showAll && (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link
              href="/servicos/"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: config.accentColor, textDecoration: "none" }}
            >
              Ver todos os ambientes
              <ArrowRightIcon size={16} color={config.accentColor} />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr !important; }
          .service-card { grid-column: span 1 !important; aspect-ratio: 4/3 !important; }
        }
        .service-card:hover .service-img { transform: scale(1.04); }
      `}</style>

      {open && <Qualifier config={config} preselect={preselect} onClose={() => setOpen(false)} />}
    </section>
  );
}

// ─── Minimal list variant (estetica / editorial) ──────────────────────────────

function ServicesMinimalList({ config, showAll }: Props) {
  const [open, setOpen] = useState(false);
  const [preselect, setPreselect] = useState<string | undefined>();

  const displayed = showAll ? config.services : config.services.slice(0, 3);

  function openQualifier(service?: string) {
    setPreselect(service);
    setOpen(true);
  }

  return (
    <section
      id="servicos"
      style={{ padding: "5rem 1.25rem", backgroundColor: "var(--color-surface)" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <h2
          style={{
            marginBottom: "0.75rem",
            textAlign: "center",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            fontFamily: `"${config.fontDisplay}", serif`,
            color: "var(--color-text)",
          }}
        >
          {showAll ? "Todos os Serviços" : "Nossos Serviços"}
        </h2>
        <p
          style={{
            marginBottom: "3rem",
            textAlign: "center",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            color: "var(--color-muted)",
            maxWidth: "32rem",
            margin: "0 auto 3rem",
          }}
        >
          Cada procedimento é precedido de avaliação individual. Sem protocolos genéricos.
        </p>

        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--color-primary-light)" }}>
          {displayed.map((service, i) => (
            <article
              key={service.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "1.5rem",
                alignItems: "center",
                padding: "2rem 0",
                borderBottom: "1px solid var(--color-primary-light)",
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              onClick={() => openQualifier(service.qualifierPreselect)}
            >
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      color: "var(--color-accent)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                      fontWeight: 600,
                      fontFamily: `"${config.fontDisplay}", serif`,
                      color: "var(--color-text)",
                      lineHeight: 1.2,
                    }}
                  >
                    {service.name}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "var(--color-muted)",
                    maxWidth: "52rem",
                    paddingLeft: "2rem",
                  }}
                >
                  {service.description}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); openQualifier(service.qualifierPreselect); }}
                data-testid={`service-cta-${service.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.65rem 1.25rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text)",
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-primary-light)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-light)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary-light)";
                }}
              >
                Tenho interesse
                <ArrowRightIcon size={14} color="var(--color-primary)" />
              </button>
            </article>
          ))}
        </div>

        {/* "See all" link — only on home page */}
        {!showAll && (
          <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
            <Link
              href="/servicos/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              Ver todos os serviços
              <ArrowRightIcon size={18} color="var(--color-primary)" />
            </Link>
          </div>
        )}
      </div>

      {open && (
        <Qualifier config={config} preselect={preselect} onClose={() => setOpen(false)} />
      )}
    </section>
  );
}
