import type { NicheConfig } from "../lib/niche";

interface Props {
  config: NicheConfig;
}

export default function HowItWorks({ config }: Props) {
  return (
    <section
      id="como-funciona"
      style={{ padding: "5rem 1.25rem", backgroundColor: "var(--color-primary-dark)" }}
    >
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <p
          style={{
            marginBottom: "0.5rem",
            textAlign: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-primary-light)",
          }}
        >
          Simples assim
        </p>
        <h2
          style={{
            marginBottom: "0.75rem",
            textAlign: "center",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            fontFamily: `"Playfair Display", serif`,
            color: "#ffffff",
          }}
        >
          Como funciona o atendimento
        </h2>
        <p
          style={{
            marginBottom: "3.5rem",
            textAlign: "center",
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          Em 3 passos, só clientes certos chegam até você
        </p>

        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {config.howItWorks.map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: "1rem",
                padding: "2rem 1.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  marginBottom: "1.25rem",
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "var(--color-primary-dark)",
                  backgroundColor: "var(--color-primary-light)",
                }}
              >
                {item.step}
              </div>
              <h3
                style={{
                  marginBottom: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "rgba(255,255,255,0.65)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
