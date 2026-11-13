import { Kicker, SectionTitle, container } from "./ui";
import { timeline } from "./content";

/** The "72" device: the process as a clock, with the real rule at each stop. */
export function Timeline() {
  return (
    <section id="processo" aria-labelledby="processo-titulo" className="bg-v-ink py-24 text-v-paper lg:py-32">
      <div className={`${container} flex flex-col gap-16`}>
        <div data-reveal className="flex max-w-[48rem] flex-col gap-5">
          <Kicker className="!text-v-paper/60">{timeline.kicker}</Kicker>
          <SectionTitle id="processo-titulo">{timeline.title}</SectionTitle>
        </div>
        <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
          <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-v-paper/20 lg:left-0 lg:top-[7px] lg:h-px lg:w-full" />
          {timeline.steps.map((s, i) => (
            <li key={s.title} data-reveal data-reveal-delay={i * 90} className="relative flex flex-col gap-3 pl-9 lg:pl-0 lg:pt-10">
              <span
                aria-hidden
                className={`absolute left-0 top-1 size-[15px] rounded-full border-2 lg:top-0 ${i === timeline.steps.length - 1 ? "border-v-signal bg-v-signal" : "border-v-paper bg-v-ink"}`}
              />
              <span className="font-mono text-[0.8rem] uppercase tracking-[0.08em] text-v-signal">{s.marker}</span>
              <h3 className="font-grotesk text-[1.45rem] font-semibold tracking-[-0.015em]">{s.title}</h3>
              <p className="font-grotesk text-[0.98rem] leading-relaxed text-v-paper/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
