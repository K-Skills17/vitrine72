import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { clinicTeaser, professionalsTeaser } from "@/content/home";
import { images } from "@/content/images";

/** Architecture as brand (wide image), then the professional as the product. */
export function ClinicTeaser() {
  return (
    <section aria-labelledby="clinica-titulo" className="py-section">
      <Container className="flex flex-col gap-section-sm">
        <EditorialImage image={images.clinicReception} ratio="16/10" sizes="(min-width: 1440px) 1312px, 100vw" className="max-md:aspect-[4/5]" />
        <div className="grid gap-12 lg:grid-golden lg:gap-20">
          <div className="flex flex-col items-start gap-8">
            <SectionHeading eyebrow={clinicTeaser.eyebrow} id="clinica-titulo" title={clinicTeaser.title} lead={clinicTeaser.body} />
            <ButtonLink href="/clinica" variant="text">
              {clinicTeaser.linkLabel}
            </ButtonLink>
          </div>
          <div className="flex flex-col items-start gap-6 border-t border-line pt-8 lg:mt-24">
            <SectionHeading as="h2" size="h3" eyebrow={professionalsTeaser.eyebrow} title={professionalsTeaser.title} />
            <p className="text-body text-umber">{professionalsTeaser.body}</p>
            <p className="text-caption text-umber">{professionalsTeaser.note}</p>
            <ButtonLink href="/profissionais" variant="text">
              {professionalsTeaser.linkLabel}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
