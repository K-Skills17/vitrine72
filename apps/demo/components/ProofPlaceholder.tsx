import { StarIcon } from "./Icon";

export default function ProofPlaceholder() {
  return (
    <section
      id="depoimentos"
      style={{
        padding: "5rem 1.25rem",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
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
          O que nossos clientes dizem
        </h2>
        <p
          style={{
            marginBottom: "3rem",
            textAlign: "center",
            fontSize: "0.95rem",
            color: "var(--color-muted)",
          }}
        >
          Resultados reais, clientes satisfeitos
        </p>

        {/* Testimonials placeholder — clearly labeled, no fake content */}
        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            marginBottom: "2rem",
          }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                borderRadius: "1rem",
                border: "2px dashed #d1d5db",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
              aria-label="Área reservada para depoimento real"
            >
              {/* Star rating row */}
              <div style={{ display: "flex", gap: "0.2rem" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} size={16} color="#d1d5db" />
                ))}
              </div>
              <div
                style={{
                  height: "3.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#f3f4f6",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "9999px",
                    backgroundColor: "#e5e7eb",
                  }}
                />
                <div>
                  <div
                    style={{
                      width: "6rem",
                      height: "0.75rem",
                      borderRadius: "4px",
                      backgroundColor: "#e5e7eb",
                      marginBottom: "0.35rem",
                    }}
                  />
                  <div
                    style={{
                      width: "4rem",
                      height: "0.6rem",
                      borderRadius: "4px",
                      backgroundColor: "#f3f4f6",
                    }}
                  />
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "var(--color-muted)",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                [Depoimento real do cliente aqui]
              </p>
            </div>
          ))}
        </div>

        {/* Before/after placeholders */}
        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {["Antes", "Depois"].map((label) => (
            <div
              key={label}
              style={{
                height: "14rem",
                borderRadius: "1rem",
                border: "2px dashed #d1d5db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "0.75rem",
                backgroundColor: "#fafafa",
              }}
              aria-label={`Foto ${label}`}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-muted)" }}>
                {label}
              </p>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                Foto real do resultado
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
