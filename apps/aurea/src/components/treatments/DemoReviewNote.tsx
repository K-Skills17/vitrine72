import type { ReviewStatus } from "@/types/treatment";

/** Visible flag on content that has not been approved by a professional. */
export function DemoReviewNote({ status }: { status: ReviewStatus }) {
  if (status === "approved") return null;
  return (
    <p className="self-start border-l-2 border-taupe pl-4 text-caption text-umber">
      Conteúdo de demonstração, pendente de revisão por profissional habilitado. Não substitui a avaliação individual.
    </p>
  );
}
