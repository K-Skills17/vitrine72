import type { Metadata } from "next";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeNav } from "@/components/home/HomeNav";
import { Included } from "@/components/home/Included";
import { Pricing } from "@/components/home/Pricing";
import { RevealObserver } from "@/components/home/RevealObserver";
import { Rules } from "@/components/home/Rules";
import { Timeline } from "@/components/home/Timeline";
import { Work } from "@/components/home/Work";
import { grotesk, mono } from "@/components/home/fonts";
import { generateMarketingJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: { absolute: "Vitrini72 — Sites para negócios locais, prévia em 3 dias úteis" },
  description:
    "Site profissional de até 5 páginas para negócios locais em todo o Brasil: celular, WhatsApp e Google Meu Negócio. Prévia em 3 dias úteis. A partir de R$ 1.797 no Pix.",
};

export default function HomePage() {
  const jsonLd = generateMarketingJsonLd();

  return (
    <div className={`v72-home ${grotesk.variable} ${mono.variable} min-h-screen bg-v-paper font-grotesk text-v-ink antialiased`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-v-ink focus:px-5 focus:py-3 focus:text-v-paper">
        Pular para o conteúdo
      </a>
      <HomeNav />
      <main id="conteudo">
        <HomeHero />
        <Work />
        <Timeline />
        <Included />
        <Pricing />
        <Rules />
        <Faq />
        <FinalCta />
      </main>
      <HomeFooter />
      <RevealObserver />
    </div>
  );
}
