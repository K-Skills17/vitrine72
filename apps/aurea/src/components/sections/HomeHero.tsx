import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { homeHero } from "@/content/home";
import { images } from "@/content/images";
import { ctaLabels } from "@/content/navigation";

/** Golden split: text column (1.618) beside a portrait (1). */
export function HomeHero() {
  return (
    <Container as="section" aria-labelledby="hero-title" className="grid items-end gap-10 pb-section-sm pt-12 lg:grid-golden lg:gap-16 lg:pt-20">
      <div className="flex flex-col gap-8 lg:pb-12">
        <Eyebrow>{homeHero.eyebrow}</Eyebrow>
        <h1 id="hero-title" className="font-display text-display font-normal text-balance">
          {homeHero.titleStart} <em className="italic">{homeHero.titleEmphasis}</em> {homeHero.titleEnd}
        </h1>
        <p className="max-w-lead text-lead text-pretty text-umber">{homeHero.lead}</p>
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <WhatsAppLink location="hero" />
          <ButtonLink href="/clinica" variant="text">
            {ctaLabels.secondary}
          </ButtonLink>
        </div>
      </div>
      <EditorialImage image={images.homeHero} ratio="4/5" priority sizes="(min-width: 1024px) 36vw, 100vw" />
    </Container>
  );
}
