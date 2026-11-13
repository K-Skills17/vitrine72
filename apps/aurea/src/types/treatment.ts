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
