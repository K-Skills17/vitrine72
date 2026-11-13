import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Política de privacidade",
  description: "Como a ÁUREA trata os dados de quem usa este site.",
  path: "/privacidade",
});

const sections = [
  {
    title: "1. Quem somos",
    body: [
      `Este site pertence à ${siteConfig.legal.companyName.value}, ${siteConfig.legal.cnpj.value}, responsável pelo tratamento dos dados descritos aqui.`,
    ],
  },
  {
    title: "2. Contato pelo WhatsApp",
    body: [
      "Antes de abrir o WhatsApp, o site faz algumas perguntas (primeiro nome, interesse, prazo e investimento previsto). As respostas não são armazenadas pelo site: elas apenas compõem a mensagem que você mesmo envia ao abrir a conversa.",
      "A conversa no WhatsApp segue os termos e a política de privacidade do próprio WhatsApp.",
    ],
  },
  {
    title: "3. Atendimento virtual (chat)",
    body: [
      "O chat do site é operado por um serviço externo de atendimento automatizado. As mensagens e as fotos enviadas são processadas por esse serviço, incluindo análise automatizada de imagens por inteligência artificial, e o histórico da conversa fica registrado para dar continuidade ao atendimento.",
      "O chat oferece informações gerais e não faz indicação de tratamento. Não envie dados de saúde sensíveis pelo chat.",
    ],
  },
  {
    title: "4. Medição de audiência",
    body: [
      "Quando ativada, a medição de audiência registra apenas dados de navegação (página visitada e botão clicado). Nenhum nome, telefone, resposta de formulário ou informação de saúde é enviado para a ferramenta de medição.",
    ],
  },
  {
    title: "5. Seus direitos",
    body: [
      "Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar confirmação, acesso, correção, anonimização, portabilidade ou exclusão dos seus dados, além de informações sobre compartilhamento.",
      `Para exercer esses direitos, entre em contato pelo e-mail ${siteConfig.contact.email.value}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <Container className="grid gap-12 pb-section pt-12 lg:grid-golden-reverse lg:gap-20 lg:pt-20">
      <div className="flex flex-col gap-6">
        <SectionHeading as="h1" size="h1" eyebrow="Privacidade" title="Política de privacidade" />
        {siteConfig.isDemo && (
          <p className="border-l-2 border-taupe pl-4 text-caption text-umber">
            Rascunho de demonstração. Antes de uso real, este texto deve ser revisado por profissional qualificado em LGPD e completado com
            prazos de retenção e dados do encarregado.
          </p>
        )}
      </div>
      <div className="flex flex-col">
        {sections.map((s) => (
          <section key={s.title} className="flex flex-col gap-4 border-t border-line py-8">
            <h2 className="font-display text-h3 font-normal">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className="max-w-prose text-body text-umber">
                {p}
              </p>
            ))}
          </section>
        ))}
        <Link href="/contato" className="mt-4 self-start text-button font-semibold uppercase underline underline-offset-4">
          Voltar ao contato
        </Link>
      </div>
    </Container>
  );
}
