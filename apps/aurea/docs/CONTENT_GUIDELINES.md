# Content Guidelines

## Voice

Elegant, not pretentious. Confident, not aggressive. Human and educational. Clear about next steps.

Write like a senior professional explaining something to an intelligent patient: short sentences, concrete nouns, no superlatives.

| Prefer | Avoid |
|---|---|
| "Cada plano começa por uma avaliação individual." | "Realce sua melhor versão." |
| "Indicação definida em consulta." | "Resultados incríveis garantidos." |
| "Agende sua avaliação" | "Compre agora", "Garanta sua vaga" |
| Specific: "linhas de expressão na testa" | Vague: "rejuvenesça e brilhe" |

Banned phrases (also see repo `config/banned-phrases.json`): *realce sua melhor versão, sua beleza é nossa paixão, resultados garantidos, sem dor, sem riscos, o melhor da cidade, transforme sua vida, antes e depois, procedimento 100% seguro*.

## Medical content rules

1. **No promises.** Use "pode", "em alguns casos", "conforme avaliação". Never state outcomes, durations or numbers of sessions as certain.
2. **No universal suitability.** Every "who it's for" section ends with the indication being defined in evaluation.
3. **No before/after, testimonials, ratings or reviews.** Not even placeholders styled to look real.
4. **No prices or promotions.**
5. **No fabricated credentials.** Registration fields render as `CRM/UF 000000 — demonstração` style placeholders, visibly marked.
6. **Aftercare is general.** Only widely accepted general guidance, framed as "orientações serão passadas pelo profissional".
7. **Professional responsibility visible** on every treatment page (placeholder responsible professional).

## Content model

Treatments (`src/types/treatment.ts`), indicative shape:

```ts
type ReviewStatus = "draft" | "pending-professional-review" | "approved";

interface Treatment {
  slug: string;
  name: string;               // "Bioestimuladores de colágeno"
  shortName: string;          // used inside WhatsApp message
  categories: CategoryId[];
  summary: string;            // index + meta description
  intro: string;
  whatItIs: string[];
  concerns: string[];         // "pode ser indicado para..."
  candidacy: string[];        // always ends with evaluation caveat
  process: { title: string; body: string }[];
  aftercare?: string[];
  faq: { q: string; a: string }[];
  responsibleProfessionalId: string;
  related: string[];          // slugs
  image: ImageRef;
  reviewStatus: ReviewStatus;
}
```

`reviewStatus` is **`pending-professional-review` for all demo treatments**. A build-time check can list every non-approved item before a real launch.

Professionals: `name`, `role`, `specialties`, `bio`, `registration` (placeholder string), `image`, `isFictional: true`.

## Labelling fictional content

- Site-wide, discreet but always-visible notice: "Site de demonstração — ÁUREA é uma clínica fictícia criada pela Vitrini72."
- Professional section: "Profissionais fictícios para demonstração."
- Footer legal block: CNPJ, Responsável Técnico, CRM — all shown as placeholders.
- Address/phone: clearly placeholder (e.g. "Endereço de demonstração").

## Approval before real use

Before this template is used for a real clinic:
1. Responsible professional reviews every treatment page and FAQ.
2. Copy checked against the relevant council's advertising rules (e.g. CFM Resolução 2.336/2023 for physicians; CFO for dentists).
3. Privacy notice reviewed by someone qualified in LGPD.
4. All `reviewStatus` set to `approved`.
