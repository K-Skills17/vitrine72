import {
  CORE_OFFER,
  ANCHOR_PACKAGE,
  ADDONS,
  DOWNSELL,
  MAINTENANCE,
  PARTNER_BONUS,
} from "@vitrine72/core";

interface Props {
  partnerBonus: boolean;
  checkoutUrl: string | null;
}

export function Preco({ partnerBonus, checkoutUrl }: Props) {
  const anchorCtaUrl = checkoutUrl ?? "#";
  const coreCtaUrl = checkoutUrl ?? "#";

  return (
    <section id="preco" className="py-20 px-4 bg-brand-dark">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-2">
          <h2
            data-copy="provisional"
            className="text-3xl md:text-4xl font-display font-bold text-white"
          >
            Preços
          </h2>
          <p className="text-gray-400">
            Sem mensalidade surpresa. Você sabe tudo antes de pagar.
          </p>
        </div>

        {/* Anchor package */}
        <div className="bg-brand-dark-3 border border-brand-gold/40 rounded-2xl p-8 space-y-6 relative">
          <div className="absolute -top-3 left-6">
            <span className="bg-brand-gold text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Mais completo
            </span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white">
            {ANCHOR_PACKAGE.label}
          </h3>
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <p className="text-4xl font-bold text-brand-gold">
                R$ {ANCHOR_PACKAGE.pricePix.toLocaleString("pt-BR")}
              </p>
              <p className="text-gray-500 text-sm">no Pix</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-300">
                R$ {ANCHOR_PACKAGE.priceCard.toLocaleString("pt-BR")}
              </p>
              <p className="text-gray-500 text-sm">
                no cartão em até {ANCHOR_PACKAGE.installmentsMax}x
              </p>
            </div>
          </div>
          {partnerBonus && (
            <p className="text-brand-gold text-sm font-semibold">
              + {PARTNER_BONUS.freeCycles} ciclos de manutenção grátis pelo
              link do parceiro
            </p>
          )}
          <a
            href={anchorCtaUrl}
            className="inline-block bg-brand-gold text-brand-dark font-bold px-8 py-4 rounded-xl hover:brightness-110 transition"
          >
            Quero o pacote completo
          </a>
        </div>

        {/* Core offer */}
        <div className="bg-brand-dark-2 border border-white/10 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-display font-bold text-white">
            {CORE_OFFER.label}
          </h3>
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <p className="text-3xl font-bold text-white">
                R$ {CORE_OFFER.pricePix.toLocaleString("pt-BR")}
              </p>
              <p className="text-gray-500 text-sm">no Pix</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-400">
                R$ {CORE_OFFER.priceCard.toLocaleString("pt-BR")}
              </p>
              <p className="text-gray-500 text-sm">
                no cartão em até {CORE_OFFER.installmentsMax}x*
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            * Juros do parcelamento por conta do comprador.
          </p>
          <a
            href={coreCtaUrl}
            className="inline-block border border-brand-gold text-brand-gold font-bold px-8 py-4 rounded-xl hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Quero só o site
          </a>
        </div>

        {/* Add-ons */}
        <div className="space-y-4">
          <h3 className="text-xl font-display font-bold text-white">
            Complementos
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                label: ADDONS.GBP_SETUP.label,
                price: ADDONS.GBP_SETUP.price,
                note: "",
              },
              {
                label: ADDONS.AI_AGENT_SETUP.label,
                price: ADDONS.AI_AGENT_SETUP.price,
                note: "Apenas com manutenção ativa",
              },
              {
                label: ADDONS.EXTRA_PAGES.label,
                price: ADDONS.EXTRA_PAGES.price,
                note: "Páginas 6 a 8",
              },
              {
                label: ADDONS.CATALOG.label,
                price: ADDONS.CATALOG.price,
                note: "Até 10 itens",
              },
            ].map((a) => (
              <div
                key={a.label}
                className="flex justify-between items-start bg-brand-dark-3 rounded-xl p-4 border border-white/5"
              >
                <div>
                  <p className="text-white font-medium text-sm">{a.label}</p>
                  {a.note && (
                    <p className="text-gray-500 text-xs mt-1">{a.note}</p>
                  )}
                </div>
                <p className="text-brand-gold font-bold text-sm whitespace-nowrap ml-4">
                  R$ {a.price.toLocaleString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-brand-dark-2 border border-white/10 rounded-2xl p-6 space-y-2">
          <h3 className="text-lg font-semibold text-white">
            {MAINTENANCE.label}
          </h3>
          <p className="text-brand-gold font-bold text-2xl">
            R$ {MAINTENANCE.pricePerCycle.toLocaleString("pt-BR")}
            <span className="text-gray-500 text-base font-normal">
              {" "}
              / a cada {MAINTENANCE.cycleWeeks * 7} dias
            </span>
          </p>
          <p className="text-gray-400 text-sm">
            {MAINTENANCE.cyclesPerYear} cobranças por ano. Inclui até{" "}
            {MAINTENANCE.editsPerCycle} pequenas edições por ciclo.
          </p>
        </div>

        {/* Downsell */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Começando do zero?{" "}
            <a href={coreCtaUrl} className="text-brand-gold hover:underline">
              Landing page 1 página por R${" "}
              {DOWNSELL.price.toLocaleString("pt-BR")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
