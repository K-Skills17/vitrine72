import type { Metadata, Viewport } from "next";
import { config } from "@/lib/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

const { palette, fontPair, businessName, address, phone, slug, jsonLd } = config;

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
    url: `https://${slug}.vitrini72.com.br`,
  },
  metadataBase: new URL(`https://${slug}.vitrini72.com.br`),
  alternates: {
    canonical: `https://${slug}.vitrini72.com.br`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: palette.primary,
};

// CSS variables from palette + fonts, injected inline
const cssVars = `
  :root {
    --color-primary: ${palette.primary};
    --color-secondary: ${palette.secondary};
    --color-accent: ${palette.accent};
    --color-bg: ${palette.background};
    --color-text: ${palette.text};
    --font-display: "${fontPair.display}";
    --font-body: "${fontPair.body}";
  }
`.trim();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Palette CSS vars */}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontPair.googleFontsUrl} rel="stylesheet" />

        {/* JSON-LD structured data */}
        {jsonLd && Object.keys(jsonLd).length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}

        {/* AI optimization discovery */}
        <link rel="alternate" type="application/json" href="/ai-catalog.json" title="AI Catalog" />
      </head>
      <body className="bg-[var(--color-bg)] text-[var(--color-text)]">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
