import { RefreshCw, Timer, CalendarCheck, ShieldCheck } from "lucide-react";
import { CORE_OFFER, RULES } from "@vitrine72/core";

const RULES_LIST = [
  {
    Icon: RefreshCw,
    title: "1 rodada de revisão",
    desc: `Após receber a prévia, você tem ${RULES.revisionWindowHours}h para solicitar ajustes. Uma rodada de revisão está incluída.`,
  },
  {
    Icon: Timer,
    title: `${CORE_OFFER.previewBusinessDays} dias úteis contam do briefing completo`,
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
    <section id="regras" className="py-20 px-4 bg-brand-dark-2">
      <div className="max-w-5xl mx-auto">
        <h2
          data-copy="provisional"
          className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-4"
        >
          Regras claras
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Transparência total para você saber o que esperar.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {RULES_LIST.map((r) => (
            <div
              key={r.title}
              className="flex gap-4 p-6 bg-brand-dark rounded-xl border border-white/5"
            >
              <r.Icon className="w-6 h-6 text-brand-gold flex-shrink-0 mt-0.5" aria-hidden />
              <div>
                <h3 className="text-white font-semibold">{r.title}</h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
