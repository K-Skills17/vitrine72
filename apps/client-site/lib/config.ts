import rawConfig from "../site-config.json";
import { whatsappHref } from "./whatsapp";

export type AnimationProfile = "minimal" | "standard" | "rich";

export interface ColorPalette {
  id: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface FontPair {
  id: string;
  display: string;
  body: string;
  googleFontsUrl: string;
}

export interface Service {
  name: string;
  description: string;
  price: string | null;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface GBPReview {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface GBPData {
  placeId: string;
  rating: number;
  reviewCount: number;
  reviews: GBPReview[];
  competitors: Array<{ name: string; rating: number; reviewCount: number; hasWebsite: boolean }>;
  customerPhrases: string[];
}

export interface CopyBlocks {
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
  serviceDescriptions: Record<string, string>;
  faqAnswers: Record<string, string>;
  sourceFacts: Record<string, unknown>;
}

/*
 * Variant names are the builder's (apps/builder/src/generate-config.ts) and
 * are kept for compatibility. What each one renders in this template:
 */
export type HeroStyle =
  | "fullscreen-photo"      // headline above a wide photo band (never text over a darkened photo)
  | "split-text-left"       // golden split: text left, portrait photo right
  | "minimal-dark"          // typographic hero on the inverse band, no photo
  | "editorial-asymmetric"; // oversized headline, offset photo and lead below

export type CardStyle =
  | "card-shadow"    // numbered ruled index of services
  | "card-bordered"  // two-column ruled list
  | "card-dark"      // services on the inverse band
  | "card-minimal";  // large rows, one per service

export type AboutStyle =
  | "about-split"       // photo and text on a golden split
  | "about-centered"    // statement: about text set large beside a label column
  | "about-credentials";// text plus a ruled list of real facts (area, hours, Google rating)

export interface SiteConfig {
  projectId: string;
  slug: string;
  vertical: string;
  businessName: string;
  address: string;
  phone: string;
  hours: string;
  hoursArray: string[];
  neighborhoods: string[];
  services: Service[];
  faqs: FAQ[];
  gbpLink: string | null;
  instagramLink: string | null;
  primaryAction: string;
  primaryActionUrl: string;
  palette: ColorPalette;
  fontPair: FontPair;
  layoutVariant: number;
  heroStyle: HeroStyle;
  cardStyle: CardStyle;
  aboutStyle: AboutStyle;
  photos: string[];
  logoPath: string | null;
  gbpData: GBPData | null;
  copyBlocks: CopyBlocks;
  selfEditSheetUrl: string | null;
  updatedAt: string;
  animationProfile: AnimationProfile;
  signatureElementEnabled: boolean;
  jsonLd?: Record<string, unknown>[] | Record<string, unknown>;
}

export const config = rawConfig as SiteConfig;

export function getServiceDescription(config: SiteConfig, serviceName: string): string {
  return config.copyBlocks.serviceDescriptions[serviceName] || "";
}

export function getFaqAnswer(config: SiteConfig, question: string): string {
  return config.copyBlocks.faqAnswers[question] || "";
}

/** Storage path → public URL. Absolute URLs and site-relative paths pass through. */
export function getPhotoUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return "";
  return `${supabaseUrl}/storage/v1/object/public/uploads/${path}`;
}

/** Photo by position, or null. Sections pick different indices so a photo is not repeated. */
export function getPhoto(config: SiteConfig, index: number): string | null {
  const path = config.photos[index];
  const url = path ? getPhotoUrl(path) : "";
  return url || null;
}

const REGULATED = ["estetica", "fisio", "odonto", "dent", "medic", "clinic", "nutri", "psico", "advoca", "saude"];

/** Health and legal businesses talk about evaluations, not quotes. */
export function isRegulatedVertical(vertical: string): boolean {
  const v = vertical.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return REGULATED.some((k) => v.includes(k));
}

export interface Cta {
  href: string;
  label: string;
  external: boolean;
}

/** The site's primary action, from the intake's primary_action. */
export function primaryCta(config: SiteConfig): Cta {
  const regulated = isRegulatedVertical(config.vertical);
  if (config.primaryAction === "phone") {
    return { href: config.primaryActionUrl, label: "Ligar agora", external: false };
  }
  if (config.primaryAction === "form") {
    // The template has no form backend, so a "form" client gets a WhatsApp
    // conversation with form-like wording rather than a link to a page
    // that has no form.
    return {
      href: whatsappHref(config.phone, config.businessName, { kind: "contact" }),
      label: regulated ? "Agendar avaliação" : "Pedir orçamento",
      external: true,
    };
  }
  return {
    href: config.primaryActionUrl || whatsappHref(config.phone, config.businessName),
    label: regulated ? "Agendar pelo WhatsApp" : "Conversar pelo WhatsApp",
    external: true,
  };
}

/** Label for a per-service call to action. */
export function serviceCtaLabel(config: SiteConfig): string {
  return isRegulatedVertical(config.vertical) ? "Agendar avaliação" : "Pedir orçamento";
}

