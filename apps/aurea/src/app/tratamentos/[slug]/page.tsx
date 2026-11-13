import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { FinalCta } from "@/components/sections/FinalCta";
import { DemoReviewNote } from "@/components/treatments/DemoReviewNote";
import { RelatedTreatments } from "@/components/treatments/RelatedTreatments";
import { ResponsibleProfessional } from "@/components/treatments/ResponsibleProfessional";
import { TreatmentHero } from "@/components/treatments/TreatmentHero";
import { RuledList, TreatmentSection } from "@/components/treatments/TreatmentSection";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { images } from "@/content/images";
import { getProfessional } from "@/content/professionals";
import { getTreatmentDetail } from "@/content/treatment-details";
import { getTreatmentSummary, treatmentSummaries } from "@/content/treatments";
import { pageMetadata } from "@/lib/metadata";
import type { ImageRef } from "@/types/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return treatmentSummaries.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatmentSummary(slug);
  if (!t) return {};
  return pageMetadata({ title: t.name, description: t.summary, path: `/tratamentos/${t.slug}` });
}

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const summary = getTreatmentSummary(slug);
  const detail = getTreatmentDetail(slug);
  if (!summary || !detail) notFound();

  const professional = getProfessional(detail.responsibleProfessionalId);
  const image = (images as Record<string, ImageRef>)[slug];
  const related = detail.related.map(getTreatmentSummary).filter((t) => t !== undefined);
  const intent = { kind: "treatment", treatmentName: summary.messageName } as const;

  return (
    <>
      {image && <TreatmentHero treatment={summary} intro={detail.intro} image={image} />}

      <Container className="pb-section-sm">
        <TreatmentSection id="o-que-e" title="O que é">
          {detail.whatItIs.map((p) => (
            <p key={p} className="max-w-prose text-body">
              {p}
            </p>
          ))}
        </TreatmentSection>

        <TreatmentSection id="indicacoes" title="Pode ser indicado para">
          <RuledList items={detail.concerns} />
        </TreatmentSection>

        <TreatmentSection id="para-quem" title="Para quem">
          {detail.candidacy.map((p, i) => (
            <p key={p} className={i === detail.candidacy.length - 1 ? "max-w-prose text-body font-semibold" : "max-w-prose text-body"}>
              {p}
            </p>
          ))}
        </TreatmentSection>

        <TreatmentSection id="como-funciona" title="Como funciona">
          <ol className="border-t border-line">
            {detail.process.map((s, i) => (
              <li key={s.title} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[3.5rem_1fr]">
                <span className="text-caption text-umber" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-h3 font-normal">{s.title}</h3>
                  <p className="mt-1 max-w-prose text-body text-umber">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <WhatsAppLink location="treatment-body" intent={intent} treatmentSlug={summary.slug} variant="secondary" className="self-start">
            Agendar avaliação
          </WhatsAppLink>
        </TreatmentSection>

        <TreatmentSection id="cuidados" title="Cuidados">
          <RuledList items={detail.aftercare} />
        </TreatmentSection>

        <TreatmentSection id="duvidas" title="Dúvidas frequentes">
          <Accordion items={detail.faq} />
        </TreatmentSection>

        <div className="grid gap-8 border-t border-line pt-12 lg:grid-golden-reverse lg:gap-20">
          <DemoReviewNote status={summary.reviewStatus} />
          {professional && <ResponsibleProfessional professional={professional} />}
        </div>
      </Container>

      <RelatedTreatments treatments={related} />
      <FinalCta />
    </>
  );
}
