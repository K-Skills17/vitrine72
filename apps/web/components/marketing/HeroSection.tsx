"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { CORE_OFFER } from "@vitrine72/core";

interface Props {
  partnerBanner: { name: string } | null;
  checkoutUrl: string | null;
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const TRUST_ITEMS = [
  `Prévia em ${CORE_OFFER.previewBusinessDays} dias úteis`,
  "Mobile e Google-ready",
  "Domínio no seu nome",
  "WhatsApp integrado",
];

export function HeroSection({ checkoutUrl }: Props) {
  const ctaUrl = checkoutUrl ?? "#preco";
  const prefersReduced = useReducedMotion();

  const stagger: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: prefersReduced ? 0 : 0.12, delayChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden grain">
      {/* Background radial glow */}
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-glow-pulse pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(197,163,104,0.12) 0%, rgba(197,163,104,0.04) 50%, transparent 70%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.span variants={item} className="section-label">
          Sites para negócios locais em São Paulo
        </motion.span>

        <motion.h1
          variants={item}
          data-copy="provisional"
          className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.08] tracking-tight mt-2"
        >
          Seu negócio na internet{" "}
          <br className="hidden sm:block" />
          <span className="text-gradient-gold italic">em 72 horas úteis</span>
        </motion.h1>

        <motion.span variants={item} className="divider-gold mt-8" />

        <motion.p
          variants={item}
          data-copy="provisional"
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mt-2 leading-relaxed"
        >
          Site profissional até 5 páginas — mobile-first, Google Meu Negócio e
          botão de WhatsApp. Clientes te encontram, você só atende.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a href={ctaUrl} className="btn-gold text-lg w-full sm:w-auto">
            Quero meu site agora
            <ArrowRight className="w-5 h-5" aria-hidden />
          </a>
          <p className="text-sm text-gray-500">
            A partir de{" "}
            <span className="text-white font-semibold">
              R$ {CORE_OFFER.pricePix.toLocaleString("pt-BR")}
            </span>{" "}
            no Pix
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12"
        >
          {TRUST_ITEMS.map((text) => (
            <span key={text} className="flex items-center gap-2 text-sm text-gray-500">
              <Check className="w-4 h-4 text-brand-gold flex-shrink-0" aria-hidden />
              {text}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade into next section */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #111111)",
        }}
      />
    </section>
  );
}
