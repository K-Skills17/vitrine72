import Link from "next/link";
import type { NicheConfig } from "../lib/niche";

interface Props {
  config: NicheConfig;
}

export default function Footer({ config }: Props) {
  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        padding: "2.5rem 1.25rem",
        backgroundColor: "var(--color-surface)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          marginBottom: "0.25rem",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--color-text)",
        }}
      >
        {config.brandName}
      </p>
      <p
        style={{
          marginBottom: "1rem",
          fontSize: "0.75rem",
          color: "var(--color-muted)",
        }}
      >
        {config.tagline}
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <Link
          href="/privacidade/"
          style={{
            fontSize: "0.75rem",
            color: "var(--color-muted)",
            textDecoration: "underline",
          }}
        >
          Política de Privacidade (LGPD)
        </Link>
      </div>

      {/* Required Vitrine72 attribution */}
      <p style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
        Site demonstrativo criado pela{" "}
        <a
          href="https://vitrini72.com.br"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontWeight: 600,
            color: "var(--color-primary)",
            textDecoration: "underline",
          }}
        >
          Vitrine72
        </a>
      </p>
    </footer>
  );
}
