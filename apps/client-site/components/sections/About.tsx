import { config, getPhoto, type AboutStyle } from "@/lib/config";
import { EditorialImage } from "../ui/EditorialImage";
import { Container, SectionLabel, SpecGrid } from "../ui/Layout";

const paragraphs = config.copyBlocks.aboutText.split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean);

/** Only facts the client supplied or Google reports. Nothing invented. */
function facts(): Array<{ label: string; value: string }> {
  const list: Array<{ label: string; value: string }> = [];
  if (config.neighborhoods.length) list.push({ label: "Região", value: config.neighborhoods.join(", ") });
  if (config.hours) list.push({ label: "Horários", value: config.hours });
  if (config.services.length) list.push({ label: "Serviços", value: `${config.services.length} serviços` });
  if (config.gbpData && config.gbpData.reviewCount > 0) {
    list.push({
      label: "Google",
      value: `${config.gbpData.rating.toFixed(1).replace(".", ",")} de 5 · ${config.gbpData.reviewCount} avaliações`,
    });
  }
  return list;
}

function Text({ large = false }: { large?: boolean }) {
  return (
    <div className="space-y-5">
      {paragraphs.map((p, i) => (
        <p key={i} className={large && i === 0 ? "font-display text-h2 text-ink" : "max-w-prose text-body text-muted"}>
          {p}
        </p>
      ))}
    </div>
  );
}

export default function About() {
  if (paragraphs.length === 0) return null;
  const style: AboutStyle = config.aboutStyle ?? "about-split";
  const photo = getPhoto(config, 1);

  if (style === "about-split" && photo) {
    return (
      <section className="border-t border-line py-section" aria-labelledby="sobre-titulo">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.618fr] lg:gap-16">
          <EditorialImage src={photo} alt={`Ambiente de ${config.businessName}`} ratio="portrait" sizes="(min-width: 1024px) 34vw, 100vw" />
          <div data-reveal>
            <SectionLabel>Sobre</SectionLabel>
            <h2 id="sobre-titulo" className="mb-8 mt-6 text-h1 text-ink">{config.businessName}</h2>
            <Text />
          </div>
        </Container>
      </section>
    );
  }

  if (style === "about-credentials") {
    const list = facts();
    return (
      <section className="border-t border-line py-section" aria-labelledby="sobre-titulo">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6" data-reveal>
            <SectionLabel>Sobre</SectionLabel>
            <h2 id="sobre-titulo" className="mb-8 mt-6 text-h1 text-ink">{config.businessName}</h2>
            <Text />
          </div>
          {list.length > 0 && (
            <dl className="border-t border-ink lg:col-span-5 lg:col-start-8">
              {list.map((f) => (
                <div key={f.label} className="grid grid-cols-3 gap-4 border-b border-line py-5">
                  <dt className="text-eyebrow font-semibold uppercase text-primary">{f.label}</dt>
                  <dd className="col-span-2 whitespace-pre-line text-small text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </section>
    );
  }

  // about-centered, or about-split without a photo: statement beside a label column
  return (
    <section className="border-t border-line py-section" aria-labelledby="sobre-titulo">
      <Container>
        <SpecGrid label={<SectionLabel>Sobre</SectionLabel>}>
          <h2 id="sobre-titulo" className="sr-only">Sobre {config.businessName}</h2>
          <div data-reveal>
            <Text large />
          </div>
        </SpecGrid>
      </Container>
    </section>
  );
}
