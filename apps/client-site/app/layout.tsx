import type { Metadata, Viewport } from "next";
import { config } from "@/lib/config";
import { themeStyle } from "@/lib/theme";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileCta from "@/components/layout/MobileCta";
import RevealObserver from "@/components/motion/RevealObserver";
import "./globals.css";

const { palette, fontPair, businessName, slug, jsonLd } = config;
const siteUrl = `https://${slug}.vitrini72.com.br`;

export const metadata: Metadata = {
  title: {
    default: businessName,
    template: `%s | ${businessName}`,
  },
  description: config.copyBlocks.heroSubheadline,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: businessName,
    title: businessName,
    description: config.copyBlocks.heroSubheadline,
    url: siteUrl,
  },
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: palette.background,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" style={themeStyle(palette, fontPair) as React.CSSProperties}>
      <head>
        {/* Fonts come from the builder's checked font pair (dynamic per site, so not next/font). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontPair.googleFontsUrl} rel="stylesheet" />

        {jsonLd && Object.keys(jsonLd).length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        )}
        <link rel="alternate" type="application/json" href="/ai-catalog.json" title="AI Catalog" />
      </head>
      <body className="pb-sticky-cta md:pb-0">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-bg"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <MobileCta />
        <RevealObserver />
      </body>
    </html>
  );
}
