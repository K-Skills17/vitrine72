"use client";

import { useState } from "react";
import type { NicheConfig } from "../lib/niche";
import { ChevronDownIcon } from "./Icon";

interface Props {
  config: NicheConfig;
}

export default function FAQ({ config }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        padding: "5rem 1.25rem",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
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
          Perguntas frequentes
        </h2>
        <p
          style={{
            marginBottom: "3rem",
            textAlign: "center",
            fontSize: "0.95rem",
            color: "var(--color-muted)",
          }}
        >
          Tudo o que você precisa saber antes de entrar em contato
        </p>

        <dl style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {config.faqs.map((item, i) => (
            <div
              key={i}
              style={{
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
            >
              <dt>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--color-text)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {item.q}
                  <span
                    aria-hidden="true"
                    style={{
                      marginLeft: "0.75rem",
                      flexShrink: 0,
                      transform: openIndex === i ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    <ChevronDownIcon size={18} color="var(--color-primary)" />
                  </span>
                </button>
              </dt>
              {openIndex === i && (
                <dd
                  style={{
                    padding: "0 1.25rem 1rem",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "var(--color-muted)",
                  }}
                >
                  {item.a}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
