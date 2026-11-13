import { Container } from "@/components/ui/Container";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { approach } from "@/content/home";
import { images } from "@/content/images";

/** Reverse golden split: architectural image (1) beside the approach (1.618). */
export function Approach() {
  return (
    <section aria-labelledby="abordagem" className="border-t border-line py-section">
      <Container className="grid gap-12 lg:grid-golden-reverse lg:gap-20">
        <EditorialImage reveal image={images.homeIntro} ratio="3/4" sizes="(min-width: 1024px) 34vw, 100vw" className="max-lg:aspect-[4/3]" />
        <div className="flex flex-col gap-14">
          <SectionHeading reveal eyebrow={approach.eyebrow} id="abordagem" title={approach.title} lead={approach.lead} />
          <ol className="border-t border-line">
            {approach.principles.map((p, i) => (
              <li key={p.title} data-reveal data-reveal-delay={i * 90} className="grid gap-2 border-b border-line py-7 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span className="font-display text-h3 text-taupe" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-h3 font-normal">{p.title}</h3>
                  <p className="max-w-prose text-body text-umber">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
