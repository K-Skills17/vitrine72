# Changelog — ÁUREA

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
- Name proximity: existing demo "Clínica Aurora" vs new "ÁUREA".
