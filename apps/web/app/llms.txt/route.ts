import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrine72.com.br";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "PLACEHOLDER_WHATSAPP";
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "PLACEHOLDER_CONTACT_EMAIL";

export function GET(): NextResponse {
  const content = `# Vitrine72

Vitrine72 é um serviço de criação de sites profissionais para negócios locais em São Paulo, Brasil.

## O que fazemos

Criamos sites institucionais de até 5 páginas para pequenas e médias empresas em São Paulo.
A prévia do site fica pronta em até 3 dias úteis após o recebimento do briefing completo.
O site é publicado no mínimo 8 dias após a confirmação do pagamento.

## Serviços

- Site até 5 páginas: R$ 1.797 no Pix ou R$ 1.997 no cartão
- Pacote completo (site + Google Meu Negócio + agente IA): R$ 3.147 no Pix ou R$ 3.497 no cartão
- Manutenção e hospedagem: R$ 97 a cada 28 dias

## Área atendida

São Paulo (estado e capital). Negócios locais de todos os segmentos.

## Segmentos que atendemos

Estética e beleza, móveis planejados, energia solar, serviços urgentes,
fisioterapia e pilates, buffet e eventos, e outros segmentos.

## Contato

- WhatsApp: ${WHATSAPP}
- E-mail: ${EMAIL}
- Site: ${SITE_URL}

## Páginas principais

- Início: ${SITE_URL}/
- Preços: ${SITE_URL}/#preco
- Portfólio: ${SITE_URL}/#portfolio
- FAQ: ${SITE_URL}/#faq
- Termos: ${SITE_URL}/termos
- Privacidade: ${SITE_URL}/privacidade

Atualizado em: ${new Date().toISOString().slice(0, 10)}
`;

  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
