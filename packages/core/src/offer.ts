/**
 * SINGLE SOURCE OF TRUTH for all prices, SKUs, rules and offer config.
 * No price is hard-coded anywhere else. A lint test enforces this.
 *
 * All monetary values are in BRL (centavos as integers where noted).
 * Display amounts are in whole Reais as numbers.
 */

export const CURRENCY = "BRL" as const;
export const TIMEZONE = "America/Sao_Paulo" as const;

// ─── Core offer ──────────────────────────────────────────────────────────────

export const CORE_OFFER = {
  sku: "SITE_5P",
  label: "Site até 5 páginas",
  pages: 5,
  previewBusinessDays: 3,
  priceCard: 1997,
  pricePix: 1797,
  installmentsMax: 12,
  /** Buyer pays installment interest (juros do comprador) */
  installmentInterestBuyer: true,
} as const;

// ─── Anchor package ───────────────────────────────────────────────────────────

export const ANCHOR_PACKAGE = {
  sku: "ANCHOR_SITE_GBP_BOT",
  label: "Site + Google Meu Negócio + Agente IA",
  priceCard: 3497,
  pricePix: 3147,
  installmentsMax: 12,
  installmentInterestBuyer: true,
  includes: ["SITE_5P", "GBP_SETUP", "AI_AGENT_SETUP"],
} as const;

// ─── Add-ons ──────────────────────────────────────────────────────────────────

export const ADDONS = {
  GBP_SETUP: {
    sku: "GBP_SETUP",
    label: "Configuração do Google Meu Negócio",
    price: 397,
  },
  AI_AGENT_SETUP: {
    sku: "AI_AGENT_SETUP",
    label: "Agente IA de agendamento",
    price: 497,
    /** Only available with active maintenance plan */
    requiresMaintenance: true,
  },
  EXTRA_PAGES: {
    sku: "EXTRA_PAGES",
    label: "Páginas 6–8 (por bloco de até 3)",
    price: 497,
    pagesPerBlock: 3,
    maxBlocks: 1,
  },
  CATALOG: {
    sku: "CATALOG",
    label: "Catálogo até 10 itens",
    price: 997,
    maxItems: 10,
  },
} as const;

// ─── Downsell ────────────────────────────────────────────────────────────────

export const DOWNSELL = {
  sku: "LANDING_1P",
  label: "Landing page 1 página",
  price: 997,
  installmentsMax: 12,
  installmentInterestBuyer: true,
} as const;

// ─── Maintenance ────────────────────────────────────────────────────────────

export const MAINTENANCE = {
  sku: "MANUT",
  label: "Manutenção + hospedagem + bot",
  /** Every 4 weeks = 13 charges per year */
  pricePerCycle: 97,
  cycleWeeks: 4,
  cyclesPerYear: 13,
  editsPerCycle: 3,
} as const;

// ─── Partner (influencer) bonus ───────────────────────────────────────────────

export const PARTNER_BONUS = {
  /** Maintenance cycles free (not a price discount) */
  freeCycles: 3,
} as const;

// ─── Business rules ──────────────────────────────────────────────────────────

export const RULES = {
  /** Calendar days after payment before site can go live */
  goLiveMinDays: 8,
  /** Business days from complete intake to preview */
  previewBusinessDays: 3,
  /** Revision window after preview in hours */
  revisionWindowHours: 48,
  /** Max revision rounds per project (after this → edit ticket) */
  maxRevisionRounds: 1,
  /** Hours after payment before first incomplete-intake reminder */
  intakeReminder1Hours: 24,
  /** Hours after payment before second reminder */
  intakeReminder2Hours: 72,
  /** Days after payment before project moves to paused */
  intakePauseDays: 7,
} as const;

// ─── Commission structure ────────────────────────────────────────────────────

export const COMMISSIONS = {
  /** Seller commission rate on core + upsells */
  sellerRate: 0.10,
  /** Pix: seller gets 50% upfront, 50% at day 8 */
  sellerPixUpfrontRate: 0.50,
  /** Card: seller gets 100% at day 8 */
  sellerCardDay8Rate: 1.00,
  /** Monthly close bonus */
  monthlyBonusThreshold: 8,
  monthlyBonusAmount: 300,
  /** Maintenance kicker (once per client) */
  maintenanceKicker: 20,
  /** Optional draw per week (first 4 weeks) */
  drawPerWeek: 400,
  drawMaxWeeks: 4,
  /** Partner self-checkout rate */
  partnerSelfCheckoutRate: 0.20,
  /** Partner rate when seller closed a partner-sourced lead */
  partnerAssistedRate: 0.15,
  sellerAssistedRate: 0.05,
  /** Clawback: 100% of paid commission on refund/chargeback */
  clawbackRate: 1.00,
} as const;

// ─── All SKUs ────────────────────────────────────────────────────────────────

export type Sku =
  | typeof CORE_OFFER["sku"]
  | typeof ANCHOR_PACKAGE["sku"]
  | typeof ADDONS[keyof typeof ADDONS]["sku"]
  | typeof DOWNSELL["sku"]
  | typeof MAINTENANCE["sku"];

export const ALL_SKUS: Sku[] = [
  CORE_OFFER.sku,
  ANCHOR_PACKAGE.sku,
  ...Object.values(ADDONS).map((a) => a.sku),
  DOWNSELL.sku,
  MAINTENANCE.sku,
] as Sku[];

/** Price lookup for a SKU and payment method */
export function getPrice(
  sku: Sku,
  method: "card" | "pix"
): number | null {
  switch (sku) {
    case "SITE_5P":
      return method === "pix" ? CORE_OFFER.pricePix : CORE_OFFER.priceCard;
    case "ANCHOR_SITE_GBP_BOT":
      return method === "pix"
        ? ANCHOR_PACKAGE.pricePix
        : ANCHOR_PACKAGE.priceCard;
    case "GBP_SETUP":
      return ADDONS.GBP_SETUP.price;
    case "AI_AGENT_SETUP":
      return ADDONS.AI_AGENT_SETUP.price;
    case "EXTRA_PAGES":
      return ADDONS.EXTRA_PAGES.price;
    case "CATALOG":
      return ADDONS.CATALOG.price;
    case "LANDING_1P":
      return DOWNSELL.price;
    case "MANUT":
      return MAINTENANCE.pricePerCycle;
    default:
      return null;
  }
}

// ─── Aesthetic clinic offer (docs: Vitrine72 Aesthetic Clinic Offer Playbook) ─
//
// One package, one payment, 90 days included. Sold on the owner call and paid
// by PIX; the /clinicas page shows the price and sends the visitor to WhatsApp.

export const CLINIC_OFFER = {
  sku: "CLINIC_CAMPAIGN_90D",
  label: "Campanha de avaliações para clínicas de estética",
  /** Founding price for the first `foundingSpots` clinics. */
  priceFounding: 1797,
  priceFull: 3147,
  foundingSpots: 10,
  /**
   * Founding spots already sold. UPDATE BY HAND after each founding sale;
   * the page shows the real remainder and switches to the full price at 0.
   */
  foundingSold: 0,
  deliveryHours: 72,
  includedDays: 90,
  guaranteeDays: 30,
  /** Days on which the weekly count is reported. */
  reportDays: [7, 14, 21, 30],
  /**
   * Guaranteed evaluation requests in 30 days, picked by the higher of the
   * owner's Instagram profile visits or Google profile views (last 30 days).
   * Starting values, kept low on purpose; recalibrate after the first 5 clinics.
   */
  guaranteeTiers: [
    { minViews: 3001, requests: 20 }, // "over 3,000"
    { minViews: 1000, requests: 10 }, // "between 1,000 and 3,000"
  ],
  /** Below this in both channels no guarantee is offered. */
  guaranteeMinViews: 1000,
  /** Lead angle: end-of-year campaign until this date (inclusive), then the procedure angle. */
  seasonalAngleUntil: "2026-12-31",
  blackFriday: "2026-11-27",
} as const;

/** Guaranteed requests for a clinic's higher 30-day view count, or null if below the minimum. */
export function clinicGuarantee(views: number): number | null {
  const tier = CLINIC_OFFER.guaranteeTiers.find((t) => views >= t.minViews);
  return tier ? tier.requests : null;
}

/** Founding spots still available (never negative). */
export function clinicFoundingLeft(): number {
  return Math.max(0, CLINIC_OFFER.foundingSpots - CLINIC_OFFER.foundingSold);
}
