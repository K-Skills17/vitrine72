# ÁUREA — demonstration clinic website

Third Vitrini72 demo site: a fictional premium aesthetic clinic in Brazil. Next.js App Router, React, TypeScript, Tailwind CSS 4, Motion. Content is pt-BR.

> ÁUREA is fictional. All professionals, registrations, addresses and contact data are demonstration placeholders.

## Status

Phases 0–3 complete: specification, design system, app foundation (layout, header, mobile navigation, footer, buttons, WhatsApp and analytics utilities). The homepage is a holding page until Phase 4. See `docs/CHANGELOG.md`.

## Requirements

Node ≥ 20 and pnpm ≥ 9. The app is a workspace package of the `vitrine72` monorepo.

## Commands

Run from the repository root:

```bash
pnpm install                       # installs every workspace, including aurea
pnpm --filter aurea dev            # http://localhost:3003
pnpm --filter aurea build
pnpm --filter aurea start          # serves the production build on :3003
pnpm --filter aurea typecheck
pnpm --filter aurea lint
pnpm --filter aurea test           # Vitest unit tests
pnpm --filter aurea test:e2e       # Playwright (from Phase 4 onward)
```

## Configuration

Copy `.env.example` to `.env.local`.

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical, sitemap and Open Graph base | `http://localhost:3003` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Clinic WhatsApp (`55` + DDD + number) | empty: links open WhatsApp without a recipient |
| `NEXT_PUBLIC_PHONE_NUMBER` | `tel:` links | empty: phone links hidden |
| `NEXT_PUBLIC_GA4_ID` | GA4 measurement ID | empty: analytics is a no-op |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Allow search engines | `false` (demo is `noindex`) |

Every other clinic detail (name, address, hours, legal identifiers) lives in `src/config/site.ts`. Placeholders are typed as `Placeholder` so they are easy to find before a real launch.

## Structure

```text
src/
  app/          routes, layout, globals.css (design tokens)
  components/   layout/ · ui/ · conversion/
  config/       site.ts · analytics.ts · motion.ts
  content/      navigation.ts · treatments.ts
  lib/          whatsapp.ts · analytics.ts · metadata.ts · utils.ts
  types/        clinic.ts · treatment.ts
docs/           brief, design system, architecture, components, content, assets, changelog
```

## Deployment

Create a separate Vercel project with Root Directory `apps/aurea`, install command `pnpm install --frozen-lockfile` and the framework preset Next.js. Set the environment variables above.

## Troubleshooting

- **Styles missing after a rebuild while `next start` is running:** the old `next-server` process is still serving HTML that points at deleted CSS chunks. Stop it (`pkill -f next-server`) and start again.
- **Vitest peer warning about Vite:** `vite` is pinned in this package because a sibling workspace hoists Vite 5.
