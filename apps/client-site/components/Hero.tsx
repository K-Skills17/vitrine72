"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { config, getHeroPhoto } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Hero() {
  const heroPhoto = getHeroPhoto(config);
  const whatsappUrl = buildWhatsAppUrl(config.phone);
  const ctaLabel =
    config.primaryAction === "whatsapp"
      ? "Solicitar orçamento"
      : "Falar agora";

  const hasRating = config.gbpData && config.gbpData.rating >= 4;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Apresentação"
    >
      {/* Background */}
      {heroPhoto ? (
        <>
          <Image
            src={heroPhoto}
            alt={`${config.businessName} — foto principal`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 100%)" }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${config.palette.primary} 0%, ${darken(config.palette.primary, 0.3)} 100%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 container-narrow px-4 text-center md:text-left">
        <div className="max-w-2xl">
          {/* Rating badge */}
          {hasRating && (
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                <StarIcon />
                <span className="text-white text-sm font-semibold">
                  {config.gbpData!.rating.toFixed(1)} no Google
                </span>
                <span className="text-white/70 text-sm">
                  · {config.gbpData!.reviewCount} avaliações
                </span>
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              {config.copyBlocks.heroHeadline}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-white/85 mb-8 leading-relaxed">
              {config.copyBlocks.heroSubheadline}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
              <a
                href={config.primaryActionUrl || whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                <WhatsAppIcon />
                {ctaLabel}
              </a>

              <a
                href="/servicos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-white text-base border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200"
              >
                Ver serviços
              </a>
            </div>
          </FadeIn>

          {/* Local signals */}
          <FadeIn delay={0.4}>
            <div className="flex flex-wrap gap-2 mt-8 items-center md:justify-start justify-center">
              {config.neighborhoods.slice(0, 3).map((n) => (
                <span
                  key={n}
                  className="text-sm text-white/80 bg-white/10 border border-white/20 rounded-full px-3 py-1"
                >
                  {n}
                </span>
              ))}
              {config.neighborhoods.length > 3 && (
                <span className="text-sm text-white/70">
                  +{config.neighborhoods.length - 3} bairros
                </span>
              )}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      return;
    }

    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.5s ease, transform 0.5s ease`;

    const timer = setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, delay * 1000 + 100);

    return () => clearTimeout(timer);
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbc04" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
