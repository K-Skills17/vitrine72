import { config, getPhoto, primaryCta, type HeroStyle } from "@/lib/config";
import { ButtonLink } from "../ui/Button";
import { EditorialImage } from "../ui/EditorialImage";
import { Container, SectionLabel } from "../ui/Layout";

const { copyBlocks, businessName, neighborhoods } = config;
const cta = primaryCta(config);
const areaLine = neighborhoods.length > 0 ? neighborhoods.slice(0, 3).join(" · ") : null;

function Actions({ inverse = false }: { inverse?: boolean }) {
  const tone = inverse ? "inverse" : "default";
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <ButtonLink href={cta.href} external={cta.external} tone={tone}>
        {cta.label}
      </ButtonLink>
      <ButtonLink href="/servicos" variant="text" tone={tone} className="self-start sm:self-auto">
        Ver serviços
      </ButtonLink>
    </div>
  );
}

/** Golden split: text left, portrait photo right. */
function HeroSplit({ photo }: { photo: string }) {
  return (
    <section aria-label="Apresentação" className="pb-section pt-12 md:pt-16">
      <Container className="grid items-end gap-12 lg:grid-cols-[1.618fr_1fr] lg:gap-16">
        <div className="lg:pb-6">
          {areaLine && <SectionLabel>{areaLine}</SectionLabel>}
          <h1 className="mt-8 text-display text-ink">{copyBlocks.heroHeadline}</h1>
          <p className="mt-8 max-w-lead text-lead text-muted">{copyBlocks.heroSubheadline}</p>
          <div className="mt-10">
            <Actions />
          </div>
        </div>
        <EditorialImage src={photo} alt={businessName} ratio="portrait" sizes="(min-width: 1024px) 38vw, 100vw" priority />
      </Container>
    </section>
  );
}

/** Headline above a wide photo band; the photo is never behind the text. */
function HeroBand({ photo }: { photo: string }) {
  return (
    <section aria-label="Apresentação" className="pt-12 md:pt-16">
      <Container>
        {areaLine && <SectionLabel>{areaLine}</SectionLabel>}
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 className="text-display text-ink lg:col-span-8">{copyBlocks.heroHeadline}</h1>
          <div className="lg:col-span-4">
            <p className="text-lead text-muted">{copyBlocks.heroSubheadline}</p>
            <div className="mt-8">
              <Actions />
            </div>
          </div>
        </div>
      </Container>
      <Container className="mt-12 md:mt-16">
        <EditorialImage src={photo} alt={businessName} ratio="band" sizes="(min-width: 1376px) 1376px, 100vw" priority />
      </Container>
    </section>
  );
}

/** Oversized headline; lead and an offset photo below it. */
function HeroAsymmetric({ photo }: { photo: string }) {
  return (
    <section aria-label="Apresentação" className="pb-section pt-12 md:pt-20">
      <Container>
        {areaLine && <SectionLabel>{areaLine}</SectionLabel>}
        <h1 className="mt-8 max-w-[18ch] text-display text-ink">{copyBlocks.heroHeadline}</h1>
        <div className="mt-12 grid gap-12 border-t border-line pt-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-lead text-muted">{copyBlocks.heroSubheadline}</p>
            <div className="mt-8">
              <Actions />
            </div>
          </div>
          <EditorialImage
            src={photo}
            alt={businessName}
            ratio="landscape"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="lg:col-span-6 lg:col-start-7 lg:-mt-24"
          />
        </div>
      </Container>
    </section>
  );
}

/** Typographic hero on the inverse band. Also the fallback when there is no photo. */
function HeroTypographic() {
  return (
    <section aria-label="Apresentação" className="bg-inverse-bg py-section text-inverse-ink">
      <Container>
        {areaLine && <SectionLabel tone="inverse">{areaLine}</SectionLabel>}
        <h1 className="mt-8 max-w-[20ch] text-display">{copyBlocks.heroHeadline}</h1>
        <div className="mt-12 grid gap-10 border-t border-inverse-line pt-10 lg:grid-cols-12 lg:gap-10">
          <p className="text-lead text-inverse-muted lg:col-span-6">{copyBlocks.heroSubheadline}</p>
          <div className="lg:col-span-5 lg:col-start-8">
            <Actions inverse />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function Hero() {
  const style: HeroStyle = config.heroStyle ?? "split-text-left";
  const photo = getPhoto(config, 0);
  if (!photo || style === "minimal-dark") return <HeroTypographic />;
  if (style === "fullscreen-photo") return <HeroBand photo={photo} />;
  if (style === "editorial-asymmetric") return <HeroAsymmetric photo={photo} />;
  return <HeroSplit photo={photo} />;
}
