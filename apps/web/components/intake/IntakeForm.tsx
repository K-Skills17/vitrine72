"use client";

import { useState, useCallback } from "react";
import { IntakeStep1 } from "./steps/IntakeStep1";
import { IntakeStep2 } from "./steps/IntakeStep2";
import { IntakeStep3 } from "./steps/IntakeStep3";
import { IntakeStep4 } from "./steps/IntakeStep4";
import { IntakeStep5 } from "./steps/IntakeStep5";
import { IntakeStepContract } from "./steps/IntakeStepContract";

export const TOTAL_STEPS = 6;

export const VERTICALS = [
  { value: "estetica", label: "Estética e beleza" },
  { value: "moveis-planejados", label: "Móveis planejados" },
  { value: "energia-solar", label: "Energia solar" },
  { value: "servicos-urgentes", label: "Serviços urgentes (desentupidora, elétrica, etc.)" },
  { value: "fisioterapia-pilates", label: "Fisioterapia / Pilates" },
  { value: "buffet-eventos", label: "Buffet e eventos" },
  { value: "outro", label: "Outro" },
] as const;

export const PRIMARY_ACTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "agendamento", label: "Link de agendamento" },
  { value: "ligacao", label: "Ligação" },
  { value: "orcamento", label: "Formulário de orçamento" },
] as const;

export const UPDATE_FREQUENCY = [
  { value: "semanal", label: "Semanal ou mais" },
  { value: "mensal", label: "Mensal" },
  { value: "raramente", label: "Raramente" },
] as const;

interface Props {
  projectId: string;
  token: string;
  sku: string;
  existingData: Record<string, unknown>;
  submissionId: string | null;
}

export function IntakeForm({ projectId, token, existingData, submissionId }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Record<string, unknown>>(existingData);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (update: Record<string, unknown>) => {
      const merged = { ...data, ...update };
      setData(merged);
      setSaving(true);
      try {
        await fetch(`/api/intake/${token}/draft`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: merged, submissionId }),
        });
      } finally {
        setSaving(false);
      }
    },
    [data, token, submissionId]
  );

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/intake/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, submissionId }),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Erro ao enviar. Tente novamente.");
        return;
      }
      // Reload to show completion state
      window.location.reload();
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }, [data, token, submissionId]);

  const nextStep = (update: Record<string, unknown> = {}) => {
    save(update);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i + 1 <= step ? "bg-brand-gold" : "bg-brand-dark-3"
            }`}
          />
        ))}
        <span className="text-gray-500 text-xs whitespace-nowrap">
          {step}/{TOTAL_STEPS}
        </span>
      </div>

      {saving && (
        <p className="text-xs text-gray-600 text-right">Salvando…</p>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {step === 1 && <IntakeStep1 data={data} onNext={nextStep} />}
      {step === 2 && <IntakeStep2 data={data} onNext={nextStep} onBack={prevStep} />}
      {step === 3 && (
        <IntakeStep3
          data={data}
          onNext={nextStep}
          onBack={prevStep}
          projectId={projectId}
          token={token}
        />
      )}
      {step === 4 && <IntakeStep4 data={data} onNext={nextStep} onBack={prevStep} />}
      {step === 5 && <IntakeStep5 data={data} onNext={nextStep} onBack={prevStep} />}
      {step === 6 && (
        <IntakeStepContract
          onSubmit={submit}
          onBack={prevStep}
          submitting={submitting}
        />
      )}
    </div>
  );
}
