import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { journey } from "@/content/home";

/** The patient journey as a primary section: process before persuasion. */
export function Journey() {
  return (
    <section aria-labelledby="como-funciona" className="bg-espresso py-section text-ivory">
      <Container className="flex flex-col gap-16">
        <SectionHeading reveal tone="dark" eyebrow={journey.eyebrow} id="como-funciona" title={journey.title} />
        <ol className="grid gap-px bg-ivory/15 sm:grid-cols-2 lg:grid-cols-4">
          {journey.steps.map((s, i) => (
            <li key={s.title} data-reveal data-reveal-delay={i * 90} className="flex flex-col gap-4 bg-espresso py-8 sm:pr-8 lg:py-2">
              <span className="text-eyebrow font-semibold uppercase text-champagne">Etapa {String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-h3 font-normal">{s.title}</h3>
              <p className="text-body text-ivory/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
