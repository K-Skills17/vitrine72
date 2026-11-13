import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { FinalCta } from "@/components/sections/FinalCta";
import { TreatmentRows } from "@/components/treatments/TreatmentRows";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories, treatmentSummaries } from "@/content/treatments";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Tratamentos",
  description: "Tratamentos de estética facial, qualidade da pele, rejuvenescimento e estética corporal, sempre a partir de uma avaliação individual.",
  path: "/tratamentos",
});

export default function TreatmentsPage() {
  return (
    <>
      <Container as="header" className="flex flex-col gap-10 pb-section-sm pt-12 lg:pt-20">
        <SectionHeading
          as="h1"
          size="h1"
          eyebrow="Tratamentos"
          title="Cada tratamento começa por uma avaliação."
          lead="Organizamos os tratamentos por área de cuidado. Em cada página, você encontra o que é, para quem pode ser indicado e como funciona. A indicação final é sempre feita em consulta."
        />
        <nav aria-label="Áreas de cuidado">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
            {categories.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="inline-flex min-h-11 items-center text-nav uppercase underline-offset-4 hover:underline">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      {categories.map((category, i) => {
        const items = treatmentSummaries.filter((t) => t.categories.includes(category.id));
        return (
          <section
            key={category.id}
            id={category.id}
            aria-labelledby={`${category.id}-titulo`}
            className={i % 2 === 0 ? "bg-porcelain py-section-sm" : "py-section-sm"}
          >
            <Container className="grid gap-10 lg:grid-golden-reverse lg:gap-20">
              <SectionHeading id={`${category.id}-titulo`} size="h2" title={category.name} lead={category.description} />
              {items.length > 0 ? (
                <TreatmentRows treatments={items} showCategories={false} />
              ) : (
                <div className="flex flex-col items-start gap-6 border-t border-espresso pt-8">
                  <p className="max-w-prose text-body text-umber">
                    As indicações corporais são definidas caso a caso, a partir da avaliação presencial. Conte o que você gostaria de
                    tratar e a equipe orienta o próximo passo.
                  </p>
                  <WhatsAppLink location="treatment-index" variant="secondary">
                    Falar sobre estética corporal
                  </WhatsAppLink>
                </div>
              )}
            </Container>
          </section>
        );
      })}

      <FinalCta />
    </>
  );
}
