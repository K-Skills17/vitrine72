"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { FormField } from "@/components/ui/FormField";

const schema = z.object({
  service1Name: z.string().min(2, "Informe o 1º serviço"),
  service1Price: z.string().optional(),
  service2Name: z.string().min(2, "Informe o 2º serviço"),
  service2Price: z.string().optional(),
  service3Name: z.string().min(2, "Informe o 3º serviço"),
  service3Price: z.string().optional(),
  idealCustomer: z.string().min(20, "Descreva com pelo menos 20 caracteres"),
  faq1: z.string().min(5, "Informe a 1ª pergunta"),
  faq2: z.string().min(5, "Informe a 2ª pergunta"),
  faq3: z.string().min(5, "Informe a 3ª pergunta"),
  faq4: z.string().optional(),
  faq5: z.string().optional(),
});

type Step3Data = z.infer<typeof schema>;

interface Props {
  data: Record<string, unknown>;
  onNext: (_update: Record<string, unknown>) => void;
  onBack: () => void;
  projectId: string;
  token: string;
}

export function IntakeStep3({ data, onNext, onBack, projectId, token }: Props) {
  const [form, setForm] = useState<Partial<Step3Data>>({
    service1Name: (data.service1Name as string) ?? "",
    service1Price: (data.service1Price as string) ?? "",
    service2Name: (data.service2Name as string) ?? "",
    service2Price: (data.service2Price as string) ?? "",
    service3Name: (data.service3Name as string) ?? "",
    service3Price: (data.service3Price as string) ?? "",
    idealCustomer: (data.idealCustomer as string) ?? "",
    faq1: (data.faq1 as string) ?? "",
    faq2: (data.faq2 as string) ?? "",
    faq3: (data.faq3 as string) ?? "",
    faq4: (data.faq4 as string) ?? "",
    faq5: (data.faq5 as string) ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Step3Data, string>>>({});
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  function validate(): boolean {
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Partial<Record<keyof Step3Data, string>> = {};
      for (const issue of result.error.issues) {
        errs[issue.path[0] as keyof Step3Data] = issue.message;
      }
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  }

  async function handleAudioUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);
      formData.append("role", "audio");
      await fetch(`/api/intake/${token}/upload`, {
        method: "POST",
        body: formData,
      });
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext(form as Record<string, unknown>);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-display font-semibold text-white">
        Serviços e clientes
      </h2>

      {/* Top 3 services */}
      <p className="text-gray-400 text-sm">
        Os 3 serviços que mais trazem dinheiro para você:
      </p>
      {[1, 2, 3].map((n) => (
        <div key={n} className="grid grid-cols-2 gap-3">
          <FormField
            label={`Serviço ${n} *`}
            error={errors[`service${n}Name` as keyof Step3Data]}
          >
            <input
              type="text"
              value={(form[`service${n}Name` as keyof Step3Data] as string) ?? ""}
              onChange={(e) =>
                setForm({ ...form, [`service${n}Name`]: e.target.value })
              }
              placeholder="Ex: Progressiva"
              className="input-field"
            />
          </FormField>
          <FormField label="Preço médio (opcional)">
            <input
              type="text"
              value={(form[`service${n}Price` as keyof Step3Data] as string) ?? ""}
              onChange={(e) =>
                setForm({ ...form, [`service${n}Price`]: e.target.value })
              }
              placeholder="R$ 250"
              className="input-field"
            />
          </FormField>
        </div>
      ))}

      <FormField
        label="Cliente ideal e por que ele escolhe você *"
        error={errors.idealCustomer}
        hint="Pode gravar um áudio de até 3 minutos se preferir"
      >
        <textarea
          value={form.idealCustomer ?? ""}
          onChange={(e) => setForm({ ...form, idealCustomer: e.target.value })}
          rows={4}
          placeholder="Meu cliente típico é… Ele nos escolhe porque…"
          className="input-field"
        />
      </FormField>

      <FormField label="Gravar áudio (opcional, máx. 3 min)">
        <div className="flex items-center gap-3">
          <input
            ref={audioRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAudioFile(file);
                handleAudioUpload(file);
              }
            }}
          />
          <button
            type="button"
            onClick={() => audioRef.current?.click()}
            className="text-sm border border-white/20 text-gray-400 px-4 py-2 rounded-lg hover:bg-brand-dark-2 transition"
          >
            {uploading ? "Enviando…" : audioFile ? `✓ ${audioFile.name}` : "Escolher áudio"}
          </button>
        </div>
      </FormField>

      {/* FAQ 5 questions */}
      <p className="text-gray-400 text-sm">
        As 5 perguntas que todo cliente faz (mínimo 3):
      </p>
      {[1, 2, 3, 4, 5].map((n) => (
        <FormField
          key={n}
          label={`Pergunta ${n}${n <= 3 ? " *" : " (opcional)"}`}
          error={errors[`faq${n}` as keyof Step3Data]}
        >
          <input
            type="text"
            value={(form[`faq${n}` as keyof Step3Data] as string) ?? ""}
            onChange={(e) =>
              setForm({ ...form, [`faq${n}`]: e.target.value })
            }
            placeholder="Ex: Quanto custa uma progressiva?"
            className="input-field"
          />
        </FormField>
      ))}

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
