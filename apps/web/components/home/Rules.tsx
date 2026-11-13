import { Kicker, SectionTitle, container } from "./ui";
import { rules } from "./content";

export function Rules() {
  return (
    <section aria-labelledby="regras-titulo" className="py-24 lg:py-32">
      <div className={`${container} flex flex-col gap-14`}>
        <div data-reveal className="flex max-w-[44rem] flex-col gap-5">
          <Kicker>{rules.kicker}</Kicker>
          <SectionTitle id="regras-titulo">{rules.title}</SectionTitle>
        </div>
        <ul className="grid border-t border-v-ink sm:grid-cols-2 lg:grid-cols-4">
          {rules.items.map((r, i) => (
            <li key={r.title} data-reveal data-reveal-delay={i * 80} className="flex flex-col gap-3 border-b border-v-line py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
              <p className="font-grotesk text-[3.6rem] font-semibold leading-none tracking-[-0.05em]">
                {r.figure}
                <span className="ml-1 font-mono text-[0.95rem] font-normal tracking-normal text-v-signal">{r.unit}</span>
              </p>
              <h3 className="font-grotesk text-[1.1rem] font-semibold">{r.title}</h3>
              <p className="font-grotesk text-[0.95rem] leading-relaxed text-v-muted">{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
