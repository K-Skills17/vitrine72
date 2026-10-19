"use client";

// Step 5 is a review step — shows summary before contract
interface Props {
  data: Record<string, unknown>;
  onNext: (_update: Record<string, unknown>) => void;
  onBack: () => void;
}

export function IntakeStep5({ data, onNext, onBack }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-display font-semibold text-white">
        Revisão — verifique antes de enviar
      </h2>

      <div className="space-y-4 text-sm">
        <ReviewRow label="Negócio" value={data.businessName as string} />
        <ReviewRow label="Segmento" value={data.vertical as string} />
        <ReviewRow label="Cidade" value={data.city as string} />
        <ReviewRow label="Endereço" value={data.exactAddress as string} />
        <ReviewRow label="Horários" value={data.hours as string} />
        <ReviewRow label="Serviço 1" value={`${data.service1Name ?? "–"} ${data.service1Price ? `(${data.service1Price})` : ""}`} />
        <ReviewRow label="Serviço 2" value={`${data.service2Name ?? "–"} ${data.service2Price ? `(${data.service2Price})` : ""}`} />
        <ReviewRow label="Serviço 3" value={`${data.service3Name ?? "–"} ${data.service3Price ? `(${data.service3Price})` : ""}`} />
        <ReviewRow label="Ação principal" value={data.primaryAction as string} />
        <ReviewRow label="Fotos enviadas" value={`${((data.uploadedPhotos as string[]) ?? []).length}`} />
        <ReviewRow label="Logo" value={data.logoPath ? "Enviada" : "Não enviada"} />
        <ReviewRow label="Domínio" value={data.domainHas === "sim" ? (data.domainName as string) : "Não tem"} />
      </div>

      <p className="text-gray-400 text-sm">
        Tudo certo? Clique em Próximo para ler e aceitar o contrato.
      </p>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-white/20 text-gray-400 py-3 rounded-xl hover:bg-brand-dark-2 transition"
        >
          Voltar e editar
        </button>
        <button
          type="button"
          onClick={() => onNext({})}
          className="flex-1 bg-brand-gold text-brand-dark font-bold py-3 rounded-xl hover:brightness-110 transition"
        >
          Tudo certo, próximo
        </button>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 min-w-[120px]">{label}:</span>
      <span className="text-white">{value || <em className="text-gray-600">não informado</em>}</span>
    </div>
  );
}
