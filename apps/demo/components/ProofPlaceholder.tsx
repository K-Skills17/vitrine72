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
            marginBottom: "2.5rem",
            textAlign: "center",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            fontFamily: "var(--font-display), serif",
            color: "var(--color-text)",
          }}
        >
          O que nossos clientes dizem
        </h2>

        {/* Testimonials placeholder — clearly labeled, no fake content */}
        <div
          style={{
            borderRadius: "1rem",
            border: "2px dashed #d1d5db",
            padding: "3rem",
            textAlign: "center",
          }}
          aria-label="Área reservada para depoimentos reais"
        >
          <span style={{ display: "block", marginBottom: "1rem", fontSize: "2.5rem" }}>
            💬
          </span>
          <p
            style={{
              marginBottom: "0.5rem",
              fontWeight: 600,
              color: "var(--color-muted)",
            }}
          >
            [Área reservada]
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
            Aqui entram os depoimentos reais dos seus clientes
          </p>
        </div>

        {/* Before/after placeholders */}
        <div
          style={{
            marginTop: "2rem",
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {[1, 2].map((n) => (
            <div
              key={n}
              style={{
                height: "12rem",
                borderRadius: "1rem",
                border: "2px dashed #d1d5db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "0.5rem",
              }}
              aria-label="Imagem exemplo"
            >
              <span style={{ fontSize: "2rem" }}>🖼️</span>
              <p style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                Exemplo — foto real do cliente aqui
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
