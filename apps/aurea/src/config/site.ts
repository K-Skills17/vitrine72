import type { ClinicConfig, Placeholder } from "@/types/clinic";

/**
 * Clinic configuration — the single source of truth for identity, contact
 * and legal details. Replace every `placeholder(...)` before real use.
 * Environment variables are documented in .env.example.
 */

const placeholder = (value: string): Placeholder => ({ value, isPlaceholder: true });

const digitsOrNull = (raw: string | undefined): string | null => {
  const digits = raw?.replace(/\D/g, "") ?? "";
  return digits.length > 0 ? digits : null;
};

export const siteConfig: ClinicConfig = {
  name: "ÁUREA",
  descriptor: "Clínica de Estética Avançada",
  messageName: "Clínica ÁUREA",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV === "production" ? "https://vitrine72-seven.vercel.app" : "http://localhost:3003")).replace(/\/$/, ""),
  locale: "pt_BR",
  isDemo: true,
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  contact: {
    whatsappNumber: digitsOrNull(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    phoneNumber: digitsOrNull(process.env.NEXT_PUBLIC_PHONE_NUMBER),
    email: placeholder("contato@exemplo-aurea.com.br"),
  },
  address: {
    street: placeholder("Endereço de demonstração"),
    district: placeholder("Bairro"),
    city: placeholder("Cidade — UF"),
  },
  openingHours: [
    { days: "Segunda a sexta", hours: "Horário a definir" },
    { days: "Sábado", hours: "Horário a definir" },
  ],
  social: [{ label: "Instagram", href: null }],
  legal: {
    companyName: placeholder("Razão social a definir"),
    cnpj: placeholder("CNPJ 00.000.000/0000-00"),
    technicalResponsible: placeholder("Responsável técnico a definir"),
    technicalRegistration: placeholder("CRM/UF 000000"),
  },
};
