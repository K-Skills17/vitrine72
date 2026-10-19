/**
 * JSON-LD generators for the Vitrine72 marketing site.
 * AI visibility layer — section 8.4 of the spec.
 */

export function generateMarketingJsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrine72.com.br";
  const phone = process.env.NEXT_PUBLIC_WHATSAPP;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const legalName = process.env.LEGAL_NAME ?? "Vitrine72";

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Vitrine72",
    legalName,
    url: siteUrl,
    description:
      "Serviço de criação de sites profissionais para negócios locais em São Paulo. Site até 5 páginas com prévia em 72 horas úteis.",
    areaServed: {
      "@type": "State",
      name: "São Paulo",
      "@id": "https://www.wikidata.org/wiki/Q175",
    },
    ...(phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: `+55${phone}`,
            availableLanguage: "Portuguese",
          },
        }
      : {}),
    ...(email ? { email } : {}),
    sameAs: [],
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
    },
  };
}

/**
 * Generate LocalBusiness JSON-LD for a generated client site.
 * Called by the site generator.
 */
export function generateLocalBusinessJsonLd(params: {
  type: string;
  name: string;
  address: string;
  phone: string;
  hours: string[];
  areaServed: string[];
  services: Array<{ name: string; description: string }>;
  faqs: Array<{ q: string; a: string }>;
  sameAs: string[];
  url: string;
  updatedAt: string;
}) {
  const {
    type,
    name,
    address,
    phone,
    hours,
    areaServed,
    services,
    faqs,
    sameAs,
    url,
    updatedAt,
  } = params;

  const entities: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": type,
      name,
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
      },
      telephone: phone,
      openingHoursSpecification: hours.map((h) => {
        const [days, time] = h.split(" ");
        const [opens, closes] = time?.split("-") ?? ["", ""];
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: days?.split(","),
          opens,
          closes,
        };
      }),
      areaServed: areaServed.map((a) => ({
        "@type": "Place",
        name: a,
      })),
      sameAs,
      url,
      dateModified: updatedAt,
    },
    ...services.map((s) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      provider: { "@type": type, name },
      name: s.name,
      description: s.description,
    })),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return entities;
}
