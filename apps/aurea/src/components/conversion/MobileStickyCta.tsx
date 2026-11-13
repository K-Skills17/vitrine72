"use client";

import { ButtonLink } from "@/components/ui/Button";
import { ctaLabels } from "@/content/navigation";
import { whatsappHref } from "@/lib/whatsapp";
import { useTreatmentContext } from "./useTreatmentContext";

/**
 * Bottom bar below lg. Replaces the floating button on small screens (never
 * both). The body reserves --spacing-sticky-cta at the bottom so the bar
 * never covers content. Goes through the qualification gate like every
 * WhatsApp link.
 */
export function MobileStickyCta() {
  const treatment = useTreatmentContext();
  const intent = treatment ? ({ kind: "treatment", treatmentName: treatment.messageName } as const) : ({ kind: "evaluation" } as const);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex h-sticky-cta items-center border-t border-line bg-ivory/95 px-gutter backdrop-blur-sm lg:hidden">
      <ButtonLink
        href={whatsappHref(intent)}
        fullWidth
        data-track="whatsapp_click"
        data-destination="whatsapp"
        data-cta-location="sticky-mobile"
        data-treatment={treatment?.slug}
        aria-label={`${ctaLabels.primary} (abre o WhatsApp em nova aba)`}
      >
        {treatment ? `Avaliação · ${treatment.name}` : ctaLabels.primary}
      </ButtonLink>
    </div>
  );
}
