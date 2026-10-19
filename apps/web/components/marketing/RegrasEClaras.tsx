import { RefreshCw, Timer, CalendarCheck, ShieldCheck } from "lucide-react";
import { CORE_OFFER, RULES } from "@vitrine72/core";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

const RULES_LIST = [
  {
    Icon: RefreshCw,
    title: "1 rodada de revisão",
    desc: `Após receber a prévia, você tem ${RULES.revisionWindowHours}h para solicitar ajustes. Uma rodada de revisão está incluída.`,
  },
  {
    Icon: Timer,
    title: `${CORE_OFFER.previewBusinessDays} dias úteis contam do briefing`,
    desc: "O prazo começa quando você termina de preencher o formulário, não quando paga.",
  },
  {
    Icon: CalendarCheck,
    title: `Site vai ao ar a partir do dia ${RULES.goLiveMinDays}`,
    desc: "O site é publicado no mínimo 8 dias após a confirmação do pagamento, após sua aprovação.",
  },
  {
    Icon: ShieldCheck,
    title: "Domínio no seu nome",
    desc: "O domínio é registrado no seu CPF ou CNPJ. É seu para sempre, mesmo que cancele o plano.",
  },
];

export function RegrasEClaras() {
  return (
    <section id="regras" className="py-28 px-6 bg-surface-raised">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="section-label">Transparência</span>
          <h2
            data-copy="provisional"
            className="text-4xl md:text-5xl font-display font-bold text-ink-primary mt-1"
          >
            Regras claras
          </h2>
          <span className="divider-gold mt-6" />
          <p className="text-ink-muted mt-4 max-w-xl mx-auto">
            Sem letras miúdas. Você sabe exatamente o que esperar antes de contratar.
          </p>
        </Reveal>

        <RevealGroup className="grid sm:grid-cols-2 gap-5">
          {RULES_LIST.map((r) => (
            <RevealItem key={r.title}>
              <div className="flex gap-5 p-7 bg-surface-base rounded-2xl border border-subtle hover:border-soft transition-colors duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                  <r.Icon className="w-5 h-5 text-brand-gold" aria-hidden />
                </div>
                <div>
                  <h3 className="text-ink-primary font-semibold leading-snug">{r.title}</h3>
                  <p className="text-ink-muted text-sm mt-2 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
