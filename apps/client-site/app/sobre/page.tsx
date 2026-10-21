import type { Metadata } from "next";
import { config } from "@/lib/config";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: `Sobre nós`,
  description: `Conheça ${config.businessName}, atendendo ${config.neighborhoods[0] || "São Paulo"} há anos.`,
};

export default function SobrePage() {
  return (
    <div className="pt-20">
      {/* Page header */}
      <div
        className="py-20 px-4 text-center"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="container-narrow">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Sobre nós
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Conheça {config.businessName} e nossa história.
          </p>
        </div>
      </div>

      <AboutSection />
      <ContactSection />
    </div>
  );
}
