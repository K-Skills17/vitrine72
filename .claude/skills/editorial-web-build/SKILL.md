---
name: editorial-web-build
description: Directive for designing, building or refining websites so they look professionally art-directed rather than AI-generated or template-made. Niche- and brand-agnostic. Use whenever building, redesigning, refining, reviewing or generating a website, landing page, demo site or site template (any framework, any niche), whenever writing site copy, choosing palettes or fonts, or judging whether a site "looks AI". Has two modes, new build and refine an existing brand (keep logo, colours, fonts and copy; fix composition, components, motion, accessibility and engineering). Includes an audit script for AI/template patterns.
---

# Editorial Web Build

The goal: a visitor should believe a senior independent studio designed the site by hand for this one business. Every rule below exists because its opposite is a recognisable tell of AI or template output. Nothing here assumes a niche, a brand or a framework; examples are illustrations, not defaults.

Audit script: `audit.sh` in this skill's folder (`bash <skill-dir>/audit.sh <source-dir>`).

## Choose the mode first

| | **New build** | **Refine an existing brand** |
|---|---|---|
| When | New site, new demo, generated client site | Live site whose identity the owner wants kept |
| Brand (logo, colours, fonts) | Designed in the Design-system phase | **Frozen.** Read from the existing tokens/CSS. Only add derived tokens (e.g. a darker shade to pass contrast) and document them |
| Copy | Written in the Brief/Copy phases | **Frozen.** Do not rewrite, shorten or "improve" text without explicit approval. Layout may change; words may not |
| What changes | Everything | Composition, component patterns (cards → rules/lists), button and badge shapes, motion, spacing, type *scale* (not families), accessibility, performance, engineering structure |
| First deliverable | Brief + plan | Audit: screenshots, `audit.sh` results, a written list of proposed changes per page, and what stays untouched |
| Risk control | — | Change one page/section per commit; keep URLs, metadata, tracking, forms and integrations byte-for-byte unless asked; screenshot before and after |

In refine mode, if a brand element itself is a banned pattern (e.g. the brand colour *is* a gradient), keep it and flag it to the owner rather than silently replacing it.

## 0. Non-negotiables

1. **Never fabricate.** No invented reviews, ratings, testimonials, before/after images, credentials, professional registration numbers, years in business, addresses, phone numbers or client counts. Real data comes from the client or the business's public profiles. Missing data becomes a visible, typed placeholder, not a plausible fake.
2. **Never claim a check you did not run.** "QA passed" means commands were executed and screenshots exist. If a step was skipped, say so.
3. **A successful build is not proof of good design.** Look at screenshots of the real page at desktop and mobile before calling any visual phase done.

## 1. Process (phase gates)

Work in phases. Each phase ends with a deliverable and a gate; do not proceed until the gate is met.

| Phase | Deliverable | Gate |
|---|---|---|
| Audit | What exists (framework, deps, conventions, git) | Nothing overwritten without understanding it |
| Brief | Audience, positioning, visitor intents, scope, constraints | Every route has a purpose and a next step |
| References | What 3–6 relevant sites do well and what not to copy | If a reference is unreachable, record that; never invent observations |
| Design system | Tokens, type scale, layout grid, motion rules (documented). Refine mode: extract existing tokens instead of inventing them | Contrast checked numerically, one structural idea defined |
| Foundation | Layout, header, mobile nav, footer, buttons, config, conversion utility | Zero overflow at 360/390/768/1440, keyboard-operable nav |
| **Hero + first two sections** | Real imagery, real copy | **Visual review gate:** screenshots reviewed; if it looks generic, recompose before continuing — never compensate with decoration or animation |
| Rest of pages | Data-driven pages from structured content | Every route renders and links resolve |
| Conversion | Contextual CTAs, form, analytics | Every conversion path clicked and verified |
| Motion | Purposeful, reduced-motion aware | No layout shift, content never waits on animation |
| QA + handoff | Checks run, report written, placeholders listed | Results are from actual runs |

## 2. Visual identity

**Derive one structural idea from the brand** and let it organise layout (e.g. a clinic named after the golden ratio uses a 1.618 : 1 column split; a joinery workshop might use a strict modular grid; a law firm a numbered-clause rhythm). One idea, used consistently, reads as intentional; many decorative ideas read as generated.

**Colour**
- Start from the brand, not from a preset palette menu. 4–6 colours total; any section uses at most two plus one accent.
- Remove the framework's default palette (Tailwind 4: `--color-*: initial;`) so off-brand colours cannot appear.
- Compute contrast for every text/background pair and record it. Accent colours that fail 4.5:1 are non-text only.
- No purple/blue SaaS gradients, no neon accents on dark backgrounds, no gradient overlays as a default image treatment.

**Typography**
- Choose a pairing for the brand's character; never default to Inter/Inter, Montserrat/Open Sans or Poppins.
- Define a full scale (display, h1–h3, lead, body, small, eyebrow, nav, button, caption, legal) with fluid `clamp()` sizes, line heights, tracking and max measures. Mobile sizes are designed, not shrunk.
- Thin display serifs only at ≥ 24px. Emphasis with italic or scale, not bold everywhere.
- Load fonts self-hosted (e.g. `next/font`) with `display: swap`.

**Composition**
- Asymmetric, editorial layouts with generous whitespace. Vary section compositions down the page; no two consecutive sections share the same skeleton.
- Hero: not centred text over a darkened full-bleed photo. Use a split, offset, or typographic composition with a deliberate mobile crop. The first viewport states what the business does, for whom, and the next step.
- Prefer ruled, numbered or typographic lists to card grids. A card is justified only when the item is a self-contained, clickable object.
- Hairline rules over boxes. Square or near-square edges unless the brand genuinely calls for softness. Shadows rarely, if ever.

**Imagery**
- Photography is art-directed: consistent light, grade and cropping, defined aspect ratios and focal points, never stretched.
- Real client photos first. Stock only when licensed, curated against a written shot list, and logged in an asset manifest (source, licence, slot).
- No AI-looking faces, over-retouched skin, unrelated medical imagery, or generic handshake/laptop stock. People are never presented as staff or patients unless they are.
- If an image is missing, use a documented placeholder, not an unrelated substitute.

**Motion**
- Motion must explain hierarchy or orientation. Not every element animates; a page has a few deliberate moments.
- No content hidden until an animation runs, no scale-on-hover on cards, no bouncing scroll arrows, no continuous decorative animation, no parallax by default.
- Respect `prefers-reduced-motion`. Keep easing and durations as tokens in one place.

## 3. Banned patterns (the "AI tells")

Run `.claude/skills/editorial-web-build/audit.sh <dir>` to detect most of these mechanically.

| Pattern | Why it reads as generated |
|---|---|
| Purple/blue/teal gradients, gradient text, `linear-gradient` overlays on every photo | Default SaaS aesthetic |
| Glassmorphism (`backdrop-blur` panels), floating blobs, dot/radial-gradient textures | Decoration without meaning |
| `rounded-2xl`/`rounded-3xl` cards with `shadow-lg` in a 3-column grid | The single most common template section |
| Pill buttons and pill badges everywhere (`rounded-full` on text) | Startup-template signature |
| Icon in a coloured circle above every feature | Filler iconography |
| `hover:scale-105` on cards and buttons | Cheap interaction feedback |
| Fade-in on every block, staggered on every list | Animation as proof of effort |
| Star-rating badge in the hero, emoji in headings | Template trust props |
| Centred everything | No hierarchy decisions were made |
| Bouncing scroll-down arrow | Dated template trope |

## 4. Copy

- Written natively in the audience's language; never translated-sounding.
- Specific nouns and concrete next steps; short sentences; no superlatives.
- Keep a banned-phrase list per language in the project and enforce it in code (a test or build check), not just in a document. Typical pt-BR offenders: "qualidade e excelência", "soluções inovadoras", "transforme sua vida", "resultados garantidos"; English: "elevate your", "unlock", "seamless", "cutting-edge", "your journey".
- Regulated sectors (health, dentistry, aesthetics, physiotherapy, law, finance): no promises, no outcome claims, no before/after, no testimonials or ratings where the professional body restricts them (in Brazil e.g. CFM Res. 2.336/2023, CFO rules, OAB rules). Show the responsible professional. Mark regulated copy for professional review in the content model.

## 5. Conversion

- Use the channel the market actually converts on (WhatsApp in Brazil, phone/booking/forms elsewhere). The primary action is contextual: the prefilled message or form says which page/service the visitor came from. Build every such URL in one utility with validation and unit tests.
- Serve three intents: decided (act in ≤ 2 taps), researching (explain and compare), evaluating trust (people, place, process).
- Every page ends with a next step. Floating/sticky CTAs never cover content, form fields or browser UI; on mobile use one, not both.
- Forms collect the minimum, have real labels, accessible errors, honest success states ("we will contact you", never "booked" without a booking system), and the consent the local privacy law requires (LGPD, GDPR, …).
- Analytics through one abstraction with an allow-list of non-personal parameters; no-op without a provider.

## 6. Engineering

1. One source of truth each for: design tokens, business config, conversion URLs, analytics.
2. Content is structured data separated from presentation; pages are rendered from it.
3. Components have typed variants (`variant`, `tone`, `size`); never fix a style by stacking a conflicting class or `!important`. Diagnose the root cause.
4. Server Components by default; client code only for interaction.
5. No unused files, deps or components; no empty folders to match a diagram.
6. No suppressing type/lint errors to pass checks.

## 7. Verification checklist (run before every handoff)

- [ ] `typecheck`, `lint`, unit tests, production build — all executed, results recorded
- [ ] Screenshots at 1440×900, 1024×768, 768×1024, 390×844, 360×800, reviewed by eye
- [ ] `document.documentElement.scrollWidth === innerWidth` at each size (no horizontal overflow)
- [ ] No console errors; no broken images; 404 page works
- [ ] Mobile nav: opens, traps focus, closes on Escape and on navigation
- [ ] Every CTA clicked; WhatsApp URLs decoded and message checked
- [ ] Contrast table matches the tokens actually used
- [ ] `audit.sh` run; every remaining hit justified in writing
- [ ] Banned-phrase check passes on generated copy
- [ ] No fabricated data; placeholders listed for the client
- [ ] Lighthouse measured and reported as measured (not estimated)
