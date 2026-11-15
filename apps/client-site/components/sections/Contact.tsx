import { config, primaryCta } from "@/lib/config";
import { formatPhone, telHref, whatsappHref } from "@/lib/whatsapp";
import { ButtonLink } from "../ui/Button";
import { Container, SectionLabel } from "../ui/Layout";

/** Closing section on every page: the next step and the real contact details. */
export default function Contact() {
  const cta = primaryCta(config);
  const mapsHref = config.gbpLink ?? (config.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.address)}` : null);

  return (
    <section className="border-t border-line py-section" aria-labelledby="contato-titulo">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionLabel>Contato</SectionLabel>
          <h2 id="contato-titulo" className="mt-6 text-h1 text-ink">
            Fale com {config.businessName}
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href={cta.href} external={cta.external}>
              {cta.label}
            </ButtonLink>
            {config.phone && config.primaryAction === "phone" && (
              <ButtonLink href={whatsappHref(config.phone, config.businessName, { kind: "contact" })} variant="secondary">
                WhatsApp
              </ButtonLink>
            )}
          </div>
        </div>
        <dl className="border-t border-ink text-small lg:col-span-5">
          {config.address && (
            <div className="border-b border-line py-5">
              <dt className="text-eyebrow font-semibold uppercase text-primary">Endereço</dt>
              <dd className="mt-2 text-ink">
                {config.address}
                {mapsHref && (
                  <>
                    {" "}
                    <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap border-b border-line hover:border-ink">
                      Ver no mapa
                    </a>
                  </>
                )}
              </dd>
            </div>
          )}
          {config.hours && (
            <div className="border-b border-line py-5">
              <dt className="text-eyebrow font-semibold uppercase text-primary">Horários</dt>
              <dd className="mt-2 whitespace-pre-line text-ink">{config.hours}</dd>
            </div>
          )}
          {config.phone && (
            <div className="border-b border-line py-5">
              <dt className="text-eyebrow font-semibold uppercase text-primary">Telefone</dt>
              <dd className="mt-2 text-ink">
                <a href={telHref(config.phone)} className="border-b border-line hover:border-ink">
                  {formatPhone(config.phone)}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </Container>
    </section>
  );
}
