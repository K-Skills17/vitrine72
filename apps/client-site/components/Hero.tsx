"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { config, getHeroPhoto, type HeroStyle } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Hero() {
  const style: HeroStyle = (config.heroStyle as HeroStyle) ?? "fullscreen-photo";

  if (style === "minimal-dark")       return <HeroMinimalDark />;
  if (style === "split-text-left")    return <HeroSplitLeft />;
  if (style === "editorial-asymmetric") return <HeroEditorial />;
  return <HeroFullscreen />;
}

// ─── Variant 1: Fullscreen photo (vibrant-boutique, conversion-driven) ────────

function HeroFullscreen() {
  const heroPhoto = getHeroPhoto(config);
  const whatsappUrl = buildWhatsAppUrl(config.phone);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" aria-label="Apresentação">
      {heroPhoto ? (
        <>
          <Image src={heroPhoto} alt={`${config.businessName}`} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 100%)" }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${config.palette.primary} 0%, ${darken(config.palette.primary, 0.3)} 100%)` }} />
      )}

      <div className="relative z-10 container-narrow px-4 text-center md:text-left">
        <div className="max-w-2xl">
          <RatingBadge />
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
            <CtaButtons white />
          </FadeIn>
          <FadeIn delay={0.4}>
            <NeighborhoodTags />
          </FadeIn>
        </div>
      </div>

      <ScrollArrow />
    </section>
  );
}

// ─── Variant 2: Minimal dark (dark-luxury) ────────────────────────────────────

function HeroMinimalDark() {
  const whatsappUrl = buildWhatsAppUrl(config.phone);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      aria-label="Apresentação"
      style={{ backgroundColor: config.palette.background }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="relative z-10 container-narrow px-4 md:px-12 w-full">
        {/* Accent line */}
        <FadeIn delay={0}>
          <div className="w-12 h-0.5 mb-8" style={{ backgroundColor: config.palette.accent }} />
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-none mb-8 tracking-tight"
            style={{ color: config.palette.text }}
          >
            {config.copyBlocks.heroHeadline}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-lg md:text-xl mb-10 max-w-xl leading-relaxed" style={{ color: `${config.palette.text}99` }}>
            {config.copyBlocks.heroSubheadline}
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <a
              href={config.primaryActionUrl || whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:opacity-80"
              style={{ backgroundColor: config.palette.accent, color: config.palette.background }}
            >
              Agendar consulta
            </a>
            <a
              href="/servicos"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-sm tracking-widest uppercase border transition-all duration-200 hover:opacity-80"
              style={{ borderColor: `${config.palette.text}30`, color: `${config.palette.text}80` }}
            >
              Ver serviços
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mt-16 flex flex-wrap gap-6">
            {config.neighborhoods.slice(0, 3).map((n) => (
              <span key={n} className="text-xs tracking-widest uppercase" style={{ color: `${config.palette.text}40` }}>
                {n}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Variant 3: Split text left (clean-clinical) ──────────────────────────────

function HeroSplitLeft() {
  const heroPhoto = getHeroPhoto(config);
  const whatsappUrl = buildWhatsAppUrl(config.phone);

  return (
    <section className="min-h-screen flex items-center pt-16" aria-label="Apresentação" style={{ backgroundColor: config.palette.background }}>
      <div className="container-narrow px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left: text */}
          <div>
            <FadeIn delay={0}>
              <span
                className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
                style={{ backgroundColor: config.palette.secondary, color: config.palette.primary }}
              >
                {config.vertical}
              </span>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1
                className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6"
                style={{ color: config.palette.text }}
              >
                {config.copyBlocks.heroHeadline}
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg mb-8 leading-relaxed text-gray-500">
                {config.copyBlocks.heroSubheadline}
              </p>
            </FadeIn>

            {config.gbpData && config.gbpData.rating >= 4 && (
              <FadeIn delay={0.25}>
                <div className="flex items-center gap-3 mb-8 p-4 rounded-xl border" style={{ borderColor: config.palette.secondary, backgroundColor: config.palette.secondary }}>
                  <div className="text-2xl font-bold" style={{ color: config.palette.primary }}>{config.gbpData.rating.toFixed(1)}★</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">{config.gbpData.reviewCount} avaliações no Google</div>
                    <div className="text-xs text-gray-500">Clientes satisfeitos em {config.neighborhoods[0]}</div>
                  </div>
                </div>
              </FadeIn>
            )}

            <FadeIn delay={0.3}>
              <CtaButtons />
            </FadeIn>
          </div>

          {/* Right: photo */}
          {heroPhoto && (
            <FadeIn delay={0.15}>
              <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src={heroPhoto} alt={config.businessName} fill sizes="50vw" className="object-cover" />
                <div
                  className="absolute bottom-0 left-0 right-0 h-32"
                  style={{ background: `linear-gradient(to top, ${config.palette.primary}30, transparent)` }}
                />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Variant 4: Editorial asymmetric (editorial-expert) ───────────────────────

function HeroEditorial() {
  const heroPhoto = getHeroPhoto(config);
  const whatsappUrl = buildWhatsAppUrl(config.phone);

  return (
    <section
      className="relative min-h-screen pt-16 overflow-hidden"
      aria-label="Apresentação"
      style={{ backgroundColor: config.palette.background }}
    >
      {/* Oversized background initial */}
      <div
        className="absolute right-0 top-0 h-full w-1/2 hidden md:block"
        aria-hidden="true"
      >
        {heroPhoto ? (
          <div className="relative h-full">
            <Image src={heroPhoto} alt="" fill sizes="50vw" className="object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${config.palette.background} 0%, transparent 40%)` }} />
          </div>
        ) : (
          <div className="h-full" style={{ background: `linear-gradient(135deg, ${config.palette.secondary}, ${config.palette.primary}20)` }} />
        )}
      </div>

      <div className="relative z-10 container-narrow px-4 md:px-8 flex flex-col justify-center min-h-[85vh]">
        <FadeIn delay={0}>
          <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: config.palette.accent }}>
            {config.neighborhoods[0] ?? "São Paulo"} · {config.vertical}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1
            className="text-5xl md:text-7xl font-display font-bold leading-[0.95] mb-8 max-w-2xl"
            style={{ color: config.palette.text }}
          >
            {config.copyBlocks.heroHeadline}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base md:text-lg max-w-lg mb-10 leading-relaxed" style={{ color: `${config.palette.text}70` }}>
            {config.copyBlocks.heroSubheadline}
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href={config.primaryActionUrl || whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: config.palette.primary, color: "#fff" }}
            >
              Agendar consulta
            </a>
            {config.gbpData && config.gbpData.rating >= 4 && (
              <div className="inline-flex items-center gap-2 text-sm" style={{ color: `${config.palette.text}60` }}>
                <span style={{ color: config.palette.accent }}>★</span>
                {config.gbpData.rating.toFixed(1)} · {config.gbpData.reviewCount} avaliações
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function RatingBadge() {
  const hasRating = config.gbpData && config.gbpData.rating >= 4;
  if (!hasRating) return null;
  return (
    <FadeIn delay={0}>
      <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
        <StarIcon />
        <span className="text-white text-sm font-semibold">{config.gbpData!.rating.toFixed(1)} no Google</span>
        <span className="text-white/70 text-sm">· {config.gbpData!.reviewCount} avaliações</span>
      </div>
    </FadeIn>
  );
}

function CtaButtons({ white = false }: { white?: boolean }) {
  const whatsappUrl = buildWhatsAppUrl(config.phone);
  const textClass = white ? "text-white" : "";
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
      <a
        href={config.primaryActionUrl || whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        <WhatsAppIcon />
        {config.primaryAction === "whatsapp" ? "Solicitar orçamento" : "Falar agora"}
      </a>
      <a
        href="/servicos"
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 hover:bg-white/10 transition-all duration-200 ${white ? "text-white border-white/50 hover:border-white" : "border-gray-300 hover:border-gray-500"}`}
      >
        Ver serviços
      </a>
    </div>
  );
}

function NeighborhoodTags() {
  return (
    <div className="flex flex-wrap gap-2 mt-8 items-center md:justify-start justify-center">
      {config.neighborhoods.slice(0, 3).map((n) => (
        <span key={n} className="text-sm text-white/80 bg-white/10 border border-white/20 rounded-full px-3 py-1">{n}</span>
      ))}
      {config.neighborhoods.length > 3 && <span className="text-sm text-white/70">+{config.neighborhoods.length - 3} bairros</span>}
    </div>
  );
}

function ScrollArrow() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.opacity = "1"; return; }
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    const t = setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, delay * 1000 + 100);
    return () => clearTimeout(t);
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
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbc04" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
}
function WhatsAppIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
}
