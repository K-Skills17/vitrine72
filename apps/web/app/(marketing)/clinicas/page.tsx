import type { Metadata } from "next";
import { ClinicPage } from "@/components/clinicas/ClinicPage";

// The hero switches from the end-of-year angle after CLINIC_OFFER.seasonalAngleUntil;
// re-render hourly so the switch happens without a deploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Vitrini72 para clínicas de estética — mais pedidos de avaliação" },
  description:
    "Página de campanha, Instagram e Google da clínica trabalhando juntos, atendente virtual e contagem semanal de pedidos de avaliação. No ar em 72 horas, com garantia.",
  alternates: { canonical: "/clinicas" },
};

export default function ClinicasPage() {
  return <ClinicPage />;
}
