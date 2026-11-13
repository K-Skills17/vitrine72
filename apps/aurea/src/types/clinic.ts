/** A value that must be replaced before the site represents a real clinic. */
export interface Placeholder {
  value: string;
  isPlaceholder: true;
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export interface SocialLink {
  label: string;
  /** null while the profile does not exist; the link is then rendered as plain text. */
  href: string | null;
}

export interface ClinicConfig {
  name: string;
  descriptor: string;
  /** Used in prefilled WhatsApp messages: "Clínica ÁUREA". */
  messageName: string;
  siteUrl: string;
  locale: string;
  /** True while ÁUREA is a fictional demonstration. Drives the demo notices. */
  isDemo: boolean;
  allowIndexing: boolean;
  contact: {
    /** Digits only, 55 + DDD + number. null = not configured. */
    whatsappNumber: string | null;
    /** Digits only, 55 + DDD + number. null = phone links hidden. */
    phoneNumber: string | null;
    email: Placeholder;
  };
  address: {
    street: Placeholder;
    district: Placeholder;
    city: Placeholder;
  };
  openingHours: OpeningHours[];
  social: SocialLink[];
  legal: {
    companyName: Placeholder;
    cnpj: Placeholder;
    technicalResponsible: Placeholder;
    technicalRegistration: Placeholder;
  };
}
