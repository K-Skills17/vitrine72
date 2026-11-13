import { normalizeBrazilianNumber } from "@/lib/whatsapp";

/**
 * Inquiry form contract. Minimum data, no health information. With no
 * endpoint configured (the demo) nothing is sent anywhere and the form says
 * so; set NEXT_PUBLIC_INQUIRY_ENDPOINT to POST JSON to a real handler.
 */

export interface InquiryInput {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  period: string;
  message: string;
  consent: boolean;
}

export type InquiryErrors = Partial<Record<keyof InquiryInput, string>>;

export const inquiryEndpoint = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT?.trim() || null;
export const MESSAGE_MAX = 600;

export function validateInquiry(input: InquiryInput): InquiryErrors {
  const errors: InquiryErrors = {};
  if (input.name.trim().length < 2) errors.name = "Informe seu nome.";
  if (!normalizeBrazilianNumber(input.phone)) errors.phone = "Informe um celular com DDD, por exemplo (11) 91234-5678.";
  if (input.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) errors.email = "Confira o e-mail informado.";
  if (input.message.length > MESSAGE_MAX) errors.message = `Use no máximo ${MESSAGE_MAX} caracteres.`;
  if (!input.consent) errors.consent = "Precisamos do seu consentimento para entrar em contato.";
  return errors;
}

export type SubmitResult = { status: "sent" } | { status: "demo" } | { status: "error" };

export async function submitInquiry(input: InquiryInput): Promise<SubmitResult> {
  if (!inquiryEndpoint) return { status: "demo" };
  try {
    const res = await fetch(inquiryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, phone: normalizeBrazilianNumber(input.phone) }),
    });
    return res.ok ? { status: "sent" } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}
