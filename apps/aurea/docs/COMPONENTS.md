# Components

Server Components unless marked **client**.

## ui/

| Component | Responsibility | Key props |
|---|---|---|
| `Button.tsx` → `ButtonLink`, `buttonStyles()` | The only button implementation. `ButtonLink` renders `next/link` for internal paths and `<a target="_blank">` for external URLs. `buttonStyles()` gives the same classes to `<button>` elements (e.g. form submit). | `variant: primary \| secondary \| text`, `tone: light \| dark`, `size: default \| compact`, `fullWidth` |
| `Container.tsx` | Page width and side gutter | `as`, `className` |
| `SectionHeading.tsx` → `SectionHeading`, `Eyebrow` | Eyebrow, heading and lead. Heading level (`as`) is set separately from visual `size`. | `as`, `size`, `tone`, `eyebrow`, `lead`, `id` |
| `EditorialImage.tsx` | Every photograph. Fixed ratio, `next/image`, labelled placeholder while `src` is null. | `image: ImageRef`, `ratio`, `sizes`, `priority` |

## conversion/

| Component | Responsibility |
|---|---|
| `WhatsAppLink.tsx` | Every WhatsApp CTA. Gets its URL only from `lib/whatsapp.ts` and sets the `data-track` attributes. Props: `location` (required, typed `CtaLocation`), `intent`, `treatmentSlug`, plus the button props. |
| `QualifierGate.tsx` (**client**) | Four-question gate before every WhatsApp hand-off. Delegated listener on `a[data-destination="whatsapp"]`; set `data-qualify="false"` on a link to bypass it. Builds the message with `buildQualifiedMessage()`. |
| `AnalyticsListener.tsx` (**client**) | A single delegated click listener that turns `data-track` / `data-cta-location` / `data-treatment` / `data-destination` attributes into `track()` calls. This lets CTAs stay Server Components. |

## chat/

| Component | Responsibility |
|---|---|
| `ChatWidget.tsx` (**client**) | lk-chatbot web chat with photo upload. Tenant from `NEXT_PUBLIC_CHATBOT_TENANT_ID`; falls back to WhatsApp (text only) without one. |

## layout/

| Component | Responsibility |
|---|---|
| `Header.tsx` | Sticky header: wordmark, desktop nav (from `lg`), WhatsApp CTA (from `md`), mobile menu (below `lg`). |
| `NavLinks.tsx` (**client**) | Desktop links with `aria-current`. Client only because it needs `usePathname`. |
| `MobileNav.tsx` (**client**) | Full-screen native `<dialog>` with `showModal()`, which provides focus containment, Escape-to-close and an inert background. Locks page scroll while open and closes on link or wordmark click. |
| `Logo.tsx` | Typographic wordmark, optional descriptor, `tone`, optional `onClick`. |
| `DemoNotice.tsx` | Slim, non-sticky notice that the clinic is fictional. Renders only when `siteConfig.isDemo`. |
| `Footer.tsx` | Navigation, treatment links, address, hours and contact placeholders, legal placeholders, demo disclaimer. All data comes from `config/site.ts` and `content/*`. |

## sections/

Homepage sections, each reading its copy from `content/home.ts`: `HomeHero`, `Approach`, `TreatmentIndex`, `Journey`, `ClinicTeaser`, `FinalCta` (reusable closing block).

## Planned (not yet built)

Accordion (Phase 5), form fields and InquiryForm (Phase 7), TreatmentIndex and TreatmentHero (Phases 5–6), ProfessionalProfile (Phase 5), FloatingWhatsApp and MobileStickyCta (Phase 7). Components are created when a page first needs them.
