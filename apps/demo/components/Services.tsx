"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NicheConfig } from "../lib/niche";
import Qualifier from "./Qualifier";
import { ArrowRightIcon } from "./Icon";

interface Props {
  config: NicheConfig;
  /** If true, shows all services; if false shows first 3 with a "see all" link */
  showAll?: boolean;
}

export default function Services({ config, showAll = false }: Props) {
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
            fontFamily: `"Playfair Display", serif`,
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
          Clique no serviço de interesse e nossa equipe receberá suas informações antes de atender você
        </p>

        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {displayed.map((service) => (
            <article
              key={service.id}
              style={{
                borderRadius: "1rem",
                overflow: "hidden",
                border: "1px solid #f0f0f0",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Service image */}
              <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                <Image
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              {/* Card body */}
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    marginBottom: "0.5rem",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    fontFamily: `"Playfair Display", serif`,
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
                    lineHeight: 1.65,
                    color: "var(--color-muted)",
                  }}
                >
                  {service.description}
                </p>
                <button
                  onClick={() => openQualifier(service.qualifierPreselect)}
                  data-testid={`service-cta-${service.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    borderRadius: "0.75rem",
                    padding: "0.65rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#fff",
                    backgroundColor: "var(--color-primary)",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Tenho interesse
                  <ArrowRightIcon size={16} color="#fff" />
                </button>
              </div>
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
