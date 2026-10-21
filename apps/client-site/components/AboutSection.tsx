"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { config, getPhotoUrl } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function AboutSection() {
  const aboutPhoto = config.photos.length >= 2 ? getPhotoUrl(config.photos[1]) : null;
  const whatsappUrl = buildWhatsAppUrl(config.phone);

  return (
    <section className="section-padding bg-[var(--color-bg)]" aria-label="Sobre nós">
      <div className="container-narrow px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          {aboutPhoto && (
            <ScrollReveal>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={aboutPhoto}
                  alt={`${config.businessName} — sobre nós`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          )}

          {/* Text */}
          <ScrollReveal delay={0.1}>
            <div className={!aboutPhoto ? "md:col-span-2 max-w-2xl" : ""}>
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--color-accent)" }}
              >
                Sobre nós
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-text)] mb-6">
                {config.businessName}
              </h2>

              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed mb-8">
                {config.copyBlocks.aboutText.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Stats row */}
              {config.gbpData && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <StatBox
                    value={config.gbpData.rating.toFixed(1) + "★"}
                    label="no Google"
                    color="var(--color-primary)"
                  />
                  <StatBox
                    value={String(config.gbpData.reviewCount) + "+"}
                    label="avaliações"
                    color="var(--color-primary)"
                  />
                  <StatBox
                    value={String(config.services.length)}
                    label="serviços"
                    color="var(--color-primary)"
                  />
                </div>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                Fale conosco
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function StatBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="text-center p-4 rounded-xl" style={{ backgroundColor: "var(--color-secondary)" }}>
      <p className="text-2xl font-display font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
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
    el.style.transform = "translateY(24px)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
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
