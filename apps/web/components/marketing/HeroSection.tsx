import { CORE_OFFER } from "@vitrine72/core";

interface Props {
  partnerBanner: { name: string } | null;
  checkoutUrl: string | null;
}

export function HeroSection({ checkoutUrl }: Props) {
  const ctaUrl = checkoutUrl ?? "#preco";

  return (
    <section className="pt-28 pb-20 px-4 bg-gradient-to-b from-brand-dark to-brand-dark-2">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Provisional copy — final headlines from NEEDS #10 */}
        <h1
          data-copy="provisional"
          className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight"
        >
          Seu negócio na internet{" "}
          <span className="text-brand-gold">em 72 horas úteis</span>
        </h1>

        <p
          data-copy="provisional"
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Clientes chegando pelo WhatsApp toda semana. Site profissional até 5
          páginas, mobile, Google Meu Negócio e botão de WhatsApp — sem
          complicação.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={ctaUrl}
            className="w-full sm:w-auto inline-block bg-brand-gold text-brand-dark font-bold px-8 py-4 rounded-xl text-lg hover:brightness-110 transition shadow-lg"
          >
            Quero meu site agora
          </a>
          <p className="text-sm text-gray-500">
            A partir de R$ {CORE_OFFER.pricePix.toLocaleString("pt-BR")} no Pix
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-gray-400">
          <span>✓ Prévia em {CORE_OFFER.previewBusinessDays} dias úteis</span>
          <span>✓ Mobile e Google-ready</span>
          <span>✓ Domínio no seu CPF/CNPJ</span>
          <span>✓ WhatsApp integrado</span>
        </div>
      </div>
    </section>
  );
}
