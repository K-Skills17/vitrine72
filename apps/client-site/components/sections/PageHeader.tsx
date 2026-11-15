import type { ReactNode } from "react";
import { Container, SectionLabel } from "../ui/Layout";

/** Inner-page opening: label, h1 and a lead, left-aligned on the page grid. */
export default function PageHeader({ label, title, lead }: { label: string; title: string; lead?: ReactNode }) {
  return (
    <header className="border-b border-line pb-12 pt-14 md:pb-16 md:pt-20">
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-6 max-w-[22ch] text-h1 text-ink">{title}</h1>
        {lead && <p className="mt-6 max-w-lead text-lead text-muted">{lead}</p>}
      </Container>
    </header>
  );
}
