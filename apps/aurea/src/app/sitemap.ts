import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { treatmentPath, treatmentSummaries } from "@/content/treatments";

const staticRoutes = ["/", "/tratamentos", "/clinica", "/profissionais", "/contato", "/privacidade"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...staticRoutes, ...treatmentSummaries.map((t) => treatmentPath(t.slug))];
  return routes.map((path) => ({
    url: `${siteConfig.siteUrl}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.startsWith("/tratamentos/") ? 0.8 : 0.6,
  }));
}
