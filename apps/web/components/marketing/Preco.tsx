import {
  CORE_OFFER,
  ANCHOR_PACKAGE,
  ADDONS,
  DOWNSELL,
  MAINTENANCE,
  PARTNER_BONUS,
} from "@vitrine72/core";
import { Check, ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

interface Props {
  partnerBonus: boolean;
  coreUrl: string | null;
  anchorUrl: string | null;
}

const ANCHOR_FEATURES = [
  `Até ${CORE_OFFER.pages} páginas`,
  "Google Meu Negócio configurado",
  "Agente IA de agendamento",
  "Domínio no seu nome",
  "Mobile e WhatsApp-ready",
  "1 rodada de revisão",
];

const CORE_FEATURES = [
  `Até ${CORE_OFFER.pages} páginas`,
  "Mobile e WhatsApp-ready",
  "Domínio no seu nome",
  "1 rodada de revisão",
];

export function Preco({ partnerBonus, coreUrl, anchorUrl }: Props) {
  const coreCtaUrl = coreUrl ?? "#";
  const anchorCtaUrl = anchorUrl ?? "#";

  return (
    <section id="preco" className="py-28 px-6 bg-surface-base">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="section-label">Investimento</span>
          <h2
            data-copy="provisional"
            className="text-4xl md:text-5xl font-display font-bold text-ink-primary mt-1"
          >
            Preços
          </h2>
          <span className="divider-gold mt-6" />
          <p className="text-ink-muted mt-4">
            Sem mensalidade surpresa. Você sabe tudo antes de pagar.
          </p>
        </Reveal>

        {/* Main packages */}
        <RevealGroup className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Anchor package — featured */}
          <RevealItem>
            <div
              className="relative rounded-2xl p-8 flex flex-col h-full grain"
              style={{
                background: "var(--anchor-card-bg)",
                border: `1px solid rgb(var(--gold-rgb) / 0.35)`,
                boxShadow: `0 0 60px rgb(var(--gold-rgb) / 0.08), inset 0 1px 0 rgb(var(--gold-rgb) / 0.15)`,
              }}
            >
              <div className="absolute -top-3.5 left-6 z-10">
                <span
                  className="text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
                  style={{ background: "var(--gold-accent)" }}
                >
                  Mais completo
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="text-ink-primary text-2xl font-display font-bold mt-2 mb-6">
                  {ANCHOR_PACKAGE.label}
                </h3>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-gradient-gold">
                    R$ {ANCHOR_PACKAGE.pricePix.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-ink-subtle text-sm mt-1">no Pix</p>
                  <p className="text-ink-muted text-sm mt-1">
                    ou R$ {ANCHOR_PACKAGE.priceCard.toLocaleString("pt-BR")} em até{" "}
                    {ANCHOR_PACKAGE.installmentsMax}x no cartão
                  </p>
                </div>

                {partnerBonus && (
                  <p className="text-brand-gold text-sm font-semibold mb-4 bg-brand-gold/10 rounded-lg px-3 py-2">
                    + {PARTNER_BONUS.freeCycles} ciclos de manutenção grátis
                  </p>
                )}

                <ul className="space-y-2.5 mb-8">
                  {ANCHOR_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-ink-muted">
                      <Check className="w-4 h-4 text-brand-gold flex-shrink-0" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>

                <a href={anchorCtaUrl} className="btn-gold w-full justify-center mt-auto">
                  Quero o pacote completo
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </a>
              </div>
            </div>
          </RevealItem>

          {/* Core offer */}
          <RevealItem>
            <div className="rounded-2xl p-8 flex flex-col h-full bg-surface-raised border border-subtle">
              <h3 className="text-ink-primary text-xl font-display font-bold mb-6">
                {CORE_OFFER.label}
              </h3>

              <div className="mb-6">
                <p className="text-3xl font-bold text-ink-primary">
                  R$ {CORE_OFFER.pricePix.toLocaleString("pt-BR")}
                </p>
                <p className="text-ink-subtle text-sm mt-1">no Pix</p>
                <p className="text-ink-subtle text-sm mt-1">
                  ou R$ {CORE_OFFER.priceCard.toLocaleString("pt-BR")} em até{" "}
                  {CORE_OFFER.installmentsMax}x*
                </p>
                <p className="text-xs text-ink-faint mt-2">
                  * Juros do parcelamento por conta do comprador.
                </p>
              </div>

              <ul className="space-y-2.5 mb-8">
                {CORE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-ink-muted">
                    <Check className="w-4 h-4 text-brand-gold/60 flex-shrink-0" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>

              <a href={coreCtaUrl} className="btn-outline-gold w-full justify-center mt-auto">
                Quero só o site
              </a>
            </div>
          </RevealItem>
        </RevealGroup>

        {/* Maintenance & Add-ons */}
        <Reveal delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface-raised border border-subtle rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">
                Manutenção mensal
              </p>
              <h3 className="text-ink-primary text-lg font-semibold mb-1">{MAINTENANCE.label}</h3>
              <p className="text-2xl font-bold text-brand-gold">
                R$ {MAINTENANCE.pricePerCycle.toLocaleString("pt-BR")}
                <span className="text-ink-subtle text-sm font-normal">
                  {" "}/ {MAINTENANCE.cycleWeeks * 7} dias
                </span>
              </p>
              <p className="text-ink-subtle text-sm mt-2">
                {MAINTENANCE.cyclesPerYear}x por ano · Até {MAINTENANCE.editsPerCycle} edições por ciclo
              </p>
            </div>

            <div className="bg-surface-raised border border-subtle rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">
                Complementos
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: ADDONS.GBP_SETUP.label, price: ADDONS.GBP_SETUP.price },
                  { label: ADDONS.EXTRA_PAGES.label, price: ADDONS.EXTRA_PAGES.price },
                  { label: ADDONS.AI_AGENT_SETUP.label, price: ADDONS.AI_AGENT_SETUP.price },
                  { label: ADDONS.CATALOG.label, price: ADDONS.CATALOG.price },
                ].map((a) => (
                  <li key={a.label} className="flex justify-between items-center text-sm">
                    <span className="text-ink-muted">{a.label}</span>
                    <span className="text-brand-gold font-semibold ml-4 whitespace-nowrap">
                      R$ {a.price.toLocaleString("pt-BR")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Downsell */}
        <Reveal>
          <p className="text-center text-ink-subtle text-sm">
            Começando do zero?{" "}
            <a href="/api/checkout?sku=LANDING_1P" className="text-brand-gold hover:underline">
              Landing page 1 página por R$ {DOWNSELL.price.toLocaleString("pt-BR")}
            </a>
            {" "}ou em até {DOWNSELL.installmentsMax}x no cartão*
          </p>
        </Reveal>
      </div>
    </section>
  );
}
