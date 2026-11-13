import { TreatmentRows } from "@/components/treatments/TreatmentRows";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { treatmentIndexCopy } from "@/content/home";
import { treatmentSummaries } from "@/content/treatments";

/** Homepage treatment index. */
export function TreatmentIndex() {
  return (
    <section aria-labelledby="tratamentos-titulo" className="bg-porcelain py-section">
      <Container className="flex flex-col gap-14">
        <div className="grid gap-8 lg:grid-golden lg:items-end">
          <SectionHeading id="tratamentos-titulo" eyebrow={treatmentIndexCopy.eyebrow} title={treatmentIndexCopy.title} lead={treatmentIndexCopy.lead} />
          <div className="lg:justify-self-end">
            <ButtonLink href="/tratamentos" variant="text">
              {treatmentIndexCopy.linkLabel}
            </ButtonLink>
          </div>
        </div>
        <TreatmentRows treatments={treatmentSummaries} />
      </Container>
    </section>
  );
}
