import Link from "next/link";
import { categories, treatmentPath } from "@/content/treatments";
import type { TreatmentSummary } from "@/types/treatment";

const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

/** Numbered typographic rows linking to treatment pages: the index, not cards. */
export function TreatmentRows({ treatments, showCategories = true }: { treatments: TreatmentSummary[]; showCategories?: boolean }) {
  return (
    <ol className="border-t border-espresso">
      {treatments.map((t, i) => (
        <li key={t.slug} data-reveal data-reveal-delay={Math.min(i, 5) * 60} className="border-b border-line">
          <Link
            href={treatmentPath(t.slug)}
            className="group grid gap-3 py-8 transition-colors hover:bg-ivory md:grid-cols-[4rem_minmax(0,1.618fr)_minmax(0,1fr)_2rem] md:items-baseline md:gap-8 md:px-4"
          >
            <span className="font-sans text-caption text-umber" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-2">
              <span className="font-display text-h3">{t.name}</span>
              <span className="max-w-prose text-small text-umber">{t.summary}</span>
            </span>
            <span className="text-eyebrow font-semibold uppercase text-sage-deep">
              {showCategories ? t.categories.map(categoryName).join(" · ") : ""}
            </span>
            <span aria-hidden className="hidden text-h3 text-umber transition-transform group-hover:translate-x-1 md:block">
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
