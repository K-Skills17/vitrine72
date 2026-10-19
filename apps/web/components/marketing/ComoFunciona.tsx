import { CORE_OFFER } from "@vitrine72/core";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

const STEPS = [
  {
    number: "01",
    title: "Pagamento",
    desc: "Você paga pelo link (Pix ou cartão). Em segundos recebe o link do formulário de briefing no e-mail.",
  },
  {
    number: "02",
    title: "Briefing em 15 minutos",
    desc: "Preenche o formulário com os dados do seu negócio, fotos e preferências. Simples e rápido.",
  },
  {
    number: "03",
    title: `Prévia em ${CORE_OFFER.previewBusinessDays} dias úteis`,
    desc: "Enviamos a prévia do site. Você aprova ou solicita 1 rodada de ajustes. Depois publicamos.",
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="py-28 px-6 bg-surface-raised">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-20">
          <span className="section-label">Processo</span>
          <h2
            data-copy="provisional"
            className="text-4xl md:text-5xl font-display font-bold text-ink-primary mt-1"
          >
            Como funciona
          </h2>
          <span className="divider-gold mt-6" />
        </Reveal>

        <RevealGroup className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line — desktop only */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[52px] left-[calc(16.666%+24px)] right-[calc(16.666%+24px)] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgb(var(--gold-rgb) / 0.3) 20%, rgb(var(--gold-rgb) / 0.3) 80%, transparent)",
            }}
          />

          {STEPS.map((step) => (
            <RevealItem key={step.number}>
              <div className="relative bg-surface-base rounded-2xl p-8 border border-subtle hover:border-soft transition-colors duration-300">
                <span className="block font-display font-bold text-7xl leading-none text-gradient-gold mb-6 select-none">
                  {step.number}
                </span>
                <h3 className="text-ink-primary font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
