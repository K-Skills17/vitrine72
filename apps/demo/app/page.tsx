import { getNicheConfig } from "../lib/niche";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Services from "../components/Services";
import ValueProps from "../components/ValueProps";
import HowItWorks from "../components/HowItWorks";
import ProofPlaceholder from "../components/ProofPlaceholder";
import CTABanner from "../components/CTABanner";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import ChatbotEmbed from "../components/ChatbotEmbed";

export default function HomePage() {
  const config = getNicheConfig();
  const tenantId = process.env.NEXT_PUBLIC_CHATBOT_TENANT_ID;

  return (
    <>
      <Nav config={config} />
      <main>
        <Hero config={config} />
        <Services config={config} />
        <ValueProps config={config} />
        <HowItWorks config={config} />
        <ProofPlaceholder />
        <CTABanner config={config} />
        <FAQ config={config} />
      </main>
      <Footer config={config} />
      <FloatingWhatsApp config={config} />
      {config.features.chatbot && (
        <ChatbotEmbed
          tenantId={tenantId}
          primaryColor={config.primaryColor}
          headerTitle={config.brandName}
          whatsappNumber={config.whatsappNumber}
        />
      )}
    </>
  );
}
