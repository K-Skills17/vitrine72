import type { Metadata } from "next";
import {
  CORE_OFFER,
  RULES,
  MAINTENANCE,
} from "@vitrine72/core";

export const metadata: Metadata = {
  title: "Termos de Serviço | Vitrine72",
};

export default function TermosPage() {
  const legalName = process.env.LEGAL_NAME ?? "PLACEHOLDER_LEGAL_NAME";
  const cnpj = process.env.CNPJ ?? "PLACEHOLDER_CNPJ";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "PLACEHOLDER_WHATSAPP";

  return (
    <main className="min-h-screen bg-brand-dark text-white px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 text-yellow-300 text-sm">
          <strong>NEEDS #13:</strong> Rascunho para revisão jurídica. Não
          publicar sem aprovação de advogado.
        </div>

        <h1 className="text-3xl font-display font-bold">Termos de Serviço</h1>

        <p className="text-gray-400 text-sm">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <section className="space-y-4 text-gray-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">
            1. Partes e objeto
          </h2>
          <p>
            <strong>{legalName}</strong> (CNPJ {cnpj}), prestadora do serviço
            &quot;Vitrine72&quot;, e o cliente que efetuou o pagamento
            (&quot;Contratante&quot;). O objeto é a criação e publicação de site
            institucional conforme pacote adquirido.
          </p>

          <h2 className="text-xl font-semibold text-white">2. Prazo</h2>
          <p>
            A prévia do site será entregue em até{" "}
            {CORE_OFFER.previewBusinessDays} dias úteis após o recebimento do
            formulário de briefing completo. O site vai ao ar no mínimo no dia{" "}
            {RULES.goLiveMinDays} após a confirmação do pagamento, após a
            aprovação do cliente.
          </p>

          <h2 className="text-xl font-semibold text-white">3. Revisão</h2>
          <p>
            Está incluída 1 (uma) rodada de revisão, a ser solicitada em até{" "}
            {RULES.revisionWindowHours}h após o envio da prévia. Solicitações
            adicionais serão cobradas conforme tabela vigente.
          </p>

          <h2 className="text-xl font-semibold text-white">4. Domínio</h2>
          <p>
            O domínio é registrado em nome do Contratante (CPF ou CNPJ). O
            Contratante é responsável pela renovação anual.
          </p>

          <h2 className="text-xl font-semibold text-white">
            5. Manutenção e hospedagem
          </h2>
          <p>
            O plano de manutenção e hospedagem é cobrado a cada{" "}
            {MAINTENANCE.cycleWeeks * 7} dias (
            {MAINTENANCE.cyclesPerYear} cobranças por ano) e inclui até{" "}
            {MAINTENANCE.editsPerCycle} pequenas edições por ciclo.
          </p>

          <h2 className="text-xl font-semibold text-white">
            6. Propriedade intelectual
          </h2>
          <p>
            O código-fonte gerado e os criativos são de propriedade do
            Contratante após quitação integral. A Vitrine72 retém o direito de
            exibir o projeto em portfólio.
          </p>

          <h2 className="text-xl font-semibold text-white">7. Cancelamento</h2>
          <p>
            Cancelamentos solicitados antes do início da produção têm reembolso
            integral. Após o início da produção, aplicam-se os termos do Código
            de Defesa do Consumidor.
          </p>

          <h2 className="text-xl font-semibold text-white">8. Contato</h2>
          <p>WhatsApp: {whatsapp}</p>
        </section>
      </div>
    </main>
  );
}
