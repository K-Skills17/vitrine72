"use client";

import { useEffect, useRef } from "react";
import { config } from "@/lib/config";

export default function ReviewsStrip() {
  if (!config.gbpData || config.gbpData.reviews.length === 0) return null;

  const { gbpData } = config;

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Avaliações"
    >
      <div className="container-narrow px-4">
        <ScrollReveal>
          <div className="text-center mb-10">
            {/* Big rating */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <span
                className="text-5xl font-display font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {gbpData.rating.toFixed(1)}
              </span>
              <div className="flex flex-col items-start gap-1">
                <StarRow rating={gbpData.rating} size={22} />
                <span className="text-sm text-gray-500">
                  {gbpData.reviewCount} avaliações no Google
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-text)]">
              O que nossos clientes dizem
            </h2>
          </div>
        </ScrollReveal>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gbpData.reviews.slice(0, 3).map((review, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
                <StarRow rating={review.rating} size={16} />
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {review.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    {review.author}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {config.gbpLink && (
          <ScrollReveal delay={0.3}>
            <div className="text-center mt-8">
              <a
                href={config.gbpLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                style={{ color: "var(--color-primary)" }}
              >
                Ver todas as avaliações no Google
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

function StarRow({ rating, size }: { rating: number; size: number }) {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < full);
  return (
    <div className="flex gap-0.5" aria-label={`${rating} estrelas`}>
      {stars.map((filled, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#fbbc04" : "#e0e0e0"} aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
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
