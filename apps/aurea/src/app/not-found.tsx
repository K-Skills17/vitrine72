import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <Container className="py-section">
      <SectionHeading
        as="h1"
        size="h1"
        eyebrow="Erro 404"
        title="Esta página não existe ou mudou de endereço."
        lead="Você pode voltar ao início ou conhecer os tratamentos da clínica."
      />
      <div className="mt-10 flex flex-wrap gap-6">
        <ButtonLink href="/tratamentos">Ver tratamentos</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Voltar ao início
        </ButtonLink>
      </div>
    </Container>
  );
}
