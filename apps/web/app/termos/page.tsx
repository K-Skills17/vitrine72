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
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "PLACEHOLDER_EMAIL";
  const updateDate = "22/10/2026";

  return (
    <main className="min-h-screen bg-brand-dark text-white px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-display font-bold">Termos de Serviço</h1>

        <p className="text-gray-400 text-sm">
          Última atualização: {updateDate}
        </p>

        <section className="space-y-6 text-gray-300 leading-relaxed">

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">1. Partes</h2>
            <p>
              <strong className="text-white">{legalName}</strong>, inscrito no CNPJ sob o nº{" "}
              <strong className="text-white">{cnpj}</strong>, prestador do serviço &quot;Vitrine72&quot;
              (&quot;Prestador&quot;), e a pessoa física ou jurídica que efetuou o pagamento
              (&quot;Contratante&quot;). Ao concluir o pagamento e submeter o formulário de briefing,
              o Contratante declara ter lido, compreendido e concordado com estes Termos.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">2. Objeto</h2>
            <p>
              O presente contrato tem por objeto a criação, desenvolvimento e publicação de site
              institucional na internet, conforme o pacote adquirido pelo Contratante. O escopo
              inclui: criação de layout, redação de textos com base nas informações fornecidas,
              hospedagem na plataforma indicada pelo Prestador e configuração de domínio. Serviços
              não descritos neste contrato ou no pacote adquirido não estão incluídos e poderão
              ser orçados separadamente.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">3. Prazo de entrega</h2>
            <p>
              O prazo de entrega da prévia é de até{" "}
              <strong className="text-white">{CORE_OFFER.previewBusinessDays} (três) dias úteis</strong>{" "}
              contados a partir do recebimento completo do formulário de briefing, incluindo o envio de
              todas as fotos exigidas. Dias úteis não incluem sábados, domingos e feriados nacionais.
            </p>
            <p>
              O prazo será suspenso caso o Prestador necessite de informações adicionais não fornecidas
              no briefing, retomando a contagem somente após o recebimento das informações solicitadas.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">4. Revisão</h2>
            <p>
              Está incluída <strong className="text-white">1 (uma) rodada de revisão</strong> após a
              entrega da prévia. O Contratante tem até{" "}
              <strong className="text-white">{RULES.revisionWindowHours} (quarenta e oito) horas</strong>{" "}
              a partir do envio da prévia para solicitar alterações. Decorrido esse prazo sem
              manifestação, o site será considerado aprovado para publicação.
            </p>
            <p>
              Rodadas de revisão adicionais ou alterações após a aprovação serão cobradas conforme tabela
              vigente, comunicada previamente ao Contratante.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">5. Publicação</h2>
            <p>
              A publicação do site em produção ocorrerá no mínimo{" "}
              <strong className="text-white">{RULES.goLiveMinDays} (oito) dias corridos</strong> após a
              confirmação do pagamento, respeitado o prazo do Código de Defesa do Consumidor para
              desistência da compra. A publicação está condicionada à aprovação expressa do Contratante
              e à quitação integral do valor contratado.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">6. Domínio</h2>
            <p>
              O domínio será registrado em nome do Contratante (CPF ou CNPJ informado no briefing).
              O Contratante é o titular do domínio e responsável pela sua renovação anual junto ao
              registrador. Em caso de não renovação, o site ficará indisponível e o Prestador não se
              responsabiliza pela perda do domínio.
            </p>
            <p>
              Caso o Contratante já possua domínio registrado, deverá fornecer acesso ao painel de DNS
              para que o Prestador realize a configuração necessária.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">7. Manutenção e hospedagem</h2>
            <p>
              O serviço de manutenção e hospedagem, quando contratado, é cobrado a cada{" "}
              <strong className="text-white">{MAINTENANCE.cycleWeeks * 7} (vinte e oito) dias</strong>,
              totalizando {MAINTENANCE.cyclesPerYear} cobranças por ano, e inclui hospedagem contínua
              do site e até <strong className="text-white">{MAINTENANCE.editsPerCycle} (três) pequenas
              edições por ciclo</strong> (textos, preços, horários e imagens existentes).
            </p>
            <p>
              A falta de pagamento de qualquer ciclo de manutenção por mais de 7 (sete) dias corridos
              poderá resultar na suspensão temporária do site. Após 30 (trinta) dias de inadimplência,
              o Prestador poderá encerrar a hospedagem sem aviso prévio adicional.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">8. Responsabilidades do Contratante</h2>
            <p>
              O Contratante é o único responsável pela veracidade, precisão e legalidade das
              informações, imagens e conteúdos fornecidos para compor o site. O Prestador não se
              responsabiliza por conteúdo que infrinja direitos de terceiros, seja enganoso ou
              contrário à legislação vigente.
            </p>
            <p>
              O Contratante declara possuir os direitos de uso de todas as imagens fornecidas.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">9. Propriedade intelectual</h2>
            <p>
              Após a quitação integral do valor contratado, os direitos patrimoniais sobre o conteúdo
              textual e visual do site são transferidos ao Contratante. O código-fonte da plataforma
              de geração e os componentes reutilizáveis permanecem de propriedade do Prestador.
            </p>
            <p>
              O Prestador reserva-se o direito de exibir o projeto em portfólio e materiais de
              divulgação, salvo solicitação expressa em contrário pelo Contratante.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">10. Cancelamento e reembolso</h2>
            <p>
              O Contratante pode cancelar o contrato em até{" "}
              <strong className="text-white">7 (sete) dias corridos</strong> a partir da data do
              pagamento, nos termos do art. 49 do Código de Defesa do Consumidor (CDC), com reembolso
              integral do valor pago.
            </p>
            <p>
              Após esse prazo e antes do início da produção (envio do briefing), o cancelamento terá
              reembolso de 80% (oitenta por cento) do valor pago. Após o início da produção, o
              reembolso será de 50% (cinquenta por cento). Após a entrega da prévia, não haverá
              reembolso.
            </p>
            <p>
              Cancelamentos devem ser solicitados por escrito via WhatsApp ou e-mail para os contatos
              indicados na cláusula 12.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">11. Limitação de responsabilidade</h2>
            <p>
              O Prestador não se responsabiliza por resultados de negócio (vendas, leads, posicionamento
              orgânico no Google) decorrentes do site. O serviço é de criação e hospedagem de site
              institucional. Variações de desempenho em SEO e resultados comerciais dependem de
              fatores externos fora do controle do Prestador.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">12. Contato e atendimento</h2>
            <p>
              WhatsApp:{" "}
              <a
                href={`https://wa.me/${whatsapp}`}
                className="text-brand-gold hover:underline"
              >
                {whatsapp}
              </a>
              <br />
              E-mail:{" "}
              <a href={`mailto:${contactEmail}`} className="text-brand-gold hover:underline">
                {contactEmail}
              </a>
            </p>
            <p>
              O atendimento é realizado em dias úteis, das 9h às 18h (horário de Brasília).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">13. Foro</h2>
            <p>
              As partes elegem o foro da Comarca de São Paulo, Estado de São Paulo, para dirimir
              quaisquer controvérsias oriundas deste contrato, renunciando a qualquer outro, por mais
              privilegiado que seja.
            </p>
          </div>

        </section>
      </div>
    </main>
  );
}
