import rawConfig from "../site-config.json";

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

export type HeroStyle =
  | "fullscreen-photo"      // full-bleed photo bg, centered text — default
  | "split-text-left"       // text left column, photo right — clinical/editorial
  | "minimal-dark"          // dark palette bg, oversized headline, no photo
  | "editorial-asymmetric"; // huge display text that overflows, doctor-led

export type CardStyle =
  | "card-shadow"    // white bg, rounded, subtle shadow — default
  | "card-bordered"  // border only, transparent bg, text-heavy
  | "card-dark"      // dark primary bg, white text — luxury
  | "card-minimal";  // no box decoration, just content + arrow

export type AboutStyle =
  | "about-split"       // photo left, text right — default
  | "about-centered"    // centered narrative, no forced columns — luxury/editorial
  | "about-credentials";// text + credential/stat pills prominently shown

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

export function getPhotoUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !path) return "";
  return `${supabaseUrl}/storage/v1/object/public/uploads/${path}`;
}

export function getHeroPhoto(config: SiteConfig): string | null {
  if (!config.photos.length) return null;
  return getPhotoUrl(config.photos[0]);
}
