/**
 * Analytics configuration. With no provider configured every `track()` call
 * is a no-op. See docs/CONVERSION_TRACKING.md.
 */
export const analyticsConfig = {
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID?.trim() || null,
} as const;

export const analyticsEvents = [
  "whatsapp_click",
  "treatment_view",
  "appointment_cta_click",
  "contact_form_start",
  "contact_form_submit",
  "phone_click",
  "qualifier_open",
  "qualifier_step",
  "qualifier_complete",
  "lead_low_fit",
  "whatsapp_redirect",
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

/**
 * The only parameters that may be sent. Deliberately excludes anything
 * personal: no names, phone numbers, form contents or health information.
 */
export interface AnalyticsParams {
  page_path?: string;
  treatment_slug?: string;
  cta_location?: string;
  destination?: "whatsapp" | "phone" | "form" | "internal";
  /** Qualifier step number ("1"–"4"). Never the answer itself. */
  qualifier_step?: string;
}
