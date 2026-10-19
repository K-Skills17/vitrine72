import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Vitrine72",
};

export default function PrivacidadePage() {
  const legalName = process.env.LEGAL_NAME ?? "PLACEHOLDER_LEGAL_NAME";
  const cnpj = process.env.CNPJ ?? "PLACEHOLDER_CNPJ";

  return (
    <main className="min-h-screen bg-brand-dark text-white px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 text-yellow-300 text-sm">
          <strong>NEEDS #13:</strong> Este texto é rascunho para revisão
          jurídica. Não publicar sem aprovação de advogado.
        </div>

        <h1 className="text-3xl font-display font-bold">
          Política de Privacidade
        </h1>

        <p className="text-gray-400 text-sm">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <section className="space-y-4 text-gray-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">
            1. Responsável pelo tratamento
          </h2>
          <p>
            <strong>{legalName}</strong>, CNPJ {cnpj}, doravante chamada
            &quot;Vitrine72&quot;, é responsável pelo tratamento dos dados
            pessoais coletados neste site, conforme a Lei Geral de Proteção de
            Dados (Lei nº 13.709/2018 — LGPD).
          </p>

          <h2 className="text-xl font-semibold text-white">
            2. Dados coletados
          </h2>
          <p>
            Coletamos dados fornecidos diretamente pelo usuário no formulário de
            briefing (nome, CNPJ/CPF, WhatsApp, e-mail, endereço, fotos) e
            dados de uso (cookies de sessão, UTMs de origem).
          </p>

          <h2 className="text-xl font-semibold text-white">
            3. Finalidade
          </h2>
          <p>
            Os dados são usados exclusivamente para prestação do serviço
            contratado (criação e publicação do site), comunicação sobre o
            projeto e cumprimento de obrigações legais.
          </p>

          <h2 className="text-xl font-semibold text-white">
            4. Compartilhamento
          </h2>
          <p>
            Dados podem ser compartilhados com fornecedores de infraestrutura
            (Supabase, Vercel, Resend) na medida necessária à prestação do
            serviço. Não vendemos dados a terceiros.
          </p>

          <h2 className="text-xl font-semibold text-white">
            5. Seus direitos (LGPD Art. 18)
          </h2>
          <p>
            Você pode solicitar acesso, correção, exclusão ou portabilidade dos
            seus dados a qualquer momento pelo e-mail{" "}
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "PLACEHOLDER_CONTACT_EMAIL"}.
          </p>

          <h2 className="text-xl font-semibold text-white">
            6. Cookies
          </h2>
          <p>
            Usamos cookies essenciais para funcionamento do site e um cookie de
            atribuição de origem (v72_source) para identificar o canal de
            aquisição, sem rastreamento comportamental.
          </p>
        </section>
      </div>
    </main>
  );
}
