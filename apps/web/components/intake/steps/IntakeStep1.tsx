"use client";

import { useState } from "react";
import { z } from "zod";
import { validateCNPJ, validateCPF } from "@/lib/validators";
import { FormField } from "@/components/ui/FormField";

const schema = z.object({
  businessName: z.string().min(2, "Informe o nome do negócio"),
  documentType: z.enum(["cpf", "cnpj"]),
  document: z.string().min(11, "Documento inválido"),
  responsibleName: z.string().min(2, "Informe o nome do responsável"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  email: z.string().email("E-mail inválido"),
});

type Step1Data = z.infer<typeof schema>;

interface Props {
  data: Record<string, unknown>;
  onNext: (_update: Record<string, unknown>) => void;
}

export function IntakeStep1({ data, onNext }: Props) {
  const [form, setForm] = useState<Partial<Step1Data>>({
    businessName: (data.businessName as string) ?? "",
    documentType: (data.documentType as "cpf" | "cnpj") ?? "cnpj",
    document: (data.document as string) ?? "",
    responsibleName: (data.responsibleName as string) ?? "",
    whatsapp: (data.whatsapp as string) ?? "",
    email: (data.email as string) ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({});

  function validate(): boolean {
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Partial<Record<keyof Step1Data, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof Step1Data;
        errs[key] = issue.message;
      }
      // Extra document validation
      if (form.documentType === "cnpj" && form.document) {
        if (!validateCNPJ(form.document)) errs.document = "CNPJ inválido";
      }
      if (form.documentType === "cpf" && form.document) {
        if (!validateCPF(form.document)) errs.document = "CPF inválido";
      }
      setErrors(errs);
      return false;
    }
    // Document check digit validation
    if (form.documentType === "cnpj" && !validateCNPJ(form.document!)) {
      setErrors({ document: "CNPJ inválido" });
      return false;
    }
    if (form.documentType === "cpf" && !validateCPF(form.document!)) {
      setErrors({ document: "CPF inválido" });
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
        Informações do negócio
      </h2>

      <FormField label="Nome do negócio *" error={errors.businessName}>
        <input
          type="text"
          value={form.businessName ?? ""}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          placeholder="Ex: Clínica Bela Pele"
          className="input-field"
        />
      </FormField>

      <FormField label="Tipo de documento *" error={errors.documentType}>
        <div className="flex gap-4">
          {(["cnpj", "cpf"] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="documentType"
                value={type}
                checked={form.documentType === type}
                onChange={() => setForm({ ...form, documentType: type, document: "" })}
                className="accent-brand-gold"
              />
              <span className="text-gray-300 uppercase text-sm">{type}</span>
            </label>
          ))}
        </div>
      </FormField>

      <FormField label={`${form.documentType?.toUpperCase() ?? "CNPJ"} *`} error={errors.document}>
        <input
          type="text"
          value={form.document ?? ""}
          onChange={(e) => setForm({ ...form, document: e.target.value.replace(/\D/g, "") })}
          placeholder={form.documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
          maxLength={form.documentType === "cpf" ? 11 : 14}
          className="input-field"
        />
      </FormField>

      <FormField label="Nome do responsável *" error={errors.responsibleName}>
        <input
          type="text"
          value={form.responsibleName ?? ""}
          onChange={(e) => setForm({ ...form, responsibleName: e.target.value })}
          className="input-field"
        />
      </FormField>

      <FormField label="WhatsApp *" error={errors.whatsapp}>
        <input
          type="tel"
          value={form.whatsapp ?? ""}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, "") })}
          placeholder="11999999999"
          className="input-field"
        />
      </FormField>

      <FormField label="E-mail *" error={errors.email}>
        <input
          type="email"
          value={form.email ?? ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-field"
        />
      </FormField>

      <button
        type="submit"
        className="w-full bg-brand-gold text-brand-dark font-bold py-3 rounded-xl hover:brightness-110 transition"
      >
        Próximo
      </button>
    </form>
  );
}
