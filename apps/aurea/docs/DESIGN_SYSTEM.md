# Design System

Source of truth: `src/app/globals.css` (`@theme`). This document explains the tokens; it does not redefine them.

## Concept

**Proporção áurea.** The clinic's name gives the system its one structural idea: key compositions split content on 1.618 : 1 (`grid-golden`, `grid-golden-reverse`). The ratio is used as a layout rule. It is never used as gold decoration.

Character: ivory paper, espresso ink, large serif headlines, small tracked sans labels, square edges, hairline rules. Hierarchy comes from scale and whitespace, not from colour or shadow.

## Colour

| Token | Value | Use | Contrast on ivory |
|---|---|---|---|
| `ivory` | `#F4EFE8` | Main background | — |
| `porcelain` | `#FCFAF7` | Raised surfaces | — |
| `sand` | `#E9E1D5` | Image placeholders, demo notice, quiet variation | — |
| `espresso` | `#292720` | Primary text, dark sections, primary button | 13.1 : 1 |
| `umber` | `#62594E` | Secondary text | 6.0 : 1 |
| `sage-deep` | `#5E6055` | Eyebrows, small accent text | 5.6 : 1 |
| `taupe` | `#A99B8B` | Lines; **text only on espresso** (5.5 : 1) | 2.4 : 1 ✗ |
| `champagne` | `#D5C2A5` | Accent; **text only on espresso** (8.6 : 1) | 1.5 : 1 ✗ |
| `sage` | `#85877A` | Decorative only | 3.2 : 1 ✗ |
| `line` | `#DDD5CA` | Dividers, borders | — |
| `error` | `#8A3B2E` | Form errors | 6.7 : 1 |

Changes from the brief's starting palette, with the reason for each:
- Renamed "muted brown" to `umber` and "warm white" to `porcelain` (shorter class names); the values are unchanged.
- **Added `sage-deep`**: the brief's sage fails WCAG AA as small text (3.2 : 1), so eyebrows need a darker sage.
- **Added `sand`**: a third light surface for placeholders and the demo notice, so champagne is not overused.
- **Added `error`**: the form needs an error colour.
- Tailwind's default palette is removed (`--color-*: initial`), so off-brand colours cannot slip in.

Rule: most sections use two colours (ivory with espresso, or espresso with ivory). Champagne appears at most once per viewport.

## Typography

**Pairing: Cormorant Garamond (display) + Manrope (body/UI).** Kept as recommended in the brief. Cormorant's high contrast and long italic give the editorial voice. Manrope is open and geometric enough to stay legible at 12–13px for labels. Both are loaded with `next/font`, which self-hosts them at build time, uses `display: swap` and avoids layout shift. Weights loaded: Cormorant 400/500 normal and italic; Manrope variable.

Cormorant is used only at 24px and above. It is too thin to use for body text.

| Token | Mobile → desktop | Line height | Tracking | Family / weight |
|---|---|---|---|---|
| `text-display` | 44 → 80px | 1.0 | −0.015em | Cormorant 400 |
| `text-h1` | 40 → 68px | 1.04 | −0.01em | Cormorant 400 |
| `text-h2` | 34 → 52px | 1.08 | −0.005em | Cormorant 400 |
| `text-h3` | 24 → 32px | 1.18 | 0 | Cormorant 400 |
| `text-lead` | 18 → 21px | 1.55 | 0 | Manrope 400 |
| `text-body` | 16 → 17px | 1.7 | 0 | Manrope 400 |
| `text-small` | 15px | 1.6 | 0 | Manrope 400 |
| `text-eyebrow` | 12px | 1.4 | 0.18em, uppercase | Manrope 600 |
| `text-nav` | 13px | 1.4 | 0.06em, uppercase | Manrope 500 |
| `text-button` | 13px | 1.2 | 0.12em, uppercase | Manrope 600 |
| `text-caption` | 13px | 1.5 | 0 | Manrope 400 |
| `text-legal` | 12px | 1.55 | 0 | Manrope 400 |

All sizes are fluid `clamp()` values between 360px and 1440px viewports. Mobile sizes are set on purpose, not just shrunk from desktop. Headings use `text-balance` and leads use `text-pretty`. Emphasis uses Cormorant italic, never bold.

Note: the button label is 13px uppercase with wide tracking. This sits below the brief's 14–16px guide but matches the visual weight of a 14–15px lowercase label. Revisit if user testing finds it hard to read.

Measures: `max-w-prose` (38rem, about 68 characters) for body text and `max-w-lead` (34rem) for lead paragraphs.

## Space and layout

- Container: `max-w-page` (1440px) with `px-gutter` (20 → 64px fluid).
- Section rhythm: `py-section` (80 → 160px) and `py-section-sm` (56 → 96px).
- Grid: 12 columns from `lg`, with `grid-golden` / `grid-golden-reverse` for the main editorial splits.
- Header height: `h-header` (72px). The page reserves `spacing-sticky-cta` (68px) at the bottom on mobile once the sticky CTA exists (Phase 7).
- Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536). Desktop navigation appears at `lg`. The header CTA appears at `md`.

## Edges, borders and shadows

- Square edges everywhere. `rounded-xs` (2px) is reserved for form inputs and focus rings.
- Hairline `border-line` rules divide content in place of cards.
- No shadows.

## Components (patterns)

- **Buttons:** `primary` (filled), `secondary` (outlined) and `text` (underlined label), each in a `light` or `dark` tone, at `default` or `compact` size. All are rectangular. There are no pill shapes.
- **Eyebrow + heading + lead:** the standard section opening (`SectionHeading`). Visual size is set separately from heading level, so the heading hierarchy stays correct.
- **Editorial lists:** treatments and navigation are numbered or ruled typographic lists, not card grids.

## Motion

Tokens: `--ease-aurea` = `cubic-bezier(0.22, 1, 0.36, 1)`. This value is mirrored in `src/config/motion.ts` and checked by a unit test. Durations are 0.24s (UI), 0.6s (reveals) and 0.9s (hero image). Reveals move only 16px.

Principles: motion clarifies hierarchy or orientation, or it isn't used. Content is never hidden behind an animation on the first paint. `prefers-reduced-motion` turns transitions and animations off globally. Motion for React components will also check `useReducedMotion` (Phase 8).

## Accessibility baseline

- Visible 2px espresso focus ring with offset.
- Skip link to `#conteudo`.
- Touch targets of at least 44px for navigation and buttons.
- Colour pairs restricted as shown in the colour table above.
