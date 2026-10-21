import { config } from "@/lib/config";

export function GET() {
  const base = `https://${config.slug}.vitrini72.com.br`;
  const pages = [
    { slug: "", priority: "1.0" },
    { slug: "servicos", priority: "0.9" },
    { slug: "sobre", priority: "0.7" },
    { slug: "faq", priority: "0.8" },
    { slug: "contato", priority: "0.8" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${base}${p.slug ? `/${p.slug}` : ""}</loc>
    <lastmod>${config.updatedAt}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
