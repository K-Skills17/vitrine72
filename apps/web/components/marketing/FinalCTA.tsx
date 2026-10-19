import { CORE_OFFER } from "@vitrine72/core";

interface Props {
  checkoutUrl: string | null;
}

export function FinalCTA({ checkoutUrl }: Props) {
  const ctaUrl = checkoutUrl ?? "#preco";

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-brand-dark-2 to-brand-dark">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2
          data-copy="provisional"
          className="text-3xl md:text-4xl font-display font-bold text-white"
        >
          Pronto para ter seu negócio na internet?
        </h2>
        <p className="text-gray-400 text-lg">
          Prévia em {CORE_OFFER.previewBusinessDays} dias úteis. Sem enrolação.
        </p>
        <a
          href={ctaUrl}
          className="inline-block bg-brand-gold text-brand-dark font-bold px-10 py-5 rounded-xl text-xl hover:brightness-110 transition shadow-xl"
        >
          Começar agora — R$ {CORE_OFFER.pricePix.toLocaleString("pt-BR")} no Pix
        </a>
        <p className="text-sm text-gray-600">
          Ou entre em contato:{" "}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? "PLACEHOLDER_WHATSAPP"}`}
            className="text-brand-gold hover:underline"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
