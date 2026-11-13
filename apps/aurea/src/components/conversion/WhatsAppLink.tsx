import type { ReactNode } from "react";
import { ButtonLink, type ButtonSize, type ButtonTone, type ButtonVariant } from "@/components/ui/Button";
import { ctaLabels } from "@/content/navigation";
import { whatsappHref, type CtaLocation, type WhatsAppIntent } from "@/lib/whatsapp";

interface WhatsAppLinkProps {
  location: CtaLocation;
  intent?: WhatsAppIntent;
  /** Slug for analytics when the CTA belongs to a treatment. */
  treatmentSlug?: string;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * The WhatsApp CTA. Server Component: tracking is handled by the delegated
 * AnalyticsListener through data attributes.
 */
export function WhatsAppLink({
  location,
  intent = { kind: "evaluation" },
  treatmentSlug,
  variant = "primary",
  tone = "light",
  size,
  fullWidth,
  className,
  children = ctaLabels.primary,
}: WhatsAppLinkProps) {
  return (
    <ButtonLink
      href={whatsappHref(intent)}
      variant={variant}
      tone={tone}
      size={size}
      fullWidth={fullWidth}
      className={className}
      data-track="whatsapp_click"
      data-destination="whatsapp"
      data-cta-location={location}
      data-treatment={treatmentSlug}
      aria-label={typeof children === "string" ? `${children} (abre o WhatsApp em nova aba)` : undefined}
    >
      {children}
    </ButtonLink>
  );
}
