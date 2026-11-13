import Link from "next/link";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Eyebrow } from "@/components/ui/SectionHeading";
import type { Professional } from "@/types/professional";

/** Professional responsibility, visible on every treatment page. */
export function ResponsibleProfessional({ professional }: { professional: Professional }) {
  return (
    <aside aria-labelledby="responsavel" className="grid gap-6 bg-porcelain p-6 sm:grid-cols-[8rem_1fr] sm:p-8">
      <EditorialImage image={professional.image} ratio="4/5" sizes="8rem" className="w-32" />
      <div className="flex flex-col gap-3">
        <Eyebrow>Profissional responsável</Eyebrow>
        <p id="responsavel" className="font-display text-h3">
          {professional.name}
        </p>
        <p className="text-small text-umber">{professional.role}</p>
        <p className="text-caption text-umber">{professional.registration}</p>
        {professional.isFictional && <p className="text-caption text-umber">Profissional fictício para demonstração.</p>}
        <Link href="/profissionais" className="self-start text-caption underline underline-offset-4">
          Conheça a equipe
        </Link>
      </div>
    </aside>
  );
}
