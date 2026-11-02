"use client";

import { useState } from "react";
import type { NicheConfig } from "../lib/niche";
import Qualifier from "./Qualifier";

interface Props {
  config: NicheConfig;
}

export default function Nav({ config }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "var(--color-surface)",
          padding: "0.75rem 1.25rem",
        }}
      >
        <div
          style={{
            maxWidth: "64rem",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              fontFamily: `"${config.fontDisplay}", serif`,
              color: "var(--color-text)",
            }}
          >
            {config.brandName}
          </span>

          <button
            onClick={() => setOpen(true)}
            data-testid="nav-cta-btn"
            style={{
              borderRadius: "9999px",
              padding: "0.5rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "var(--color-primary)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Falar no WhatsApp
          </button>
        </div>
      </header>

      {open && (
        <Qualifier config={config} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
