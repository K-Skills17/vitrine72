import { CORE_OFFER } from "@vitrine72/core";

const FEATURES = [
  {
    icon: "📱",
    title: "Mobile primeiro",
    desc: "Layout otimizado para celular, onde seus clientes estão.",
  },
  {
    icon: "💬",
    title: "Botão de WhatsApp",
    desc: "Botão fixo de contato para o cliente chamar diretamente.",
  },
  {
    icon: "🔍",
    title: "Google-ready",
    desc: "Estrutura técnica para aparecer no Google e no Google Meu Negócio.",
  },
  {
    icon: "🤖",
    title: "Preparado para IA",
    desc: "Linguagem simples e estrutura que permite que assistentes de IA recomendem seu negócio.",
  },
  {
    icon: "📄",
    title: `Até ${CORE_OFFER.pages} páginas`,
    desc: "Home, serviços, sobre, FAQ e contato. O suficiente para converter visitas em clientes.",
  },
  {
    icon: "🌐",
    title: "Domínio no seu nome",
    desc: "O domínio fica no seu CPF ou CNPJ — é seu, para sempre.",
  },
];

export function OQueVemNoSite() {
  return (
    <section id="o-que-vem" className="py-20 px-4 bg-brand-dark">
      <div className="max-w-5xl mx-auto">
        <h2
          data-copy="provisional"
          className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-4"
        >
          O que vem no site
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Tudo que um negócio local precisa para aparecer online e receber
          clientes pelo WhatsApp.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 items-start p-5 bg-brand-dark-2 rounded-xl border border-white/5"
            >
              <span className="text-2xl flex-shrink-0" aria-hidden>
                {f.icon}
              </span>
              <div>
                <h3 className="text-white font-semibold">{f.title}</h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
