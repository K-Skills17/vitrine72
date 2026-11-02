"use client";

import { useState } from "react";
import type { NicheConfig } from "../lib/niche";
import Qualifier from "./Qualifier";

interface Props {
  config: NicheConfig;
}

export default function Services({ config }: Props) {
  const [open, setOpen] = useState(false);
  const [preselect, setPreselect] = useState<string | undefined>();

  function openQualifier(service?: string) {
    setPreselect(service);
    setOpen(true);
  }

  return (
    <section
      id="servicos"
      style={{
        padding: "5rem 1.25rem",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
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
          Nossos Serviços
        </h2>
        <p
          style={{
            marginBottom: "3rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--color-muted)",
          }}
        >
          Clique no serviço que você tem interesse para iniciar a conversa
        </p>

        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
          }}
        >
          {config.services.map((service) => (
            <div
              key={service.id}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "1rem",
                border: "1px solid #f0f0f0",
                backgroundColor: "#fff",
                padding: "1.5rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <span
                style={{ marginBottom: "0.75rem", fontSize: "2rem" }}
                role="img"
                aria-label={service.name}
              >
                {service.emoji}
              </span>
              <h3
                style={{
                  marginBottom: "0.5rem",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                {service.name}
              </h3>
              <p
                style={{
                  flex: 1,
                  marginBottom: "1.25rem",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  color: "var(--color-muted)",
                }}
              >
                {service.description}
              </p>
              <button
                onClick={() => openQualifier(service.qualifierPreselect)}
                data-testid={`service-cta-${service.id}`}
                style={{
                  borderRadius: "0.75rem",
                  padding: "0.6rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: "var(--color-primary)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Tenho interesse
              </button>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <Qualifier
          config={config}
          preselect={preselect}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}
