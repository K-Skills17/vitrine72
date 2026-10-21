import { config, getServiceDescription, getFaqAnswer } from "@/lib/config";

export function GET() {
  const catalog = {
    schema: "vitrine72/ai-catalog/v1",
    generatedAt: config.updatedAt,
    businessName: config.businessName,
    vertical: config.vertical,
    description: config.copyBlocks.heroSubheadline || config.copyBlocks.heroHeadline,
    location: {
      address: config.address,
      neighborhoods: config.neighborhoods,
      city: "São Paulo",
      state: "SP",
      country: "BR",
    },
    contact: {
      whatsapp: config.phone,
      primaryCTA: config.primaryAction,
      primaryCTAUrl: config.primaryActionUrl,
    },
    hours: config.hours,
    services: config.services.map((s) => ({
      name: s.name,
      description: getServiceDescription(config, s.name) || s.description,
      price: s.price,
    })),
    faqs: config.faqs.map((f) => ({
      question: f.q,
      answer: getFaqAnswer(config, f.q) || f.a,
    })),
    ratings: config.gbpData
      ? {
          google: {
            score: config.gbpData.rating,
            count: config.gbpData.reviewCount,
            placeId: config.gbpData.placeId,
          },
        }
      : null,
    socialLinks: {
      google: config.gbpLink,
      instagram: config.instagramLink,
    },
    capabilities: {
      languages: ["pt-BR"],
      regions: config.neighborhoods.map((n) => `${n}, São Paulo`),
      bookingViaWhatsApp: config.primaryAction === "whatsapp",
    },
  };

  return Response.json(catalog, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
