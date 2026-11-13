import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "800"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Vitrini72 — Site profissional para o seu negócio",
    template: "%s | Vitrini72",
  },
  description:
    "Site profissional de até 5 páginas para negócios locais em todo o Brasil. Prévia em 3 dias úteis. Celular, WhatsApp e Google Meu Negócio.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrini72.com.br"
  ),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Vitrini72",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-theme="dark" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Synchronous script: sets theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
