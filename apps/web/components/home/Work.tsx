import { Arrow, BrowserFrame, Kicker, PhoneFrame, SectionTitle, btnSecondary, container } from "./ui";
import { clientSites, whatsappUrl, work } from "./content";

export function Work() {
  const f = work.featured;
  return (
    <section id="trabalhos" aria-labelledby="trabalhos-titulo" className="border-t border-v-line bg-v-card py-24 lg:py-32">
      <div className={`${container} flex flex-col gap-16`}>
        <div data-reveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div className="flex flex-col gap-5">
            <Kicker>{work.kicker}</Kicker>
            <SectionTitle id="trabalhos-titulo">{work.title}</SectionTitle>
          </div>
          <p className="max-w-[32rem] font-grotesk text-[1.1rem] leading-relaxed text-v-muted lg:justify-self-end">{work.lead}</p>
        </div>

        {/* Featured: ÁUREA */}
        <article data-reveal className="grid gap-10 border-t border-v-ink pt-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
          <div className="relative pb-8">
            <BrowserFrame src={f.desktop} alt="Site de demonstração ÁUREA no computador" url={f.url.replace("https://", "")} />
            <PhoneFrame src={f.mobile} alt="Site de demonstração ÁUREA no celular" className="absolute -bottom-2 right-4 w-[24%] max-w-[170px]" />
          </div>
          <div className="flex flex-col gap-5 lg:pt-4">
            <Kicker>{f.scope}</Kicker>
            <h3 className="font-grotesk text-[2rem] font-semibold tracking-[-0.02em]">
              {f.name} <span className="font-normal text-v-muted">· {f.type}</span>
            </h3>
            <p className="font-grotesk text-[1.05rem] leading-relaxed text-v-muted">{f.body}</p>
            <a href={whatsappUrl("Olá! Vi o projeto ÁUREA no site da Vitrini72 e quero falar sobre um site multipágina.")} target="_blank" rel="noopener noreferrer" className={`${btnSecondary} self-start`}>
              {f.cta}
              <Arrow />
            </a>
            <a href={f.url} target="_blank" rel="noopener noreferrer" className="self-start font-mono text-[0.8rem] uppercase tracking-[0.08em] underline decoration-v-line underline-offset-[6px] hover:decoration-v-ink">
              Abrir demonstração ↗
            </a>
          </div>
        </article>

        {/* Package demos */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-10">
          {work.items.map((item, i) => (
            <article key={item.name} data-reveal data-reveal-delay={i * 100} className="flex flex-col gap-6">
              <BrowserFrame src={item.desktop} alt={`Site de demonstração ${item.name} no computador`} url={item.url.replace("https://", "")} />
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-v-line pt-5">
                <div>
                  <h3 className="font-grotesk text-[1.4rem] font-semibold tracking-[-0.015em]">
                    {item.name} <span className="font-normal text-v-muted">· {item.type}</span>
                  </h3>
                  <Kicker className="mt-1">{item.scope}</Kicker>
                </div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-mono text-[0.8rem] uppercase tracking-[0.08em] underline decoration-v-line underline-offset-[6px] hover:decoration-v-ink">
                  Abrir demonstração ↗
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="font-grotesk text-[0.85rem] text-v-muted">{work.demoNote}</p>

        {/* Real clients */}
        {clientSites.length > 0 && (
          <div data-reveal className="flex flex-col gap-6 border-t border-v-line pt-10">
            <Kicker>{work.clientsTitle}</Kicker>
            <ul className={`grid gap-8 sm:grid-cols-2 ${clientSites.length >= 3 ? "lg:grid-cols-3" : ""}`}>
              {clientSites.map((c) => (
                <li key={c.url}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col gap-4">
                    {c.screenshot ? (
                      <BrowserFrame src={c.screenshot} alt={`Página inicial do site ${c.name}`} url={c.domain} className="transition-transform duration-300 group-hover:-translate-y-1" />
                    ) : (
                      <div className="flex aspect-[16/10] items-end rounded-[14px] border border-v-line bg-v-paper p-6">
                        <span className="font-grotesk text-[1.6rem] font-semibold tracking-[-0.02em]">{c.name}</span>
                      </div>
                    )}
                    <span className="flex items-baseline justify-between gap-4 border-t border-v-line pt-4">
                      <span>
                        <span className="block font-grotesk text-[1.2rem] font-semibold tracking-[-0.015em]">{c.name}</span>
                        <span className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-v-muted">{c.vertical}</span>
                      </span>
                      <span className="font-mono text-[0.8rem] text-v-muted group-hover:text-v-ink">
                        {c.domain} <span aria-hidden>↗</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
