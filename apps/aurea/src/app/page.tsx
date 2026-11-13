import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ctaLabels } from "@/content/navigation";

/**
 * Phase 3 holding page: exercises the foundation (type, buttons, CTA) until
 * the editorial hero and homepage sections are built in Phase 4.
 */
export default function HomePage() {
  return (
    <Container className="grid gap-12 py-section lg:grid-golden lg:gap-20">
      <SectionHeading
        as="h1"
        size="display"
        eyebrow="Clínica de Estética Avançada"
        title={
          <>
            Ciência, critério e <em className="italic">naturalidade</em> em cada indicação.
          </>
        }
        lead="Avaliação individual, planejamento por etapas e acompanhamento próximo. Cada plano é definido em consulta, a partir do que o seu rosto e a sua pele realmente pedem."
      />
      <div className="flex flex-col items-start gap-6 lg:justify-end">
        <WhatsAppLink location="hero" />
        <ButtonLink href="/clinica" variant="text">
          {ctaLabels.secondary}
        </ButtonLink>
      </div>
    </Container>
  );
}
