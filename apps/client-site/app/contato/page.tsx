import type { Metadata } from "next";
import { config } from "@/lib/config";
import PageHeader from "@/components/sections/PageHeader";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contato",
  description: `Entre em contato com ${config.businessName} pelo WhatsApp ou visite-nos.`,
};

export default function ContatoPage() {
  return (
    <>
      <PageHeader label="Contato" title={`Como chegar e falar com ${config.businessName}`} />
      <Contact />
    </>
  );
}
