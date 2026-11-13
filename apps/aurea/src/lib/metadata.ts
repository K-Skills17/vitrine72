import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Route path starting with "/", used for the canonical URL. */
  path: string;
}

/** Per-route metadata with canonical and Open Graph, built on the root defaults. */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${siteConfig.name}`,
      description,
      url: path,
      siteName: `${siteConfig.name} — ${siteConfig.descriptor}`,
      locale: siteConfig.locale,
      type: "website",
    },
  };
}
