import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { treatmentIndexCopy } from "@/content/home";
import { categories, treatmentPath, treatmentSummaries } from "@/content/treatments";

const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

/** Numbered typographic index of treatments: rows, not cards. */
export function TreatmentIndex() {
  return (
    <section aria-labelledby="tratamentos-titulo" className="bg-porcelain py-section">
      <Container className="flex flex-col gap-14">
        <div className="grid gap-8 lg:grid-golden lg:items-end">
          <SectionHeading
            eyebrow={treatmentIndexCopy.eyebrow}
            id="tratamentos-titulo" title={treatmentIndexCopy.title}
            lead={treatmentIndexCopy.lead}
          />
          <div className="lg:justify-self-end">
            <ButtonLink href="/tratamentos" variant="text">
              {treatmentIndexCopy.linkLabel}
            </ButtonLink>
          </div>
        </div>
        <ol className="border-t border-espresso">
          {treatmentSummaries.map((t, i) => (
            <li key={t.slug} className="border-b border-line">
              <Link
                href={treatmentPath(t.slug)}
                className="group grid gap-3 py-8 transition-colors hover:bg-ivory md:grid-cols-[4rem_minmax(0,1.618fr)_minmax(0,1fr)_2rem] md:items-baseline md:gap-8 md:px-4"
              >
                <span className="font-sans text-caption text-umber" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-2">
                  <span className="font-display text-h3">{t.name}</span>
                  <span className="max-w-prose text-small text-umber">{t.summary}</span>
                </span>
                <span className="text-eyebrow font-semibold uppercase text-sage-deep">
                  {t.categories.map(categoryName).join(" · ")}
                </span>
                <span aria-hidden className="hidden text-h3 text-umber transition-transform group-hover:translate-x-1 md:block">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
