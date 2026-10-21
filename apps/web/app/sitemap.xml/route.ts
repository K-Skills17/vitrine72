import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrini72.com.br";

export function GET(): NextResponse {
  const now = new Date().toISOString().slice(0, 10);

  const pages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/#como-funciona", priority: "0.8", changefreq: "monthly" },
    { loc: "/#o-que-vem", priority: "0.8", changefreq: "monthly" },
    { loc: "/#portfolio", priority: "0.7", changefreq: "monthly" },
    { loc: "/#preco", priority: "0.9", changefreq: "weekly" },
    { loc: "/#faq", priority: "0.8", changefreq: "monthly" },
    { loc: "/termos", priority: "0.3", changefreq: "monthly" },
    { loc: "/privacidade", priority: "0.3", changefreq: "monthly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
