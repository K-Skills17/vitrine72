import { config } from "@/lib/config";
import { Container, SectionLabel } from "../ui/Layout";

/**
 * Real Google reviews only (gbpData from the business's own profile). The
 * builder sets gbpData to null for regulated verticals unless the client
 * confirms reviews are allowed, so this renders nothing for them.
 */
export default function Reviews() {
  const data = config.gbpData;
  if (!data || data.reviews.length === 0) return null;
  const rating = data.rating.toFixed(1).replace(".", ",");
  return (
    <section className="bg-surface py-section" aria-labelledby="avaliacoes-titulo">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Avaliações no Google</SectionLabel>
            <h2 id="avaliacoes-titulo" className="mt-6 text-h2 text-ink">
              {rating} de 5, em {data.reviewCount} avaliações
            </h2>
          </div>
          {config.gbpLink && (
            <a href={config.gbpLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center self-start border-b border-line text-small text-ink hover:border-ink md:self-auto">
              Ver no Google
            </a>
          )}
        </div>
        <ul className="mt-12 grid border-t border-ink md:grid-cols-3">
          {data.reviews.slice(0, 3).map((r, i) => (
            <li key={i} className={`flex flex-col justify-between gap-6 border-b border-line py-8 md:border-b-0 md:py-8 ${i > 0 ? "md:border-l md:pl-8" : ""} ${i < 2 ? "md:pr-8" : ""}`}>
              <blockquote className="font-display text-h3 italic text-ink">&ldquo;{r.text}&rdquo;</blockquote>
              <p className="text-legal text-muted">
                {r.author} · {r.rating} de 5
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
