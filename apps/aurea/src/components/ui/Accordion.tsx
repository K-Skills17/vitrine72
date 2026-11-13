import type { FaqItem } from "@/types/treatment";

/** FAQ list on native <details>: keyboard and screen-reader friendly, no JS. */
export function Accordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-line">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-h3 [&::-webkit-details-marker]:hidden">
            {item.q}
            <span aria-hidden className="shrink-0 font-sans text-lead text-umber transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-prose pb-6 text-body text-umber">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
