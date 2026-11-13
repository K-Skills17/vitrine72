import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";
import { AnalyticsListener } from "@/components/conversion/AnalyticsListener";
import { QualifierGate } from "@/components/conversion/QualifierGate";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { DemoNotice } from "@/components/layout/DemoNotice";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { analyticsConfig } from "@/config/analytics";
import { siteConfig } from "@/config/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.descriptor}`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Clínica de estética avançada com avaliação individual, planejamento personalizado e acompanhamento profissional.",
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f4efe8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { ga4Id } = analyticsConfig;

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-espresso focus:px-4 focus:py-3 focus:text-ivory"
        >
          Pular para o conteúdo
        </a>
        <DemoNotice />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <AnalyticsListener />
        <QualifierGate />
        <ChatWidget />

        {ga4Id && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4Id}',{anonymize_ip:true});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
