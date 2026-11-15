/**
 * The only place WhatsApp links are built. Every message names the business
 * and, when known, the service or page the visitor came from.
 */

export type WhatsAppContext =
  | { kind: "general" }
  | { kind: "service"; serviceName: string }
  | { kind: "contact" };

/** Digits only, with the 55 country code. Returns null for unusable input. */
export function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const intl = digits.startsWith("55") ? digits : `55${digits}`;
  return /^55[1-9][0-9]\d{8,9}$/.test(intl) ? intl : null;
}

export function buildWhatsAppMessage(businessName: string, context: WhatsAppContext): string {
  const opening = `Olá! Vi o site da ${businessName}`;
  switch (context.kind) {
    case "service":
      return `${opening} e gostaria de saber mais sobre ${context.serviceName}.`;
    case "contact":
      return `${opening} e gostaria de falar com vocês.`;
    case "general":
      return `${opening} e gostaria de mais informações.`;
  }
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const intl = normalizePhone(phone);
  const text = `text=${encodeURIComponent(message)}`;
  return intl ? `https://wa.me/${intl}?${text}` : `https://wa.me/?${text}`;
}

export function whatsappHref(phone: string, businessName: string, context: WhatsAppContext = { kind: "general" }): string {
  return buildWhatsAppUrl(phone, buildWhatsAppMessage(businessName, context));
}

/** "11991234567" → "(11) 99123-4567". Returns the input unchanged if it is not a Brazilian number. */
export function formatPhone(phone: string): string {
  const intl = normalizePhone(phone);
  if (!intl) return phone;
  const local = intl.slice(2);
  const ddd = local.slice(0, 2);
  const rest = local.slice(2);
  const cut = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, cut)}-${rest.slice(cut)}`;
}

/** tel: link with country code. */
export function telHref(phone: string): string {
  return `tel:+${normalizePhone(phone) ?? phone.replace(/\D/g, "")}`;
}
