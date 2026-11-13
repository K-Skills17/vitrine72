# Site Architecture

## Placement in the monorepo

ÁUREA is a new workspace app at `apps/aurea`, not a fourth niche inside `apps/demo`.

**Why:** `apps/demo` is a single-page, config-swapped template (`NEXT_PUBLIC_NICHE`) whose whole flow is a WhatsApp qualifier gate. ÁUREA needs seven routes, dynamic treatment pages, a design system, Motion, a form, unit tests and its own docs. Forcing that into the niche-config pattern would either bloat `NicheConfig` for the other two demos or compromise this brief. A separate app keeps both clean; `pnpm-workspace.yaml` already includes `apps/*`.

Trade-off: `apps/aurea` will run newer major versions (Next 16, Tailwind 4) than `apps/demo`/`apps/web` (Next 15, Tailwind 3). They share one lockfile but no code, so this is acceptable; it is documented in `CHANGELOG.md`.

Deployment: its own Vercel project with Root Directory `apps/aurea`.

## Routes

| Route | Purpose | Primary next step |
|---|---|---|
| `/` | Brand + acquisition | Agende sua avaliação (WhatsApp, general message) |
| `/tratamentos` | Treatment discovery by category | Open a treatment / WhatsApp |
| `/tratamentos/[slug]` | Treatment detail, landing page for ads/search | WhatsApp with treatment-specific message |
| `/clinica` | Environment, approach, experience | Agendar avaliação |
| `/profissionais` | Profiles (fictional, labelled) | Agendar avaliação |
| `/contato` | WhatsApp, form, address/hours placeholders | WhatsApp or form |
| `/privacidade` | Privacy notice (demo draft) | Back to contact |
| 404 | Not found | Tratamentos / Início |

Slugs (static, generated at build):
`toxina-botulinica`, `bioestimuladores-de-colageno`, `preenchimento-facial`, `skinbooster`, `laser-dermatologico`, `qualidade-da-pele`.

Categories (homepage + directory filter): Estética facial, Qualidade da pele, Rejuvenescimento, Estética corporal. A treatment may belong to more than one category.

Note: the six demonstration treatments are facial/skin. *Estética corporal* currently has no dedicated treatment page. Options: (a) show it as a category with an honest "sob avaliação" description linking to contact, or (b) add a body treatment. Default: (a), revisit if Vitrini72 wants a body page.

## Visitor journeys

- **Decided:** lands on `/tratamentos/[slug]` → sticky/hero WhatsApp with treatment message. Two taps.
- **Researching:** `/` → treatment index → detail → related treatments → WhatsApp.
- **Evaluating clinic:** `/` → `/clinica` or `/profissionais` → patient journey → contact.

Every page ends in a contextual conversion block; header CTA and mobile sticky CTA are always available.

## Application structure (planned)

```text
apps/aurea/
├── docs/                      project documentation (this folder)
├── public/images/{hero,treatments,clinic,professionals,editorial}/
├── src/
│   ├── app/                   routes, layout, sitemap.ts, robots.ts, not-found.tsx
│   ├── components/
│   │   ├── layout/            Header, MobileNav, Footer, DemoNotice
│   │   ├── sections/          homepage + page sections (Hero, Intro, TreatmentIndex, ...)
│   │   ├── treatments/        TreatmentHero, TreatmentBody, RelatedTreatments
│   │   ├── conversion/        WhatsAppLink, StickyCta, InquiryForm, FinalCta
│   │   └── ui/                Button, Container, SectionHeading, Accordion, Field, EditorialImage
│   ├── content/               clinic.ts, navigation.ts, treatments.ts, professionals.ts, faq.ts
│   ├── config/                site.ts (clinic config, phone), analytics.ts, motion.ts
│   ├── lib/                   whatsapp.ts, analytics.ts, metadata.ts, utils.ts
│   └── types/                 treatment.ts, clinic.ts
├── tests/                     Playwright: navigation, conversion, responsive
└── src/lib/*.test.ts          Vitest unit tests (WhatsApp utility)
```

Design tokens live in one place: Tailwind 4 `@theme` in `src/app/globals.css`. A separate `design-tokens.ts` is only created if TypeScript needs token values at runtime (e.g. motion durations, which live in `config/motion.ts`). This avoids two sources of truth.

## Data flow

```
config/site.ts ──► lib/whatsapp.ts ──► conversion/WhatsAppLink (client: fires analytics)
content/*.ts   ──► app/**/page.tsx (Server Components) ──► sections/*, treatments/*
lib/analytics.ts ◄── client components only; no-op unless provider configured
```

- Content is typed TypeScript modules, read at build time. No CMS.
- All pages are statically generated.
- Client Components only for: mobile nav, accordion, form, WhatsApp/CTA tracking wrapper, motion reveals.

## Conversion points

Header CTA · Hero CTA · Treatment hero CTA · Treatment index row CTA · Floating WhatsApp (desktop) · Mobile sticky bar · Final CTA · Contact page. All built from `lib/whatsapp.ts`; none construct URLs themselves.

On mobile the sticky bar replaces the floating button (never both), and the page reserves bottom padding equal to its height so it never covers content or form fields.
