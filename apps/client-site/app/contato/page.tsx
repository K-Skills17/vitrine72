import type { Metadata } from "next";
import { config } from "@/lib/config";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: `Contato`,
  description: `Entre em contato com ${config.businessName} pelo WhatsApp ou visite-nos.`,
};

export default function ContatoPage() {
  return (
    <div className="pt-20">
      <div
        className="py-20 px-4 text-center"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="container-narrow">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Fale conosco
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Atendemos {config.neighborhoods.slice(0, 3).join(", ")} e região de São Paulo.
          </p>
        </div>
      </div>

      <ContactSection />
    </div>
  );
}
