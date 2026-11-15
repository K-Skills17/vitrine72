"use client";

import { useEffect } from "react";

/**
 * Marks [data-reveal] elements as revealed when they enter the viewport.
 * Content is visible without JS; the hidden start state only applies once
 * this runs (html.js-reveal) and motion is allowed (see globals.css).
 */
export default function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      // Already on screen at load: show immediately, no animation.
      if (el.getBoundingClientRect().top < window.innerHeight) el.setAttribute("data-revealed", "");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
