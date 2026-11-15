import type { Metadata } from "next";
import { config } from "@/lib/config";
import PageHeader from "@/components/sections/PageHeader";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

const area = config.neighborhoods.slice(0, 3).join(", ");

export const metadata: Metadata = {
  title: "Serviços",
  description: area ? `Serviços de ${config.businessName} em ${area}.` : `Serviços de ${config.businessName}.`,
};

export default function ServicosPage() {
  return (
    <>
      <PageHeader label="Serviços" title="Nossos serviços" lead={area ? `Atendemos ${area} e região.` : undefined} />
      <Services withHeading={false} />
      <Contact />
    </>
  );
}
