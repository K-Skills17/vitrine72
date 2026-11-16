import { CLINIC_OFFER } from "@vitrine72/core";
import { Wordmark } from "@/components/home/HomeNav";
import { work } from "@/components/home/content";
import { Arrow, BrowserFrame, Kicker, PhoneFrame, SectionTitle, btnPrimary, btnSecondary, container } from "@/components/home/ui";
import { GapCalculator } from "./GapCalculator";
import { faq, finalCta, gap, guarantee, hero, included, price, pricing, rules, timeline, whatsapp } from "./content";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function ClinicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-v-line bg-v-paper">
      <div className={`${container} flex h-16 items-center justify-between gap-6`}>
        <a href="#topo" aria-label="Vitrini72, início da página">
          <Wordmark />
        </a>
        <a href={whatsapp.main} {...external} className={`${btnPrimary} min-h-10 px-5 text-[0.9rem]`}>
          Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}

function PriceLine() {
  return (
    <p className="font-grotesk text-[0.95rem] leading-snug text-v-muted">
      <span className="font-semibold text-v-ink">{price.label(price.current)}</span>
      {price.isFounding ? (
        <>
          {" "}
          <span className="text-v-muted line-through decoration-1">{price.label(price.full)}</span>
          <br />
          Restam {price.foundingLeft} de {price.foundingSpots} vagas no preço de lançamento
        </>
      ) : (
        <>
          <br />
          Pacote de {CLINIC_OFFER.includedDays} dias, pagamento único
        </>
      )}
    </p>
  );
}

export function ClinicHero({ seasonal }: { seasonal: boolean }) {
  const h = hero(seasonal);
  return (
    <section id="topo" aria-labelledby="hero-titulo" className="overflow-hidden">
      <div className={`${container} grid items-center gap-14 pb-20 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:pb-28 lg:pt-20`}>
        <div className="flex flex-col gap-7">
          <Kicker>
            <span className="mr-2 inline-block size-2 rounded-full bg-v-signal align-middle" aria-hidden />
            {h.kicker}
          </Kicker>
          <h1 id="hero-titulo" className="text-balance font-grotesk text-[2.7rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[3.8rem] lg:text-[4.3rem]">
            {h.title}
          </h1>
          <p className="max-w-[34rem] text-pretty font-grotesk text-[1.15rem] leading-relaxed text-v-muted">{h.lead}</p>
          {h.seasonNote && <p className="max-w-[34rem] font-grotesk text-[1rem] text-v-ink">{h.seasonNote}</p>}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
            <a href={whatsapp.main} {...external} className={btnPrimary}>
              {h.cta}
              <Arrow />
            </a>
            <PriceLine />
          </div>
          <a href="#garantia" className="self-start font-mono text-[0.8rem] uppercase tracking-[0.08em] text-v-ink underline decoration-v-line underline-offset-[6px] hover:decoration-v-ink">
            {h.secondary} ↓
          </a>
        </div>

        <figure className="relative pb-10 lg:pb-16">
          <BrowserFrame src={work.featured.desktop} alt="Exemplo de página de campanha para uma clínica de estética fictícia, ÁUREA" url="exemplo · clínica fictícia" priority />
          <PhoneFrame
            src={work.featured.mobile}
            alt="A mesma página de exemplo no celular"
            priority
            className="absolute -bottom-2 right-3 w-[30%] max-w-[190px] sm:right-8 lg:-bottom-4 lg:-left-10 lg:right-auto"
          />
          <figcaption className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-v-muted lg:pl-40">
            Exemplo de página · clínica fictícia
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function ClinicGap() {
  return (
    <section aria-labelledby="gap-titulo" className="bg-v-ink py-20 text-v-paper lg:py-28">
      <div className={container}>
        <p className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-paper/70">{gap.kicker}</p>
        <SectionTitle id="gap-titulo" className="mt-5 max-w-[22ch] text-v-paper">
          {gap.title}
        </SectionTitle>
        <ol className="mt-10 grid max-w-[60rem] gap-4 border-t border-v-paper/25 pt-8 sm:grid-cols-2 sm:gap-10">
          {gap.steps.map((s, i) => (
            <li key={s} className="flex gap-4 font-grotesk text-[1.05rem] leading-relaxed text-v-paper/85">
              <span className="font-mono text-[0.85rem] text-v-paper/60" aria-hidden>
                0{i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-[44rem] font-grotesk text-[1rem] leading-relaxed text-v-paper/75">{gap.lead}</p>
        <div className="mt-14">
          <GapCalculator />
        </div>
      </div>
    </section>
  );
}

export function ClinicIncluded() {
  return (
    <section aria-labelledby="inclui-titulo" className="py-20 lg:py-28">
      <div className={container}>
        <Kicker>{included.kicker}</Kicker>
        <SectionTitle id="inclui-titulo" className="mt-5 max-w-[20ch]">
          {included.title}
        </SectionTitle>
        <ol className="mt-14 grid border-t border-v-ink md:grid-cols-2 md:gap-x-14">
          {included.items.map((item, i) => (
            <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-2 border-b border-v-line py-7">
              <span className="font-mono text-[0.85rem] text-v-signal-dark" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-grotesk text-[1.35rem] font-semibold tracking-[-0.01em]">{item.title}</h3>
                <p className="mt-2 font-grotesk text-[1rem] leading-relaxed text-v-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-14">
          <div className="bg-v-card p-7 sm:p-9">
            <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-muted">{included.bonusTitle}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {included.bonuses.map((b) => (
                <li key={b} className="flex gap-3 font-grotesk text-[1.02rem] leading-relaxed">
                  <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-v-ink" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-7 sm:p-9 md:pl-0">
            <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-muted">{included.notNeededTitle}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {included.notNeeded.map((b) => (
                <li key={b} className="flex gap-3 font-grotesk text-[1.02rem] leading-relaxed">
                  <span className="font-mono text-v-signal-dark" aria-hidden>
                    ×
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClinicTimeline() {
  return (
    <section aria-labelledby="processo-titulo" className="border-t border-v-line bg-v-card py-20 lg:py-28">
      <div className={container}>
        <Kicker>{timeline.kicker}</Kicker>
        <SectionTitle id="processo-titulo" className="mt-5">
          {timeline.title}
        </SectionTitle>
        <ol className="mt-14 grid gap-0 lg:grid-cols-5 lg:gap-8">
          {timeline.steps.map((s) => (
            <li key={s.mark} className="border-t-2 border-v-ink pb-8 pt-5 lg:pb-0">
              <p className="font-mono text-[0.8rem] uppercase tracking-[0.08em] text-v-signal-dark">{s.mark}</p>
              <h3 className="mt-3 font-grotesk text-[1.2rem] font-semibold">{s.title}</h3>
              <p className="mt-2 font-grotesk text-[0.98rem] leading-relaxed text-v-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ClinicGuarantee() {
  const tiers = [...CLINIC_OFFER.guaranteeTiers].reverse();
  return (
    <section id="garantia" aria-labelledby="garantia-titulo" className="py-20 lg:py-28">
      <div className={container}>
        <Kicker>{guarantee.kicker}</Kicker>
        <h2 id="garantia-titulo" className="mt-5 max-w-[26ch] text-balance font-grotesk text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[2.6rem] lg:text-[3rem]">
          {guarantee.title}
        </h2>

        <div className="mt-14 grid gap-14 lg:grid-cols-2">
          <div>
            <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-muted">{guarantee.tiersTitle}</h3>
            <p className="mt-3 font-grotesk text-[1rem] leading-relaxed text-v-muted">{guarantee.tiersLead}</p>
            <table className="mt-6 w-full border-t border-v-ink font-grotesk text-[1rem]">
              <thead>
                <tr className="text-left">
                  <th scope="col" className="py-3 pr-4 font-mono text-[0.72rem] font-normal uppercase tracking-[0.08em] text-v-muted">Maior número, 30 dias</th>
                  <th scope="col" className="py-3 font-mono text-[0.72rem] font-normal uppercase tracking-[0.08em] text-v-muted">Meta garantida</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-v-line">
                  <td className="py-4 pr-4">{guarantee.belowMin}</td>
                  <td className="py-4 text-v-muted">{guarantee.belowMinResult}</td>
                </tr>
                {tiers.map((t, i) => {
                  const next = tiers[i + 1];
                  const range = next
                    ? `De ${t.minViews.toLocaleString("pt-BR")} a ${(next.minViews - 1).toLocaleString("pt-BR")}`
                    : `Acima de ${(t.minViews - 1).toLocaleString("pt-BR")}`;
                  return (
                    <tr key={t.minViews} className="border-t border-v-line">
                      <td className="py-4 pr-4">{range}</td>
                      <td className="py-4 font-semibold">{t.requests} pedidos em {CLINIC_OFFER.guaranteeDays} dias</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-10">
            <div>
              <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-muted">{guarantee.countsTitle}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {guarantee.counts.map((c) => (
                  <li key={c} className="flex gap-3 font-grotesk text-[1.02rem] leading-relaxed">
                    <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-v-ink" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-grotesk text-[0.95rem] text-v-muted">{guarantee.countsNote}</p>
            </div>
            <div>
              <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-muted">{guarantee.clinicTitle}</h3>
              <ol className="mt-4 flex flex-col gap-3">
                {guarantee.clinic.map((c, i) => (
                  <li key={c} className="flex gap-3 font-grotesk text-[1.02rem] leading-relaxed">
                    <span className="font-mono text-[0.85rem] text-v-muted" aria-hidden>
                      {i + 1}.
                    </span>
                    {c}
                  </li>
                ))}
              </ol>
              <p className="mt-4 font-grotesk text-[0.95rem] text-v-muted">{guarantee.clock}</p>
            </div>
            <div>
              <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-muted">{guarantee.excludesTitle}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {guarantee.excludes.map((c) => (
                  <li key={c} className="font-grotesk text-[1.02rem] leading-relaxed text-v-muted">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <a href={whatsapp.guarantee} target="_blank" rel="noopener noreferrer" className={`${btnSecondary} mt-14`}>
          Ver qual seria a meta da minha clínica
          <Arrow />
        </a>
      </div>
    </section>
  );
}

export function ClinicPricing() {
  return (
    <section id="preco" aria-labelledby="preco-titulo" className="border-t border-v-line bg-v-card py-20 lg:py-28">
      <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16`}>
        <div>
          <Kicker>{pricing.kicker}</Kicker>
          <SectionTitle id="preco-titulo" className="mt-5">
            {pricing.title}
          </SectionTitle>
          <p className="mt-6 max-w-[34rem] font-grotesk text-[1.1rem] leading-relaxed text-v-muted">{pricing.lead}</p>
          <p className="mt-4 max-w-[34rem] font-grotesk text-[1rem] text-v-ink">{pricing.compare}</p>
        </div>
        <div className="border-t-2 border-v-ink pt-8">
          <p className="font-grotesk text-[4rem] font-semibold leading-none tracking-[-0.03em] sm:text-[5rem]">{price.label(price.current)}</p>
          {price.isFounding ? (
            <>
              <p className="mt-4 font-grotesk text-[1rem] text-v-ink">
                Restam {price.foundingLeft} de {price.foundingSpots} vagas. {pricing.foundingNote}
              </p>
              <p className="mt-2 font-grotesk text-[1rem] text-v-muted">
                Depois: {price.label(price.full)}. {pricing.fullNote}
              </p>
            </>
          ) : (
            <p className="mt-4 font-grotesk text-[1rem] text-v-muted">Pacote de {CLINIC_OFFER.includedDays} dias, pagamento único.</p>
          )}
          <a href={whatsapp.main} {...external} className={`${btnPrimary} mt-8`}>
            {pricing.cta}
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function ClinicRules() {
  return (
    <section aria-labelledby="regras-titulo" className="py-20 lg:py-28">
      <div className={container}>
        <Kicker>{rules.kicker}</Kicker>
        <SectionTitle id="regras-titulo" className="mt-5 max-w-[18ch]">
          {rules.title}
        </SectionTitle>
        <dl className="mt-14 grid border-t border-v-ink md:grid-cols-2 md:gap-x-14">
          {rules.items.map((r) => (
            <div key={r.title} className="border-b border-v-line py-6">
              <dt className="font-grotesk text-[1.2rem] font-semibold">{r.title}</dt>
              <dd className="mt-2 font-grotesk text-[1rem] leading-relaxed text-v-muted">{r.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function ClinicFaq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="border-t border-v-line py-20 lg:py-28">
      <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
        <div>
          <Kicker>{faq.kicker}</Kicker>
          <SectionTitle id="duvidas-titulo" className="mt-5">
            {faq.title}
          </SectionTitle>
        </div>
        <div className="border-t border-v-ink">
          {faq.items.map((f) => (
            <details key={f.q} className="group border-b border-v-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-grotesk text-[1.15rem] font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="mt-0.5 font-mono text-v-signal-dark transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-[40rem] pb-6 font-grotesk text-[1rem] leading-relaxed text-v-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClinicFinalCta() {
  return (
    <section aria-labelledby="final-titulo" className="bg-v-ink py-20 text-v-paper lg:py-28">
      <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end`}>
        <div>
          <h2 id="final-titulo" className="text-balance font-grotesk text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.025em] sm:text-[3rem]">
            {finalCta.title}
          </h2>
          <p className="mt-5 max-w-[36rem] font-grotesk text-[1.1rem] leading-relaxed text-v-paper/80">{finalCta.body}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <a href={whatsapp.main} {...external} className={btnPrimary}>
            {finalCta.cta}
            <Arrow />
          </a>
          <p className="font-grotesk text-[0.95rem] text-v-paper/75">
            {price.label(price.current)}
            {price.isFounding ? ` · restam ${price.foundingLeft} de ${price.foundingSpots} vagas no preço de lançamento` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
