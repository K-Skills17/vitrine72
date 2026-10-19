import { ArrowRight } from "lucide-react";
import { CORE_OFFER } from "@vitrine72/core";
import { Reveal } from "./Reveal";

interface Props {
  checkoutUrl: string | null;
}

export function FinalCTA({ checkoutUrl }: Props) {
  const ctaUrl = checkoutUrl ?? "#preco";
  const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? "PLACEHOLDER_WHATSAPP"}`;

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Gold gradient background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #1a1508 0%, #161205 30%, #111111 70%, #111111 100%)",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(197,163,104,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Border top/bottom */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(197,163,104,0.4), transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(197,163,104,0.2), transparent)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <Reveal>
          <span className="section-label">Próximo passo</span>
          <h2
            data-copy="provisional"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mt-1 leading-tight"
          >
            Seu negócio merece{" "}
            <span className="text-gradient-gold italic">estar online</span>
          </h2>
          <span className="divider-gold mt-8" />
          <p className="text-gray-400 text-lg mt-4 mb-10">
            Prévia em {CORE_OFFER.previewBusinessDays} dias úteis. Sem enrolação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={ctaUrl} className="btn-gold text-lg w-full sm:w-auto">
              Começar agora — R$ {CORE_OFFER.pricePix.toLocaleString("pt-BR")} no Pix
              <ArrowRight className="w-5 h-5" aria-hidden />
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold w-full sm:w-auto"
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
