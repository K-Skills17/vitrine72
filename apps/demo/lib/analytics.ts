"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "qualifier_open"
  | `qualifier_step_${number}`
  | "qualifier_complete"
  | "whatsapp_redirect"
  | "lead_low_fit";

export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, string>
): void {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params ?? {});
    }
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", event, params ?? {});
    }
  } catch {
    // analytics must never break the page
  }
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const clean = number.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buildQualifierMessage(
  template: string,
  answers: Record<string, string>
): string {
  return template
    .replace("{name}", answers["name"] ?? "")
    .replace("{service}", answers["service"] ?? "")
    .replace("{timing}", answers["timing"] ?? "")
    .replace("{budget}", answers["budget"] ?? "");
}
