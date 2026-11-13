import { getNicheConfig } from "../../lib/niche";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function PrivacidadePage() {
  const config = getNicheConfig();

  return (
    <>
      <header
        style={{
          borderBottom: "1px solid #e5e7eb",
          padding: "0.75rem 1.25rem",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--color-primary)",
            textDecoration: "none",
          }}
        >
          ← Voltar ao site
        </Link>
      </header>

      <main
        style={{
          maxWidth: "40rem",
          margin: "0 auto",
          padding: "4rem 1.25rem",
        }}
      >
        <h1
          style={{
            marginBottom: "2rem",
            fontSize: "1.75rem",
            fontWeight: 700,
            fontFamily: "var(--font-display), serif",
            color: "var(--color-text)",
          }}
        >
          Política de Privacidade
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            fontSize: "0.875rem",
            lineHeight: 1.7,
            color: "var(--color-text)",
          }}
        >
          <section>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              1. Responsável pelo tratamento
            </h2>
            <p>
              Este site é uma demonstração criada pela{" "}
              <strong>Vitrini72</strong> (
              <a
                href="https://vitrini72.com.br"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-primary)" }}
              >
                vitrini72.com.br
              </a>
              ). As informações inseridas no qualificador de WhatsApp não são
              armazenadas neste site — elas são incluídas na URL de
              redirecionamento do WhatsApp e chegam diretamente à empresa
              responsável.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              2. Dados coletados
            </h2>
            <p>Ao usar o qualificador de WhatsApp, você fornece voluntariamente:</p>
            <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
              <li>Primeiro nome</li>
              <li>Serviço ou ambiente de interesse</li>
              <li>Prazo ou situação do imóvel</li>
              <li>Faixa de investimento pretendida</li>
            </ul>
            <p style={{ marginTop: "0.75rem" }}>
              Esses dados são transmitidos exclusivamente via URL do WhatsApp (
              <code>wa.me</code>) e não são coletados, armazenados ou
              processados por servidores deste site.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              3. Cookies e analytics
            </h2>
            <p>
              Este site pode usar Google Analytics (GA4) e Meta Pixel para
              medir visitas e eventos de navegação. Essas plataformas têm suas
              próprias políticas de privacidade.
            </p>
          </section>

          {config.privacyPolicyExtra && (
            <section>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                4. Chatbot
              </h2>
              <p>{config.privacyPolicyExtra}</p>
            </section>
          )}

          <section>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              {config.privacyPolicyExtra ? "5" : "4"}. Base legal (LGPD)
            </h2>
            <p>
              O tratamento de dados ocorre com base no consentimento do titular
              (art. 7º, I, Lei 13.709/2018) e no legítimo interesse para fins
              de atendimento comercial (art. 7º, IX). Você pode solicitar a
              exclusão ou informações sobre seus dados entrando em contato com
              a empresa pelo WhatsApp ou pelo e-mail indicado neste site.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              {config.privacyPolicyExtra ? "6" : "5"}. Contato
            </h2>
            <p>
              Para exercer seus direitos como titular de dados, entre em
              contato com {config.brandName} pelos canais informados no site ou
              com a Vitrini72 em{" "}
              <a
                href="https://vitrini72.com.br"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-primary)" }}
              >
                vitrini72.com.br
              </a>
              .
            </p>
          </section>

          <p style={{ fontSize: "0.75rem", color: "var(--color-muted)", paddingTop: "1rem" }}>
            Última atualização: novembro de 2026
          </p>
        </div>
      </main>

      <Footer config={config} />
    </>
  );
}
