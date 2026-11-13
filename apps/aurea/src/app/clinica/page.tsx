import { FinalCta } from "@/components/sections/FinalCta";
import { Journey } from "@/components/sections/Journey";
import { Container } from "@/components/ui/Container";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/content/images";
import { clinicPage } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "A clínica",
  description: "Ambientes reservados, luz natural e protocolos claros: como a ÁUREA organiza a avaliação e o acompanhamento.",
  path: "/clinica",
});

export default function ClinicPage() {
  const [first, ...rest] = clinicPage.spaces;
  return (
    <>
      <Container as="header" className="grid gap-10 pb-section-sm pt-12 lg:grid-golden lg:items-end lg:gap-16 lg:pt-20">
        <SectionHeading as="h1" size="h1" eyebrow={clinicPage.eyebrow} title={clinicPage.title} lead={clinicPage.lead} />
        <EditorialImage image={images.clinicDetail} ratio="1/1" priority sizes="(min-width: 1024px) 34vw, 100vw" />
      </Container>

      <EditorialImage image={images.clinicSpace} ratio="16/10" sizes="100vw" className="max-md:aspect-[4/5]" />

      <section aria-labelledby="ambientes" className="py-section">
        <Container className="flex flex-col gap-14">
          <h2 id="ambientes" className="font-display text-h2 font-normal">
            {clinicPage.spacesTitle}
          </h2>
          <div className="grid gap-12 lg:grid-golden lg:gap-16">
            <figure className="flex flex-col gap-5">
              <EditorialImage image={images[first.key]} ratio="4/3" sizes="(min-width: 1024px) 56vw, 100vw" />
              <figcaption>
                <h3 className="font-display text-h3 font-normal">{first.title}</h3>
                <p className="mt-2 max-w-prose text-body text-umber">{first.body}</p>
              </figcaption>
            </figure>
            <div className="flex flex-col gap-12 lg:pt-24">
              {rest.map((s) => (
                <figure key={s.key} className="flex flex-col gap-5">
                  <EditorialImage image={images[s.key]} ratio="4/5" sizes="(min-width: 1024px) 34vw, 100vw" />
                  <figcaption>
                    <h3 className="font-display text-h3 font-normal">{s.title}</h3>
                    <p className="mt-2 text-body text-umber">{s.body}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Journey />

      <section aria-labelledby="cuidados-titulo" className="py-section">
        <Container className="grid gap-12 lg:grid-golden-reverse lg:gap-20">
          <SectionHeading id="cuidados-titulo" eyebrow={clinicPage.standardsEyebrow} title={clinicPage.standardsTitle} />
          <ol className="border-t border-line">
            {clinicPage.standards.map((s, i) => (
              <li key={s.title} className="grid gap-2 border-b border-line py-7 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span className="font-display text-h3 text-taupe" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-h3 font-normal">{s.title}</h3>
                  <p className="mt-2 max-w-prose text-body text-umber">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
