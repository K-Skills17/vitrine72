import { CORE_OFFER } from "@vitrine72/core";

const STEPS = [
  {
    number: "01",
    title: "Pagamento",
    desc: "Você paga pelo link (Pix ou cartão). Em segundos recebe o link do formulário de briefing no e-mail.",
  },
  {
    number: "02",
    title: "Formulário de briefing",
    desc: "Preenche o formulário com os dados do seu negócio, fotos e preferências. Leva em média 15 minutos.",
  },
  {
    number: "03",
    title: `Prévia em ${CORE_OFFER.previewBusinessDays} dias úteis`,
    desc: "Enviamos a prévia do site. Você aprova ou solicita 1 rodada de ajustes. Depois publicamos.",
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="py-20 px-4 bg-brand-dark-2">
      <div className="max-w-5xl mx-auto">
        <h2
          data-copy="provisional"
          className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-12"
        >
          Como funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-brand-dark-3 rounded-2xl p-6 space-y-3 border border-white/5"
            >
              <span className="text-brand-gold font-display font-bold text-4xl">
                {step.number}
              </span>
              <h3 className="text-white font-semibold text-lg">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
