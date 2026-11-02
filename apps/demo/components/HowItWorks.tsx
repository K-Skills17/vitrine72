import type { NicheConfig } from "../lib/niche";

interface Props {
  config: NicheConfig;
}

export default function HowItWorks({ config }: Props) {
  return (
    <section
      id="como-funciona"
      style={{
        padding: "5rem 1.25rem",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
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
          Como funciona
        </h2>
        <p
          style={{
            marginBottom: "3.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--color-muted)",
          }}
        >
          Em 3 passos, só clientes certos chegam até você
        </p>

        <div
          style={{
            display: "grid",
            gap: "2.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {config.howItWorks.map((item) => (
            <div
              key={item.step}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
            >
              <div
                style={{
                  marginBottom: "1.25rem",
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#fff",
                  backgroundColor: "var(--color-primary)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                {item.step}
              </div>
              <h3
                style={{
                  marginBottom: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--color-muted)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
