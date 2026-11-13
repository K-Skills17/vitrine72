import { Arrow, btnPrimary, container } from "./ui";
import { checkout, finalCta, whatsappUrl } from "./content";

export function FinalCta() {
  return (
    <section aria-labelledby="final-titulo" className="py-24 lg:py-36">
      <div className={`${container} flex flex-col gap-10`}>
        <h2 id="final-titulo" data-reveal className="max-w-[60rem] text-balance font-grotesk text-[3rem] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-[4.5rem] lg:text-[6rem]">
          {finalCta.title}
        </h2>
        <p className="max-w-[34rem] font-grotesk text-[1.15rem] text-v-muted">{finalCta.lead}</p>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <a href={checkout.core} className={btnPrimary}>
            {finalCta.cta}
            <Arrow />
          </a>
          <a href={whatsappUrl(finalCta.whatsappText)} target="_blank" rel="noopener noreferrer" className="font-mono text-[0.85rem] uppercase tracking-[0.08em] underline decoration-v-line underline-offset-[6px] hover:decoration-v-ink">
            {finalCta.whatsapp} ↗
          </a>
        </div>
      </div>
    </section>
  );
}
