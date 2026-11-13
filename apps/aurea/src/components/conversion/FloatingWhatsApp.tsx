"use client";

import { useEffect, useState } from "react";
import { whatsappHref } from "@/lib/whatsapp";
import { cx } from "@/lib/utils";
import { useTreatmentContext } from "./useTreatmentContext";

const SHOW_AFTER_PX = 480;

/**
 * Desktop (lg+) floating WhatsApp button. Appears after the hero so it does
 * not duplicate the hero CTA on first view.
 */
export function FloatingWhatsApp() {
  const treatment = useTreatmentContext();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const intent = treatment ? ({ kind: "treatment", treatmentName: treatment.messageName } as const) : ({ kind: "evaluation" } as const);

  return (
    <a
      href={whatsappHref(intent)}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
      data-destination="whatsapp"
      data-cta-location="floating"
      data-treatment={treatment?.slug}
      aria-label="Agendar avaliação pelo WhatsApp (abre em nova aba)"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={cx(
        "fixed bottom-5 right-5 z-30 hidden h-14 items-center gap-3 bg-espresso px-5 text-button font-semibold uppercase text-ivory transition-[opacity,transform,background-color] hover:bg-umber lg:inline-flex",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
      </svg>
      WhatsApp
    </a>
  );
}
