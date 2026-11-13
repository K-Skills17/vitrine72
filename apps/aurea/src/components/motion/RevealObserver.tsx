"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for every `[data-reveal]` element, so sections stay Server
 * Components. Rules (docs/DESIGN_SYSTEM.md, Motion):
 * - Content is never hidden on first paint: only elements still below the
 *   viewport after mount are set to "pending"; anything already visible is
 *   left alone. Without JavaScript nothing is ever hidden.
 * - prefers-reduced-motion: nothing is touched.
 * - `data-reveal-delay="160"` staggers siblings (ms).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? 0);
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.dataset.reveal = "shown";
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const fold = window.innerHeight;
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.dataset.reveal === "shown" || el.dataset.reveal === "pending") return;
      if (el.getBoundingClientRect().top < fold) return; // already visible: never hide it
      el.dataset.reveal = "pending";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
