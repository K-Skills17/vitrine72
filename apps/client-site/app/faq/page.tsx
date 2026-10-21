import type { Metadata } from "next";
import { config } from "@/lib/config";
import FAQAccordion from "@/components/FAQAccordion";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: `Perguntas frequentes`,
  description: `Tire suas dúvidas sobre os serviços de ${config.businessName}.`,
};

export default function FAQPage() {
  return (
    <div className="pt-20">
      <div
        className="py-20 px-4 text-center"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="container-narrow">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Perguntas frequentes
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Tudo o que você precisa saber antes de entrar em contato.
          </p>
        </div>
      </div>

      <FAQAccordion />
      <ContactSection />
    </div>
  );
}
