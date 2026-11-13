import { Kicker, PhoneFrame, SectionTitle, container } from "./ui";
import { included, work } from "./content";

export function Included() {
  return (
    <section aria-labelledby="incluso-titulo" className="py-24 lg:py-32">
      <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20`}>
        <div className="flex flex-col gap-10">
          <div data-reveal className="flex flex-col gap-5">
            <Kicker>{included.kicker}</Kicker>
            <SectionTitle id="incluso-titulo">{included.title}</SectionTitle>
          </div>
          <ol className="border-t border-v-ink">
            {included.items.map((item, i) => (
              <li key={item.title} data-reveal data-reveal-delay={Math.min(i, 5) * 60} className="grid gap-1 border-b border-v-line py-6 sm:grid-cols-[3.5rem_minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-baseline sm:gap-6">
                <span className="font-mono text-[0.8rem] text-v-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-grotesk text-[1.2rem] font-semibold tracking-[-0.01em]">{item.title}</h3>
                <p className="font-grotesk text-[0.98rem] leading-relaxed text-v-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div data-reveal className="mx-auto w-[min(18rem,70%)] lg:sticky lg:top-24 lg:mx-0 lg:w-[19rem] lg:self-start lg:justify-self-end">
          <PhoneFrame src={work.items[1]!.mobile} alt="Site de demonstração Atelier Madeira no celular, com botão de WhatsApp" />
          <p className="mt-4 text-center font-mono text-[0.75rem] uppercase tracking-[0.08em] text-v-muted">Atelier Madeira · demonstração</p>
        </div>
      </div>
    </section>
  );
}
