export type CategoryId = "estetica-facial" | "qualidade-da-pele" | "rejuvenescimento" | "estetica-corporal";

export interface TreatmentCategory {
  id: CategoryId;
  name: string;
  description: string;
}

export type ReviewStatus = "draft" | "pending-professional-review" | "approved";

/**
 * Light treatment record used by navigation, the treatment index, related
 * treatments and the footer. Full page content is added in Phase 6 as a
 * `Treatment` type extending this one.
 */
export interface TreatmentSummary {
  slug: string;
  name: string;
  /** Lower-case form used inside sentences and WhatsApp messages. */
  messageName: string;
  categories: CategoryId[];
  summary: string;
  reviewStatus: ReviewStatus;
}

export interface TreatmentStep {
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Full treatment page content. Kept in content/treatment-details.ts, apart
 * from the summaries, so client components that import summaries (the
 * qualification gate) do not ship page copy to the browser.
 */
export interface TreatmentDetail {
  slug: string;
  /** Opening paragraph under the page title. */
  intro: string;
  /** "O que é": short paragraphs. */
  whatItIs: string[];
  /** "Pode ser indicado para": concerns, phrased without promises. */
  concerns: string[];
  /** "Para quem": always ends with the evaluation caveat. */
  candidacy: string[];
  process: TreatmentStep[];
  /** General guidance only; specifics come from the professional. */
  aftercare: string[];
  faq: FaqItem[];
  responsibleProfessionalId: string;
  related: string[];
}
