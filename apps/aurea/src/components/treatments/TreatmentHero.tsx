import Link from "next/link";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { Container } from "@/components/ui/Container";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { categories } from "@/content/treatments";
import type { ImageRef } from "@/types/image";
import type { TreatmentSummary } from "@/types/treatment";

interface Props {
  treatment: TreatmentSummary;
  intro: string;
  image: ImageRef;
}

/** Treatment landing hero: name and contextual CTA beside the image. */
export function TreatmentHero({ treatment, intro, image }: Props) {
  const categoryNames = treatment.categories.map((id) => categories.find((c) => c.id === id)?.name).filter(Boolean);
  return (
    <Container as="section" aria-labelledby="tratamento-titulo" className="grid items-end gap-10 pb-section-sm pt-10 lg:grid-golden lg:gap-16 lg:pt-16">
      <div className="flex flex-col gap-8 lg:pb-12">
        <nav aria-label="Você está em" className="text-caption text-umber">
          <Link href="/tratamentos" className="underline-offset-4 hover:underline">
            Tratamentos
          </Link>
          <span aria-hidden> / </span>
          <span aria-current="page">{treatment.name}</span>
        </nav>
        <Eyebrow>{categoryNames.join(" · ")}</Eyebrow>
        <h1 id="tratamento-titulo" className="font-display text-h1 font-normal text-balance">
          {treatment.name}
        </h1>
        <p className="max-w-lead text-lead text-pretty text-umber">{intro}</p>
        <WhatsAppLink
          location="treatment-hero"
          intent={{ kind: "treatment", treatmentName: treatment.messageName }}
          treatmentSlug={treatment.slug}
          className="self-start"
        >
          Agendar avaliação
        </WhatsAppLink>
      </div>
      <EditorialImage image={image} ratio="4/5" priority sizes="(min-width: 1024px) 36vw, 100vw" />
    </Container>
  );
}
