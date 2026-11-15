import type { Metadata } from "next";
import { config } from "@/lib/config";
import PageHeader from "@/components/sections/PageHeader";
import About from "@/components/sections/About";
import Reviews from "@/components/sections/Reviews";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Sobre",
  description: `Conheça ${config.businessName}.`,
};

export default function SobrePage() {
  return (
    <>
      <PageHeader label="Sobre" title={`Conheça ${config.businessName}`} />
      <About />
      <Reviews />
      <Contact />
    </>
  );
}
