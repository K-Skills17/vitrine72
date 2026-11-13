import { siteConfig } from "@/config/site";

/**
 * The only place WhatsApp URLs are built. Components call `whatsappHref()`
 * and never assemble `wa.me` links themselves.
 */

/** Where on the page a CTA sits. Used for analytics, never in the message. */
export type CtaLocation =
  | "header"
  | "mobile-nav"
  | "hero"
  | "treatment-hero"
  | "treatment-index"
  | "treatment-body"
  | "floating"
  | "sticky-mobile"
  | "final-cta"
  | "contact-page"
  | "footer";

export type WhatsAppIntent =
  | { kind: "evaluation" }
  | { kind: "treatment"; treatmentName: string }
  | { kind: "contact" };

const BASE_URL = "https://wa.me/";

/**
 * Normalises a Brazilian number to `55` + DDD (2 digits) + 8 or 9 digits.
 * Accepts numbers with or without the 55 country code and any punctuation.
 * Returns null if the result is not a plausible Brazilian number.
 */
export function normalizeBrazilianNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  if (!/^55[1-9][0-9]\d{8,9}$/.test(digits)) return null;
  // Mobile numbers (11 digits after 55) must start with 9.
  if (digits.length === 13 && digits[4] !== "9") return null;
  return digits;
}

/** Message sent after the qualification gate. Empty answers are left out. */
export function buildQualifiedMessage(
  answers: { name?: string; service?: string; timing?: string; budget?: string },
  clinicName = siteConfig.messageName,
): string {
  const lines = [
    answers.name ? `Olá! Sou ${answers.name} e vim pelo site da ${clinicName}.` : `Olá! Vim pelo site da ${clinicName}.`,
    answers.service && `Interesse: ${answers.service}`,
    answers.timing && `Quando: ${answers.timing}`,
    answers.budget && `Investimento previsto: ${answers.budget}`,
    "Gostaria de agendar uma avaliação.",
  ];
  return lines.filter(Boolean).join("\n");
}

export function buildWhatsAppMessage(intent: WhatsAppIntent, clinicName = siteConfig.messageName): string {
  const opening = `Olá! Estava conhecendo o site da ${clinicName}`;
  switch (intent.kind) {
    case "treatment":
      return `${opening} e gostaria de saber mais sobre ${intent.treatmentName} e como funciona a avaliação.`;
    case "contact":
      return `${opening} e gostaria de falar com a equipe.`;
    case "evaluation":
      return `${opening} e gostaria de agendar uma avaliação.`;
  }
}

/**
 * Builds a WhatsApp deep link. With no valid number configured, the link
 * still works: WhatsApp opens with the message and asks for a recipient.
 */
export function buildWhatsAppUrl(message: string, phone: string | null): string {
  const text = `text=${encodeURIComponent(message)}`;
  return phone ? `${BASE_URL}${phone}?${text}` : `${BASE_URL}?${text}`;
}

export const configuredWhatsAppNumber = normalizeBrazilianNumber(siteConfig.contact.whatsappNumber);

if (siteConfig.contact.whatsappNumber && !configuredWhatsAppNumber && process.env.NODE_ENV !== "production") {
  console.warn(
    `[whatsapp] NEXT_PUBLIC_WHATSAPP_NUMBER "${siteConfig.contact.whatsappNumber}" is not a valid Brazilian number; links will open without a recipient.`,
  );
}

export function whatsappHref(intent: WhatsAppIntent = { kind: "evaluation" }): string {
  return buildWhatsAppUrl(buildWhatsAppMessage(intent), configuredWhatsAppNumber);
}
