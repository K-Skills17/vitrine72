"use client";

import { useEffect } from "react";

/**
 * Reveals `[data-reveal]` elements below the fold as they scroll in.
 * Never hides content already on screen or without JavaScript; does nothing
 * under prefers-reduced-motion. Same rules as the ÁUREA demo.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? 0);
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.dataset.reveal = "shown";
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.dataset.reveal === "shown" || el.dataset.reveal === "pending") return;
      if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: never hide it
      el.dataset.reveal = "pending";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
