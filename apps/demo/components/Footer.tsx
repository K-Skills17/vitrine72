import Link from "next/link";
import type { NicheConfig } from "../lib/niche";

interface Props {
  config: NicheConfig;
}

export default function Footer({ config }: Props) {
  return (
    <footer
      style={{
        backgroundColor: "#0f0f0f",
        color: "rgba(255,255,255,0.7)",
        padding: "4rem 1.25rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          display: "grid",
          gap: "2.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {/* Brand */}
        <div>
          <p
            style={{
              marginBottom: "0.5rem",
              fontSize: "1.1rem",
              fontWeight: 700,
              fontFamily: `"Playfair Display", serif`,
              color: "#ffffff",
            }}
          >
            {config.brandName}
          </p>
          <p style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>{config.tagline}</p>
        </div>

        {/* Navigation */}
        <div>
          <p
            style={{
              marginBottom: "1rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Navegação
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { href: "/", label: "Início" },
              { href: "/servicos/", label: "Serviços" },
              { href: "/sobre/", label: "Sobre" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Legal */}
        <div>
          <p
            style={{
              marginBottom: "1rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Legal
          </p>
          <Link
            href="/privacidade/"
            style={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
            }}
          >
            Política de Privacidade (LGPD)
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "72rem",
          margin: "3rem auto 0",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <p style={{ fontSize: "0.75rem" }}>
          © {new Date().getFullYear()} {config.brandName}. Todos os direitos reservados.
        </p>
        <p style={{ fontSize: "0.75rem" }}>
          Site demonstrativo criado pela{" "}
          <a
            href="https://vitrini72.com.br"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: 600,
              color: "var(--color-primary-light)",
              textDecoration: "underline",
            }}
          >
            Vitrine72
          </a>
        </p>
      </div>
    </footer>
  );
}
