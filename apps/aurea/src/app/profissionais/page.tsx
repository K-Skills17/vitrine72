import { ProfessionalProfile } from "@/components/professionals/ProfessionalProfile";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { professionalsPage } from "@/content/pages";
import { professionals } from "@/content/professionals";
import { treatmentDetails } from "@/content/treatment-details";
import { getTreatmentSummary } from "@/content/treatments";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Profissionais",
  description: "Conheça os profissionais responsáveis pelos tratamentos da ÁUREA. Profissionais fictícios para demonstração.",
  path: "/profissionais",
});

export default function ProfessionalsPage() {
  const leadsFor = (id: string) =>
    treatmentDetails
      .filter((d) => d.responsibleProfessionalId === id)
      .map((d) => getTreatmentSummary(d.slug))
      .filter((t) => t !== undefined);

  return (
    <>
      <Container as="header" className="flex flex-col gap-8 pb-section-sm pt-12 lg:pt-20">
        <SectionHeading as="h1" size="h1" eyebrow={professionalsPage.eyebrow} title={professionalsPage.title} lead={professionalsPage.lead} />
        <p className="border-l-2 border-taupe pl-4 text-caption text-umber">{professionalsPage.fictionalNote}</p>
      </Container>
      <Container className="pb-section-sm">
        {professionals.map((p) => (
          <ProfessionalProfile key={p.id} professional={p} leads={leadsFor(p.id)} />
        ))}
        <p className="border-t border-line pt-8 text-caption text-umber">
          Responsável técnica: {siteConfig.legal.technicalResponsible.value} · {siteConfig.legal.technicalRegistration.value}
        </p>
      </Container>
      <FinalCta />
    </>
  );
}
