"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { config, getPhotoUrl, type AboutStyle } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function AboutSection() {
  const style: AboutStyle = (config.aboutStyle as AboutStyle) ?? "about-split";

  if (style === "about-centered")    return <AboutCentered />;
  if (style === "about-credentials") return <AboutCredentials />;
  return <AboutSplit />;
}

// ─── Variant 1: Split photo + text (clean-clinical, vibrant-boutique) ─────────

function AboutSplit() {
  const aboutPhoto = config.photos.length >= 2 ? getPhotoUrl(config.photos[1]) : null;
  const whatsappUrl = buildWhatsAppUrl(config.phone);

  return (
    <section className="section-padding bg-[var(--color-bg)]" aria-label="Sobre nós">
      <div className="container-narrow px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {aboutPhoto && (
            <ScrollReveal>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image src={aboutPhoto} alt={`${config.businessName} — sobre nós`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
            </ScrollReveal>
          )}
          <ScrollReveal delay={0.1}>
            <div className={!aboutPhoto ? "md:col-span-2 max-w-2xl" : ""}>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-accent)" }}>
                Sobre nós
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-text)] mb-6">
                {config.businessName}
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed mb-8">
                {config.copyBlocks.aboutText.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
              </div>
              {config.gbpData && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <StatBox value={config.gbpData.rating.toFixed(1) + "★"} label="no Google" />
                  <StatBox value={String(config.gbpData.reviewCount) + "+"} label="avaliações" />
                  <StatBox value={String(config.services.length)} label="serviços" />
                </div>
              )}
              <a href={buildWhatsAppUrl(config.phone)} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                Fale conosco
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// ─── Variant 2: Centered dark narrative (dark-luxury) ─────────────────────────

function AboutCentered() {
  const whatsappUrl = buildWhatsAppUrl(config.phone);

  return (
    <section
      className="section-padding"
      aria-label="Sobre nós"
      style={{ backgroundColor: `${config.palette.text}06` }}
    >
      <div className="container-narrow px-4 max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <div className="w-8 h-0.5 mx-auto mb-8" style={{ backgroundColor: config.palette.accent }} />
          <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: config.palette.accent }}>
            Nossa história
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight" style={{ color: config.palette.text }}>
            {config.businessName}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="text-lg leading-relaxed mb-10 space-y-4" style={{ color: `${config.palette.text}70` }}>
            {config.copyBlocks.aboutText.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </ScrollReveal>

        {config.gbpData && (
          <ScrollReveal delay={0.2}>
            <div className="flex justify-center gap-12 mb-10 py-8 border-y" style={{ borderColor: `${config.palette.text}10` }}>
              <div>
                <div className="text-4xl font-display font-bold mb-1" style={{ color: config.palette.accent }}>
                  {config.gbpData.rating.toFixed(1)}★
                </div>
                <div className="text-xs uppercase tracking-widest" style={{ color: `${config.palette.text}40` }}>Google</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold mb-1" style={{ color: config.palette.accent }}>
                  {config.gbpData.reviewCount}+
                </div>
                <div className="text-xs uppercase tracking-widest" style={{ color: `${config.palette.text}40` }}>Avaliações</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold mb-1" style={{ color: config.palette.accent }}>
                  {config.services.length}
                </div>
                <div className="text-xs uppercase tracking-widest" style={{ color: `${config.palette.text}40` }}>Serviços</div>
              </div>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.3}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm tracking-widest uppercase transition-all hover:opacity-80"
            style={{ backgroundColor: config.palette.accent, color: config.palette.background }}
          >
            Agendar consulta
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── Variant 3: Credentials layout (editorial-expert, conversion-driven) ──────

function AboutCredentials() {
  const aboutPhoto = config.photos.length >= 2 ? getPhotoUrl(config.photos[1]) : null;
  const whatsappUrl = buildWhatsAppUrl(config.phone);

  const credentials = [
    config.gbpData?.rating ? `${config.gbpData.rating.toFixed(1)}★ no Google` : null,
    config.gbpData?.reviewCount ? `${config.gbpData.reviewCount}+ avaliações` : null,
    config.neighborhoods[0] ? `Atende em ${config.neighborhoods[0]}` : null,
    config.services.length > 0 ? `${config.services.length} serviços disponíveis` : null,
  ].filter(Boolean) as string[];

  return (
    <section className="section-padding bg-[var(--color-secondary)]" aria-label="Sobre nós">
      <div className="container-narrow px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-accent)" }}>
              Sobre
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-text)] mb-6">
              {config.businessName}
            </h2>
            <div className="text-gray-600 leading-relaxed mb-8 space-y-3">
              {config.copyBlocks.aboutText.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
              Fale conosco
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="space-y-4">
              {/* Credential pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {credentials.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full"
                    style={{ backgroundColor: "var(--color-bg)", color: "var(--color-primary)", border: "1px solid var(--color-primary)" + "30" }}
                  >
                    <span style={{ color: "var(--color-accent)" }}>✓</span> {c}
                  </span>
                ))}
              </div>

              {/* Photo if available */}
              {aboutPhoto && (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                  <Image src={aboutPhoto} alt={config.businessName} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              )}

              {/* Neighborhood list */}
              {config.neighborhoods.length > 0 && (
                <div className="pt-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Bairros atendidos</p>
                  <div className="flex flex-wrap gap-2">
                    {config.neighborhoods.map((n) => (
                      <span key={n} className="text-xs text-gray-500 bg-white border border-gray-100 rounded-full px-3 py-1">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-4 rounded-xl" style={{ backgroundColor: "var(--color-secondary)" }}>
      <p className="text-2xl font-display font-bold" style={{ color: "var(--color-primary)" }}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
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
          el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
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
