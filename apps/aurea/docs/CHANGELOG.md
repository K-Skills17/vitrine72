# Changelog — ÁUREA

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
- Known and expected: Next prefetches return 404 for routes not yet built (/tratamentos, /clinica, …).


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
