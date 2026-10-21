import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrini72.com.br";

export function GET(): NextResponse {
  const robots = `User-agent: *
Allow: /

# AI Assistants — explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

# Disallow ops and private routes
Disallow: /ops
Disallow: /intake
Disallow: /edits
Disallow: /api

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
