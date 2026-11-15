# client-site — builder template

The site every builder project deploys. `apps/builder` uploads this folder to Vercel with a generated `site-config.json`; nothing else changes per client. It is a standalone npm project (no workspace imports) because it is deployed on its own.

Design rules: `.claude/skills/editorial-web-build/SKILL.md` (repo root). Niche-agnostic: everything client-specific comes from `site-config.json`.

## How a site varies

| Config field | Variants (builder name → what renders) |
|---|---|
| `heroStyle` | `split-text-left` golden split, text + portrait · `fullscreen-photo` headline above a wide photo band · `editorial-asymmetric` oversized headline, offset photo · `minimal-dark` typographic on the inverse band. No photo → typographic. |
| `cardStyle` | `card-shadow` numbered ruled index · `card-bordered` two-column ruled list · `card-dark` list on the inverse band · `card-minimal` large rows with photos |
| `aboutStyle` | `about-split` photo + text · `about-centered` large statement · `about-credentials` text + ruled facts (only supplied data and Google rating) |
| `layoutVariant` | Home order: 1 services → reviews → about → FAQ · 2 services → about → reviews → FAQ · 3 about → services → reviews → FAQ |
| `palette`, `fontPair` | CSS variables on `<html>` (`lib/theme.ts`). Muted, line and inverse tones are mixed from text and background, so light and dark palettes both work. |
| `primaryAction` | `whatsapp` / `phone` / `form`. There is no form backend: `form` opens WhatsApp with "Pedir orçamento" / "Agendar avaliação". |
| `vertical` | Regulated niches (health, legal) get evaluation wording. Reviews come only from `gbpData`, which the builder leaves empty for regulated niches unless the intake allows reviews. |

## Structure

```text
app/                 routes: / /servicos /sobre /faq /contato + AI-discovery routes
components/ui/       Button (only button), Layout (Container, SectionLabel, SpecGrid), EditorialImage
components/layout/   Header, MobileNav (native <dialog>), MobileCta (single mobile action), Footer
components/sections/ Hero, Services, About, Reviews, Faq (native <details>), Contact, PageHeader
components/motion/   RevealObserver (IntersectionObserver; content visible without JS)
lib/                 config (types + helpers), theme (palette → CSS vars), whatsapp (all wa.me links)
scripts/fixtures/    test configs + check.cjs (not uploaded to Vercel)
```

## Checking changes

```bash
npx tsc --noEmit
node scripts/fixtures/check.cjs            # all fixtures, or name some: a-estetica-dark c-buffet
```

`check.cjs` builds the template once per fixture and visits every route at 1440, 1024, 768, 390 and 360px. It fails on horizontal overflow, broken images, console errors, a missing business name, anything but one `h1`, or a WhatsApp link whose message does not name the business. Screenshots go to `scripts/fixtures/out/` (git-ignored). Fixture photos are copied from `apps/aurea/public/images` into `public/_fixtures/` (git-ignored, so never deployed).

Add a fixture whenever you add a variant or a niche behaves differently.
