import Image from "next/image";
import { getNicheConfig } from "../../lib/niche";
import Nav from "../../components/Nav";
import CTABanner from "../../components/CTABanner";
import Footer from "../../components/Footer";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";

export default function SobrePage() {
  const config = getNicheConfig();

  return (
    <>
      <Nav config={config} />
      <main>
        {/* Page header */}
        <section
          style={{
            padding: "6rem 1.25rem 4rem",
            backgroundColor: "var(--color-primary-dark)",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
            <p
              style={{
                marginBottom: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-primary-light)",
              }}
            >
              Nossa história
            </p>
            <h1
              style={{
                marginBottom: "1rem",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 700,
                fontFamily: `"Playfair Display", serif`,
                color: "#ffffff",
                lineHeight: 1.2,
              }}
            >
              Sobre a {config.brandName}
            </h1>
          </div>
        </section>

        {/* About content */}
        <section style={{ padding: "5rem 1.25rem", backgroundColor: "var(--color-bg)" }}>
          <div
            style={{
              maxWidth: "72rem",
              margin: "0 auto",
              display: "grid",
              gap: "3rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              alignItems: "center",
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                height: "420px",
                borderRadius: "1.25rem",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              }}
            >
              <Image
                src={config.aboutImageUrl}
                alt={config.aboutImageAlt}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text */}
            <div>
              <h2
                style={{
                  marginBottom: "1.25rem",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 700,
                  fontFamily: `"Playfair Display", serif`,
                  color: "var(--color-text)",
                  lineHeight: 1.25,
                }}
              >
                {config.aboutHeadline}
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  color: "var(--color-muted)",
                  whiteSpace: "pre-line",
                }}
              >
                {config.aboutText}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        {config.stats.length > 0 && (
          <section
            style={{
              padding: "4rem 1.25rem",
              backgroundColor: "var(--color-primary-dark)",
            }}
          >
            <div
              style={{
                maxWidth: "72rem",
                margin: "0 auto",
                display: "grid",
                gap: "2rem",
                gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
                textAlign: "center",
              }}
            >
              {config.stats.map((stat, i) => (
                <div key={i}>
                  <p
                    style={{
                      marginBottom: "0.25rem",
                      fontSize: "clamp(2rem, 4vw, 2.75rem)",
                      fontWeight: 800,
                      fontFamily: `"Playfair Display", serif`,
                      color: "var(--color-primary-light)",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <CTABanner
          config={config}
          headline={`Pronto para conhecer a ${config.brandName}?`}
          sub="Entre em contato agora. Responda 3 perguntas rápidas e nossa equipe entrará em contato com você."
        />
      </main>
      <Footer config={config} />
      <FloatingWhatsApp config={config} />
    </>
  );
}
