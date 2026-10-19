"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CORE_OFFER, RULES, MAINTENANCE } from "@vitrine72/core";
import { Reveal } from "./Reveal";

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
    a: `Com o plano de manutenção (R$ ${MAINTENANCE.pricePerCycle.toLocaleString("pt-BR")} a cada ${MAINTENANCE.cycleWeeks * 7} dias), você tem ${MAINTENANCE.editsPerCycle} pequenas edições por ciclo. Alterações maiores têm valor separado.`,
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
    <section id="faq" className="py-28 px-6 bg-brand-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="section-label">Dúvidas</span>
          <h2
            data-copy="provisional"
            className="text-4xl md:text-5xl font-display font-bold text-white mt-1"
          >
            Perguntas frequentes
          </h2>
          <span className="divider-gold mt-6" />
        </Reveal>

        <Reveal>
          <div className="space-y-2">
            {FAQS.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/6 overflow-hidden transition-colors duration-200"
                style={{
                  background: open === i ? "rgba(197,163,104,0.04)" : "rgba(26,26,26,1)",
                  borderColor: open === i ? "rgba(197,163,104,0.2)" : undefined,
                }}
              >
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 text-white font-medium hover:text-white/90 transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="text-sm md:text-base leading-snug">{item.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex-shrink-0 text-brand-gold"
                  >
                    <ChevronDown className="w-5 h-5" aria-hidden />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
