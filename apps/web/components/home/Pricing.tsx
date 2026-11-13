import { Arrow, Kicker, SectionTitle, btnPrimary, btnSecondary, container } from "./ui";
import { brl, pricing } from "./content";

export function Pricing() {
  return (
    <section id="preco" aria-labelledby="preco-titulo" className="border-t border-v-line bg-v-card py-24 lg:py-32">
      <div className={`${container} flex flex-col gap-14`}>
        <div data-reveal className="flex max-w-[44rem] flex-col gap-5">
          <Kicker>{pricing.kicker}</Kicker>
          <SectionTitle id="preco-titulo">{pricing.title}</SectionTitle>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {pricing.plans.map((plan, i) => (
            <article
              key={plan.id}
              data-reveal
              data-reveal-delay={i * 100}
              aria-labelledby={`plano-${plan.id}`}
              className={`flex flex-col gap-8 rounded-[20px] p-8 sm:p-10 ${plan.highlight ? "bg-v-ink text-v-paper" : "border border-v-ink/20 bg-v-paper"}`}
            >
              <div className="flex flex-col gap-3">
                {plan.highlight && <Kicker className="!text-v-signal">Mais completo</Kicker>}
                <h3 id={`plano-${plan.id}`} className="font-grotesk text-[1.5rem] font-semibold tracking-[-0.015em]">
                  {plan.name}
                </h3>
              </div>
              <div>
                <p className="font-grotesk text-[3.4rem] font-semibold leading-none tracking-[-0.04em]">
                  {brl(plan.pix)}
                  <span className={`ml-2 align-middle font-mono text-[0.85rem] font-normal tracking-normal ${plan.highlight ? "text-v-paper/60" : "text-v-muted"}`}>no Pix</span>
                </p>
                <p className={`mt-3 font-grotesk text-[0.95rem] ${plan.highlight ? "text-v-paper/70" : "text-v-muted"}`}>
                  ou {brl(plan.card)} em até {plan.installments}x no cartão
                </p>
              </div>
              <ul className={`flex flex-col border-t ${plan.highlight ? "border-v-paper/20" : "border-v-line"}`}>
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-3 border-b py-3 font-grotesk text-[1rem] ${plan.highlight ? "border-v-paper/20" : "border-v-line"}`}>
                    <span aria-hidden className="text-v-signal">●</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`${plan.highlight ? btnPrimary : btnSecondary} mt-auto`}
              >
                {plan.cta}
                <Arrow />
              </a>
            </article>
          ))}
        </div>
        <p className="-mt-6 font-grotesk text-[0.85rem] text-v-muted">{pricing.cardNote}</p>

        <div data-reveal className="grid gap-8 border-t border-v-ink pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <h3 className="font-grotesk text-[1.5rem] font-semibold tracking-[-0.015em]">{pricing.extrasTitle}</h3>
          <dl className="border-t border-v-line">
            {pricing.extras.map((e) => (
              <div key={e.label} className="flex items-baseline justify-between gap-6 border-b border-v-line py-4">
                <dt className="font-grotesk text-[1rem]">{e.label}</dt>
                <dd className="shrink-0 font-mono text-[0.9rem]">{e.price}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="font-grotesk text-[1rem] text-v-muted">
          {pricing.downsell.text}{" "}
          <a href={pricing.downsell.href} className="font-semibold text-v-ink underline decoration-v-signal decoration-2 underline-offset-4">
            {pricing.downsell.link}
          </a>
        </p>
      </div>
    </section>
  );
}
