import { Smartphone, MessageCircle, Search, Bot, FileText, Globe } from "lucide-react";
import { CORE_OFFER } from "@vitrine72/core";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

const FEATURES = [
  {
    Icon: Smartphone,
    title: "Mobile primeiro",
    desc: "Layout otimizado para celular, onde seus clientes estão.",
  },
  {
    Icon: MessageCircle,
    title: "Botão de WhatsApp",
    desc: "Botão fixo de contato para o cliente chamar diretamente.",
  },
  {
    Icon: Search,
    title: "Google-ready",
    desc: "Estrutura técnica para aparecer no Google e no Google Meu Negócio.",
  },
  {
    Icon: Bot,
    title: "Preparado para IA",
    desc: "Linguagem e estrutura que permitem que assistentes de IA recomendem seu negócio.",
  },
  {
    Icon: FileText,
    title: `Até ${CORE_OFFER.pages} páginas`,
    desc: "Home, serviços, sobre, FAQ e contato. O suficiente para converter visitas em clientes.",
  },
  {
    Icon: Globe,
    title: "Domínio no seu nome",
    desc: "O domínio fica no seu CPF ou CNPJ — é seu, para sempre.",
  },
];

export function OQueVemNoSite() {
  return (
    <section id="o-que-vem" className="py-28 px-6 bg-surface-base">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="section-label">Incluso no pacote</span>
          <h2
            data-copy="provisional"
            className="text-4xl md:text-5xl font-display font-bold text-ink-primary mt-1"
          >
            O que vem no site
          </h2>
          <span className="divider-gold mt-6" />
          <p className="text-ink-muted mt-4 max-w-xl mx-auto">
            Tudo que um negócio local precisa para aparecer online e receber
            clientes pelo WhatsApp.
          </p>
        </Reveal>

        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <RevealItem key={f.title}>
              <div className="group flex gap-4 items-start p-6 bg-surface-raised rounded-2xl border border-subtle hover:border-soft transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/15 transition-colors duration-300">
                  <f.Icon className="w-5 h-5 text-brand-gold" aria-hidden />
                </div>
                <div>
                  <h3 className="text-ink-primary font-semibold">{f.title}</h3>
                  <p className="text-ink-muted text-sm mt-1.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
