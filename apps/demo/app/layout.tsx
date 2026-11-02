import type { Metadata } from "next";
import { getNicheConfig } from "../lib/niche";
import "./globals.css";

const cfg = getNicheConfig();

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={cfg.googleFontsUrl} rel="stylesheet" />
        <style>{`
          :root {
            --color-primary: ${cfg.primaryColor};
            --color-primary-light: ${cfg.primaryLight};
            --color-primary-dark: ${cfg.primaryDark};
            --color-accent: ${cfg.accentColor};
            --color-bg: ${cfg.bgColor};
            --color-surface: ${cfg.surfaceColor};
            --color-text: ${cfg.textColor};
            --color-muted: ${cfg.mutedColor};
          }
          body {
            font-family: "${cfg.fontBody}", system-ui, sans-serif;
          }
        `}</style>

        {ga4Id && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`,
              }}
            />
          </>
        )}
        {pixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`,
            }}
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
