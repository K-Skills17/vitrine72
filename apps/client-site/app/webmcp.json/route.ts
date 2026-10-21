import { config } from "@/lib/config";

export function GET() {
  const baseUrl = `https://${config.slug}.vitrine72.com.br`;
  const manifest = {
    schema: "webmcp/v1",
    name: `${config.businessName} — Assistente`,
    description: `Informações sobre ${config.businessName}: serviços, localização, horários e contato.`,
    catalogEndpoint: `${baseUrl}/ai-catalog.json`,
    llmsEndpoint: `${baseUrl}/llms.txt`,
    tools: [
      {
        name: "get_business_info",
        description: `Retorna informações gerais sobre ${config.businessName}: endereço, horários e área atendida.`,
        inputSchema: { type: "object", properties: {}, required: [] },
      },
      {
        name: "get_services",
        description: "Retorna lista de serviços disponíveis com descrições e preços.",
        inputSchema: { type: "object", properties: {}, required: [] },
      },
      {
        name: "get_contact",
        description: "Retorna WhatsApp e link de contato direto.",
        inputSchema: { type: "object", properties: {}, required: [] },
      },
      {
        name: "get_faqs",
        description: "Retorna perguntas frequentes e respostas sobre os serviços.",
        inputSchema: { type: "object", properties: {}, required: [] },
      },
    ],
  };

  return Response.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
}
