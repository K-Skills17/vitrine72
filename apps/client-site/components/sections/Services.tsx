import { config, getPhoto, getServiceDescription, serviceCtaLabel, type CardStyle } from "@/lib/config";
import { whatsappHref } from "@/lib/whatsapp";
import { Arrow, ButtonLink } from "../ui/Button";
import { cx } from "../ui/cx";
import { EditorialImage } from "../ui/EditorialImage";
import { Container, SectionLabel, SpecGrid } from "../ui/Layout";

interface ServiceItem {
  name: string;
  description: string;
  price: string | null;
  href: string;
}

function items(limit?: number): ServiceItem[] {
  const list = limit ? config.services.slice(0, limit) : config.services;
  return list.map((s) => ({
    name: s.name,
    description: getServiceDescription(config, s.name) || s.description,
    price: s.price,
    href: whatsappHref(config.phone, config.businessName, { kind: "service", serviceName: s.name }),
  }));
}

function ServiceLink({ href, inverse = false }: { href: string; inverse?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "inline-flex min-h-11 items-center gap-2 border-b text-small font-medium transition-colors",
        inverse ? "border-inverse-line text-inverse-ink hover:border-inverse-ink" : "border-line text-ink hover:border-ink",
      )}
    >
      {serviceCtaLabel(config)}
      <Arrow />
    </a>
  );
}

function Price({ value, inverse = false }: { value: string | null; inverse?: boolean }) {
  if (!value) return null;
  return <p className={cx("text-small", inverse ? "text-inverse-muted" : "text-muted")}>{value}</p>;
}

/** Numbered ruled index. */
function IndexLayout({ list, showPrice }: { list: ServiceItem[]; showPrice: boolean }) {
  return (
    <ol className="border-t border-ink">
      {list.map((s, i) => (
        <li key={s.name} data-reveal className="grid gap-4 border-b border-line py-8 md:grid-cols-12 md:gap-8">
          <span className="font-display text-h3 text-primary md:col-span-1" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-h3 text-ink md:col-span-4">{s.name}</h3>
          <div className="md:col-span-7">
            {s.description && <p className="max-w-prose text-body text-muted">{s.description}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
              {showPrice && <Price value={s.price} />}
              <ServiceLink href={s.href} />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Two-column ruled list. */
function ColumnsLayout({ list, showPrice }: { list: ServiceItem[]; showPrice: boolean }) {
  return (
    <ul className="grid border-t border-ink md:grid-cols-2 md:gap-x-12">
      {list.map((s) => (
        <li key={s.name} data-reveal className="flex flex-col border-b border-line py-8">
          <h3 className="text-h3 text-ink">{s.name}</h3>
          {s.description && <p className="mt-3 flex-1 text-body text-muted">{s.description}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2">
            {showPrice && <Price value={s.price} />}
            <ServiceLink href={s.href} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Large rows, alternating photo side when photos exist. */
function RowsLayout({ list, showPrice }: { list: ServiceItem[]; showPrice: boolean }) {
  return (
    <div className="border-t border-ink">
      {list.map((s, i) => {
        const photo = getPhoto(config, i + 2);
        return (
          <article key={s.name} data-reveal className="grid items-center gap-8 border-b border-line py-10 lg:grid-cols-12 lg:gap-10">
            {photo && (
              <EditorialImage
                src={photo}
                alt={s.name}
                ratio="landscape"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className={cx("lg:col-span-5", i % 2 === 1 && "lg:order-2 lg:col-start-8")}
              />
            )}
            <div className={cx(photo ? "lg:col-span-6" : "lg:col-span-8", photo && i % 2 === 0 && "lg:col-start-7", photo && i % 2 === 1 && "lg:order-1")}>
              <h3 className="text-h2 text-ink">{s.name}</h3>
              {s.description && <p className="mt-4 max-w-prose text-lead text-muted">{s.description}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
                {showPrice && <Price value={s.price} />}
                <ServiceLink href={s.href} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

interface ServicesProps {
  /** Homepage shows the first few; /servicos shows all with prices. */
  limit?: number;
  /** Heading level: h2 on the homepage, omitted on /servicos (page has its own h1). */
  withHeading?: boolean;
}

export default function Services({ limit, withHeading = true }: ServicesProps) {
  if (config.services.length === 0) return null;
  const style: CardStyle = config.cardStyle ?? "card-shadow";
  const list = items(limit);
  const showPrice = !limit;
  const inverse = style === "card-dark";

  if (inverse) {
    return (
      <section className="bg-inverse-bg py-section text-inverse-ink" aria-labelledby={withHeading ? "servicos-titulo" : undefined}>
        <Container>
          {withHeading && (
            <div className="mb-14">
              <SectionLabel tone="inverse">Serviços</SectionLabel>
              <h2 id="servicos-titulo" className="mt-6 text-h1">O que fazemos</h2>
            </div>
          )}
          <ul className="grid border-t border-inverse-ink md:grid-cols-2 md:gap-x-12">
            {list.map((s) => (
              <li key={s.name} data-reveal className="flex flex-col border-b border-inverse-line py-8">
                <h3 className="text-h3">{s.name}</h3>
                {s.description && <p className="mt-3 flex-1 text-body text-inverse-muted">{s.description}</p>}
                <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2">
                  {showPrice && <Price value={s.price} inverse />}
                  <ServiceLink href={s.href} inverse />
                </div>
              </li>
            ))}
          </ul>
          {limit && config.services.length > limit && (
            <ButtonLink href="/servicos" variant="secondary" tone="inverse" className="mt-12">
              Ver todos os serviços
            </ButtonLink>
          )}
        </Container>
      </section>
    );
  }

  const Layout = style === "card-bordered" ? ColumnsLayout : style === "card-minimal" ? RowsLayout : IndexLayout;

  return (
    <section className="py-section" aria-labelledby={withHeading ? "servicos-titulo" : undefined}>
      <Container>
        {withHeading ? (
          <SpecGrid label={<SectionLabel>Serviços</SectionLabel>}>
            <h2 id="servicos-titulo" className="mb-14 text-h1 text-ink">
              O que fazemos
            </h2>
          </SpecGrid>
        ) : null}
        <Layout list={list} showPrice={showPrice} />
        {limit && config.services.length > limit && (
          <ButtonLink href="/servicos" variant="secondary" className="mt-12">
            Ver todos os serviços
          </ButtonLink>
        )}
      </Container>
    </section>
  );
}
