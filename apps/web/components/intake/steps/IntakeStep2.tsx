"use client";

import { useState } from "react";
import { z } from "zod";
import { VERTICALS, PRIMARY_ACTIONS, UPDATE_FREQUENCY } from "../IntakeForm";
import { FormField } from "@/components/ui/FormField";

const schema = z.object({
  vertical: z.string().min(1, "Selecione um segmento"),
  city: z.string().min(2, "Informe a cidade"),
  neighborhoods: z.string().min(2, "Informe os bairros atendidos"),
  exactAddress: z.string().min(5, "Informe o endereço exatamente como no Google"),
  hours: z.string().min(5, "Informe os horários"),
  gbpLink: z.string().url("Link inválido").optional().or(z.literal("")),
  instagramLink: z.string().optional(),
  primaryAction: z.string().min(1, "Selecione a ação principal"),
  primaryActionUrl: z.string().optional(),
  updateFrequency: z.string().min(1, "Selecione a frequência"),
});

type Step2Data = z.infer<typeof schema>;

interface Props {
  data: Record<string, unknown>;
  onNext: (_update: Record<string, unknown>) => void;
  onBack: () => void;
}

export function IntakeStep2({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<Partial<Step2Data>>({
    vertical: (data.vertical as string) ?? "",
    city: (data.city as string) ?? "São Paulo",
    neighborhoods: (data.neighborhoods as string) ?? "",
    exactAddress: (data.exactAddress as string) ?? "",
    hours: (data.hours as string) ?? "",
    gbpLink: (data.gbpLink as string) ?? "",
    instagramLink: (data.instagramLink as string) ?? "",
    primaryAction: (data.primaryAction as string) ?? "",
    primaryActionUrl: (data.primaryActionUrl as string) ?? "",
    updateFrequency: (data.updateFrequency as string) ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Step2Data, string>>>({});

  function validate(): boolean {
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Partial<Record<keyof Step2Data, string>> = {};
      for (const issue of result.error.issues) {
        errs[issue.path[0] as keyof Step2Data] = issue.message;
      }
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext(form as Record<string, unknown>);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-display font-semibold text-white">
        Sobre o negócio
      </h2>

      <FormField label="Segmento *" error={errors.vertical}>
        <select
          value={form.vertical ?? ""}
          onChange={(e) => setForm({ ...form, vertical: e.target.value })}
          className="input-field"
        >
          <option value="">Selecione…</option>
          {VERTICALS.map((v) => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Cidade *" error={errors.city}>
        <input
          type="text"
          value={form.city ?? ""}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="input-field"
        />
      </FormField>

      <FormField
        label="Bairros atendidos *"
        error={errors.neighborhoods}
        hint="Separe com vírgula"
      >
        <input
          type="text"
          value={form.neighborhoods ?? ""}
          onChange={(e) => setForm({ ...form, neighborhoods: e.target.value })}
          placeholder="Pinheiros, Vila Madalena, Lapa"
          className="input-field"
        />
      </FormField>

      <FormField
        label="Endereço exatamente como está no Google *"
        error={errors.exactAddress}
      >
        <input
          type="text"
          value={form.exactAddress ?? ""}
          onChange={(e) => setForm({ ...form, exactAddress: e.target.value })}
          placeholder="Rua Exemplo, 123 — Pinheiros, São Paulo - SP"
          className="input-field"
        />
      </FormField>

      <FormField
        label="Horários de atendimento *"
        error={errors.hours}
        hint="Ex: Seg–Sex 9h–18h, Sáb 9h–13h"
      >
        <textarea
          value={form.hours ?? ""}
          onChange={(e) => setForm({ ...form, hours: e.target.value })}
          rows={3}
          className="input-field"
        />
      </FormField>

      <FormField label="Link do Google Meu Negócio" error={errors.gbpLink}>
        <input
          type="url"
          value={form.gbpLink ?? ""}
          onChange={(e) => setForm({ ...form, gbpLink: e.target.value })}
          placeholder="https://maps.google.com/..."
          className="input-field"
        />
      </FormField>

      <FormField label="Link do Instagram" error={errors.instagramLink}>
        <input
          type="text"
          value={form.instagramLink ?? ""}
          onChange={(e) => setForm({ ...form, instagramLink: e.target.value })}
          placeholder="@seu_negocio"
          className="input-field"
        />
      </FormField>

      <FormField label="Ação principal do site *" error={errors.primaryAction}>
        <select
          value={form.primaryAction ?? ""}
          onChange={(e) => setForm({ ...form, primaryAction: e.target.value })}
          className="input-field"
        >
          <option value="">Selecione…</option>
          {PRIMARY_ACTIONS.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </FormField>

      {(form.primaryAction === "whatsapp" ||
        form.primaryAction === "agendamento" ||
        form.primaryAction === "ligacao") && (
        <FormField
          label={
            form.primaryAction === "whatsapp"
              ? "Número do WhatsApp"
              : form.primaryAction === "agendamento"
              ? "Link de agendamento"
              : "Telefone para ligação"
          }
          error={errors.primaryActionUrl}
        >
          <input
            type={form.primaryAction === "agendamento" ? "url" : "tel"}
            value={form.primaryActionUrl ?? ""}
            onChange={(e) => setForm({ ...form, primaryActionUrl: e.target.value })}
            className="input-field"
          />
        </FormField>
      )}

      <FormField
        label="Com que frequência muda preços, cardápio ou promoções? *"
        error={errors.updateFrequency}
      >
        <select
          value={form.updateFrequency ?? ""}
          onChange={(e) => setForm({ ...form, updateFrequency: e.target.value })}
          className="input-field"
        >
          <option value="">Selecione…</option>
          {UPDATE_FREQUENCY.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </FormField>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-white/20 text-gray-400 py-3 rounded-xl hover:bg-brand-dark-2 transition"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 bg-brand-gold text-brand-dark font-bold py-3 rounded-xl hover:brightness-110 transition"
        >
          Próximo
        </button>
      </div>
    </form>
  );
}
