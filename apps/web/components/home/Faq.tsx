import { Kicker, SectionTitle, container } from "./ui";
import { faq } from "./content";

export function Faq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="border-t border-v-line bg-v-card py-24 lg:py-32">
      <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20`}>
        <div data-reveal className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <Kicker>{faq.kicker}</Kicker>
          <SectionTitle id="duvidas-titulo">{faq.title}</SectionTitle>
        </div>
        <div className="border-t border-v-ink">
          {faq.items.map((item) => (
            <details key={item.q} className="group border-b border-v-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-grotesk text-[1.15rem] font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-v-line font-mono text-[1rem] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-[40rem] pb-6 font-grotesk text-[1rem] leading-relaxed text-v-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
