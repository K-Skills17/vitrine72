import Link from "next/link";
import type { ReactNode } from "react";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { legalNav, primaryNav } from "@/content/navigation";
import { treatmentPath, treatmentSummaries } from "@/content/treatments";
import { formatBrazilianPhone } from "@/lib/utils";
import { Logo } from "./Logo";

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-eyebrow font-semibold uppercase text-champagne">{title}</h2>
      <div className="mt-5 text-small text-ivory/80">{children}</div>
    </div>
  );
}

/** Block padding rather than min-height so wrapped names keep clear separation. */
const linkClass = "inline-block py-1.5 hover:text-ivory";

export function Footer() {
  const { contact, address, openingHours, social, legal } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-espresso text-ivory">
      <Container className="grid gap-14 py-section-sm lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo tone="dark" />
          <p className="mt-8 max-w-sm font-display text-h3 text-ivory">
            Cada tratamento começa por uma conversa e uma avaliação individual.
          </p>
          <WhatsAppLink location="footer" tone="dark" className="mt-8" />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:pl-12">
          <FooterColumn title="Navegação">
            <ul>
              <li>
                <Link href="/" className={linkClass}>
                  Início
                </Link>
              </li>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Tratamentos">
            <ul>
              {treatmentSummaries.map((t) => (
                <li key={t.slug}>
                  <Link href={treatmentPath(t.slug)} className={linkClass}>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Visite">
            <address className="not-italic">
              {address.street.value}
              <br />
              {address.district.value}
              <br />
              {address.city.value}
            </address>
            <dl className="mt-5 space-y-1">
              {openingHours.map((h) => (
                <div key={h.days}>
                  <dt className="inline">{h.days}: </dt>
                  <dd className="inline">{h.hours}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5">
              {contact.phoneNumber && (
                <li>
                  <a
                    href={`tel:+${contact.phoneNumber}`}
                    className={linkClass}
                    data-track="phone_click"
                    data-destination="phone"
                    data-cta-location="footer"
                  >
                    {formatBrazilianPhone(contact.phoneNumber)}
                  </a>
                </li>
              )}
              <li>{contact.email.value}</li>
              {social.map((s) =>
                s.href ? (
                  <li key={s.label}>
                    <a href={s.href} className={linkClass} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ) : (
                  <li key={s.label}>{s.label} (perfil a definir)</li>
                ),
              )}
            </ul>
          </FooterColumn>
        </div>
      </Container>

      <div className="border-t border-ivory/15">
        <Container className="flex flex-col gap-4 py-8 text-legal text-taupe lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <p>
              {legal.companyName.value} · {legal.cnpj.value}
            </p>
            <p>
              Responsável técnico: {legal.technicalResponsible.value} · {legal.technicalRegistration.value}
            </p>
            {siteConfig.isDemo && (
              <p>
                Conteúdo de demonstração. Profissionais, registros e dados de contato são fictícios. As informações sobre
                tratamentos não substituem a avaliação de um profissional habilitado.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 lg:items-end">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex min-h-9 items-center hover:text-ivory">
                {item.label}
              </Link>
            ))}
            <p>
              © {year} {siteConfig.name} · Site por Vitrini72
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
