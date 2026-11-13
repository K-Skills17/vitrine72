"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { describedBy, Field, fieldControl } from "@/components/ui/Field";
import { treatmentSummaries } from "@/content/treatments";
import { track } from "@/lib/analytics";
import { MESSAGE_MAX, submitInquiry, validateInquiry, type InquiryErrors, type InquiryInput } from "@/lib/inquiry";

const PERIODS = ["Manhã", "Tarde", "Noite", "Sem preferência"];

type Status = "idle" | "submitting" | "sent" | "demo" | "error";

const empty: InquiryInput = { name: "", phone: "", email: "", treatment: "", period: "", message: "", consent: false };

/**
 * Secondary conversion path (WhatsApp is primary). Honest states: in the demo
 * nothing is sent and the form says so; no appointment is ever implied.
 */
export function InquiryForm() {
  const [values, setValues] = useState<InquiryInput>(empty);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);

  function set<K extends keyof InquiryInput>(key: K, value: InquiryInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onFirstInput() {
    if (started.current) return;
    started.current = true;
    track("contact_form_start", { destination: "form", cta_location: "contact-page" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateInquiry(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`inq-${firstInvalid}`)?.focus();
      return;
    }
    setStatus("submitting");
    const result = await submitInquiry(values);
    setStatus(result.status);
    if (result.status !== "error") {
      track("contact_form_submit", { destination: "form", cta_location: "contact-page" });
      setValues(empty);
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status === "sent" || status === "demo") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col gap-4 border-t border-espresso pt-8 focus:outline-none">
        <p className="font-display text-h3">{status === "sent" ? "Mensagem recebida." : "Formulário de demonstração."}</p>
        <p className="max-w-prose text-body text-umber">
          {status === "sent"
            ? "A equipe vai responder pelo contato informado para combinar sua avaliação. Nenhum horário foi reservado ainda."
            : "Este é um site de demonstração: nenhum dado foi enviado ou armazenado e nenhuma avaliação foi agendada. Em um site real, a equipe receberia sua mensagem."}
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="self-start text-caption underline underline-offset-4 min-h-11">
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  const fieldProps = (key: keyof InquiryInput, hint?: string) => ({
    id: `inq-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": describedBy(`inq-${key}`, hint, errors[key]),
  });

  return (
    <form noValidate onSubmit={onSubmit} onInput={onFirstInput} aria-labelledby="form-titulo" className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="inq-name" label="Nome" required error={errors.name}>
          <input {...fieldProps("name")} type="text" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} className={fieldControl} />
        </Field>
        <Field id="inq-phone" label="Celular (WhatsApp)" required error={errors.phone}>
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(11) 91234-5678"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={fieldControl}
          />
        </Field>
      </div>
      <Field id="inq-email" label="E-mail" error={errors.email}>
        <input {...fieldProps("email")} type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={fieldControl} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="inq-treatment" label="Tratamento de interesse">
          <select {...fieldProps("treatment")} value={values.treatment} onChange={(e) => set("treatment", e.target.value)} className={fieldControl}>
            <option value="">Ainda não sei</option>
            {treatmentSummaries.map((t) => (
              <option key={t.slug} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="inq-period" label="Melhor período para contato">
          <select {...fieldProps("period")} value={values.period} onChange={(e) => set("period", e.target.value)} className={fieldControl}>
            <option value="">Selecione</option>
            {PERIODS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field
        id="inq-message"
        label="Mensagem"
        hint={`Não inclua informações de saúde. Até ${MESSAGE_MAX} caracteres.`}
        error={errors.message}
      >
        <textarea
          {...fieldProps("message", "hint")}
          rows={4}
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          className={`${fieldControl} resize-y`}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 text-small">
          <input
            {...fieldProps("consent")}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-1 size-5 shrink-0 accent-espresso"
          />
          <span>
            Autorizo o contato da equipe pelos meios informados, conforme a{" "}
            <Link href="/privacidade" className="underline underline-offset-4">
              política de privacidade
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="inq-consent-error" className="text-caption text-error">
            {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && (
        <p ref={statusRef} tabIndex={-1} role="alert" className="text-small text-error focus:outline-none">
          Não foi possível enviar agora. Tente novamente ou fale com a equipe pelo WhatsApp.
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className={`${buttonStyles()} self-start disabled:opacity-60`}>
        {status === "submitting" ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}
