# Changelog — ÁUREA

Remaining phase: 9 SEO, end-to-end tests, QA report.

## 2026-11-13 — Phase 8: motion

### Added
- `RevealObserver` (motion/, **client**): one IntersectionObserver for every `[data-reveal]` element, re-run on route change. Elements still below the fold after mount fade in and rise 16px over 0.6s with `--ease-aurea`; anything already on screen is never hidden, and nothing is hidden without JavaScript. Optional `data-reveal-delay` staggers list items.
- `reveal` prop on `SectionHeading` and `EditorialImage`. Applied to section headings, the approach image and principles, journey steps, treatment rows, treatment content sections, professional profiles, the clinic teaser image and the closing CTA.
- Hero images (`priority`) settle from a 1.04 zoom over 0.9s (`animate-hero-settle`); the image is visible from the first frame.

### Decisions
- **CSS transitions driven by one observer instead of Motion for React components.** Sections stay Server Components and no animation library ships to the browser. The `motion` package stays installed but is not imported; `config/motion.ts` remains the token reference and its sync test still runs.
- Reduced motion: the observer does nothing, and the global CSS rule already disables transitions and animations.

### Verified (actual runs)
- `typecheck`, `lint`, `test` (33/33), `build`: pass.
- Playwright, homepage at 1440px: 18 reveal elements; at load 0 visible elements hidden; after scrolling all 18 shown. With `reducedMotion: "reduce"` none is ever set to pending.

## 2026-11-13 — Phase 7: conversion

### Added
- `InquiryForm` (conversion/, **client**) on `/contato`: name, mobile (validated as a Brazilian number), optional e-mail, treatment, contact period, optional message (no health data, 600 characters), explicit consent linked to the privacy notice. Errors are announced per field and focus moves to the first invalid one. Honest states: with no `NEXT_PUBLIC_INQUIRY_ENDPOINT` it says nothing was sent and nothing was booked; with an endpoint it POSTs JSON and still states no time has been reserved. Events `contact_form_start` and `contact_form_submit` (no field values).
- `lib/inquiry.ts` (validation, submission) with 4 unit tests; `ui/Field.tsx`.
- `MobileStickyCta` (below lg): bottom bar, treatment-aware on treatment pages ("Avaliação · Skinbooster"); the body reserves its height so it never covers content.
- `FloatingWhatsApp` (lg+): appears after 480px of scroll, so it doesn't duplicate the hero CTA. Treatment-aware.
- Both go through the qualification gate. The chat bubble now sits above the sticky bar on mobile and above the floating button on desktop.

### Verified (actual runs)
- `typecheck`, `lint`, `test` (33/33), `build`: pass.
- Playwright: empty submit shows 3 errors and focuses Nome; a valid submit shows the demo state. Sticky bar visible at 390px with the treatment label; last footer line clears the bar; chat bubble sits above it. At 1440px the floating button is hidden at the top, shown after scrolling, opens the gate; sticky bar hidden.

## 2026-11-13 — Phase 6: clinic, professionals, contact, privacy

### Added
- `/clinica`: header with detail image, full-width space photo, "Os ambientes" (reception, consultation room, procedure rooms on a golden split), the patient journey, and four care standards (prontuário, consentimento informado, produtos regularizados na Anvisa, materiais de uso único).
- `/profissionais`: fictional-content notice, one `ProfessionalProfile` per professional (portrait, role, placeholder registration, bio, specialties, links to the treatments they are responsible for, derived from treatment content), technical-responsible line.
- `/contato`: WhatsApp block (goes through the qualification gate), address, hours, other channels, all from `config/site.ts`, with a demo-data note.
- `/privacidade`: demo draft covering the qualification gate (answers not stored by the site), the chatbot (external processing, AI image analysis, history kept), audience measurement (no personal data) and LGPD rights, flagged for LGPD review.
- `content/pages.ts`; image slots 07–09 registered.

### Verified (actual runs)
- `typecheck`, `lint`, `test` (29/29), `build`: pass.
- Link crawl from `/`: 12 pages, 0 broken links. The prefetch 404s noted in earlier phases are gone.
- Playwright at 1440 and 390px on the four new pages: 0px overflow, no console errors.

## 2026-11-13 — Phase 5: treatment index and treatment pages

### Added
- `/tratamentos`: page header with jump links to the four care areas, then one section per category with its treatments as numbered rows. *Estética corporal* has no treatment page yet, so it shows an honest "definida caso a caso" note with a WhatsApp CTA (option (a) in SITE_ARCHITECTURE).
- `/tratamentos/[slug]` for all six treatments, statically generated (`dynamicParams = false`, unknown slugs 404). Sections: hero with contextual CTA, O que é, Pode ser indicado para, Para quem (ends with the evaluation caveat), Como funciona (with a second CTA), Cuidados, Dúvidas frequentes, the demo-review note, the responsible professional, related treatments, closing CTA. Treatment CTAs make the qualification gate preselect the treatment (3 questions instead of 4).
- `content/treatment-details.ts` (full page copy, kept apart from the summaries so the browser-side gate doesn't download it), `content/professionals.ts` (three **fictional** professionals with placeholder registrations), `types/professional.ts`, `TreatmentDetail` type.
- Components: `ui/Accordion` (native `<details>`), `treatments/TreatmentHero`, `TreatmentSection`/`RuledList`, `TreatmentRows` (now also used by the homepage index), `ResponsibleProfessional`, `RelatedTreatments`, `DemoReviewNote`.
- Image slots 12–20 (professional portraits, treatment heroes) registered with placeholders.
- `content/content.test.ts`: every summary has a page, related slugs and professionals resolve, every "para quem" ends with the caveat, no banned phrases (checks 25 phrases from `config/banned-phrases.json`).

### Verified (actual runs)
- `typecheck`, `lint`, `test` (29/29), `build`: pass.
- Playwright at 1440 and 390px on `/tratamentos` and a treatment page: HTTP 200, 0px overflow, no console errors. Gate from a treatment hero: 3 steps, message includes the treatment. Unknown slug: 404.

## 2026-11-13 — Qualification gate and chatbot (carried over from apps/demo)

### Added
- `QualifierGate` (conversion/, **client**): the four-question gate from the estética and planejados demos (name, interest, timing, budget) in front of every WhatsApp CTA. One delegated listener intercepts `a[data-destination="whatsapp"]`, so CTAs stay Server Components and still work as plain links if the script fails. Treatment CTAs preselect the treatment and skip that question. Native `<dialog>`.
- `content/qualifier.ts`: steps, low-fit answers (tracked only, as in the demos' "tag" mode) and copy. `buildQualifiedMessage()` in `lib/whatsapp.ts`, with 2 unit tests.
- `ChatWidget` (chat/, **client**): lk-chatbot web chat in ÁUREA's style, with **photo upload**. Photos are downscaled in the browser to 1600px JPEG before upload (`lib/chat-image.ts`) and sent as `imageBase64`/`imageMimeType`, which the lk-chatbot `/message` endpoint analyses. Session kept in localStorage; auto-opens once per browser session, as in the demos. Notice under the input that photos go to an external service.
- `config/chatbot.ts` and `NEXT_PUBLIC_CHATBOT_TENANT_ID`. Without a tenant, typed text goes to WhatsApp and photo upload is hidden.
- Analytics events: `qualifier_open`, `qualifier_step` (step number only), `qualifier_complete`, `lead_low_fit`, `whatsapp_redirect`.

### Decisions
- **No "skip the questions" link**, to keep the gate identical in effect to the demos.
- **Budget ranges kept from the estética demo.** They may be low for a premium clinic; revisit with Vitrini72.

### Verified (actual runs)
- `typecheck`, `lint`, `test` (15/15), `build`: pass.
- Playwright at 390px: the hero CTA opens the gate; after 4 answers the gate closes and opens `wa.me` with the expected message. With the chatbot API intercepted in the browser, a photo plus text is sent as `{ sessionId, text, imageBase64, imageMimeType: "image/jpeg" }` (89 KB after downscaling) and the reply renders.

## 2026-11-13 — Phase 4: homepage

### Added
- `EditorialImage` (ui/): the only way photographs render. Fixed aspect ratio (no layout shift), `next/image` when `src` is set, and a labelled sand placeholder ("IMG 01 — subject") while it is `null`.
- `types/image.ts` (`ImageRef`) and `content/images.ts`: one registry of every photograph, numbered to match `docs/ASSETS.md`. Adding a photo means dropping the file in `public/images/<folder>/` and setting `src`.
- `content/home.ts`: all homepage copy in one place.
- Homepage sections (sections/): `HomeHero` (golden split, portrait right), `Approach` (reverse split, three numbered principles), `TreatmentIndex` (numbered rows linking to treatment pages), `Journey` (four steps on espresso), `ClinicTeaser` (wide architecture image, then clinic and professionals), `FinalCta` (sand, reusable at the end of pages).
- `SectionHeading` takes an `id` so sections can use `aria-labelledby`.

### Verified (actual runs)
- `typecheck`, `lint`, `test` (13/13), `build`: pass. Copy checked against `config/banned-phrases.json`: no hits.
- Playwright at 1440 and 390px: 0px horizontal overflow, no console errors other than the expected prefetch 404s.
- The tall circumflex on "Ciência" is Cormorant's normal glyph, checked at full size; not a rendering bug.

### Photographs
- First three photos placed: hero portrait (slot 01, converted to an espresso→ivory duotone so a black-and-white stock image matches the palette), editorial still life for the approach section (slot 02), waiting area with marble panel for the clinic teaser (slot 11). Metadata stripped, JPEG q82.
- Rejected two supplied photos: a reception with a teal mural and clinical clutter (breaks the palette rules), and a clinic interior showing another business's logo and name (can't be used on a demo for a fictional clinic).

### Known
- The marble-panel photo is 1375px wide and shows at up to 1338px, so it will look slightly soft on high-density screens. Treatment, clinic, professionals and contact links 404 until Phases 5–7.

## 2026-11-13 — Phases 2 & 3: design system and foundation

### Added
- App scaffold: Next 16.4.6, React 19.3.1, Tailwind 4.3.5, motion 14.13.0, TypeScript 5.9.3, ESLint 9, Vitest 5.1 with Vite 8 pinned, Playwright 1.63.0.
- Design tokens in `globals.css` `@theme`, with the Tailwind default palette removed. `grid-golden` utilities.
- `config/site.ts` (clinic configuration with typed placeholders), `config/analytics.ts`, `config/motion.ts`.
- `lib/whatsapp.ts`: Brazilian number validation, contextual messages, URL encoding, recipient-less fallback. 9 unit tests.
- `lib/analytics.ts`: allow-listed parameters (no personal data), GA4 adapter, no-op without provider. 2 unit tests.
- Motion token sync test (CSS easing equals TS easing).
- Components: ButtonLink/buttonStyles, Container, SectionHeading/Eyebrow, WhatsAppLink, AnalyticsListener, Header, NavLinks, MobileNav, Logo, DemoNotice, Footer. Holding homepage and a 404 page.
- Docs: DESIGN_SYSTEM, COMPONENTS, ASSETS (shot list), README.

### Decisions
- **Palette refinements:** added `sage-deep` (sage fails AA as small text), `sand` and `error`; taupe, champagne and sage are restricted to non-text use on light surfaces.
- **Tracking via data attributes and one delegated listener**, so every CTA stays a Server Component.
- **Native `<dialog>` for mobile navigation**, which gives focus containment and Escape handling without a library.
- **Demo is `noindex` by default** (`NEXT_PUBLIC_ALLOW_INDEXING`), so a fictional clinic does not appear in search results.
- **No WhatsApp number = recipient-less `wa.me/?text=` link**, rather than a fake number.

### Fixed
- Header CTA showed on mobile and caused 25–55px horizontal overflow at 390 and 360px. Root cause: `hidden` conflicted with the button's `inline-flex`, and height and padding were overridden by stacked classes. Fix: a typed `size` variant on the button, with visibility handled by a wrapper element.
- Footer treatment links ran together when names wrapped on mobile.
- The wordmark inside the open mobile menu navigated without closing the menu.

### Verified (actual runs)
- `typecheck`, `lint`, `test` (13/13), `build`: pass.
- Playwright script at 1440, 768, 390 and 360px: 0px horizontal overflow, no console errors, mobile menu opens and closes with Escape. Screenshots in `docs/screenshots/phase3-*`.
- Known and expected at the time: Next prefetches returned 404 for routes not yet built (resolved in Phase 6).


## 2026-11-13 — Phase 0 & 1

### Added
- `apps/aurea/docs/`: PROJECT_BRIEF, REFERENCE_ANALYSIS, SITE_ARCHITECTURE, CONTENT_GUIDELINES, CHANGELOG.

### Decisions
- **Separate workspace app** (`apps/aurea`) rather than a third niche in `apps/demo`. Reason: scope (7 routes, dynamic treatments, design system, tests) does not fit the single-page niche-config template. See SITE_ARCHITECTURE.
- **Newer stack than sibling apps**: Next 16 / React 19 / Tailwind 4 / motion 14, while `apps/demo` and `apps/web` stay on Next 15 / Tailwind 3. No shared code, so no conflict.
- **Playwright pinned to the version with browsers available in the build environment** (1.63.x) rather than latest, to avoid re-downloading browsers.
- **Design tokens in Tailwind 4 `@theme`** (CSS) as the single source; motion tokens in `config/motion.ts`.
- **Fonts via `next/font/google`** (self-hosted at build, no runtime request to Google).

### Open issues
- Reference sites unreachable from build environment (network policy). Analysis not performed.
- No photography source available in the build environment (no image hosts, no generation tool). See Phase 0 report.
- ~~Name proximity with "Clínica Aurora"~~: resolved. Aurora will not be shown to prospects.
