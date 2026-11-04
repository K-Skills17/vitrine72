"use client";

import { useEffect, useRef } from "react";
import { config, getServiceDescription, type CardStyle } from "@/lib/config";
import { buildWhatsAppServiceUrl } from "@/lib/whatsapp";

export default function ServicesGrid({ limit }: { limit?: number }) {
  const services = limit ? config.services.slice(0, limit) : config.services;
  const cardStyle: CardStyle = (config.cardStyle as CardStyle) ?? "card-shadow";

  const sectionBg =
    cardStyle === "card-dark"
      ? config.palette.background
      : cardStyle === "card-bordered"
      ? config.palette.background
      : "var(--color-secondary)";

  return (
    <section className="section-padding" style={{ backgroundColor: sectionBg }} aria-label="Serviços">
      <div className="container-narrow px-4">
        <ScrollReveal>
          <div className={`mb-12 ${cardStyle === "card-minimal" ? "" : "text-center"}`}>
            {cardStyle === "card-dark" ? (
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3" style={{ color: config.palette.text }}>
                Nossos Serviços
              </h2>
            ) : cardStyle === "card-minimal" ? (
              <>
                <div className="w-8 h-0.5 mb-4" style={{ backgroundColor: config.palette.accent }} />
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3" style={{ color: config.palette.text }}>
                  Serviços
                </h2>
              </>
            ) : (
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-text)] mb-4">
                Nossos Serviços
              </h2>
            )}
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: cardStyle === "card-dark" ? `${config.palette.text}80` : undefined }}
            >
              {cardStyle !== "card-minimal" && `Confira o que podemos fazer por você em ${config.neighborhoods[0] || "São Paulo"}.`}
            </p>
          </div>
        </ScrollReveal>

        <div
          className={`${
            cardStyle === "card-minimal"
              ? "divide-y"
              : `grid gap-6 ${services.length === 1 ? "grid-cols-1 max-w-md mx-auto" : services.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`
          }`}
          style={cardStyle === "card-minimal" ? { borderColor: `${config.palette.text}10` } : undefined}
        >
          {services.map((service, i) => (
            <ServiceCard key={service.name} service={service} index={i} cardStyle={cardStyle} />
          ))}
        </div>

        {limit && config.services.length > limit && (
          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10">
              <a href="/servicos" className="btn-primary inline-flex">
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
  cardStyle,
}: {
  service: { name: string; description: string; price: string | null };
  index: number;
  cardStyle: CardStyle;
}) {
  const description = getServiceDescription(config, service.name) || service.description;
  const whatsappUrl = buildWhatsAppServiceUrl(config.phone, service.name);

  if (cardStyle === "card-minimal") {
    return (
      <ScrollReveal delay={index * 0.08}>
        <div className="py-6 flex items-start justify-between gap-4 group">
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="text-lg font-display font-bold" style={{ color: config.palette.text }}>
                {service.name}
              </h3>
              {service.price && (
                <span className="text-sm font-semibold" style={{ color: config.palette.accent }}>
                  {service.price}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm leading-relaxed text-gray-500">{description}</p>
            )}
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all group-hover:scale-110"
            style={{ borderColor: config.palette.primary, color: config.palette.primary }}
            aria-label={`Orçamento: ${service.name}`}
          >
            <ArrowIcon />
          </a>
        </div>
      </ScrollReveal>
    );
  }

  if (cardStyle === "card-dark") {
    return (
      <ScrollReveal delay={index * 0.1}>
        <div
          className="rounded-2xl p-6 flex flex-col h-full border transition-all duration-300 hover:scale-[1.02]"
          style={{ backgroundColor: `${config.palette.text}08`, borderColor: `${config.palette.text}15` }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: config.palette.accent }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="text-xl font-display font-bold mb-3" style={{ color: config.palette.text }}>
            {service.name}
          </h3>
          {description && (
            <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: `${config.palette.text}60` }}>
              {description}
            </p>
          )}
          {service.price && (
            <div className="text-sm font-bold mb-4" style={{ color: config.palette.accent }}>
              {service.price}
            </div>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: config.palette.accent }}
          >
            Solicitar <ArrowIcon />
          </a>
        </div>
      </ScrollReveal>
    );
  }

  if (cardStyle === "card-bordered") {
    return (
      <ScrollReveal delay={index * 0.1}>
        <div
          className="rounded-xl p-6 border flex flex-col h-full transition-colors duration-300"
          style={{ borderColor: config.palette.primary + "40", backgroundColor: "transparent" }}
        >
          <div
            className="w-8 h-8 rounded-lg border-2 flex items-center justify-center mb-4 text-xs font-bold"
            style={{ borderColor: config.palette.primary, color: config.palette.primary }}
          >
            {service.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-display font-bold text-[var(--color-text)] mb-3">
            {service.name}
          </h3>
          {description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{description}</p>
          )}
          {service.price && (
            <div
              className="inline-block text-sm font-semibold rounded px-3 py-1 mb-4 w-fit border"
              style={{ borderColor: config.palette.primary + "40", color: config.palette.primary }}
            >
              {service.price}
            </div>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: config.palette.primary }}
          >
            Solicitar orçamento <ArrowIcon />
          </a>
        </div>
      </ScrollReveal>
    );
  }

  // card-shadow (default)
  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-lg"
          style={{ backgroundColor: "var(--color-primary)" }}
          aria-hidden="true"
        >
          {service.name.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-xl font-display font-bold text-[var(--color-text)] mb-3">{service.name}</h3>
        {description && <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{description}</p>}
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
          Solicitar orçamento <ArrowIcon />
        </a>
      </div>
    </ScrollReveal>
  );
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          el.style.transition = "opacity 0.45s ease, transform 0.45s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, delay * 1000);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
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
