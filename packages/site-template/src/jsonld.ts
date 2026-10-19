/**
 * JSON-LD generators for client sites.
 * Shared between the site-template generator and the web app.
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
}): unknown[] {
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
        const parts = h.split(" ");
        const days = parts[0] ?? "";
        const time = parts[1] ?? "";
        const [opens, closes] = time.split("-");
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: days.split(","),
          opens: opens ?? "",
          closes: closes ?? "",
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
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name,
          item: url,
        },
      ],
    },
  ];

  return entities;
}
