"use client";

import { useEffect, useRef } from "react";
import { config, getServiceDescription } from "@/lib/config";
import { buildWhatsAppServiceUrl } from "@/lib/whatsapp";

export default function ServicesGrid({ limit }: { limit?: number }) {
  const services = limit ? config.services.slice(0, limit) : config.services;

  return (
    <section className="section-padding bg-[var(--color-secondary)]" aria-label="Serviços">
      <div className="container-narrow px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-text)] mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Confira o que podemos fazer por você em {config.neighborhoods[0] || "São Paulo"}.
            </p>
          </div>
        </ScrollReveal>

        <div className={`grid gap-6 ${services.length === 1 ? "grid-cols-1 max-w-md mx-auto" : services.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {services.map((service, i) => (
            <ServiceCard key={service.name} service={service} index={i} />
          ))}
        </div>

        {limit && config.services.length > limit && (
          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10">
              <a
                href="/servicos"
                className="btn-primary inline-flex"
              >
                Ver todos os serviços
              </a>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: { name: string; description: string; price: string | null };
  index: number;
}) {
  const description = getServiceDescription(config, service.name) || service.description;
  const whatsappUrl = buildWhatsAppServiceUrl(config.phone, service.name);

  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
        {/* Icon placeholder — uses accent color */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-lg"
          style={{ backgroundColor: "var(--color-primary)" }}
          aria-hidden="true"
        >
          {service.name.charAt(0).toUpperCase()}
        </div>

        <h3 className="text-xl font-display font-bold text-[var(--color-text)] mb-3">
          {service.name}
        </h3>

        {description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
            {description}
          </p>
        )}

        {service.price && (
          <div
            className="inline-block text-sm font-semibold rounded-full px-3 py-1 mb-4 w-fit"
            style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-primary)" }}
          >
            {service.price}
          </div>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          Solicitar orçamento
          <ArrowIcon />
        </a>
      </div>
    </ScrollReveal>
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
    el.style.transform = "translateY(24px)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.transition = "opacity 0.45s ease, transform 0.45s ease";
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

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
