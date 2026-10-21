import { config } from "@/lib/config";

export function GET() {
  const lines = [
    `# ${config.businessName}`,
    ``,
    `${config.businessName} é um negócio localizado em ${config.address}.`,
    ``,
    `## Serviços`,
    ``,
    ...config.services.map(
      (s) => `- ${s.name}${s.price ? ` (${s.price})` : ""}`
    ),
    ``,
    `## Área atendida`,
    ``,
    `${config.neighborhoods.join(", ")}, São Paulo.`,
    ``,
    `## Horários`,
    ``,
    config.hours,
    ``,
    `## Contato`,
    ``,
    `- WhatsApp: ${config.phone}`,
    config.gbpLink ? `- Google: ${config.gbpLink}` : null,
    config.instagramLink ? `- Instagram: ${config.instagramLink}` : null,
    ``,
    `Atualizado em: ${config.updatedAt}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return new Response(lines, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
