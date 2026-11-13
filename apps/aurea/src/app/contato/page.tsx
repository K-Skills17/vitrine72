import { InquiryForm } from "@/components/conversion/InquiryForm";
import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { contactPage } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import { formatBrazilianPhone } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Contato",
  description: "Fale com a equipe da ÁUREA pelo WhatsApp e agende sua avaliação.",
  path: "/contato",
});

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-line pt-6">
      <h2 className="text-eyebrow font-semibold uppercase text-sage-deep">{title}</h2>
      <div className="text-body">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const { contact, address, openingHours, social } = siteConfig;
  return (
    <Container className="grid gap-16 pb-section pt-12 lg:grid-golden lg:gap-20 lg:pt-20">
      <div className="flex flex-col gap-10">
        <SectionHeading as="h1" size="h1" eyebrow={contactPage.eyebrow} title={contactPage.title} lead={contactPage.lead} />
        <div className="flex flex-col items-start gap-5 bg-porcelain p-6 sm:p-8">
          <h2 className="font-display text-h3 font-normal">{contactPage.whatsappTitle}</h2>
          <p className="max-w-prose text-body text-umber">{contactPage.whatsappBody}</p>
          <WhatsAppLink location="contact-page" intent={{ kind: "contact" }}>
            Conversar pelo WhatsApp
          </WhatsAppLink>
        </div>
        <section aria-labelledby="form-titulo" className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col gap-3">
            <h2 id="form-titulo" className="font-display text-h2 font-normal">
              Prefere deixar uma mensagem?
            </h2>
            <p className="max-w-prose text-body text-umber">A equipe retorna pelo contato informado para combinar a avaliação.</p>
          </div>
          <InquiryForm />
        </section>
      </div>

      <div className="flex flex-col gap-10 lg:pt-12">
        <Block title={contactPage.visitTitle}>
          <address className="not-italic">
            {address.street.value}
            <br />
            {address.district.value}
            <br />
            {address.city.value}
          </address>
        </Block>
        <Block title={contactPage.hoursTitle}>
          <ul>
            {openingHours.map((h) => (
              <li key={h.days}>
                {h.days}: {h.hours}
              </li>
            ))}
          </ul>
        </Block>
        <Block title={contactPage.otherTitle}>
          <ul className="flex flex-col gap-1">
            {contact.phoneNumber && (
              <li>
                <a href={`tel:+${contact.phoneNumber}`} data-track="phone_click" data-destination="phone" data-cta-location="contact-page" className="underline underline-offset-4">
                  {formatBrazilianPhone(contact.phoneNumber)}
                </a>
              </li>
            )}
            <li>{contact.email.value}</li>
            {social.map((s) =>
              s.href ? (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    {s.label}
                  </a>
                </li>
              ) : (
                <li key={s.label}>{s.label} (perfil a definir)</li>
              ),
            )}
          </ul>
        </Block>
        {siteConfig.isDemo && <p className="text-caption text-umber">Endereço, horários e contatos são dados de demonstração.</p>}
      </div>
    </Container>
  );
}
