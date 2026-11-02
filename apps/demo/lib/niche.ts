export type QualifierStep =
  | {
      id: string;
      type: "text";
      label: string;
      placeholder: string;
    }
  | {
      id: string;
      type: "choice";
      label: string;
      options: string[];
    };

export interface QualifierConfig {
  steps: QualifierStep[];
  messageTemplate: string;
  lowFitAnswers: string[];
  lowFitMode: "tag" | "soft";
  timingLabel: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  qualifierPreselect: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface NicheConfig {
  niche: string;
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  whatsappNumber: string;

  primaryColor: string;
  primaryLight: string;
  primaryDark: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;

  fontDisplay: string;
  fontBody: string;
  googleFontsUrl: string;

  services: ServiceItem[];
  howItWorks: HowItWorksStep[];
  faqs: FAQItem[];

  qualifier: QualifierConfig;

  tier: 1 | 2 | 3;
  features: {
    qualifier: boolean;
    chatbot: boolean;
    multiPage: boolean;
    serviceFilter: boolean;
    lowFitMode: "tag" | "soft";
  };

  privacyPolicyExtra?: string;
  metaTitle: string;
  metaDescription: string;
}

let _config: NicheConfig | null = null;

export function getNicheConfig(): NicheConfig {
  if (_config) return _config;

  const niche = process.env.NEXT_PUBLIC_NICHE ?? "estetica";

  if (niche === "planejados") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _config = require("../config/planejados").default as NicheConfig;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _config = require("../config/estetica").default as NicheConfig;
  }

  return _config!;
}
