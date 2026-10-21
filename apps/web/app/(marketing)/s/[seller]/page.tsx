import { notFound } from "next/navigation";
import type { Metadata } from "next";
import sellers from "@/../../config/sellers.json";
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

interface Props {
  params: Promise<{ seller: string }>;
  searchParams: Promise<Record<string, string>>;
}

interface SellerConfig {
  id: string;
  name: string;
  asaasLinks: {
    SITE_5P_CARD?: string;
    SITE_5P_PIX?: string;
    ANCHOR_CARD?: string;
    ANCHOR_PIX?: string;
    LANDING_1P?: string;
  };
}

export async function generateMetadata(_props: Props): Promise<Metadata> {
  return { robots: { index: false } };
}

export default async function SellerPage({ params }: Props) {
  const { seller: sellerId } = await params;

  const seller = (sellers.sellers as SellerConfig[]).find(
    (s) => s.id === sellerId
  );
  if (!seller) notFound();

  const coreUrl = "/api/checkout?sku=SITE_5P";
  const anchorUrl = "/api/checkout?sku=ANCHOR_SITE_GBP_BOT";

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.cookie = "v72_source=${encodeURIComponent(`seller:${sellerId}`)}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax";
          `,
        }}
      />
      <SiteNav />
      <main>
        <HeroSection partnerBanner={null} checkoutUrl={coreUrl} />
        <ComoFunciona />
        <OQueVemNoSite />
        <Portfolio />
        <Preco partnerBonus={false} coreUrl={coreUrl} anchorUrl={anchorUrl} />
        <RegrasEClaras />
        <FAQ />
        <FinalCTA checkoutUrl={coreUrl} />
      </main>
      <SiteFooter />
    </>
  );
}
