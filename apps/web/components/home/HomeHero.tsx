import { Arrow, BrowserFrame, Kicker, PhoneFrame, btnPrimary, container } from "./ui";
import { checkout, hero, work } from "./content";

export function HomeHero() {
  return (
    <section id="topo" aria-labelledby="hero-titulo" className="overflow-hidden">
      <div className={`${container} grid items-center gap-14 pb-20 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10 lg:pb-28 lg:pt-20`}>
        <div className="flex flex-col gap-7">
          <Kicker>
            <span className="mr-2 inline-block size-2 rounded-full bg-v-signal align-middle" aria-hidden />
            {hero.kicker}
          </Kicker>
          <h1 id="hero-titulo" className="text-balance font-grotesk text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[4rem] lg:text-[4.6rem]">
            {hero.title}
          </h1>
          <p className="max-w-[34rem] text-pretty font-grotesk text-[1.15rem] leading-relaxed text-v-muted">{hero.lead}</p>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
            <a href={checkout.core} className={btnPrimary}>
              {hero.cta}
              <Arrow />
            </a>
            <p className="font-grotesk text-[0.95rem] leading-snug text-v-muted">
              <span className="font-semibold text-v-ink">{hero.price}</span>
              <br />
              {hero.priceNote}
            </p>
          </div>
          <a href="#trabalhos" className="self-start font-mono text-[0.8rem] uppercase tracking-[0.08em] text-v-ink underline decoration-v-line underline-offset-[6px] hover:decoration-v-ink">
            {hero.secondary} ↓
          </a>
        </div>

        <div className="relative pb-10 lg:pb-16">
          <BrowserFrame src={work.featured.desktop} alt="Página inicial do site de demonstração ÁUREA, clínica de estética" url={work.featured.url.replace("https://", "")} priority />
          <PhoneFrame
            src={work.items[0]!.mobile}
            alt="Versão para celular do site de demonstração Clínica Aurora"
            priority
            className="absolute -bottom-2 right-3 w-[30%] max-w-[190px] sm:right-8 lg:-bottom-4 lg:-left-10 lg:right-auto"
          />
        </div>
      </div>
    </section>
  );
}
