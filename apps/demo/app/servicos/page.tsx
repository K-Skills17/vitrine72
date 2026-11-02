import { getNicheConfig } from "../../lib/niche";
import Nav from "../../components/Nav";
import Services from "../../components/Services";
import ValueProps from "../../components/ValueProps";
import CTABanner from "../../components/CTABanner";
import FAQ from "../../components/FAQ";
import Footer from "../../components/Footer";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";

export default function ServicosPage() {
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
              {config.brandName}
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
              Nossos Serviços
            </h1>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Conheça em detalhe cada tratamento e solução que oferecemos.
              Clique no serviço de interesse para iniciar o atendimento.
            </p>
          </div>
        </section>

        <Services config={config} showAll />
        <ValueProps config={config} />
        <CTABanner
          config={config}
          headline="Encontrou o que procurava?"
          sub="Responda 3 perguntas rápidas e nossa equipe entrará em contato com uma proposta personalizada."
        />
        <FAQ config={config} />
      </main>
      <Footer config={config} />
      <FloatingWhatsApp config={config} />
    </>
  );
}
