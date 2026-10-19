/**
 * Commissions ledger logic.
 * All percentages and amounts read from offer.ts — no hard-coded numbers here.
 * All functions are pure; callers persist the results to the DB.
 */

import {
  COMMISSIONS as C,
  MAINTENANCE,
} from "./offer";

export type PaymentMethod = "pix" | "card";

export type CommissionSource =
  | "inbound"
  | "seller"
  | "partner"
  | "seller_partner"; // seller closed a partner-sourced lead

export type CommissionEntryKind =
  | "seller_upfront"
  | "seller_day8"
  | "seller_monthly_bonus"
  | "seller_maintenance_kicker"
  | "seller_draw"
  | "partner_self_checkout"
  | "partner_assisted"
  | "clawback";

export interface CommissionEntry {
  id?: string;
  projectId: string;
  sellerId?: string;
  partnerId?: string;
  kind: CommissionEntryKind;
  grossAmount: number;
  commissionAmount: number;
  /** ISO date when this entry becomes payable */
  dueAt: string;
  note?: string;
}

/**
 * Calculate commission entries when a payment is approved.
 * Returns a list of entries to be inserted into commission_entries.
 */
export function calcPaymentCommissions(params: {
  projectId: string;
  grossAmount: number;
  method: PaymentMethod;
  source: CommissionSource;
  sellerId?: string;
  partnerId?: string;
  paymentDate: Date;
}): CommissionEntry[] {
  const {
    projectId,
    grossAmount,
    method,
    source,
    sellerId,
    partnerId,
    paymentDate,
  } = params;

  const entries: CommissionEntry[] = [];

  const day8 = new Date(paymentDate);
  day8.setDate(day8.getDate() + 8);
  const day8Iso = day8.toISOString().slice(0, 10);
  const todayIso = paymentDate.toISOString().slice(0, 10);

  // ── Seller commissions ──────────────────────────────────────────────────
  if (sellerId && (source === "seller" || source === "seller_partner")) {
    const sellerRate =
      source === "seller_partner"
        ? C.sellerAssistedRate
        : C.sellerRate;

    const totalSellerCommission = grossAmount * sellerRate;

    if (method === "pix") {
      // 50% upfront, 50% at day 8
      const half = Math.round(totalSellerCommission * C.sellerPixUpfrontRate * 100) / 100;
      entries.push({
        projectId,
        sellerId,
        kind: "seller_upfront",
        grossAmount,
        commissionAmount: half,
        dueAt: todayIso,
        note: `Pix upfront 50% (rate ${sellerRate * 100}%)`,
      });
      entries.push({
        projectId,
        sellerId,
        kind: "seller_day8",
        grossAmount,
        commissionAmount: Math.round((totalSellerCommission - half) * 100) / 100,
        dueAt: day8Iso,
        note: `Pix day-8 50% (rate ${sellerRate * 100}%)`,
      });
    } else {
      // Card: 100% at day 8
      entries.push({
        projectId,
        sellerId,
        kind: "seller_day8",
        grossAmount,
        commissionAmount: Math.round(totalSellerCommission * 100) / 100,
        dueAt: day8Iso,
        note: `Card 100% at day 8 (rate ${sellerRate * 100}%)`,
      });
    }
  }

  // ── Partner commissions ────────────────────────────────────────────────
  if (partnerId && source === "partner") {
    // Self-checkout through partner link (paid by Kiwify split, recorded here)
    const partnerComm = Math.round(grossAmount * C.partnerSelfCheckoutRate * 100) / 100;
    entries.push({
      projectId,
      partnerId,
      kind: "partner_self_checkout",
      grossAmount,
      commissionAmount: partnerComm,
      dueAt: todayIso,
      note: `Partner self-checkout ${C.partnerSelfCheckoutRate * 100}%`,
    });
  }

  if (partnerId && sellerId && source === "seller_partner") {
    const partnerComm = Math.round(grossAmount * C.partnerAssistedRate * 100) / 100;
    entries.push({
      projectId,
      partnerId,
      kind: "partner_assisted",
      grossAmount,
      commissionAmount: partnerComm,
      dueAt: day8Iso,
      note: `Partner assisted ${C.partnerAssistedRate * 100}%`,
    });
  }

  return entries;
}

/**
 * Maintenance kicker: once when first maintenance charge clears.
 */
export function calcMaintenanceKicker(params: {
  projectId: string;
  sellerId: string;
  clearedAt: Date;
}): CommissionEntry {
  return {
    projectId: params.projectId,
    sellerId: params.sellerId,
    kind: "seller_maintenance_kicker",
    grossAmount: MAINTENANCE.pricePerCycle,
    commissionAmount: C.maintenanceKicker,
    dueAt: params.clearedAt.toISOString().slice(0, 10),
    note: "Maintenance kicker (once per client)",
  };
}

/**
 * Monthly bonus: R$ 300 at 8 closes in a calendar month.
 */
export function calcMonthlyBonus(params: {
  sellerId: string;
  month: string; // YYYY-MM
  closedCount: number;
}): CommissionEntry | null {
  if (params.closedCount < C.monthlyBonusThreshold) return null;
  return {
    projectId: `bonus_${params.sellerId}_${params.month}`,
    sellerId: params.sellerId,
    kind: "seller_monthly_bonus",
    grossAmount: 0,
    commissionAmount: C.monthlyBonusAmount,
    dueAt: `${params.month}-28`,
    note: `Monthly bonus: ${params.closedCount} closes in ${params.month}`,
  };
}

/**
 * Draw entry (negative balance, deducted from future commissions).
 */
export function calcDrawEntry(params: {
  sellerId: string;
  week: string; // YYYY-Www
  weekNumber: number; // 1–4
}): CommissionEntry | null {
  if (params.weekNumber > C.drawMaxWeeks) return null;
  return {
    projectId: `draw_${params.sellerId}_${params.week}`,
    sellerId: params.sellerId,
    kind: "seller_draw",
    grossAmount: 0,
    commissionAmount: -C.drawPerWeek,
    dueAt: params.week,
    note: `Draw week ${params.weekNumber}/${C.drawMaxWeeks}`,
  };
}

/**
 * Clawback: 100% of previously paid commissions on refund/chargeback.
 * Returns clawback entries (negative amounts) for each original entry.
 */
export function calcClawback(
  originalEntries: CommissionEntry[],
  clawbackDate: Date
): CommissionEntry[] {
  const iso = clawbackDate.toISOString().slice(0, 10);
  return originalEntries
    .filter((e) => e.kind !== "seller_draw" && e.kind !== "clawback")
    .map((e) => ({
      projectId: e.projectId,
      sellerId: e.sellerId,
      partnerId: e.partnerId,
      kind: "clawback" as CommissionEntryKind,
      grossAmount: e.grossAmount,
      commissionAmount: -Math.abs(e.commissionAmount) * C.clawbackRate,
      dueAt: iso,
      note: `Clawback of entry kind=${e.kind} originalId=${e.id ?? "?"}`,
    }));
}
