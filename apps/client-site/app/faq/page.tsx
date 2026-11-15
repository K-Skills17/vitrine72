import type { Metadata } from "next";
import { config } from "@/lib/config";
import PageHeader from "@/components/sections/PageHeader";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: `Tire suas dúvidas sobre os serviços de ${config.businessName}.`,
};

export default function FaqPage() {
  return (
    <>
      <PageHeader label="Perguntas frequentes" title="Perguntas frequentes" />
      <Faq withHeading={false} />
      <Contact />
    </>
  );
}
