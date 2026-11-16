import { HomeFooter } from "@/components/home/HomeFooter";
import { RevealObserver } from "@/components/home/RevealObserver";
import { grotesk, mono } from "@/components/home/fonts";
import { isSeasonal } from "./content";
import {
  ClinicFaq,
  ClinicFinalCta,
  ClinicGap,
  ClinicGuarantee,
  ClinicHero,
  ClinicIncluded,
  ClinicNav,
  ClinicPricing,
  ClinicRules,
  ClinicTimeline,
} from "./Sections";

/** The aesthetic-clinic offer page, shared by /clinicas and /s/[seller]/clinicas. */
export function ClinicPage() {
  return (
    <div className={`v72-home ${grotesk.variable} ${mono.variable} min-h-screen bg-v-paper font-grotesk text-v-ink antialiased`}>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-v-ink focus:px-5 focus:py-3 focus:text-v-paper">
        Pular para o conteúdo
      </a>
      <ClinicNav />
      <main id="conteudo">
        <ClinicHero seasonal={isSeasonal()} />
        <ClinicGap />
        <ClinicIncluded />
        <ClinicTimeline />
        <ClinicGuarantee />
        <ClinicPricing />
        <ClinicRules />
        <ClinicFaq />
        <ClinicFinalCta />
      </main>
      <HomeFooter tagline="Pedidos de avaliação para clínicas de estética em todo o Brasil" />
      <RevealObserver />
    </div>
  );
}
