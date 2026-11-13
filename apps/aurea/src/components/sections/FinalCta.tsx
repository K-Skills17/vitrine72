import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { finalCta } from "@/content/home";

/** Closing conversion block used at the end of pages. */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-final" className="border-t border-line bg-sand py-section">
      <Container className="grid gap-10 lg:grid-golden lg:items-end lg:gap-20">
        <SectionHeading eyebrow={finalCta.eyebrow} id="cta-final" title={finalCta.title} lead={finalCta.lead} />
        <div className="flex flex-col items-start gap-5">
          <WhatsAppLink location="final-cta" />
          <ButtonLink href="/contato" variant="text">
            {finalCta.secondaryLabel}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
