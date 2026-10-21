export type VerticalId =
  | "estetica"
  | "moveis-planejados"
  | "energia-solar"
  | "servicos-urgentes"
  | "fisioterapia-pilates"
  | "buffet-eventos"
  | "generico";

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

export interface PageConfig {
  slug: string;
  title: string;
  template: string;
}

export interface VerticalConfig {
  id: VerticalId;
  schemaOrgType: string;
  pages: PageConfig[];
  layoutVariants: number[];
  fontPairs: FontPair[];
  palettes: ColorPalette[];
  signatureElement: string | null;
  signatureElementHidden?: string;
  /** Design/UX principles that make top sites in this niche stand out */
  designPrinciples: string[];
  /** Conversion patterns that work specifically for this niche */
  conversionPatterns: string[];
  /** Animation patterns appropriate for the niche's emotional tone */
  animationHints: string[];
  /** Mobile-specific UX patterns critical for this niche */
  mobilePatterns: string[];
}

export interface GeneratedSiteConfig {
  projectId: string;
  slug: string;
  vertical: VerticalId;
  businessName: string;
  address: string;
  phone: string;
  hours: string;
  hoursArray: string[];
  neighborhoods: string[];
  services: Array<{ name: string; description: string; price: string | null }>;
  faqs: Array<{ q: string; a: string }>;
  gbpLink: string | null;
  instagramLink: string | null;
  primaryAction: string;
  primaryActionUrl: string;
  palette: ColorPalette;
  fontPair: FontPair;
  layoutVariant: number;
  photos: string[];
  logoPath: string | null;
  gbpData: GBPData | null;
  copyBlocks: CopyBlocks;
  selfEditSheetUrl: string | null;
  updatedAt: string;
  /** "minimal" | "standard" | "rich" — drives animation complexity in the template */
  animationProfile: "minimal" | "standard" | "rich";
  /** Whether the vertical's signature element has enough content to be enabled */
  signatureElementEnabled: boolean;
}

export interface GBPData {
  placeId: string;
  rating: number;
  reviewCount: number;
  reviews: GBPReview[];
  competitors: Competitor[];
  customerPhrases: string[];
}

export interface GBPReview {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Competitor {
  name: string;
  rating: number;
  reviewCount: number;
  hasWebsite: boolean;
}

export interface CopyBlocks {
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
  serviceDescriptions: Record<string, string>;
  faqAnswers: Record<string, string>;
  sourceFacts: Record<string, string[]>;
}
