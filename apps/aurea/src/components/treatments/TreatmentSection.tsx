import type { ReactNode } from "react";

/** Ruled two-column block: label on the left (1), content on the right (1.618). */
export function TreatmentSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-6 border-t border-line py-12 lg:grid-golden-reverse lg:gap-20 lg:py-16">
      <h2 id={id} className="font-display text-h2 font-normal text-balance">
        {title}
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function RuledList({ items }: { items: string[] }) {
  return (
    <ul className="border-t border-line">
      {items.map((item) => (
        <li key={item} className="border-b border-line py-4 text-body">
          {item}
        </li>
      ))}
    </ul>
  );
}
