import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ComoFunciona } from "@/components/marketing/ComoFunciona";
import { OQueVemNoSite } from "@/components/marketing/OQueVemNoSite";
import { Portfolio } from "@/components/marketing/Portfolio";
import { Preco } from "@/components/marketing/Preco";
import { RegrasEClaras } from "@/components/marketing/RegrasEClaras";
import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteNav } from "@/components/marketing/SiteNav";
import { generateMarketingJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Vitrine72 — Site profissional em 72h para negócios em São Paulo",
  description:
    "Seu site até 5 páginas pronto em 72 horas úteis. Mobile, WhatsApp, Google Meu Negócio. A partir de R$ 1.797 no Pix.",
};

export default function HomePage() {
  const jsonLd = generateMarketingJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />
      <main>
        <HeroSection partnerBanner={null} checkoutUrl="/api/checkout?sku=SITE_5P" />
        <ComoFunciona />
        <OQueVemNoSite />
        <Portfolio />
        <Preco
          partnerBonus={false}
          coreUrl="/api/checkout?sku=SITE_5P"
          anchorUrl="/api/checkout?sku=ANCHOR_SITE_GBP_BOT"
        />
        <RegrasEClaras />
        <FAQ />
        <FinalCTA checkoutUrl="/api/checkout?sku=SITE_5P" />
      </main>
      <SiteFooter />
    </>
  );
}
