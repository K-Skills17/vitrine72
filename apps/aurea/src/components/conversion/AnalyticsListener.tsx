"use client";

import { useEffect } from "react";
import { isAnalyticsEvent, track } from "@/lib/analytics";

/**
 * One delegated click listener for the whole site. Links opt in with data
 * attributes, so CTAs can stay Server Components:
 *
 *   data-track="whatsapp_click" data-cta-location="hero" data-treatment="skinbooster"
 */
export function AnalyticsListener() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-track]");
      const name = target?.dataset.track;
      if (!target || !name || !isAnalyticsEvent(name)) return;
      track(name, {
        cta_location: target.dataset.ctaLocation,
        treatment_slug: target.dataset.treatment,
        destination: target.dataset.destination as "whatsapp" | "phone" | "form" | "internal" | undefined,
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
