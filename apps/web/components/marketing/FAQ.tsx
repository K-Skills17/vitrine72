"use client";

import { useState } from "react";
import { CORE_OFFER, RULES, MAINTENANCE } from "@vitrine72/core";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "O prazo de 72 horas úteis começa quando?",
    a: `O prazo começa quando você termina de preencher o formulário de briefing com todas as informações e fotos. Não começa no pagamento.`,
  },
  {
    q: "Quantas páginas vêm no site?",
    a: `O pacote inclui até ${CORE_OFFER.pages} páginas. Você pode adicionar páginas extras (6 a 8) por R$ ${(497).toLocaleString("pt-BR")} o bloco.`,
  },
  {
    q: "Posso escolher as cores e o estilo do site?",
    a: "Sim. No formulário de briefing você escolhe entre paletas de cores com base no seu segmento ou nas cores da sua logo.",
  },
  {
    q: "Posso alterar o site depois que ele estiver no ar?",
    a: `Com o plano de manutenção (R$ ${MAINTENANCE.pricePerCycle.toLocaleString("pt-BR")}/mês), você tem ${MAINTENANCE.editsPerCycle} pequenas edições por ciclo. Alterações maiores têm valor separado.`,
  },
  {
    q: "Quem fica com o domínio?",
    a: "O domínio é registrado no seu CPF ou CNPJ. Ele é seu, independentemente de qualquer coisa.",
  },
  {
    q: "Posso pedir mais de uma rodada de revisão?",
    a: `Está incluída ${RULES.maxRevisionRounds} rodada de revisão por projeto. Rodadas adicionais são tratadas como edições avulsas com valor separado.`,
  },
  {
    q: "Como funciona o pagamento?",
    a: `Você pode pagar via Pix ou cartão de crédito em até ${CORE_OFFER.installmentsMax}x. No Pix há desconto. Os juros do parcelamento são por conta do comprador.`,
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  // JSON-LD for FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="py-20 px-4 bg-brand-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto">
        <h2
          data-copy="provisional"
          className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-12"
        >
          Perguntas frequentes
        </h2>
        <div className="space-y-2">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className="bg-brand-dark-2 rounded-xl border border-white/5 overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center text-white font-medium hover:bg-brand-dark-3 transition"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <span className="text-brand-gold ml-4 flex-shrink-0">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
