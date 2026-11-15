import { config, getFaqAnswer } from "@/lib/config";
import { Container, SectionLabel } from "../ui/Layout";

/** Native <details> accordion: keyboard and screen-reader support without JS. */
export default function Faq({ limit, withHeading = true }: { limit?: number; withHeading?: boolean }) {
  const list = (limit ? config.faqs.slice(0, limit) : config.faqs)
    .map((f) => ({ q: f.q, a: getFaqAnswer(config, f.q) || f.a }))
    .filter((f) => f.a);
  if (list.length === 0) return null;

  return (
    <section className="border-t border-line py-section" aria-labelledby={withHeading ? "faq-titulo" : undefined}>
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          {withHeading && (
            <>
              <SectionLabel>Perguntas frequentes</SectionLabel>
              <h2 id="faq-titulo" className="mt-6 text-h2 text-ink">Antes de você nos chamar</h2>
            </>
          )}
        </div>
        <div className="border-t border-ink lg:col-span-8">
          {list.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer items-start justify-between gap-6 py-6 font-display text-h3 text-ink">
                {f.q}
                <span aria-hidden="true" className="mt-1 font-body text-lead text-primary transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-prose pb-6 text-body text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
