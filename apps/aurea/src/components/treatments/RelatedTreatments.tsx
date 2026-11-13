import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { treatmentPath } from "@/content/treatments";
import type { TreatmentSummary } from "@/types/treatment";

export function RelatedTreatments({ treatments }: { treatments: TreatmentSummary[] }) {
  if (treatments.length === 0) return null;
  return (
    <Container as="section" aria-labelledby="relacionados" className="flex flex-col gap-8 py-section-sm">
      <Eyebrow>
        <span id="relacionados">Tratamentos relacionados</span>
      </Eyebrow>
      <ul className="grid border-t border-espresso md:grid-cols-2">
        {treatments.map((t) => (
          <li key={t.slug} className="border-b border-line md:odd:border-r md:odd:pr-8 md:even:pl-8">
            <Link href={treatmentPath(t.slug)} className="group flex flex-col gap-2 py-8">
              <span className="flex items-baseline justify-between gap-4 font-display text-h3">
                {t.name}
                <span aria-hidden className="text-umber transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
              <span className="max-w-prose text-small text-umber">{t.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
