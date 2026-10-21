"use client";

import { useState, useEffect, useRef } from "react";
import { config, getFaqAnswer } from "@/lib/config";

export default function FAQAccordion({ limit }: { limit?: number }) {
  const faqs = limit ? config.faqs.slice(0, limit) : config.faqs;

  if (faqs.length === 0) return null;

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: "var(--color-secondary)" }}
      aria-label="Perguntas frequentes"
    >
      <div className="container-narrow px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-text)] mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Tire suas dúvidas antes de entrar em contato.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <FAQItem question={faq.q} answer={getFaqAnswer(config, faq.q) || faq.a} />
            </ScrollReveal>
          ))}
        </div>

        {limit && config.faqs.length > limit && (
          <div className="text-center mt-10">
            <a
              href="/faq"
              className="text-sm font-semibold inline-flex items-center gap-1"
              style={{ color: "var(--color-primary)" }}
            >
              Ver todas as perguntas
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-[var(--color-text)] text-sm md:text-base pr-4">
          {question}
        </span>
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white transition-all duration-200"
          style={{
            backgroundColor: open ? "var(--color-accent)" : "var(--color-primary)",
            transform: open ? "rotate(45deg)" : "none",
          }}
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
          <div className="pt-4">{answer}</div>
        </div>
      )}
    </div>
  );
}

function ScrollReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}
