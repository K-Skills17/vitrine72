# ÁUREA — Project Brief

> Demonstration project by Vitrini72. ÁUREA is a **fictional** clinic. Every professional, credential, address and contact detail on the site is demonstration data and must be labelled as such.

## Purpose

A high-fidelity, reusable demonstration website for a fictional premium aesthetic clinic in Brazil. Vitrini72 uses it to show prospective premium aesthetic clinics the level of art direction, conversion strategy and engineering it delivers.

It is the **third** demo in this repository, and the first built to a full multi-page, editorial standard:

| Demo | Location | Nature |
|---|---|---|
| Clínica Aurora (estética) | `apps/demo`, `NEXT_PUBLIC_NICHE=estetica` | Single-page cold-call demo, WhatsApp qualifier gate |
| Atelier Madeira (planejados) | `apps/demo`, `NEXT_PUBLIC_NICHE=planejados` | Single-page cold-call demo, WhatsApp qualifier gate |
| **ÁUREA** | `apps/aurea` | Multi-page premium clinic site, content-driven treatment pages |

## Clinic (fictional)

- **Name:** ÁUREA — Clínica de Estética Avançada
- **Positioning:** science, individual evaluation, technology and natural-looking outcomes.
- **Market:** Brazil. All visible copy in pt-BR.

## Audience

- Mainly women, roughly 28–55, middle-upper to high income.
- Researching facial aesthetics, skin quality, rejuvenation, body aesthetics.
- Value professional credibility, personalised care, comfort, discretion.

Three visitor intents the site must serve (see `SITE_ARCHITECTURE.md`):
1. **Decided** — knows the treatment, wants to talk now.
2. **Researching** — comparing treatments, needs clear explanation.
3. **Evaluating the clinic** — checking people, place and process before trusting.

## Goals (equal weight)

1. **Art direction** — distinctive editorial identity; not a template.
2. **Conversion** — contextual WhatsApp as primary, inquiry form as secondary.
3. **Usability** — accessible, responsive, clear hierarchy.
4. **Maintainability** — tokens, config, content and conversion logic each with one source of truth.

## Scope

In scope:
- Routes: `/`, `/tratamentos`, `/tratamentos/[slug]` (6 treatments), `/clinica`, `/profissionais`, `/contato`, `/privacidade`, 404.
- Centralised WhatsApp utility with unit tests; analytics abstraction (no-op without provider).
- Demo inquiry form with honest submission states (no booking is made).
- SEO basics: per-route metadata, sitemap, robots, OG.
- Playwright tests, QA report, documentation set.

Out of scope:
- Backend, database, CMS, booking integration.
- Real professional data, testimonials, reviews, before/after images.
- Structured data asserting a real business (the business is not real).

## Constraints

- Brazilian healthcare advertising rules (CFM/CFO/CRBM-style restrictions on promises, before/after, testimonials) inform all copy. Copy is conservative and flagged for professional review.
- LGPD-aware form: minimum data, explicit consent, no health data, nothing personal sent to analytics.
- No fabricated registrations, ratings, history, addresses or phone numbers.

## Success test

A premium clinic owner opening the link thinks: *"This is the quality of website I want for my clinic."*
