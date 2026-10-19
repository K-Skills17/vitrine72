import { notFound } from "next/navigation";
import type { Metadata } from "next";
import partners from "@/../../config/partners.json";
import paymentConfig from "@/../../config/payment.json";
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
import { PartnerBanner } from "@/components/marketing/PartnerBanner";
import { PARTNER_BONUS } from "@vitrine72/core";

interface Props {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const partner = (partners.partners as PartnerConfig[]).find(
    (p) => p.handle === handle
  );
  if (!partner) return {};
  return {
    title: `Vitrine72 — Oferta especial de ${partner.name}`,
    robots: { index: false },
  };
}

interface PartnerConfig {
  handle: string;
  name: string;
  kiwifyAffiliateId: string;
  bonusCycles?: number;
}

export default async function PartnerPage({ params }: Props) {
  const { handle } = await params;

  const partner = (partners.partners as PartnerConfig[]).find(
    (p) => p.handle === handle
  );
  if (!partner) notFound();

  // Set source cookie (30 days) — done via response headers in middleware
  // The cookie is set client-side via a small component for RSC compatibility
  const checkoutUrl = buildCheckoutUrl(partner, "SITE_5P");

  return (
    <>
      {/* Source cookie set by SourceCookieSetter client component */}
      <SetSourceCookie source={`partner:${handle}`} />
      <SiteNav />
      <main>
        <PartnerBanner
          partnerName={partner.name}
          freeCycles={partner.bonusCycles ?? PARTNER_BONUS.freeCycles}
        />
        <HeroSection partnerBanner={partner} checkoutUrl={checkoutUrl} />
        <ComoFunciona />
        <OQueVemNoSite />
        <Portfolio />
        <Preco partnerBonus checkoutUrl={checkoutUrl} />
        <RegrasEClaras />
        <FAQ />
        <FinalCTA checkoutUrl={checkoutUrl} />
      </main>
      <SiteFooter />
    </>
  );
}

function buildCheckoutUrl(partner: PartnerConfig, sku: string): string {
  const cfg = paymentConfig as typeof paymentConfig;
  if (cfg.provider === "kiwify") {
    const productId =
      (cfg.kiwify.products as Record<string, string>)[sku] ?? "";
    return `${cfg.kiwify.checkoutBaseUrl}/${productId}?aff=${partner.kiwifyAffiliateId}`;
  }
  // Asaas fallback
  const link =
    (cfg.asaas.paymentLinks as Record<string, string>)[`${sku}_PIX`] ?? "#";
  return `${link}?src=${partner.handle}`;
}

// Client component to set the source cookie
function SetSourceCookie({ source }: { source: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          document.cookie = "v72_source=${encodeURIComponent(source)}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax";
        `,
      }}
    />
  );
}
