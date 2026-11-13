import Link from "next/link";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { treatmentPath } from "@/content/treatments";
import { professionalsPage } from "@/content/pages";
import type { Professional } from "@/types/professional";
import type { TreatmentSummary } from "@/types/treatment";

/** Full profile: portrait beside name, role, registration, bio and the treatments they lead. */
export function ProfessionalProfile({ professional, leads }: { professional: Professional; leads: TreatmentSummary[] }) {
  return (
    <article data-reveal aria-labelledby={professional.id} className="grid gap-8 border-t border-line py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.618fr)] md:gap-16">
      <EditorialImage image={professional.image} ratio="4/5" sizes="(min-width: 768px) 36vw, 100vw" className="max-w-sm" />
      <div className="flex flex-col gap-5">
        <Eyebrow>{professional.role}</Eyebrow>
        <h2 id={professional.id} className="font-display text-h2 font-normal">
          {professional.name}
        </h2>
        <p className="text-caption text-umber">{professional.registration}</p>
        <p className="max-w-prose text-body text-umber">{professional.bio}</p>
        <p className="text-small">{professional.specialties.join(" · ")}</p>
        {leads.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-line pt-5">
            <p className="text-eyebrow font-semibold uppercase text-sage-deep">{professionalsPage.leadsLabel}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {leads.map((t) => (
                <li key={t.slug}>
                  <Link href={treatmentPath(t.slug)} className="inline-flex min-h-11 items-center text-small underline underline-offset-4">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {professional.isFictional && <p className="text-caption text-umber">Profissional fictício para demonstração.</p>}
      </div>
    </article>
  );
}
